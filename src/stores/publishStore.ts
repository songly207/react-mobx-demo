import { observable, action, runInAction } from 'mobx';
import * as Api from "../util/Api";
import { packageTreeNode } from './../util/TreeNodeUtils';
import { isNotEmpty } from './../util/StringUtils';

// 码表信息，避免发布类型来回切换造成的不必要的数据请求，第一次请求后会将数据存储起来,由于要用到保密级别和脱敏的码表，因此重新发布的码表必须要先请求
let codeTableInfo: any = {      
    // 获取码表状态
    // 0 初始化 1 请求中，2 请求成功 3 请求失败
    getStatus: {
        fdw: 0,
        other: 0,
    },
    // 数据类型码表(仅非FDW发布类型使用)
    dataTypeList: [],
    // 数据空间（other类型码表来自数据类型的namespace字段）
    nameSpaceList: {
        fdw: [{label: 'FDW', value: '1'}],
        other: [{ label: 'NOTFDW', value: '1' }]
    },
    // 数据维护方(仅非FDW发布类型使用)
    dataGroupList: [],
    // 数据来源方PDB(仅非FDW发布类型使用)
    dataSourcePDBList: [],
    // 数据主题分类（EDW）
    edwNodeList: [],
    // 业务主题分类（EDM）
    edmNodeList: [],
    // 数据源分类（ODS）
    odsNodeList: [],
    // 是否为空
    isNullList: [],
    // 是否脱敏
    isMaskList: [],
    // 保密级别
    levelList: [],
    // fdw 数据表列表选项数据 set
    fdwList: []
};

let ajaxConf: any = {
    getDatabase: null,
    getDataTable: null,
    getDataTableCol: null,
    getDataSourceGroup: null
};


class PublishStore {
    @observable todo: any = {
        data: null,
        // 数据库码表
        dataBaseList: [],
        // 数据表的码表
        tableList: [],
        // 当前选中的数据库
        dataBaseSelect: null,
        // 当前选中的数据表
        dataTableSelect: null,

        // 当前数据表名称（由于个人中心复用部分功能，因此单独记录）
        currTable: null,
        //当前数据表字段详情
        currTableDetail: null,
        // 业务主题分类和数据源分类和数据主题分类选中状态
        checkedNode: {},
        // 数据主题分类（EDW）的码表
        edwNode: new Array(),
        // 业务主题分类（EDM）的码表
        edmNode: new Array(),
        // 数据源分类（ODS）的码表
        odsNode: new Array(),
        nodeTree: new Array(),
        // 发布中心标示当前页数
        page: {
            totalPage: 3,
            currPage: 1,
        },
        // 第二页中上一页disabled状态
        edit: false,
        // 从FDW发布 还是 未做过发布&重新发布
        publishType: 'other',
        // 数据类型码表
        dataTypeList: [],
        // 当前选中的数据类型
        currentDataType: '',
        // 数据空间码表
        nameSpaceList:[],
        // nameSpaceListRaw: [],
        // 当前选中的数据空间
        currentNameSpace: '',
        // 数据维护方
        dataGroupList: [],
        // 当前选中数据维护方
        currentDataGroup: '',
        // 数据来源方PDB
        dataSourcePDBList: [],
        // 数据来源方PDB分组
        dataGroupPDBList: [],
        // 当前选中的数据来源方PDB
        currentDataSourcePDB: '',
        // 数据来源方GROUP，需要实时请求
        dataSourceGroupList: [],
        // 当前选中的数据来源方GROUP
        currentDataSourceGroup: '',
        //数据接口人
        dataInterfacePeoples: [],
        //所选择的数据接口人
        currentDataInterfacePepple: '',
        //数据更新频率选项
        dataUpdateRateList: [
            // { label: '请选择', value: -1 },
            { label: '不定时', value: 'untime' },
            { label: '分钟', value: 'minute' },
            { label: '天', value: 'day' },
            { label: '周', value: 'week' },
            { label: '月', value: 'month' },
        ],
        //当前所选择的更新频率
        currentDataUpdateRate: { label: '不定时', value: 'untime' },

        weekList:[
            { label: '星期一', value:'Monday' },
            { label: '星期二', value: 'Tuesday' },
            { label: '星期三', value: 'Wednesday' },
            { label: '星期四', value: 'Thursday' },
            { label: '星期五', value: 'Friday' },
            { label: '星期六', value: 'Saturday' },
            { label: '星期日', value: 'Sunday' },
        ],
        
        //数据更新时间
        dataUpdataTime: '00:00:00',
        // 数据生命周期
        dataLifeCircle: [null,null],
        // 数据重要级别
        dataImportanceLevel: [
            { label: 'P0: 非常重要，数据问题<=1次/月，需在24h内修复',value: 'P0' },
            { label: 'P1: 较重要，数据问题<=2次/月，需在48h内修复', value: 'P1' },
            { label: 'P2: 重要，数据问题<=3次/月，需在72h内修复', value: 'P2' },
            { label: 'P3: 一般，数据问题<=3次/月，需在一周内修复', value: 'P3' },
        ],
        currentdataImportanceLevel: 'P0',

        // 当前表的详细字段内容
        dataTableColList: [],
        // 是否为空码表
        isNullList: [],
        isNullListObject: {},

        // 是否脱敏码表
        isMaskList: [],

        //是否为主键 码表
        isKeyList: [
            { label: '是', value: '是' },
            { label: '否', value: '否' },
        ],
        isKeyListObject:{
            '是': '是',
            '否': '否'
        },

        isMaskListObject: {},
        // 保密级别码表
        levelList: [],
        levelListObject: {},

        // 非FDW是否获取到详情 0未知 1有 2无
        hasCurrTableDetail: 0,

        // 0未初始化，1 请求中 2 已发布 3未发布
        tablePublishType: 0,
        // edm多选
        edmArr: []
    };

    // 后期优化
    // 清除所有数据 触发类型 all,publishType，dataType，nameSpace ，dataBase，dataTable，dataSourcePDB，
    @action clean(type: any) {
        if (!type) {
            type = 'all';
        }
        // 发布类型是否是从未发布或重新发布
        let isPublishFromOther = this.todo.publishType === 'other';
        // 数字越小等级越高
        let typeLevel = {
            all: 10,
            publishType:20 ,
            dataType: 30,
            nameSpace: 40,
            dataBase: 50,
            dataGroup: 60,
            dataTable: 70,
            dataSourcePDB: 80,
            dataSourceGroup: 90
        };
        let currentTypeLevel = typeLevel[type];

        if (currentTypeLevel <= 80) {
            // 数据来源方PDB变化需要清楚数据来源方Group
            this.todo.currentDataSourceGroup = '';
        }
        if (currentTypeLevel <= 70) {
            // 数据表变化需要清除数据来源方当前选中value和数据来源Group码表、value
            this.todo.currentDataSourcePDB = '';
        }
        if (currentTypeLevel <= 60) {
            // 数据库以上变化
            this.todo.dataTableSelect = '';
        }
        if (currentTypeLevel <= 50) {
            this.todo.currentDataGroup = '';
        }

        if (currentTypeLevel === 50 && isPublishFromOther) {
            // 数据库变化
            // this.todo.tableList = [];
        }
        if (currentTypeLevel <= 40) {
            // 命名空间以上变化
            this.todo.dataBaseSelect = '';
        }

        if (currentTypeLevel <= 30) {
            // 数据类型及以上变化
            this.todo.currentNameSpace = '';
        }
        // 数据空间的码表依赖 数据类型
        if (currentTypeLevel === 30) {
            this.todo.nameSpaceList = [];
        }
        // 数据库的码表依赖 数据空间 和数据类型
        if (currentTypeLevel === 30 || (currentTypeLevel === 40 && isPublishFromOther)) {
            this.todo.dataBaseList = [];
        }
        // 数据表的码表依赖 数据空间 、数据类型、 数据维护方 数据库
        if (currentTypeLevel === 30 || (currentTypeLevel === 40 && isPublishFromOther)
            ||  (currentTypeLevel === 50 && isPublishFromOther)
            ||  currentTypeLevel === 60) {
            this.todo.tableList = [];
        }
        // 数据表详细内容依赖 数据空间 、数据类型、 数据维护方 数据库 数据表 数据来源方
        if (currentTypeLevel === 30 || (currentTypeLevel === 40 && isPublishFromOther)
            ||  (currentTypeLevel === 50 && isPublishFromOther)
            || currentTypeLevel === 60 || (currentTypeLevel === 70 && isPublishFromOther)) {
            this.todo.data = [];
        }
        // 数据表详细内容依赖 数据空间 、数据类型、 数据维护方 数据库 数据表 数据来源方
        if (currentTypeLevel === 80 ) {
            this.todo.dataSourceGroupList = [];
        }
        if (currentTypeLevel <= 20) {
            // 清除之前的请求（临时方案，后期优化）
            if (ajaxConf.getDatabase) {
                ajaxConf.getDatabase.abort();
                ajaxConf.getDatabase = null;
            }
            if (ajaxConf.getDataTable) {
                ajaxConf.getDataTable.abort();
                ajaxConf.getDataTable = null;
            }
            if (ajaxConf.getDataTableCol) {
                ajaxConf.getDataTableCol.abort();
                ajaxConf.getDataTableCol = null;
            }
            if (ajaxConf.getDataSourceGroup) {
                ajaxConf.getDataSourceGroup.abort();
                ajaxConf.getDataSourceGroup = null;
            }
        }


        if (currentTypeLevel === 20) {
            this.todo.hasCurrTableDetail = 0;
            this.todo.tablePublishType = 0;
            this.todo.currentDataType = '';
            if (isPublishFromOther && codeTableInfo.getStatus.other==2) {
                this.todo.dataTypeList = codeTableInfo.dataTypeList;
                this.todo.dataGroupList = codeTableInfo.dataGroupList;
                this.todo.dataSourcePDBList = codeTableInfo.dataSourcePDBList;

            } else if (!isPublishFromOther) {
                this.todo.dataTypeList = [];
                this.todo.dataGroupList = [];
                this.todo.dataSourcePDBList = [];
                this.todo.nameSpaceList = codeTableInfo.nameSpaceList.fdw;
                this.todo.currentNameSpace = '1';
                if (codeTableInfo.getStatus.fdw === 2) {
                    this.todo.dataBaseList = Object.keys(codeTableInfo.fdwList);
                    this.todo.data = codeTableInfo.fdwList;
                } else {
                    this.todo.dataBaseList = [];
                }


            }
        }
        if (currentTypeLevel === 10) {
            this.todo = {
                data: null,
                dataBaseList: [],
                tableList: [],
                dataBaseSelect: null,
                dataTableSelect: null,
                currTable: null,
                currTableDetail: null,
                checkedNode: {
                    edm: null,
                    edw: null,
                    ods: null
                },
                edmNode: new Array(),
                edwNode: new Array(),
                odsNode: new Array(),
                page: {
                    totalPage: 3,
                    currPage: 1,
                },
                edit: false,
                editId: null,
                publishType: 'other',
                dataTypeList: [],
                currentDataType: '',
                dataGroupList: [],
                currentDataGroup: '',
                nameSpaceList:[],
                currentNameSpace: '',
                dataSourcePDBList: [],
                currentDataSourcePDB: '',
                dataSourceGroupList: [],
                currentDataSourceGroup: '',
                hasCurrTableDetail: 0,
                tablePublishType: 0
            };
        }
    }

    @action checkIsPublish() {
        // this.nextPage();
        let request = new Api.ApiBody();
        this.todo.tablePublishType = 1;
        request.body = {
            databaseName: this.todo.dataBaseSelect.value,
            tableName: this.todo.dataTableSelect.value || 'defaultTableName',
            namespace: this.todo.currentNameSpace.value,
            publishType: this.todo.publishType === 'fdw' ? 0: 1
        };
        Api.performSingleApiBodyRequest(
            '/fdw/apiReleaseCheck',
            request,
            res => {
                runInAction(() => {
                    this.todo.tablePublishType = res.body['data'].hasPublish ? 2: 3;
                    if (this.todo.tablePublishType === 2) {
                        // 已发布
                        toastr.error('该表已发布，请重新选择！');
                    } else if (this.todo.tablePublishType === 3) {
                        // 未发布
                        // this.nextPage();
                    }
                });

            },
            res => {
                runInAction(() => {
                    this.todo.tablePublishType = 0;
                })

            }
        );
    }

    @action edit(id: any) {
        this.todo.editId = id;
        this.todo.edit = true;
        this.todo.page.currPage = 2;
        let request = new Api.ApiBody();
        request.body = {
            id: id + ''
        };
        Api.performSingleApiBodyRequest('/edwCommon/getDetail', request, res => {
            runInAction(() => {
                let data = res.body['data'];
                this.todo.currTable = data;
                let currTableDetails: any[] = JSON.parse(data.dataFields);
                this.todo.currTableDetail = currTableDetails.map((e: any)=>{
                    //默认值设置
                    if (!e['remark']) {
                        e['remark'] = '';
                    }
                    if (!e['remarkCode']) {
                        e['remarkCode'] = '0';
                    }
                    if (!e['customerType']) {
                        e['customerType'] = null;
                    }
                    if (!e['primaryKey']) {
                        e['primaryKey'] = "否";
                    }
                    return e;
                })
                this.todo.checkedNode = { edm: data.edmType, edw: data.edwType, ods: data.odsType };
            });
        });

    }
    // 组件挂载后获取码表信息
    @action queryDataBase() {
        let response;
        if (this.todo.publishType === 'fdw') {
            if (codeTableInfo.getStatus.fdw === 1 || codeTableInfo.getStatus.fdw === 2){
                console.log('Object.keys(codeTableInfo.fdwList):'+ Object.keys(codeTableInfo.fdwList))
                this.todo.dataBaseList = Object.keys(codeTableInfo.fdwList);
                return;
            }
            // 从FDW发布queryD
            codeTableInfo.getStatus.fdw = 1;
            this.todo.currentNameSpace = '1';
            Api.performGetRequest('/fdw/getTableInfoFromFdw', res => {
                runInAction(() => {
                    this.todo.data = res.body['data'];
                    codeTableInfo.fdwList = res.body['data'];
                    if (res.body['data'] && this.todo.publishType === 'fdw') {
                        this.todo.dataBaseList = Object.keys(res.body['data']);
                        response = res;
                        codeTableInfo.getStatus.fdw = 2;
                    }
                });
            },
            ()=> {
                runInAction(() => {
                    codeTableInfo.getStatus.fdw = 3;
                });

            });
        } else {
            // 从未发布或者重新发布
            if (codeTableInfo.getStatus.other === 1 || codeTableInfo.getStatus.other === 2) {
                return;
            }
            codeTableInfo.getStatus.other = 1;
            Api.performGetRequest('/fdw/apiReleaseIndex', res => {
                runInAction(() => {
                    // 数据类型
                    // let res = testData.default.apiReleaseIndex;
                    codeTableInfo.getStatus.other = 2;
                    let dataTypeList = [];
                    let dataType = res.body.data && res.body.data.dataType;
                    if (dataType) {
                        for (let dataTypeItem in dataType) {
                            dataTypeList.push({
                                label: dataTypeItem,
                                value: dataTypeItem,
                                nameSpace: dataType[dataTypeItem]
                            });
                        }
                    }
                    if (this.todo.publishType !== 'fdw') {
                        this.todo.dataTypeList = dataTypeList;
                    }
                    codeTableInfo.dataTypeList = [...dataTypeList];

                    // 数据维护方
                    let dataGroup = res.body.data && res.body.data.group;
                    let changeDataGroup;
                    if (!dataGroup) {
                        changeDataGroup = [];
                    } else {
                        changeDataGroup = dataGroup.map(function (item: any) {
                            return {
                                label: item,
                                value: item
                            }
                        });
                    }
                    if (this.todo.publishType !== 'fdw') {
                        this.todo.dataGroupList = changeDataGroup;
                    }
                    codeTableInfo.dataGroupList = [...changeDataGroup];

                    // 数据来源方pdb
                    let pdb = res.body.data && res.body.data.pdb;
                    let changePdb: any = [];
                    if (pdb) {
                        pdb.forEach((item: any) => {
                            let changeGroupPdb: any = [];
                            if (item.sub && item.sub.length) {
                                item.sub.forEach((subItem: any) => {
                                    let changeItem = {
                                        label: `${subItem.description}\(${subItem.name}\)`,
                                        value: subItem.id
                                    };
                                    changeGroupPdb.push(changeItem);
                                });
                                let changeGroupItem = {
                                    label: item.description,
                                    options: changeGroupPdb,
                                };
                                changePdb.push(changeGroupItem);
                            }

                        });
                    }
                    if (this.todo.publishType !== 'fdw') {
                        this.todo.dataSourcePDBList = changePdb;
                    }
                    codeTableInfo.dataSourcePDBList = [...changePdb];

                    response = res;


                // 处理是否为空、脱敏、保密级别的码表
                if (response) {
                    // 是否为空
                    if (response.body && response.body.data && response.body.data.detailCn
                        && response.body.data.detailCn.detail_null) {
                        let detailNullList = response.body.data.detailCn.detail_null;
                        for (let item in detailNullList) {
                            codeTableInfo.isNullList.push({
                                label: detailNullList[item],
                                value: item
                            });
                        }
                        this.todo.isNullList = codeTableInfo.isNullList;
                        this.todo.isNullListObject = detailNullList;
                    }
                    // 保密级别
                    if (response.body && response.body.data && response.body.data.detailCn
                        && response.body.data.detailCn.data_level_detail) {
                        let dataLevelList = response.body.data.detailCn.data_level_detail;
                        for (let item in dataLevelList) {
                            codeTableInfo.levelList.push({
                                label: dataLevelList[item],
                                value: item,
                                disabled: parseInt(item) == 0
                            });
                        }
                        this.todo.levelList = codeTableInfo.levelList;
                        this.todo.levelListObject = dataLevelList;
                    }
                    // 是否脱敏
                    if (response.body && response.body.data && response.body.data.mask) {
                        let maskList = response.body.data.mask;
                        for (let item in maskList) {
                            codeTableInfo.isMaskList.push({
                                label: maskList[item],
                                value: item
                            });
                        }
                        this.todo.isMaskList = codeTableInfo.isMaskList;
                        this.todo.isMaskListObject = maskList;
                    }
                }});
            },
            ()=>{
                runInAction(() => {
                    codeTableInfo.getStatus.other = 3;
                });
            });
        }

    }
    packageReq(): Api.ApiBody {
        let request = new Api.ApiBody();
        let checkedNode = this.todo.checkedNode;
        let keys = Object.keys(checkedNode);
        let typeIdList = [];
        for (let i = 0; i < keys.length; i++) {
            if (checkedNode[keys[i]]) {
                typeIdList.push(checkedNode[keys[i]].id)
            }
        }
        // console.log(typeIdList);

        request.body = {
            publishInfo: {
                publishType: this.todo.publishType === 'other' ? 1: 0,
                namespace: this.todo.currentNameSpace.value,
                databaseName: this.todo.dataBaseSelect.value,
                title:this.todo.currTable.fdwTitle,
                tableProcessLogic: this.todo.currTable.tableProcessLogic,
                detail: this.todo.currTable.fdwDetail,
                // odsType: this.todo.checkedNode.ods,
                // edwType: this.todo.checkedNode.edw,
                // edmType: this.todo.checkedNode.edm === null ? '': this.todo.checkedNode.edm.join(','),
                typeIdList:typeIdList,
                applyTimes: this.todo.currTable.applyTimes,
                fieldsDesc: JSON.stringify(this.todo.currTableDetail),
                customerSourceList: this.todo.currTableDetail.filter((e:any) => e.remarkCode === '1'),
                dataType: this.todo.currTable.fdwDataType,
                processInfo: JSON.stringify(this.todo.currTable.processInfo),
                //配置信息里面的中文名
                dataNameCh: this.todo.currTable.dataNameCh
            }
        }
        // console.log('this.todo.pushblishType', this.todo.publishType);
        // 新增的字段
        request.body.publishInfo.dataBizPrincipal = this.todo.currentDataInterfacePepple;
        request.body.publishInfo.dataUpdateFreq = this.todo.currentDataUpdateRate.value;
        
        request.body.publishInfo.dataUpdateTime = this.todo.dataUpdataTime;
        
        request.body.publishInfo.dataLifeCycleStart = (this.todo.dataLifeCircle[0]).format('YYYY-MM-DD');
        request.body.publishInfo.dataLifeCycleEnd = this.todo.dataLifeCircle[1] ? (this.todo.dataLifeCircle[1]).format('YYYY-MM-DD') : '9999-12-31';
        request.body.publishInfo.dataLevel = this.todo.currentdataImportanceLevel.value;

        if (this.todo.publishType === 'other') {
            request.body.publishInfo.dataType = this.todo.currentDataType.value;
            request.body.publishInfo.tableName = this.todo.dataTableSelect.value;
            request.body.publishInfo.group = this.todo.currentDataGroup.value;
            request.body.publishInfo.dataSource = this.todo.currentDataSourceGroup.value;
        } else {
            request.body.publishInfo.dataType = this.todo.currTable.fdwDataType;
            request.body.publishInfo.tableName = this.todo.currTable.fdwTable;
            request.body.publishInfo.group = this.todo.currTable.fdwUserGroup;
            request.body.publishInfo.dataSource = this.todo.currTable.fdwUserGroup;
        }
        return request;
    }
    // 取消选中
    @action cancelNode(type: string, index: number) {
        if (type === 'edw') {
            this.todo.checkedNode.edw = null;
        } else if (type === 'edm') {
            this.todo.edmArr.splice(index,1);
        } else {
            this.todo.checkedNode[type] = null;
        }
    }
    // 保存还是提交
    @action saveOrCommit(type: string): boolean {
        let request = this.packageReq();
        // if (request.body.publishInfo.edmType.length > 128) {
        //     alert('业务主题分类选项过多，请修改！')
        //     return false;
        // }
        if (isNotEmpty(this.todo.editId)) {
            request.body.publishInfo['id'] = this.todo.editId;
        }
        let bool = false;

        Api.performSingleApiBodyRequestSyn(type === 'save'  ? '/fdwDataPublish/saveTable' :
            '/fdwDataPublish/publishTable ', request, res => {
            toastr.success('操作成功');
            this.todo.editId = null;
            bool = true;
            setTimeout(function () {
                window.location.href = '/usercenter/publish';
            }, 800);

        });

        return bool;
    }

    // 数据库切换
    @action checkedDataBase(dataBase: any) {
        if (this.todo.dataBaseSelect === dataBase) return;
        this.todo.dataBaseSelect = dataBase;

        if (this.todo.publishType === 'fdw') {
            this.todo.tableList = this.todo.data[dataBase.value];
        } else {
            this.clean('dataBase');
            this.todo.tableList = this.todo.data[dataBase.value];
        }

    }

    @action editTable(fieldName: string, key: string, val: string) {
        let tableDetail = this.todo.currTableDetail;
        for (let temp of tableDetail) {
            if (temp.name === fieldName) {
                temp[key] = val;
                break;
            }
        }
        this.todo.currTableDetail = tableDetail;
        this.todo.hasCurrTableDetail = 1;
    }

    // 数据表切换
    @action checkedTable(tableName: any) {
        if (this.todo.dataTableSelect === tableName) return;
        this.todo.dataTableSelect = tableName;
        this.todo.tablePublishType = 0;
        this.todo.checkedNode = { edm: null, edw: null, ods: null };

        if (tableName === null) {
            return;
        }
        if (this.todo.publishType === 'fdw') {
            this.todo.currTable = this.todo.tableList.slice().filter((e: any) => e.fdwTable === tableName.value)[0];
            this.todo.currTableDetail = JSON.parse(this.todo.currTable.fieldDetail).map((e: any) => {
                if (!e['remark']) {
                    e['remark'] = '';
                }
                if (!e['remarkCode']) {
                    e['remarkCode'] = '0';
                }
                if (!e['customerType']) {
                    e['customerType'] = null;
                }
                if (!e['primaryKey']) {
                    e['primaryKey'] = '否';
                }
                return e;
            });
            this.todo.hasCurrTableDetail = 1;
        } else {
            this.clean('dataTable');
        }
    }

    @action checkedNode(type: string, nodeName: any, id: any) {
        this.todo.checkedNode[type] = {nodeName,id};
        // console.log('checkNode',this.todo.checkedNode);
        // if (type === 'edw') {
        //     this.todo.checkedNode.edw = nodeName;
        // } else if (type === 'edm') {
        //     this.todo.checkedNode.edm = nodeName;
        // } else {
        //     this.todo.checkedNode.ods = nodeName;
        // }
    }

    @action queryNode() {
        Api.performGetRequest('/edwCommon/queryTypeList', res => {
            runInAction(() => {
                let node: any[] = res.body['data'];
                this.todo.nodeTree = packageTreeNode(node);
                // console.log('this.todo.nodeT', packageTreeNode(node));
                this.todo.edwNode = packageTreeNode(node.filter(e => e.type === 'edw'));
                this.todo.edmNode = packageTreeNode(node.filter(e => e.type === 'edm'));
                this.todo.odsNode = packageTreeNode(node.filter(e => e.type === 'ods'));
            });
        });
    }

    @action nextPage() {
        let currPage = this.todo.page.currPage;
        if (currPage === this.todo.page.totalPage) {
            return;
        }
        this.todo.page.currPage = currPage + 1;
    }
    @action previousPage() {
        let currPage = this.todo.page.currPage;
        if (currPage === 1) {
            return;
        }
        this.todo.page.currPage = currPage - 1;
    }
    // @action setCurpage(currPage: Number) {
    //     let currPage1 = this.todo.page.currPage;
    //     if (currPage1 === currPage) {
    //         return;
    //     }
    //     this.todo.page.currPage = currPage;
    // }

    // 发布类型切换切换从fdw发布还是从未发布
    @action setPublishType(type: string) {
        // 相同类型不需要更新
        if (type === this.todo.publishType) { return; } 
        console.log('切换发布类型'+type);

        // 更新类型
        this.todo.publishType = type;
        // 类型更新时候，该页面其他数据需要清除
        this.clean('publishType');
        // 请求码表
        this.queryDataBase();
    }

    // 数据类型切换
    @action setDataType(type: any ) {

        // 相同类型不需要更新
        if (type === this.todo.currentDataType) return;
        this.todo.currentDataType = type;
        this.clean('dataType');

        // 更新数据空间的码表
        let currentNameSpace = this.todo.dataTypeList.find(function (item: any) {
            return item.value === type.value;
        });
        let nameSpaceList = currentNameSpace && currentNameSpace.nameSpace;
        let changeNameSpaceList;
        if (nameSpaceList) {
            changeNameSpaceList = nameSpaceList.map(function (item: any) {
               return {
                   label: item.name,
                   value: item.value,
               }
            });
        } else {
            changeNameSpaceList = [];
        }
        this.todo.nameSpaceList = changeNameSpaceList;
    }

    // 数据空间切换
    @action setNameSpace(val: any) {
        if(this.todo.currentNameSpace === val) return;
        this.todo.currentNameSpace = val;
        this.clean('nameSpace');

        // 从未发布的情况下，数据空间的切换需要请求数据库
        let request = new Api.ApiBody();
        request.body = {
            action: 'query_database',
            namespace: val.value
        };
        if (!request.body.namespace) return;
        if ( ajaxConf.getDatabase) {
            ajaxConf.getDatabase.abort();
            ajaxConf.getDatabase = null;
        }

        ajaxConf.getDatabase = Api.performSingleApiBodyRequest('/fdw/apiqueryDbMeta', request, res =>{   
            runInAction(() => {
                // let res = testData.default.;
                // 避免来回切换数据错误
                if (this.todo.publishType !== 'other') {
                    return;
                }
                let dataBase = res.body.data && res.body.data.databaseList;
                let changeDataBase: any;
                if (!dataBase) {
                    changeDataBase = [];
                } else {
                    changeDataBase = dataBase.map((item: any) => {
                        return {
                            label: item,
                            value: item
                        }
                    });
                }
            
                if (this.todo.publishType !== 'fdw') {
                    this.todo.dataBaseList = changeDataBase;
                }

            });
        })
    }

    // 数据维护方切换
    @action setDataGroup(val: any) {
        if(this.todo.currentDataGroup === val) return;
        this.todo.currentDataGroup = val;
        this.clean('dataGroup');
        // 需要请求table的码表
        let request = new Api.ApiBody();
        request.body = {
            action: 'query_table',
            databaseName: this.todo.dataBaseSelect.value,
            namespace: this.todo.currentNameSpace.value,
            group: this.todo.currentDataGroup.value
        };
        if (!request.body.databaseName || !request.body.namespace || !request.body.group) {
            return;
        };
        if (ajaxConf.getDataTable) {
            ajaxConf.getDataTable.abort();
            ajaxConf.getDataTable = null;
        }

        ajaxConf.getDataTable = Api.performSingleApiBodyRequest('/fdw/apiqueryDbMeta', request, res => {
            runInAction(()=>{
                // let res = testData.default.apiQueryDbMeta;
                // 避免来回切换数据错误
                if (this.todo.publishType !== 'other') {
                    return;
                }
                let dataTable = res.body.data && res.body.data.dataTableList;
                let changeDataTable;
                if (!dataTable) {
                    changeDataTable = [];
                } else {
                    changeDataTable = dataTable.map((item: any) => {
                        return {
                            label: item,
                            value: item
                        }
                    });
                }
                if (this.todo.publishType !== 'fdw') {
                    this.todo.tableList = changeDataTable;
                }
            })
        });
    }

    // 数据来源方PDB切换
    @action setDataSourcePDB(val: any) {
        if (this.todo.currentDataSourcePDB === val) return;
        this.todo.currentDataSourcePDB = val;
        this.clean('dataSourcePDB');
        // 需要请求dataSourceGroup
        let request = new Api.ApiBody();
        request.body = {
            pdbId: this.todo.currentDataSourcePDB.value
        };
        if (!request.body.pdbId) return;
        if (ajaxConf.getDataSourceGroup) {
            ajaxConf.getDataSourceGroup.abort();
            ajaxConf.getDataSourceGroup = null;
        }

        ajaxConf.getDataSourceGroup = Api.performSingleApiBodyRequest('/fdw/apiQueryPdbGroup', request, res => {
            runInAction(()=>{
                // let res = testData.default.apiQueryPdbGroup;
                if (this.todo.publishType !== 'other') {
                    return;
                }
                let dataSourceGroup = res.body.data && res.body.data.oriGroupList;
                let changeDataSourceGroup;
                if (!dataSourceGroup) {
                    changeDataSourceGroup = [];
                } else {
                    changeDataSourceGroup = dataSourceGroup.map((item: any) => {
                        return {
                            label: item,
                            value: item
                        }
                    });
                }
                this.todo.dataSourceGroupList = changeDataSourceGroup;
            })
        });
    }

    // 数据来源方GROUP切换
    @action setDataSourceGroup(val: any) {
        if (this.todo.currentDataSourceGroup === val) return;
        this.todo.currentDataSourceGroup = val;
        this.todo.hasCurrTableDetail = 0;
        this.clean('dataSourceGroup');
        // 需要请求table详细内容
        let request = new Api.ApiBody();
        request.body = {
            action: 'query_column',
            databaseName: this.todo.dataBaseSelect.value,
            namespace: this.todo.currentNameSpace.value,
            group: this.todo.currentDataGroup.value,
            oriGroupName: this.todo.currentDataSourceGroup.value,
            tableName: this.todo.dataTableSelect.value?this.todo.dataTableSelect.value:'defaultTableName'
        };
        if (!request.body.databaseName || !request.body.namespace || !request.body.group || !request.body.oriGroupName
            ||! request.body.tableName) {
            return;
        }
        if (ajaxConf.getDataTableCol) {
            ajaxConf.getDataTableCol.abort();
            ajaxConf.getDataTableCol = null;
        }

        ajaxConf.getDataTableCol = Api.performSingleApiBodyRequest(
            '/fdw/apiqueryDbMeta',
            request,
            res => {
                runInAction(()=> {
                    if (this.todo.publishType !== 'other') {
                        return;
                    }

                    // let res = testData.default.apiQueryDbMeta;
                    this.todo.hasCurrTableDetail  = 1;
                    let data=  res.body.data;
                    let dataTableCol = res.body.data && res.body.data.dataFiledList;
                    this.todo.currTable = {
                        fdwTitle: data.tableTitle,
                        fdwDetail:data.tableDesc,
                        tableProcessLogic: data.tableLogic,
                        applyTimes: data.applyTimes,
                        processInfo: data.processInfo
                    };

                    this.todo.currTableDetail = dataTableCol && dataTableCol.map((e: any) => {
                        if (!e['remark']) {
                            e['remark'] = '';
                        }
                        if (!e['remarkCode']) {
                            e['remarkCode'] = '0';
                        }
                        if (!e['customerType']) {
                            e['customerType'] = null;
                        }
                        if (!e['primaryKey']) {
                            e['primaryKey'] = "否";
                        }
                        return e;
                    });

                })
            },
            res => {
                runInAction(()=> {
                    this.todo.hasCurrTableDetail  = 2;
                });

            }
        );
    }

    //设置数据接口人字段信息
    @action setDataInterfacePeo(val: any) {
        if (this.todo.currentDataInterfacePepple === val) return;
        this.todo.currentDataInterfacePepple = val;
    }
    //设置数据更新频率
    @action setdataUpdateRate(val: any) {
        if (this.todo.currentDataUpdateRate === val) return;
        this.todo.currentDataUpdateRate = val;
    }
    //设置数更新时间
    @action setdataUpdataTime(val: any) {
        if (this.todo.dataUpdataTime === val) return;
        this.todo.dataUpdataTime = val;
    }
    //设置生命周期
    @action setdataLifeCircle(val: any) {
        if (this.todo.dataLifeCircle === val) return;
        this.todo.dataLifeCircle = val;
    }
    //设置数据重要级别
    @action setDataImportanceLevel(val: any) {
        if (this.todo.currentdataImportanceLevel === val) return;
        this.todo.currentdataImportanceLevel = val;
    }

    // 设置表的字段信息
    @action setCurrentTableInfo(type: any, val: any) {
        this.todo.currTable[type] = val;
    }
    // 设置保密级别、是否为空、是否脱敏、是否为主键
    @action setCurrentTableFieldInfo(type: any, name: any, val: any) {
        let currTableDetail = this.todo.currTableDetail.slice();
        if (!type || !name) {
            return;
        }
        currTableDetail.forEach(function (item: any) {
           if (item.name === name && item[type] !== val) {
                item[type] = val;
           }
        });
        this.todo.currTableDetail = currTableDetail;
    }


}
export default PublishStore;
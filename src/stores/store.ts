import { observable, action, runInAction } from 'mobx';
import { ApiBody } from "./../util/Api";
import * as Api from "./../util/Api";
import { IStore, Todo, TreeNode } from './../contants/base';
import { packageTreeNode} from './../util/TreeNodeUtils'
// , findChild,normalizeTreeNode 
// import {node} from "prop-types";

class Store implements IStore {
    @observable todo: Todo = {
        queryArg: '',
        queryConditions: new Array(),
        data: {
            total: 0,
            list: new Array(),
            currentList: new Array()
        },
        customerData: {
            pageSize: 5,
            startIndex: 0,
            list: new Array,
            isEnd: false
        },
        customerModalData: {
            pageSize: 10,
            pageNum: 0,
            list: new Array,
            isShow: false,
            page: {
                currentPage: 0,
                pageSize: 10,
                pageTotal: 1,
                total: null
            }
        },
        edmNode: new Array(),
        edwNode: new Array(),
        odsNode: new Array(),
        nodeTree: new Array(),
        buttons: [
            {
                key: 'dataName',
                isChecked: false,
                desc: '表名'
            },
            {
                key: 'dataTitle',
                isChecked: false,
                desc: '表标题'
            },
            {
                key: 'dataDesc',
                isChecked: false,
                desc: '表描述'
            },
            {
                key: 'dataFields',
                isChecked: false,
                desc: '字段名'
            },
            {
                key: 'fieldsDesc',
                isChecked: false,
                desc: '字段描述'
            },
            {
                key: 'dataRemark',
                isChecked: false,
                desc: '标签'
            }
        ],
        customerObj : {
            title: '个人数据源分布',
            desc: '记录了个人客户标识对数据源具体表的对应关系，可用于辅助查询更多个人客户信息',
            invoke: '数据来源：数据中心'
        },
        dataModal: {
            show: false,
            id: null
        },
        page: {
            currentPage: 1,
            pageSize: 10,
            pageTotal: 1
        },
        toggleEdmNode: null,
        toggleEdwNode: null,
        toggleOdsNode: null,
        selectedNode: null,
        toggleSearchNode:  null,
        typeDesc: null
    };
    @action showCustomerModal() {
        this.todo.customerModalData.isShow = true;
    }
    @action closeCustomerModal() {
        this.todo.customerModalData.isShow = false;
    }
    // modal页用
    @action queryCustomer(pageNo?: number) {
        let request = new Api.ApiBody();
        request.body = { pageNum: 1, pageSize: 10 };
        if (pageNo) {
            request.body['pageNum'] = pageNo;
        }
        Api.performSingleApiBodyRequest('/edwDataMap/queryCustomerSource', request, res => {
            runInAction(() => {
                this.todo.customerModalData.list = res.body['data'];
                this.todo.customerModalData.page = res.body['page'];
            });
        });
    }
    // 检索页用
    @action queryCustomerData(pageSize: number) {
        let request = new Api.ApiBody();
        request.body = {
            startIndex: this.todo.customerData.startIndex,
            pageSize
        };
        Api.performSingleApiBodyRequest('/edwDataMap/queryCustomerSource', request, res => {
            runInAction(() => {
                let list = res.body['data'];
                let page = res.body.page;
                if (list && list.length > 0) {
                    list.forEach((e: any) => {
                        this.todo.customerData.list.push(e);
                    });
                    if (page.total === this.todo.customerData.list.length) {
                        this.todo.customerData.isEnd = true;
                    }
                }
                this.todo.customerData.startIndex += list.length;
            });
        });
    }
    @action cancelNode(type: string) {
        if (type === 'edw') {
            this.todo.toggleEdwNode = null;
        } else if (type === 'edm') {
            this.todo.toggleEdmNode = null;
        } else {
            this.todo.toggleOdsNode = null;
            this.todo.toggleSearchNode = null;
        }
        this.query(this.todo.toggleSearchNode);
    }
    @action closeModal() {
        this.todo.dataModal.show = false;
    }
    @action clickDataName(id: number) {
        this.todo.dataModal.id = id;
        this.todo.dataModal.show = true;
    }
    @action resetCustomerData() {
        this.todo.customerData.list = new Array;
        this.todo.customerData.startIndex = 0;
        this.todo.customerData.isEnd = false;
    }
    @action toggleNode(type: string, node: TreeNode) {
        if (type === 'edw') {
            this.todo.selectedNode = node;
            this.todo.toggleEdwNode = node;
            this.todo.toggleSearchNode = node;
            if (node.name !== '个人数据源分布') {
                this.query(this.todo.toggleSearchNode);
            } else {
                this.resetCustomerData();
                this.queryCustomerData(5);
            }
        } else if (type === 'edm') {
            this.todo.selectedNode = node;
            this.todo.toggleEdmNode = node;
            this.todo.toggleSearchNode = node;
            this.query(this.todo.toggleSearchNode);
        } else {
            this.todo.selectedNode = node;
            this.todo.toggleOdsNode = node;
            this.todo.toggleSearchNode = node;
            this.query(this.todo.toggleSearchNode);
        }
    }
    @action query(toggleSearchNode : any) {
        let searchNode = toggleSearchNode || '';
        let queryCon = this.todo.buttons.filter(e => e.isChecked).map(e => e.key);
        let request = new ApiBody();
        request.body = {
            conditions: queryCon.join(','),
            value: this.todo.queryArg,
            typeIdList: this.todo.selectedNode ?[this.todo.selectedNode.id] : []
            // edmTypes: this.todo.toggleEdmNode ? findChild(this.todo.toggleEdmNode).join(',') : '',
            // edwTypes: this.todo.toggleEdwNode ? findChild(this.todo.toggleEdwNode).join(',') : '',
            // odsTypes: this.todo.toggleOdsNode ? findChild(this.todo.toggleOdsNode).join(',') : '',
        };
        Api.performSingleApiBodyRequest('/edwDataMap/queryInfo', request, res => {
            runInAction(() => {
                this.todo.data.list = res.body['data'];
                this.todo.data.total = res.body['data'].length;
                // this.todo.page.currentPage = 1;
                this.todo.page = { currentPage: 1, pageSize: 10, pageTotal: Math.ceil(this.todo.data.total / 10) };
                // this.todo.page.pageTotal = Math.ceil(this.todo.data.total / this.todo.page.pageSize);
                this.todo.data.currentList = this.todo.data.list.slice(0, 10);
                this.todo.typeDesc = res.body.typeMap[searchNode.name] || '';
            });
        });
    }
    @action queryNode() {
        Api.performGetRequest('/edwCommon/queryTypeList', res => {
            runInAction(() => {
                let node: any[] = res.body['data'];
                this.todo.nodeTree = packageTreeNode(node);
                // let node1: any[] = packageTreeNode(node);
                // console.log('node1', node1);
                // this.todo.edmNode = packageTreeNode(node.filter(e => e.type === 'edm'));
                // this.todo.edwNode = packageTreeNode(node.filter(e => e.type === 'edw'));
                // console.log('todo.edwNod', packageTreeNode(node.filter(e => e.type === 'edw')));
                // this.todo.odsNode = packageTreeNode(node.filter(e => e.type === 'ods'));
            });
        });
    }
    @action pageUp(pageNo: number) {
        if (this.todo.page.pageTotal < pageNo) {
            return;
        }
        this.todo.page.currentPage = pageNo;
        let pageStart = (pageNo - 1) * this.todo.page.pageSize;
        this.todo.data.currentList = this.todo.data.list.slice(pageStart, (pageStart + this.todo.page.pageSize - 1));
    }

    @action clickButton(key: string) {
        let buttons = this.todo.buttons.slice();
        this.todo.buttons = buttons.map(e => {
            if (e.key === key) {
                return { key: key, isChecked: !e.isChecked, desc: e.desc }
            } else {
                return e;
            }
        });
    }
}

export default Store

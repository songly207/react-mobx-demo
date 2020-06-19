import { observable, action, runInAction } from 'mobx';
import * as Api from "../util/Api";
import { rtnLeafNodeList } from '../util/TreeNodeUtils';

class CenterStore {
    @observable todo: any = {
        queryArgs: {
            status: null,
            publishUser: null,
            odsType: null,
            fdwUserGroup: '',
            pageSize: 10
        },
        page: {
            currentPage: 0,
            pageSize: 10,
            pageTotal: 1
        },
        data: new Array,
        odsNode: new Array,
        dataModal: {
            show: false,
            id: null
        },
        publishUser: new Array
    }
    @action pageUp(pageNo: number) {
        // this.todo.queryArgs.pageNum = pageNo;
        this.query(pageNo);
    }
    @action closeModal() {
        this.todo.dataModal.show = false;
    }
    @action clickDataName(id: number) {
        this.todo.dataModal.id = id;
        // this.todo.dataModal.show = true;
    }
    @action queryNode() {
        Api.performGetRequest('/edwCommon/queryTypeList', res => {
            runInAction(() => {
                let node: any[] = res.body['data'];
                this.todo.odsNode = rtnLeafNodeList(node.filter(e => e.type === 'ods'));
            });
        });
    }
    @action publish(id: any) {
        var confirm = window.confirm('确认发布？');
        if(confirm === false) {
            return;
        }
        let request = new Api.ApiBody();
        request.body = { id: id + '' };
        Api.performSingleApiBodyRequest('/edwDataPublish/publishTableById', request, res => {
            toastr.success('操作成功');
            this.query();
        });
    }
    @action getPublishUser() {
        Api.performGetRequestSyn('/edwCommon/getAllPublishUser', res => {
            runInAction(() => {
                this.todo.publishUser = res.body['data'];
            });
        });
    }
    @action query(pageNo?: number) {
        let request = new Api.ApiBody();
        request.body = { ...this.todo.queryArgs };
        if (pageNo) {
            request.body['pageNum'] = pageNo;
        }
        Api.performSingleApiBodyRequest('/edwDataPublish/queryPublishInfo', request, res => {
            runInAction(() => {
                this.todo.data = res.body['data'];
                this.todo.page = res.body['page'];
            });
        });
    }

    @action changeArgs(key: string, val: any) {
        this.todo.queryArgs[key] = val;
    }
}

export default CenterStore;
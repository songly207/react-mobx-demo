
export interface IBase {
    store?: IStore,
}

export interface IStore {
    todo: Todo,
    query: Function,
    clickButton: Function,
    pageUp: Function,
    queryNode: Function,
    toggleNode: Function,
    clickDataName: Function,
    closeModal: Function,
    cancelNode: Function,
    queryCustomerData: Function,
    queryCustomer: Function,
    showCustomerModal: Function,
    closeCustomerModal: Function
}

export interface Todo {
    queryArg: string,
    queryConditions: string[],
    customerData: {
        pageSize: number,
        startIndex: number,
        list: any[],
        isEnd: boolean
    },
    customerObj : {
        title: string,
        desc: string,
        invoke: string
    },
    customerModalData: {
        pageSize: number,
        pageNum: number,
        list: any[],
        isShow: boolean,
        page: {
            currentPage: number,
            pageSize: number,
            pageTotal: number,
            total: number
        }
    },
    data: {
        total: number,
        list: Idetail[],
        currentList: Idetail[],
    },
    edmNode: TreeNode[],
    edwNode: TreeNode[],
    odsNode: TreeNode[],
    nodeTree: any,
    buttons: ISeatchButton[],
    page: {
        currentPage: number,
        pageSize: number,
        pageTotal: number,
    },
    dataModal: {
        show: boolean,
        id: null | number
    },
    toggleEdmNode: any,
    toggleEdwNode: any,
    selectedNode: any,
    toggleSearchNode: TreeNode | null,
    toggleOdsNode: TreeNode | null,
    publishType?: string,
    typeDesc: any
}
export interface TreeNode {
    id: number,
    name: string,
    children?: TreeNode[],
    toggled: boolean,
    active: boolean,
    loading: boolean,
    decorators: object,
    animations: object
}
export interface ISeatchButton {
    key: string
    isChecked: boolean,
    desc: string
}
export interface Idetail {
    dataName: string,
    dataDesc: string,
    edwType: string,
}
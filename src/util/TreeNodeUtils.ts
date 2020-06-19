import { TreeNode } from "../contants/base";

export function packageTreeNode(treeNode: any[]) {
    let parentId = -1;
    return treeNode.map((e) => {
        e.children = node(parentId, e.children);
        return e;
    });
    // return node(parentId, treeNode);
}

export function rtnLeafNodeList(treeNode: any[]) {
    return treeNode.filter(node => {
        for (let temp of treeNode) {
            if (node.id === temp.parentId) {
                return false;
            }
        }
        return true;
    });
}

function node(parentId: number, treeNode: any[]): any[] {

    return treeNode.map(e => {
        if (e.children) {
            return {
                id: e.id, name: e.nodeName, children: node(e.id, e.children),
                toggled: parentId === -1, active: false, type: e.type
            }
        } else {
            return {
                id: e.id, name: e.nodeName, toggled: false, active: false, type: e.type
            }
        }

    });
}

export function isNodeHaveChild(id: number, treeNode: any[]) {
    for (let node of treeNode) {
        if (node.parentId === id) {
            return true;
        }
    }
    return true;
}

export function findChild(node: TreeNode): number[] {
    let rtnArr: number[] = [];
    treeNode(node, rtnArr);
    return rtnArr;
}

function treeNode(node: TreeNode, rtnArr: number[]) {
    if (node.children && node.children.length > 0) {
        node.children.forEach(e => treeNode(e, rtnArr));
    } else {
        rtnArr.push(node.id);
    }
}
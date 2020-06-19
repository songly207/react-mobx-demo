import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { TreeNode, IBase } from '../../contants/base';
import { Treebeard } from 'react-treebeard';
import defaultTheme from '../../components/common/tree/TreeTheme';
import { Panels } from '../../components/basic/Panels';
// import {getDictionaryView} from "../../util/CommonUtils";

@inject('store')
@observer
export class EdwTree extends React.Component<IBase, { cursor: TreeNode | null }> {
    constructor(props: any) {
        super(props);
        this.state = { cursor: null };
    }
    onToggle(node: any, toggled: any) {
        console.log('onToggle node', node.type);
        this.props.store.toggleNode(node.type, node);
        if (this.state.cursor) { this.state.cursor.active = false; }
        node.active = true;
        if (node.children) { node.toggled = toggled; }
        this.setState({ cursor: node });
    }
    render() {
        let node = this.props.store.todo.nodeTree;
        let items = [];
        console.log('this.props.store.node', node);
        if (node) {
            for (let i = 0; i < node.length; i++) {
                if (node && node[i].children) {
                    items.push(<Panels header={node[i].nodeName} key={i}>
                        <Treebeard style={defaultTheme} data={node[i].children} onToggle={this.onToggle.bind(this)}/>
                    </Panels>)
                }
            }
            return (
                <div>{items}</div>
            )
        } else {
                return (<div></div>)

        // if (node && node.children) {
        //     return (
        //         <div>
        //             <Panels header={'数据主题分类（EDW）'}>
        //                 <Treebeard style={defaultTheme} data={this.props.store.todo.nodeTree[0].children} onToggle={this.onToggle.bind(this)} />
        //             </Panels>
        //         </div>
        //     );
        // } else {
        //     return (<div></div>)
        // }

    }
}}

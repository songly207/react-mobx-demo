import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { TreeNode, IBase } from '../../contants/base';
import { Treebeard } from 'react-treebeard';
import defaultTheme from '../../components/common/tree/TreeTheme';
import { Panels } from '../../components/basic/Panels';

@inject('store')
@observer
export class EdmTree extends React.Component<IBase, { cursor: TreeNode | null }> {
    constructor(props: any) {
        super(props);
        this.state = { cursor: null };
    }
    onToggle(node: any, toggled: any) {
        this.props.store.toggleNode('edm', node);
        if (this.state.cursor) { this.state.cursor.active = false; }
        node.active = true;
        if (node.children) { node.toggled = toggled; }
        this.setState({ cursor: node });
    }
    render() {
        return (
            <div>
                <Panels header={'业务主题分类（EDM）'}>
                    <Treebeard 
                        style={defaultTheme}
                        data={this.props.store.todo.edmNode}
                        onToggle={this.onToggle.bind(this)} />
                </Panels>
            </div>
        );
    }
}

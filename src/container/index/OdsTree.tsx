import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { TreeNode, IBase } from '../../contants/base';
import { Treebeard, decorators } from 'react-treebeard';
import defaultTheme from '../../components/common/tree/TreeTheme';
import { Panels } from '../../components/basic/Panels';

decorators.Header = function({ style,node }:{style: any,node: any}):any{
    const iconType = node.children ? 'folder' : 'file-text';
    const iconClass = `fa fa-${iconType}`;
    const iconStyle = { marginRight: '5px' };

    return (
        <div style={style.base}>
            <div style={style.title}>
                <i className={iconClass} style={iconStyle} />

                {node.name}
            </div>
        </div>
    );
};

@inject('store')
@observer
export class OdsTree extends React.Component<IBase, { cursor: TreeNode | null, data: TreeNode[] | null }> {
    constructor(props: any) {
        super(props);
        this.state = { cursor: null, data: new Array() };
    }
    onToggle(node: any, toggled: any) {
        this.props.store.toggleNode('ods', node);
        if (this.state.cursor) { this.state.cursor.active = false; }
        node.active = true;
        if (node.children) { node.toggled = toggled; }
        this.setState({ cursor: node });
        this.props.store.query();
    }
    render() {
        return (
            <div>
                <Panels header={'数据源分类（ODS）'}>
                    <Treebeard style={defaultTheme} data={this.props.store.todo.odsNode}
                        onToggle={this.onToggle.bind(this)} decorators={decorators} />
                </Panels>
            </div>

        );
    }
}

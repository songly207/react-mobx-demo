import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { IPublish } from '../../interface/IPublish';
import { Pager, Col, FormGroup, Button } from 'react-bootstrap';
import { Treebeard } from 'react-treebeard';
import defaultTheme from '../../components/common/tree/TreeTheme';
import { TreeNode } from '../../contants/base';
import { withRouter } from 'react-router';
import { LabelWithClose } from '../../components/basic/LabelWithClose';
import { Panels } from '../../components/basic/Panels';

interface Container extends IPublish {
}
@withRouter
@inject('publishStore')
@observer
export class PageThree extends React.Component<Container, { edwCursor: TreeNode | null, odsCursor: TreeNode | null, edmCursor: TreeNode | null }> {
    constructor(props: any) {
        super(props);
        this.state = { edwCursor: null, odsCursor: null, edmCursor: null };
    }
    previousPage() {
        if (this.state.edwCursor) { this.state.edwCursor.active = false; }
        if (this.state.edmCursor) { this.state.edmCursor.active = false; }
        if (this.state.odsCursor) { this.state.odsCursor.active = false; }
        this.props.publishStore.previousPage();
    }
    componentWillReceiveProps() {
        this.setState({ edwCursor: null, odsCursor: null, edmCursor: null });
    }
    saveOrCommit(type: string) {
         let msg = '';
        // if (!this.props.publishStore.todo.checkedNode.edm) {
        //     msg = '您没有选择业务主题分类，';
        // } else if (!this.props.publishStore.todo.checkedNode.ods) {
        //     msg = '您没有选择数据源分类，';
        // } else if (!this.props.publishStore.todo.checkedNode.edw) {
        //     msg = '您没有选择数据主题分类，';
        // }
        //
        var confirm: any = window.confirm(`${msg}确定${type === 'save' ? '保存' : '发布'}？`);
        if (confirm == false) {
            return;
        }
        this.props.publishStore.saveOrCommit(type);
    }
    onEdmToggle(node: any, toggled: boolean) {
        if (this.state.edmCursor) { this.state.edmCursor.active = false; }
        if (node.children) {
            node.toggled = toggled;
        } else {
            node.active = true;
            if (this.props.publishStore.todo.edmArr.indexOf(node.name) === -1) {
                this.props.publishStore.todo.edmArr.push(node.name);
                this.props.publishStore.checkedNode('edm', this.props.publishStore.todo.edmArr, node.id);
            }
        }
        this.setState({ edmCursor: node },()=>{});
        
    }
    onEdwToggle(node: any, toggled: boolean) {
        if (this.state.edwCursor) { this.state.edwCursor.active = false; }
        if (node.children) {
            node.toggled = toggled;
        } else {
            node.active = true;
            this.props.publishStore.checkedNode('edw', node.name, node.id);
        }
        this.setState({ edwCursor: node });
    }
    onOdsToggle(node: any, toggled: boolean) {
        if (this.state.odsCursor) { this.state.odsCursor.active = false; }
        console.log('selectToggle', node);
        if (node.children) {
            node.toggled = toggled;
        } else {
            node.active = true;
            this.props.publishStore.checkedNode(node.type, node.name, node.id);
        }
        this.setState({ odsCursor: node });
    }
    render() {
        let node = this.props.publishStore.todo.nodeTree;
        let items = [];

        for (let i = 0; i < node.length; i++) {
            if (node && node[i].children) {
                items.push(
                  <div key={i}>
                    <FormGroup className={'row'}>
                        <Col sm={1}>&nbsp;</Col>
                        <Col sm={7}>
                            <Panels header={node[i].nodeName}>
                                <Treebeard style={defaultTheme} data={node[i].children}
                                           onToggle={this.onOdsToggle.bind(this)} />
                            </Panels>
                        </Col>
                        <Col sm={3}>
                            {this.props.publishStore.todo.checkedNode[node[i].type] &&
                            <LabelWithClose click={() => this.props.publishStore.cancelNode(node[i].type,i)} >{this.props.publishStore.todo.checkedNode[node[i].type].nodeName}</LabelWithClose>
                            }
                        </Col>
                        <Col sm={1}>&nbsp;</Col>
                    </FormGroup>
                    <hr />
                  </div>

                )
            }
        }
        return (<div>
            <div className='row'>
                <h4 style={{ color:'#1890ff', marginLeft: '75px'}}>配置发布位置</h4>
                {/* <div className='pull-left'><h4>{this.props.publishStore.todo.currTable.fdwTable}</h4></div> */}
            </div>
            <hr/>
            <br />
            {items}
            {/*<FormGroup className={'row'}>*/}
                {/*<Col sm={7}>*/}
                    {/*<Panels header={'业务主题分类（ED）'}>*/}
                        {/*<Treebeard style={defaultTheme} data={this.props.publishStore.todo.nodeTree[0].children}*/}
                            {/*onToggle={this.onEdmToggle.bind(this)} />*/}
                    {/*</Panels>*/}
                {/*</Col>*/}
                {/*<Col sm={3}>*/}
                    {/*{this.props.publishStore.todo.checkedNode.edm &&*/}
                        {/*this.props.publishStore.todo.checkedNode.edm.map((e: any,i:number) => <LabelWithClose key={i} click={() => this.props.publishStore.cancelNode('edm',i)} > {e} </LabelWithClose>)}*/}
                {/*</Col>*/}
            {/*</FormGroup>*/}
            {/*<hr />*/}
            {/*<FormGroup className={'row'}>*/}
                {/*<Col sm={7}>*/}
                    {/*<Panels header={'数据源分类（ODS）'}>*/}
                        {/*<Treebeard style={defaultTheme} data={this.props.publishStore.todo.odsNode}*/}
                            {/*onToggle={this.onOdsToggle.bind(this)} />*/}
                    {/*</Panels>*/}
                {/*</Col>*/}
                {/*<Col sm={3}>*/}
                    {/*{this.props.publishStore.todo.checkedNode.ods &&*/}
                        {/*<LabelWithClose click={() => this.props.publishStore.cancelNode('ods','')} >{this.props.publishStore.todo.checkedNode.ods}</LabelWithClose>*/}
                    {/*}*/}
                {/*</Col>*/}
            {/*</FormGroup>*/}
            {/*<hr />*/}
            {/*<FormGroup className={'row'}>*/}
                {/*<Col sm={7}>*/}
                    {/*<Panels header={'数据主题分类（EDW）'}>*/}
                        {/*<Treebeard style={defaultTheme} data={this.props.publishStore.todo.edwNode}*/}
                            {/*onToggle={this.onEdwToggle.bind(this)} />*/}
                    {/*</Panels>*/}
                {/*</Col>*/}
                {/*<Col sm={3}>*/}
                    {/*{this.props.publishStore.todo.checkedNode.edw &&*/}
                        {/*<LabelWithClose click={() => this.props.publishStore.cancelNode('edw','')}>{this.props.publishStore.todo.checkedNode.edw}</LabelWithClose>*/}
                    {/*}*/}
                {/*</Col>*/}
            {/*</FormGroup>*/}
            <Pager>
                <FormGroup>
                    <div >
                        发布信息将在数据中心与FDW展示
                    </div>
                    <Button bsStyle={'primary'} onClick={() => this.saveOrCommit('save')}>{'保存'}</Button>
                    &nbsp;
                    <Button bsStyle={'success'} onClick={() => this.saveOrCommit('commit')}>{'发布'}</Button>
                </FormGroup>
                <Pager.Item onClick={this.previousPage.bind(this)} previous href="#">{'← 上一页'}</Pager.Item>
            </Pager>
        </div>);
    }
}
//  withRouter(PageThree);
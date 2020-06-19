import * as React from 'react';
import { Form, Col, FormGroup, Table, Button, FormControl, ButtonToolbar } from 'react-bootstrap';
import Select from 'react-select';
import { inject, observer } from 'mobx-react';
import { status } from '../../contants/Common';
import { Pagination } from '../../components/basic/Pagination';
import { TableModal } from './TableModal';
import { withRouter } from 'react-router-dom';
import { dateFormat } from '../../util/CommonUtils';
import TextWithTooltip from '../../components/basic/TextWithTooltip';

@withRouter
@inject('centerStore', 'publishStore')
@observer
export class Center extends React.Component<{ centerStore?: any, publishStore?: any } | any > {
    componentDidMount() {
        this.props.centerStore.query();
        this.props.centerStore.queryNode();
        this.props.centerStore.getPublishUser();
    }
    handleChange(type: string, newVal: any) {
        this.props.centerStore.changeArgs(type, newVal);
    }
    // 表格页码组件回调
    paginationCallBack(pageNo: number) {
        this.props.centerStore.pageUp(pageNo);
    }
    getStateOption(): object[] {
        return Object.keys(status).map(e => {
            return { label: status[e], value: e };
        });
    }
    getOdsTypeOption(): object[] {
        return this.props.centerStore.todo.odsNode.map((e: any) => {
            return { label: e.nodeName, value: e.nodeName };
        });
    }
    edit(id: any) {
        this.props.publishStore.edit(id);
        this.props.history.push('/publish');
    }
    publish() {

    }
    render() {
        return (<div>
            <div className='post'>
                <Form horizontal>
                    <div className='row'>
                        <div className='col-md-3'>
                            <FormGroup>
                                <label className={'col-sm-4 control-label text-right text-nowrap'}>{'状态'}</label>
                                <Col sm={8}>
                                    <Select options={this.getStateOption()} placeholder={'请选择'} closeOnSelect={true}
                                        simpleValue value={this.props.centerStore.todo.queryArgs.status}
                                        onChange={(newVal) => { this.handleChange('status', newVal) }}
                                    />
                                </Col>
                            </FormGroup>
                        </div>
                        <div className='col-md-3'>
                            <FormGroup>
                                <label className={'col-sm-4 control-label text-right text-nowrap'}>{'数据源'}</label>
                                <Col sm={8}>
                                    <Select options={this.getOdsTypeOption()} placeholder={'请选择'} closeOnSelect={true}
                                        simpleValue value={this.props.centerStore.todo.queryArgs.odsType}
                                        onChange={(newVal) => { this.handleChange('odsType', newVal) }}
                                    />
                                </Col>
                            </FormGroup>
                        </div>
                        <div className='col-md-3'>
                            <FormGroup>
                                <label className='col-sm-4 control-label text-right text-nowrap'>{'发布人'}</label>
                                <Col sm={8}>
                                    <Select options={this.props.centerStore.todo.publishUser.map((e: any) => { return { label: e, value: e } })}
                                        placeholder={'请选择'} closeOnSelect={true}
                                        simpleValue value={this.props.centerStore.todo.queryArgs.publishUser}
                                        onChange={(newVal) => { this.handleChange('publishUser', newVal) }}
                                    />
                                </Col>
                            </FormGroup>
                        </div>
                        <div className='col-md-3'>
                            <FormGroup>
                                <label className='col-sm-4 control-label text-right text-nowrap'>{'用户组'}</label>
                                <Col sm={8}>
                                    <FormControl type='text' value={this.props.centerStore.todo.queryArgs.fdwUserGroup}
                                        onChange={(event: any) => this.handleChange('fdwUserGroup', event.target.value)}
                                    />
                                </Col>
                            </FormGroup>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-12'>
                            <ButtonToolbar className='pull-right'>
                                <Button href='#' bsStyle='primary' onClick={() => this.props.centerStore.query()}>{'查询'}</Button>
                            </ButtonToolbar>
                        </div>
                    </div>
                </Form>
                <hr />
                <Table className='text-center'>
                    <tbody>
                        <tr className='row active'>
                            <td className='word-break col-md-2'>{'数据标题'}</td>
                            <td className='word-break col-md-2'>{'数据库'}</td>
                            <td className='word-break col-md-2'>{'数据表'}</td>
                            <td className='word-break col-md-2'>{'用户组'}</td>
                            <td className='col-md-1'>{'发布时间'}</td>
                            <td className='col-md-1'>{'被申请次数'}</td>
                            <td className='col-md-1'>{'状态'}</td>
                            <td className='col-md-1'>{'操作'}</td>
                        </tr>
                        {this.props.centerStore.todo.data.slice().map((e: any, index: number) => {
                            return (<tr className='row' key={index}>
                                <td>{e.fdwTitle}</td>
                                <td>{e.fdwDatabase}</td>
                                <td><a onClick={() => this.props.centerStore.clickDataName(e.id)}> {e.fdwTable}</a></td>
                                <td>{e.fdwUserGroup}</td>
                                <td>{dateFormat(e.publishTime)}</td>
                                <td>{e.applyTime}</td>
                                <td>{status[e.status]}</td>
                                <td>
                                    {e.status === 0 && <div>
                                        <TextWithTooltip tooltip='编辑'>
                                            <a className='fa fa-edit cursor-pointer' onClick={() => this.edit(e.id)}></a>
                                        </TextWithTooltip>
                                        {' '}
                                        <TextWithTooltip tooltip='发布'>
                                            <a className='fa fa-send cursor-pointer' onClick={() => this.props.centerStore.publish(e.id)}></a>
                                        </TextWithTooltip>
                                    </div>}
                                </td>
                            </tr>);
                        })}
                    </tbody>
                </Table>
                {this.props.centerStore.todo.dataModal.show &&
                    <TableModal id={this.props.centerStore.todo.dataModal.id} />
                }
                <Pagination data={this.props.centerStore.todo.page} callback={this.paginationCallBack.bind(this)} />
            </div>
        </div>);
    }
}
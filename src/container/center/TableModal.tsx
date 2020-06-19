import * as React from 'react';
import { Modal, Table, Label, Button } from 'react-bootstrap';
import * as Api from '../../util/Api';
import { inject, observer } from 'mobx-react';
import { isNull, dataLevel, customerSource } from '../../contants/Common';

@inject('centerStore')
@observer
export class TableModal extends React.Component<{ id: number, centerStore?: any }, { data: any, show: boolean }> {
    constructor(props: any) {
        super(props);
        this.state = { data: null, show: true };
    }
    componentDidMount() {
        let request = new Api.ApiBody();
        request.body = {
            id: this.props.id + ''
        };
        Api.performSingleApiBodyRequest('/edwCommon/getDetail', request, res => {
            this.setState({ data: res.body['data'] });
        });
    }
    onHide() {
        this.setState({ show: false });
        this.props.centerStore.closeModal();
    }
    render() {
        return (
            <Modal bsSize="large" aria-labelledby="contained-modal-title-lg"
                onHide={this.onHide.bind(this)} show={this.state.show}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-lg">
                        <strong>{'数据详情'}</strong>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.data &&
                        <div className='post'>
                            <h3>{this.state.data.fdwTitle}</h3>
                            <small>{this.state.data.fdwDetail}</small>
                            <hr />
                            <div>
                                <strong>{'基本信息'}</strong>
                                <br />
                                <Table striped bordered condensed hover>
                                    <tbody>
                                        <tr className='row'>
                                            <td className='col-sm-2'>{'数据类型'}</td>
                                            <td className='col-sm-10'>{this.state.data.fdwDataType}</td>
                                        </tr>
                                        <tr className='row'>
                                            <td>{'数据空间'}</td>
                                            <td>{this.state.data.fdwNamespace}</td>
                                        </tr>
                                        <tr className='row'>
                                            <td>{'数据库名'}</td>
                                            <td>{this.state.data.fdwDatabase}</td>
                                        </tr>
                                        <tr className='row'>
                                            <td>{'数据表名'}</td>
                                            <td>{this.state.data.fdwTable}</td>
                                        </tr>
                                        <tr className='row'>
                                            <td>{'发布人'}</td>
                                            <td>{this.state.data.publishUser}</td>
                                        </tr>
                                        <tr className='row'>
                                            <td>{'数据维护方'}</td>
                                            <td>{'FDW'}</td>
                                        </tr>
                                        <tr className='row'>
                                            <td>{'数据来源方'}</td>
                                            <td>{'FDW'}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                            <hr />
                            <div>
                                <strong>{'字段定义'}</strong>
                                <br />
                                <Table striped bordered condensed hover className='text-center'>
                                    <tbody>
                                        <tr className='row'>
                                            <td>{'密级'}</td>
                                            <td>{'字段名'}</td>
                                            <td>{'描述'}</td>
                                            <td>{'数据类型'}</td>
                                            <td>{'是否为空'}</td>
                                            <td className='word-break'>{'补充说明'}</td>
                                            <td >{'标记识别码'}</td>
                                            <td className='word-break'>{'用户识别码类型'}</td>
                                        </tr>
                                        {JSON.parse(this.state.data.dataFields).map((e: any, index: number) => {
                                            return <tr className='row' key={index}>
                                                <td ><Label bsStyle='danger'>{dataLevel[e.level]}</Label></td>
                                                <td>{e.name}</td>
                                                <td>{e.detail}</td>
                                                <td>{e.type}</td>
                                                <td>{isNull[e.is_null]}</td>
                                                <td>{e.remark ? e.remark : ''}</td>
                                                <td>{e.remarkCode === '1' ? '是' : '否'}</td>
                                                <td>{e.customerType ? customerSource[e.customerType] : ''}</td>
                                            </tr>
                                        })}
                                    </tbody>
                                </Table>
                            </div>
                            <hr />
                            <div>
                                <strong>{'数据发布位置'}</strong>
                                <br />
                                <Table striped bordered condensed hover>
                                    <tbody>
                                        <tr className='row'>
                                            <td className='col-sm-2'>
                                                {'数据源：'}
                                            </td>
                                            <td className='col-sm-10'>
                                                {this.state.data.odsType}
                                            </td>
                                        </tr>
                                        <tr className='row'>
                                            <td className='col-sm-2'>
                                                {'数据主题：'}
                                            </td>
                                            <td className='col-sm-10'>
                                                {this.state.data.edwType}
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle='danger' onClick={this.onHide.bind(this)}>{'关闭'}</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
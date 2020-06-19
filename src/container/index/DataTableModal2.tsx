import * as React from 'react';
import { Table, Button, Tabs, Tab } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';
import { IStore } from '../../contants/base';
import { customerSource } from '../../contants/Common';
import { Pagination } from '../../components/basic/Pagination';

const tab1 = [{name:'数据源名称',desc:'数据中心发布时配置的数据源名称',type:''},
{name:'表名称',desc:'数据中心发布时配置的数据源对应的表名称',type:''},
{name:'表描述',desc:'数据中心发布完成时拉取的表描述',type:''},
{name:'表中客户标识字段',desc:'发布表时勾选了【标记个人标识】项对应的字段名称（必须项）',type:'未标记个人标识的信息不生成记录'},
{name:'对应个人标识类型',desc:`个人标识类型的分类
BID：Passport账号；
CMID：信贷业务后台基于身份证生成个人ID
CUID：个人设备编码
CID：钱包支付基于身份证生成个人ID
身份证号：中国公民身份账号
Icoshuid：主场景基于用户session生成的个人标识
微信账号：个人微信登录账号
其它
`,type:'数据发布时标记的个人标识类型分类'},
{name:'最新更新日期',desc:'该表内容最新的更新日期',type:''}
];

@inject('store')
@observer
export class DataTableModal2 extends React.Component<{ customerObj: any, store?: IStore }, { show: boolean }> {
    constructor(props: any) {
        super(props);
        this.state = { show: true };
    }
    // 表格页码组件回调
    paginationCallBack(pageNo: number) {
        this.props.store.queryCustomer(pageNo);
    }
    componentDidMount() {
        this.props.store.queryCustomer();
    }
    onHide() {
        this.setState({ show: false });
        this.props.store.closeCustomerModal();
    }
    render() {
        let trArr: JSX.Element[] = [];
        this.props.store.todo.customerModalData.list.forEach((e: any) => {
            let remarkFieldsArr = e.remarkFields.split(',');
            let typeArr = e.type.split(',');
            remarkFieldsArr.forEach((fields: any, index: number) => {
                trArr.push(<tr className='row' key={`${e.id}.${index}`}>
                    <td>{e.source}</td>
                    <td>{e.tableName}</td>
                    <td>{e.tableTitle}</td>
                    <td>{fields}</td>
                    <td>{customerSource[typeArr[index]]}</td>
                </tr>);
            });
        })
        return (
            <div style={{ minHeight:'468px' }}>
                <header style={{ fontSize:'22px',marginBottom:'20px' }}>
                    <strong>{'详情'}</strong>
                </header>
                <section>
                    <div className='main-container'>
                        <h4>{this.props.store.todo.customerObj.title}</h4>
                        <p>{this.props.store.todo.customerObj.desc}</p>
                        <p>{this.props.store.todo.customerObj.invoke}</p>
                        <Button bsStyle="primary" onClick={() => toastr.info(`需要在http://fdw.duxiaoman-int.com/market中申请表， 申请完成后即可使用数据中查询服务（待上线）`)}>{'立即申请'}</Button>
                        <hr />
                        <Tabs defaultActiveKey={2} id="uncontrolled-tab-example">
                            <Tab eventKey={1} title="字段定义">
                                <Table striped bordered condensed hover>
                                    <tbody>
                                        <tr className='row'>
                                            <td>{'字段'}</td>
                                            <td>{'字段描述'}</td>
                                            <td>{'处理逻辑'}</td>
                                        </tr>
                                        {tab1.map((e,i) => <tr key={`${i}`} className='row'>
                                            <td className='word-break col-md-3'>{e.name}</td>
                                            <td className='word-break col-md-6'>{e.desc}</td>
                                            <td className='word-break col-md-3'>{e.type}</td>
                                        </tr>)}
                                    </tbody>
                                </Table>
                            </Tab>
                            <Tab eventKey={2} title="数据样例">
                                <Table striped bordered condensed hover>
                                    <tbody>
                                        <tr className='row info'>
                                            {['数据源名称', '数据表名称', '数据表描述', '表中客户标识字段', '对应个人标识类型'].map((e,i) => <td key={`${i}`}>{e}</td>)}
                                        </tr>
                                        {trArr}
                                    </tbody>
                                </Table>
                                <Pagination data={this.props.store.todo.customerModalData.page} callback={this.paginationCallBack.bind(this)} />
                            </Tab>
                        </Tabs>
                    </div>
                </section>
            </div>
            // <Modal bsSize="large" aria-labelledby="contained-modal-title-lg"
            //     onHide={this.onHide.bind(this)} show={this.state.show}>
            //     <Modal.Header closeButton>
            //         <Modal.Title id="contained-modal-title-lg">
            //             <strong>{'详情'}</strong>
            //         </Modal.Title>
            //     </Modal.Header>
            //     <Modal.Body>
            //         <div className='main-container'>
            //             {/* this.props.customerObj.title */}
            //             <h4>{this.props.store.todo.customerObj.title}</h4>
            //             <p>{this.props.store.todo.customerObj.desc}</p>
            //             <p>{this.props.store.todo.customerObj.invoke}</p>
            //             <Button bsStyle="primary" onClick={() => toastr.info(`需要在http://fdw.duxiaoman-int.com/market中申请表， 申请完成后即可使用数据中查询服务（待上线）`)}>{'立即申请'}</Button>
            //             <hr />
            //             <Tabs defaultActiveKey={2} id="uncontrolled-tab-example">
            //                 <Tab eventKey={1} title="字段定义">
            //                     <Table striped bordered condensed hover>
            //                         <tbody>
            //                             <tr className='row'>
            //                                 <td>{'字段'}</td>
            //                                 <td>{'字段描述'}</td>
            //                                 <td>{'处理逻辑'}</td>
            //                             </tr>
            //                             {tab1.map(e => <tr className='row'>
            //                                 <td className='word-break col-md-3'>{e.name}</td>
            //                                 <td className='word-break col-md-6'>{e.desc}</td>
            //                                 <td className='word-break col-md-3'>{e.type}</td>
            //                             </tr>)}
            //                         </tbody>
            //                     </Table>
            //                 </Tab>
            //                 <Tab eventKey={2} title="数据样例">
            //                     <Table striped bordered condensed hover>
            //                         <tbody>
            //                             <tr className='row info'>
            //                                 {['数据源名称', '数据表名称', '数据表描述', '表中客户标识字段', '对应个人标识类型'].map(e => <td>{e}</td>)}
            //                             </tr>
            //                             {trArr}
            //                         </tbody>
            //                     </Table>
            //                     <Pagination data={this.props.store.todo.customerModalData.page} callback={this.paginationCallBack.bind(this)} />
            //                 </Tab>
            //             </Tabs>
            //         </div>
            //     </Modal.Body>
            //     <Modal.Footer>
            //         <Button bsStyle='danger' onClick={this.onHide.bind(this)}>{'关闭'}</Button>
            //     </Modal.Footer>
            // </Modal>
        );
    }
}
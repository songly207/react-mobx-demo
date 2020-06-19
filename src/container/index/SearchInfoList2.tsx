import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { IBase } from '../../contants/base';
// import { DataTableModal2 } from './DataTableModal2';
import { Table, Button } from 'react-bootstrap';
import { customerSource } from '../../contants/Common';


@inject('store')
@observer
export class SearchInfoList2 extends React.Component<IBase, {}> {
    render() {
        let trArr: JSX.Element[] = [];
        this.props.store.todo.customerData.list.forEach((e: any) => {
            let remarkFieldsArr = e.remarkFields.split(',');
            let typeArr = e.type.split(',');
            remarkFieldsArr.forEach((fields: any, index: number) => {
                trArr.push(<tr key={`${e.id}.${index}`}>
                    <td key={'source'}>{e.source}</td>
                    <td key={'tableName'}>{e.tableName}</td>
                    <td key={'tableTitle'}>{e.tableTitle}</td>
                    <td key={'fields'}>{fields}</td>
                    <td key={'type'}>{customerSource[typeArr[index]]}</td>
                </tr>);
            });
        })
        return (
            <div className='row'>
                <h4>
                    <a href={'/datasource'} target='_blank'>{this.props.store.todo.customerObj.title}</a>
                </h4>
                <p>{this.props.store.todo.customerObj.desc}</p>
                <p>{this.props.store.todo.customerObj.invoke}</p>
                <Table striped bordered condensed hover style={{width:'96%'}}>
                    <tbody>
                        <tr className=' info'>
                            {['数据源名称', '数据表名称', '数据表描述', '表中客户标识字段', '对应个人标识类型'].map((e,i) => <td key={`${i}`}>{e}</td>)}
                        </tr>
                        {trArr}
                        <tr>
                            <td colSpan={5}>
                                <Button
                                    disabled={this.props.store.todo.customerData.isEnd}
                                    block
                                    onClick={() => { this.props.store.queryCustomerData(20) }}>
                                    {'MORE'}
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </Table>
                <hr />
            </div>);
    }
}
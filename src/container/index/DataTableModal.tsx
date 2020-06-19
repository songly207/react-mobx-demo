import * as React from 'react';
import * as Api from '../../util/Api';
import { Tabs, Tab, Table, Label } from 'react-bootstrap';
import  { Button } from 'antd';
import Select from 'react-select';
import { htmlDecode } from '../../util/StringUtils';
import { inject, observer } from 'mobx-react';
import { IStore } from '../../contants/base';
import { dateFormat } from '../../util/CommonUtils';
import { isNull, status, dataLevel, dataImportanceLevel, customerSource, updateRate,dataUpdateFreq, updateMode, securityClass } from '../../contants/Common';
require('./DataTableModal.css');
@inject('store')
@observer
export class DataTableModal extends React.Component<{ id: number, store?: IStore }, { data: any, show: boolean, dataSample: any, keySet: string[], sampleAmount: any }> {
    constructor(props: any) {
        super(props);
        // show 默认 QE false GP
        this.state = { data: null, show: true, dataSample: null, keySet: null, sampleAmount: 5 };
        
    }
    httpString(s: string) {
        let reg = /(https?|http?|ftp?|file?):?\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
        reg.lastIndex = 0;
        let s1 = s.match(reg);
        let arr = s.split(s1 + '');
        return (
            <span>
                {arr[0]}
                {
                    s1 ? (<a target="_blank" href={s1 ? s1+'':''}> {s1 ? s1:'' } </a> ): ''
                } 
                {arr[1] ? arr[1]:''}
            </span>
        );
    }
    componentDidMount() {
        $('body').addClass('data-map-detail');
        function GetQueryString(name:any) {
            let reg = new RegExp('(^|&)'+ name +'=([^&]*)(&|$)');
            let r = window.location.search.substr(1).match(reg);
        　　if(r != null) return unescape(r[2]);
            return null;
        }
        let myurl = GetQueryString('url');
        if(myurl != null && myurl.toString().length > 1) {
            alert(GetQueryString('url'));
        }
        let request = new Api.ApiBody();
        request.body = {
            id: this.props.id + ''
            // id: GetQueryString('id')
        };
        let params = window.location.hash.slice(2).split('/');
        // console.log('params',params);
        this.setState({ show: params[1] === 'QueryEngine' });
        if (params) {
            request.body.id = params[0];
            request.body.sourceType = params[1];
        }
        Api.performSingleApiBodyRequest('/edwCommon/getDetail', request, res => {
            let data = res.body['data'];
            let dataFields: string = data.dataFields;
            if (data) {
                this.setState({ data: data, keySet: JSON.parse(dataFields).map((e: any) => e.name) });
                this.queryDataSample(5, request.body.id);
            }
        });

    }
    queryDataSample(limit:any, id:any) {
        let request = new Api.ApiBody();
        request.body = {
            publishId: Number(id),
            // 默认取第一页
            page_num: 1,
            // 默认取10条数据
            limit: this.state.sampleAmount||limit,
            fields: this.state.keySet.join()
        };
        Api.performSingleApiBodyRequest('/edwDataMap/querySample', request, res => {
            this.setState({ dataSample: { code: res.code, list: res.body['data'] } });
        });
    }
    onHide() {
        this.setState({ show: false });
        setTimeout(()=>{
            this.setState({ show: true });
        }, 60000)
        // this.props.store.closeModal();
    }
    selectSampleDataAmount(newVal:any) {
        if (newVal) {
            this.queryDataSample(newVal,''); 
            this.setState({sampleAmount: newVal});
        } else {
            this.setState({sampleAmount: "请选择数据样例数量"});
        }
    }
    dataUpdataTime(){
        let caseval = this.state.data.dataUpdateFreq;
        let time = this.state.data.dataUpdateTime;
        switch(caseval) {
            case 'untime':
            case 'day':   
            return (
                <span>{time}</span>
            );
            case 'minute': return (
                <span>每{parseInt(time)}分钟</span>
            );
            case 'week': {
                let obj = {
                    Monday : '星期一',
                    Tuesday: '星期二',
                    Wednesday : '星期三',
                    Thursday: '星期四',
                    Friday: '星期五',
                    Saturday: '星期六',
                    Sunday: '星期日',
                }
                return '每周' + obj[time];
            };
            case 'month': 
                if (time >0){
                    return (<span> 每月第 {time} 天</span>)
            }else{
                return( <span>每月最后一天</span> )
            }
            default: return (
                <span></span>
            );
        }
        
    }
    render() {
        return (
                <div>
                    {this.state.data &&
                    <div className='main-container '>
                        <p className="data-map-details clearfix">
                            <span>详情</span>
                            <img src="../../img/arrowRight.svg"/>
                            <a href="/">返回</a>
                            {/* <span onClick={() => { this.onHide() }}>隐藏</span> */}
                        </p>
                        {/* this.state.data.sourceType */}
                        { this.state.show ? 
                        <div className="clearfix" style={{ display: 'flex', justifyContent: 'flex-start' }}>
                           
                            <div style={{ flex: '4', marginBottom: '10px' }}>
                                <h4 style={{ color: "#0092f2" }}>
                                    {this.state.data.dataNameCh ? this.state.data.dataNameCh : ""}
                                </h4>
                                <p>{this.state.data.fdwTable}</p>
                                <p>加工逻辑：{this.httpString(this.state.data.tableProcessLogic)}</p>
                                {/* <p>数据标题：{this.state.data.fdwTitle}</p> */}
                                {this.state.data.typeNameList ? this.state.data.typeNameList.map((item: any, index: any) => {
                                    return <Label bsStyle='primary' key={index}>{item}</Label>
                                }) : <Label bsStyle='primary'></Label>}
                            </div>
                            <div style={{ flex: "1", margin: "40px 20px 0 0" }}>
                                <span style={{ marginRight: '14px' }}>
                                    <b>数据接口人&nbsp;&nbsp;&nbsp;&nbsp;</b>
                                    {this.state.data.dataBizPrincipal}
                                </span>
                            </div>
                            <Button type="primary"
                                style={{ flex: "0 0 88px", background: "#0092f2", marginTop: '35px' }} onClick={() => { window.location = `/datamap?mapId=${this.state.data.id}`} }
                            >立即申请</Button>
                        </div>
                        : 
                        <div className="clearfix">
                            <div className="clearfix" style={{ width: "100%", borderBottom: "1px solid #b5b5b5", marginBottom: "10px"}}>
                                <h4 style={{ float: "left", color: "#0092f2", width: "80%"}}>
                                    {this.state.data.dataNameCh}
                                </h4>
                                <Button type="primary" style={{ float: "right", background: "#0092f2" }} onClick={() => { window.open('http://fbi.duxiaoman-int.com/easy/market/task#/')}}>立即使用</Button>
                            </div>

                            <div className="clearfix" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{ flex: '3' }}>
                                    <p>表名：{this.state.data.dataName}</p>
                                    <p>更新方式：{updateMode[this.state.data.updateMode]}</p>
                                    <p>数据规模：{this.state.data.dataSize}</p>
                                </div>
                                <div style={{ flex: "3" }}>
                                    <p>数据库：{this.state.data.fdwDatabase}</p>
                                    <p>数据范围：{this.state.data.dataScope}</p>
                                    <p>安全等级：{securityClass[this.state.data.securityClass]}</p>
                                </div>

                                <div style={{ flex: "0 0 245px" }}>
                                    <p>预期产出时间：{this.state.data.dataOutTime}</p>
                                    <p>更新频率：{dataUpdateFreq[this.state.data.dataUpdateFreq]}</p>
                                    <p>数据负责人：{this.state.data.dataManager}</p>
                                </div>
                            </div>
                            <p>加工逻辑：{this.httpString(this.state.data.tableProcessLogic)}</p>
                        </div>

                        }
                        
                        {/*<FormGroup>*/}
                            {/*<Button bsStyle="primary" onClick={() => {window.location = `/datamap?mapId=${this.state.data.id}`}}>{'立即申请'}</Button>*/}
                            {/*<Select className="pull-right col-md-4" simpleValue  closeOnSelect={true} value={this.state.sampleAmount} options={[*/}
                                {/*{ value: 5, label: '5' },{ value: 10, label: '10' },*/}
                                {/*{ value: 20, label: '20' },{ value: 30, label: '30' },{ value: 50, label: '50' }]} placeholder={'请选择数据样例数量'}*/}
                                    {/*onChange={(newVal) => { this.selectSampleDataAmount(newVal) }}*/}
                            {/*/>*/}
                            {/*<hr />*/}
                        {/*</FormGroup>*/}
                        <Tabs defaultActiveKey={1} id="uncontrolled-tab-example"  style = {{ minHeight: '279px' }}>
                        {this.state.show ? 
                            <Tab eventKey={1} title="字段定义">
                                <Table striped bordered condensed hover className='text-center'>
                                    <tbody>
                                    <tr className='row'>
                                        <td>{'密级'}</td>
                                        <td>{'字段名'}</td>
                                        <td>{'描述'}</td>
                                        <td>{'数据类型'}</td>
                                        <td>{'是否为空'}</td>
                                        <td>{'补充说明'}</td>
                                        <td >{'标记识别码'}</td>
                                        {/* <td>{'是否为主键'}</td> */}
                                        <td className='word-break'>{'用户识别码类型'}</td>
                                    </tr>
                                    {JSON.parse(htmlDecode(this.state.data.dataFields)).map((e: any, index: number) => {
                                        return <tr className='row' key={index}>
                                            <td ><Label bsStyle='danger'>{dataLevel[e.level]}</Label></td>
                                            <td>{e.name}</td>
                                            <td>{e.detail}</td>
                                            <td>{e.type}</td>
                                            <td>{isNull[e.is_null]}</td>
                                            <td>{e.remark ? e.remark : ''}</td>
                                            <td>{e.remarkCode === '1' ? '是' : '否'}</td>
                                            {/* <td>{e.primaryKey ? e.primaryKey:'否'}</td> */}
                                            <td>{e.customerType ? customerSource[e.customerType] : ''}</td>
                                        </tr>
                                    })}
                                    </tbody>
                                </Table>
                            </Tab>
                            :
                            <Tab eventKey={1} title="字段定义">
                                <Table striped bordered condensed hover className='text-center'>
                                    <tbody>
                                        <tr className='row'>
                                            <td>{'字段英文名'}</td>
                                            <td>{'字段中文名'}</td>
                                            <td>{'数据类型'}</td>
                                            <td>{'字段描述'}</td>
                                        </tr>
                                        {JSON.parse(htmlDecode(this.state.data.dataFields)).map((e: any, index: number) => {
                                            return <tr className='row' key={index}>
                                                <td>{e.name}</td>
                                                <td>{e.nameCh || e.name_ch}</td>
                                                <td>{e.type}</td>
                                                <td>{e.detail}</td>
                                            </tr>
                                        })}
                                    </tbody>
                                </Table>
                            </Tab>
                        }
                            {this.state.show ? 
                                <Tab eventKey={2} title="数据样例">
                                    <div className="clearfix" style={{ marginTop: "4px", marginBottom: "4px", paddingRight: "1px" }}>
                                        <Select className="pull-right col-md-4" simpleValue closeOnSelect={true} value={this.state.sampleAmount} options={[
                                            { value: 5, label: '5' }, { value: 10, label: '10' },
                                            { value: 20, label: '20' }, { value: 30, label: '30' }, { value: 50, label: '50' }]} placeholder={'请选择数据样例数量'}
                                            onChange={(newVal) => { this.selectSampleDataAmount(newVal) }}
                                        />
                                    </div>
                                    {this.state.dataSample && <div style={{ overflowX: "auto" }}>
                                        <Table striped bordered condensed hover className='text-center'>
                                            <tbody>
                                                <tr className='row'>
                                                    {this.state.keySet.map((e: any, index: number) => {
                                                        return <td key={index}>{e}</td>
                                                    })}
                                                </tr>
                                                {this.state.dataSample.list.map((e: any, index: number) => {
                                                    return <tr className='row' key={index}>
                                                        {this.state.keySet.map((f: any, index: number) => {
                                                            return <td key={index}>{e[f]}</td>
                                                        })}
                                                    </tr>
                                                })}
                                            </tbody>
                                        </Table>
                                    </div>}
                                </Tab> : ''
                            }
                            {this.state.show ? 
                                <Tab eventKey={3} title="服务级别">
                                    <Table striped bordered condensed hover>
                                        <thead></thead>
                                        <tbody>
                                            <tr className="table-first-tr row">
                                                <td className='table-left-title col-md-2'>{'数据规模'}</td>
                                                <td className="col-md-4">{this.state.data.dataSize}</td>
                                                <td className='table-left-title col-md-2'>{'数据更新频率'}</td>
                                                <td className="col-md-4">{updateRate[this.state.data.dataUpdateFreq]}</td>
                                            </tr>
                                            <tr className="row">
                                                <td className='table-left-title col-md-2'>{'数据状态'}</td>
                                                <td className="col-md-4">{status[this.state.data.status]}</td>
                                                <td className='table-left-title col-md-2'>{'数据更新时间'}</td>
                                                <td className="col-md-4">
                                                    {this.state.data.dataUpdateTime}
                                                    {/* {this.state.data.dataUpdateTime + ' ' +'('+this.dataUpdataTime()+')'} */}
                                                </td>
                                            </tr>
                                            <tr className="table-first-tr row">
                                                <td className='table-left-title col-md-2'>{'最近修改时间'}</td>
                                                <td className="col-md-3">{dateFormat(this.state.data.updateTime)}</td>
                                                <td className='table-left-title col-md-2'>{'数据生命周期'}</td>
                                                <td className="col-md-4">{this.state.data.dataLifeCycleStart}&nbsp;-&nbsp;{/9999/.test(this.state.data.dataLifeCycleEnd) ? '长期有效' : this.state.data.dataLifeCycleEnd}
                                                </td>
                                            </tr>
                                            <tr className="row">
                                                <td className='table-left-title col-md-2'>{'数据重要级别'}</td>
                                                <td className="col-md-4">{dataImportanceLevel[this.state.data.dataLevel]}</td>
                                                <td className='table-left-title col-md-2'>{''}</td>
                                                <td className="col-md-4"></td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Tab>
                            : ''}
                                
                            {/* <Tab eventKey={4} title="基本信息">
                                <Table striped bordered condensed hover>
                                    <tbody>
                                    <tr>
                                        <td>{'运行周期'}</td>
                                        <td>{this.state.data.runCycle}</td>
                                    </tr>
                                    <tr>
                                        <td>{'数据规模'}</td>
                                        <td>{this.state.data.dataSize}</td>
                                    </tr>
                                    <tr>
                                        <td>{'数据状态'}</td>
                                        <td>{status[this.state.data.status]}</td>
                                    </tr>
                                    <tr>
                                        <td>{'最近修改时间'}</td>
                                        <td>{dateFormat(this.state.data.updateTime)}</td>
                                    </tr>
                                    </tbody>
                                </Table>
                            </Tab> */}
                        </Tabs>
                    </div>
                    }</div>

            );
    }
}
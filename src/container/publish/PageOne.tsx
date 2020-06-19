import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { IPublish } from '../../interface/IPublish';
import Select from 'react-select';
import { Pager, FormGroup, Col, ControlLabel, Form, Popover, OverlayTrigger, Button } from 'react-bootstrap';
import { Input, InputNumber, TimePicker, Radio} from 'antd';
import DateRange from './../../components/basic/DateRange'

import './PageOne.css';
import 'antd/dist/antd.css'; 
import moment = require('moment');
// import { Left } from '_@types_react-bootstrap@0.32.17@@types/react-bootstrap/lib/Media';

interface Container extends IPublish {
}
const RadioGroup = Radio.Group;

@inject('publishStore')
@observer
export class PageOne extends React.Component<Container, {dayOfMonthRdo:number,dayOfMonth:number}> {
    constructor(props: any) {
        super(props);
        console.log(this.props.publishStore);
        this.state = {
            dayOfMonth : 1,
            dayOfMonthRdo: 1
        }
    }

    dataBaseOption() {
        if (this.props.publishStore.todo.publishType === 'fdw') {
            let dataBaseList = this.props.publishStore.todo.dataBaseList;
            console.log(dataBaseList);
            if (dataBaseList)
                return dataBaseList.map((e: any) => {
                    return { label: e, value: e }
                });
            else return [];
        } else {
            return this.props.publishStore.todo.dataBaseList
        }
    }

    dataBaseChange(newVal: any) {
        this.props.publishStore.checkedDataBase(newVal);
    }

    dataGroupChange(newVal: string) {
        this.props.publishStore.setDataGroup(newVal);
    }
    
    // dataSourcePDBChange(newVal: string) {
    //     this.props.publishStore.setDataSourcePDB(newVal);
    // }
    dataTableOption() {
        let tableList = this.props.publishStore.todo.tableList;
        if (this.props.publishStore.todo.publishType === 'fdw') {
            if (tableList && tableList.length > 0) {
                return tableList.map((e: any) => {
                    return { label: e.fdwTable, value: e.fdwTable };
                });
            } else {
                return [];
            }
        } else {
            return tableList;
        }
    }

    dataTableChange(newVal: any) {
        this.props.publishStore.checkedTable(newVal);
    }

    // 数据类型切换
    dataTypeChange(newVal: any){
        this.props.publishStore.setDataType(newVal);
    }
    nameSpaceChange(newVal: any) {
        this.props.publishStore.setNameSpace(newVal)
    }
    dataSourcePDBChange(newVal: any) {
        this.props.publishStore.setDataSourcePDB(newVal)
    }
    dataSourceGroupChange(newVal: any) {
        this.props.publishStore.setDataSourceGroup(newVal)
        this.checkIsPublish();
    }
    dataInterfacePeoChange(e?: any, newVal?: any) {
        console.log(e.target.value||newVal);
        this.props.publishStore.setDataInterfacePeo(e.target.value)
    }
    dataUpdateRateChange(newVal: any){
        console.log(newVal.value);
        this.props.publishStore.setdataUpdateRate(newVal)
    }
    dataImportanceLevelChange(newVal: any){
        this.props.publishStore.setDataImportanceLevel(newVal)
    }
    dataUpdateTimeChange(newVal: any){
        console.log(newVal);
        this.props.publishStore.setdataUpdataTime(newVal.value)
    }
    onUpdateTimeTextChange(e:any){
        console.log(e.target.value);
        this.props.publishStore.setdataUpdataTime(e.target.value);
    }
    onUpdateTimeChange(value: any,e?:any) {
        let value1 = value || e;
        let rate = this.props.publishStore.todo.currentDataUpdateRate.value;
        if (rate === "day" && (typeof e)==='string' ){
            value1 = e;
            this.props.publishStore.setdataUpdataTime(value1);
        }
        if (rate==="month" && this.state.dayOfMonth!= -1){
            this.setState({dayOfMonth: value1,dayOfMonthRdo: value1});
            this.props.publishStore.setdataUpdataTime(Number(value1));
        }
    }
    onRadioGroupChange(e:any){
        console.log(e.target.value);
        this.setState({dayOfMonth:e.target.value});
        this.props.publishStore.setdataUpdataTime(e.target.value);
    } 
    ondataLifeCircleChange(startDate: any, endDate: any){
        console.log('from' + startDate + 'to' + endDate);
        this.props.publishStore.setdataLifeCircle([startDate,endDate]);
    }
    renderDateUpdtaTimeCpn() {
        let rate = this.props.publishStore.todo.currentDataUpdateRate;
        let curtime = this.props.publishStore.todo.dataUpdataTime;
        if(rate == "month"){
            if(Number(curtime) > -1 ){
                this.setState({ dayOfMonth: curtime, dayOfMonthRdo: curtime })
            }else {
                this.setState({ dayOfMonth: curtime})
            }
        }

        let caseval = rate &&(!!rate.value) ? rate.value : "untime"; 
        switch (caseval){
            case 'untime': return (
                <div>
                    <Input style={{ float: 'left' }} placeholder="请具体描述定时更新原因" allowClear
                    onChange={this.onUpdateTimeTextChange.bind(this)}/>
                </div>
            );
            case 'minute': return (
                <div style={{ float: 'left' }}>
                   <span>每</span> 
                    <InputNumber style={{width:'100px'}} type='number' min={0}
                        onChange={this.onUpdateTimeChange.bind(this)} />
                    <span>分钟</span>
                </div>
            );
            case 'day': return (
                <Input style={{ float: 'left', width: '168px' }} placeholder="请选择数据更新时间" onChange={this.onUpdateTimeTextChange.bind(this)} />
            );
            case 'week': return (   
                <Select style={{width:'240px'}} options={this.props.publishStore.todo.weekList}
                    placeholder={'请选择数据更新时间'}
                    closeOnSelect={true}
                    simpleValue
                    searchable={true}
                    onChange={this.dataUpdateTimeChange.bind(this)}
                    />
            );
            case 'month': return (
                <div>
                    <RadioGroup style={{ float: 'left' }} name="dayOfMonth" 
                        onChange={this.onRadioGroupChange.bind(this)}
                        value={this.state.dayOfMonth}>
                        <Radio  value={this.state.dayOfMonthRdo}>
                            <span>每月第&nbsp;</span> 
                            <InputNumber style={{ width: '100px' }}
                                max={31} min={1}
                                value={this.state.dayOfMonthRdo}
                                onChange = {this.onUpdateTimeChange.bind(this)}/>
                            <span>&nbsp;天</span>
                        </Radio>
                        <Radio value={-1}><span>每月最后一天</span></Radio>
                    </RadioGroup>
                </div>
            );
            case -1:
            default: return (
                <span></span>
            );
        }
    }
    nextPage() {
        let todo = this.props.publishStore.todo;
        
        if (!todo.currentDataInterfacePepple) {
            toastr.error('请输入数据接口人！');
            return;
        }
        let reg = /.*_dxm$/ig;
        reg.lastIndex = 0;//每次匹配都从头开始  或者把g修饰去掉
        if (!reg.test(todo.currentDataInterfacePepple)) {
            toastr.error('数据接口人应该以字符串"_dxm"结尾');
            return;
        }
        if (!todo.currentDataUpdateRate) {
            toastr.error('请选择数据更新频率！');
            return;
        }
        if (!todo.dataUpdataTime) {
            toastr.error('请选择数据更新时间！');
            return;
        }
        if (!todo.dataLifeCircle[0]) {
            toastr.error('请填写数据生命周期！');
            return;
        }
        if (!todo.currentdataImportanceLevel) {
            toastr.error('请选择数据重要级别！');
            return;
        }
       
        this.props.publishStore.nextPage();
    }
    checkIsPublish() {
        let todo = this.props.publishStore.todo;
        let isPublishTypeOther = todo.publishType === 'other';

        if (!todo.currentDataType && isPublishTypeOther) {
            toastr.error('请选择数据类型！');
            return;
        }
        if (!todo.currentNameSpace && isPublishTypeOther) {
            toastr.error('请选择数据空间！');
            return;
        }
        if (!this.props.publishStore.todo.dataBaseSelect ) {
            toastr.error('请选择数据库！');
            return;
        }
        if (!todo.currentDataGroup && isPublishTypeOther) {
            toastr.error('请选择数据维护方！');
            return;
        }
        if(!this.props.publishStore.todo.dataTableSelect) {
            toastr.error('请选择数据表！');
            return;
        }
        if (!todo.currentDataSourcePDB && isPublishTypeOther) {
            toastr.error('请选择数据来源PDB节点！');
            return;
        }
        if (!todo.currentDataSourceGroup && isPublishTypeOther) {
            toastr.error('请选择数据来源Group！');
            return;
        }
        // 校验发布状态
        this.props.publishStore.checkIsPublish();

    }
    render() {
        let publishType = this.props.publishStore.todo.publishType;
        const popoverDataGroup = (
            <Popover id="popover-data-group">
                <p className="popover-class">
                    一般为数据生产源头系统的维护者，或是数据所属业务对应的专职数据团队。一般
由数据管理员在数据发布时进行指定。
                    <br/>
                    <a href="http://wiki.baidu.com/pages/viewpage.action?pageId=343118040" target="_blank">怎样加入数据维护方?</a>
                </p>

            </Popover>
        );

        const popoverDataSourcePDB = (
            <Popover id="popover-data-source">
                <p className="popover-class">
                    一般为数据生成源头系统或从FSG以外接入数据的接入方对应的PDB节点和该节点下某个RCC Group。
                    <br/>
                    <a href="http://fsgrcc.duxiaoman-int.com/pdb" target="_blank">更多关于PDB与RCC Group</a>
                </p>

            </Popover>
        );

        const popoverDataLifeCicleTip = (
            <Popover id="popover-data-source">
                <p className="popover-class">
                    填写数据最早产生的时间                 
                </p>
            </Popover>
        );
        const popoverDataLevelTip = (
            <Popover id="popover-data-source">
                <p className="popover-class">
                    数据对业务影响程度，对不同影响程度的数据需要有不同的保障级别
                </p>
            </Popover>
        );

        return (
            <Pager>
                <Form horizontal>
                    {publishType !== 'fdw' ?
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2} className={'text-right'}>
                                {'数据类型'}
                            </Col>
                            <Col sm={10}>
                                <Select options={this.props.publishStore.todo.dataTypeList}
                                        placeholder={'请选择数据类型'}
                                        closeOnSelect={true}
                                        simpleValue
                                        searchable={true}
                                        onChange={this.dataTypeChange.bind(this)}
                                        value={this.props.publishStore.todo.currentDataType}
                                        />
                            </Col>
                        </FormGroup>
                        : ''
                    }

                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2} className={'text-right'}>
                            {'数据空间'}
                        </Col>
                        <Col sm={10}>
                            <Select options={this.props.publishStore.todo.nameSpaceList}
                                    placeholder={'请选择数据空间'}
                                    closeOnSelect={true}
                                    simpleValue
                                    onChange={this.nameSpaceChange.bind(this)}
                                    value={this.props.publishStore.todo.currentNameSpace}
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2} className={'text-right'}>
                            {'数据库'}
                        </Col>
                        <Col sm={10}>

                            <Select options={this.dataBaseOption()} placeholder={'请选择数据库'} closeOnSelect={true}
                                simpleValue searchable={true} onChange={this.dataBaseChange.bind(this)}
                                value={this.props.publishStore.todo.dataBaseSelect}/>
                        </Col>
                    </FormGroup>

                    {publishType !== 'fdw' ?
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2} className={'text-right'}>
                                {'数据维护方'}
                                <OverlayTrigger
                                    trigger={'click'}
                                    placement="top"
                                    rootClose
                                    overlay={popoverDataGroup}
                                >
                                    <Button className="popover-tips">?</Button>
                                </OverlayTrigger>
                            </Col>
                            <Col sm={10}>
                                <Select options={this.props.publishStore.todo.dataGroupList}
                                        placeholder={'请选择数据维护方'}
                                        closeOnSelect={true}
                                        simpleValue
                                        searchable={true}
                                        onChange={this.dataGroupChange.bind(this)}
                                        value={this.props.publishStore.todo.currentDataGroup}/>
                            </Col>
                        </FormGroup>
                    : ''}
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2} className={'text-right'}>
                            {'数据表'}
                        </Col>
                        <Col sm={10}>
                            <Select 
                                options={this.dataTableOption()} 
                                placeholder={'请选择数据表'} 
                                closeOnSelect={true}
                                simpleValue
                                searchable={true}
                                onChange={this.dataTableChange.bind(this)}
                                value={this.props.publishStore.todo.dataTableSelect} 
                                pageSize={5}/>
                        </Col>
                    </FormGroup>

                    {publishType !== 'fdw' ?
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2} className={'text-right'}>
                                {'数据来源方'}
                                <OverlayTrigger
                                    trigger={'click'}
                                    placement="top"
                                    rootClose
                                    overlay={popoverDataSourcePDB}
                                >
                                    <Button className="popover-tips">?</Button>
                                </OverlayTrigger>
                            </Col>
                            <Col sm={10}>
                                <Select options={this.props.publishStore.todo.dataSourcePDBList}
                                        placeholder={'数据来源方PDB节点'}
                                        closeOnSelect={true}
                                        simpleValue
                                        searchable={true}
                                        onChange={this.dataSourcePDBChange.bind(this)}
                                        value={this.props.publishStore.todo.currentDataSourcePDB}
                                        pageSize={5}
                                />
                            </Col>
                        </FormGroup>
                        : ''}

                    {publishType !== 'fdw' ?
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2} className={'text-right'}>
                                {''}
                            </Col>
                            <Col sm={10}>
                                <Select options={this.props.publishStore.todo.dataSourceGroupList}
                                        placeholder={'数据来源方GROUP'}
                                        closeOnSelect={true}
                                        simpleValue
                                        searchable={true}
                                        onChange={this.dataSourceGroupChange.bind(this)}
                                        value={this.props.publishStore.todo.currentDataSourceGroup}/>
                            </Col>
                        </FormGroup>
                    :''}

                    {/* 需求功能项添加 */}
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2} className={'text-right'}>
                            {'数据接口人'}
                        </Col>
                        <Col sm={10}>
                            <Input style={{ float: 'left', width: '100%' }} placeholder="请输入数据接口人" value={this.props.publishStore.todo.currentDataInterfacePepple}
                            onChange={this.dataInterfacePeoChange.bind(this)} />
                        </Col>
                    </FormGroup>

                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2} className={'text-right'}>
                            {'数据更新频率'}
                        </Col>
                        <Col sm={10}>
                            <Select options={this.props.publishStore.todo.dataUpdateRateList}
                                placeholder={'请选择数据更新频率'}
                                closeOnSelect={true}
                                simpleValue
                                searchable={true}
                                onChange={this.dataUpdateRateChange.bind(this)}
                                value={this.props.publishStore.todo.currentDataUpdateRate} />
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2} className={'text-right'}>
                            {'数据更新时间'}
                        </Col>
                        <Col sm={10}>
                            <span>
                                {this.renderDateUpdtaTimeCpn()}
                            </span>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2} className={'text-right'}>
                            {'数据生命周期'}
                            <OverlayTrigger
                                trigger={'click'}
                                placement="top"
                                rootClose
                                overlay={popoverDataLifeCicleTip}
                            >
                                <Button className="popover-tips">?</Button>
                            </OverlayTrigger>
                        </Col>
                        <Col sm={10}>
                            <DateRange updateLifeCicle={this.ondataLifeCircleChange.bind(this)}/>
                            {/* <RangePicker format='YYYY/MM/DD'  style={{float: 'left'}}
                                onChange={this.ondataLifeCircleChange.bind(this)}
                            /> */}
                            {/* <Select options={this.props.publishStore.todo.weekList}
                                placeholder={'请选择数据生命周期'}
                                closeOnSelect={true}
                                simpleValue
                                searchable={true}
                                onChange={this.dataSourceGroupChange.bind(this)}
                                value={this.props.publishStore.todo.dataLifeCircle} /> */}
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2} className={'text-right'}>
                            {'数据重要级别'}
                            <OverlayTrigger
                                trigger={'click'}
                                placement="top"
                                rootClose
                                overlay={popoverDataLevelTip}
                            >
                                <Button className="popover-tips">?</Button>
                            </OverlayTrigger>
                        </Col>
                        <Col sm={10}>
                            <Select options={this.props.publishStore.todo.dataImportanceLevel}
                                placeholder={'请选择数据重要级别'}
                                closeOnSelect={true}
                                simpleValue
                                searchable={true}
                                onChange={this.dataImportanceLevelChange.bind(this)}
                                value={this.props.publishStore.todo.currentdataImportanceLevel} /> 
                        </Col>
                    </FormGroup>
                </Form>

                <br/><br/>
                {this.props.publishStore.todo.hasCurrTableDetail === 2 ?
                    <div style={{textAlign: 'right'}}> 读取信息时报，请核对配置信息后重试。</div>
                    : ''}
                <Pager.Item next
                            href="#"
                            onClick={this.nextPage.bind(this)}
                            disabled={!((this.props.publishStore.todo.tablePublishType == 3
                                || this.props.publishStore.todo.tablePublishType == 0)
                                && (this.props.publishStore.todo.hasCurrTableDetail == 1))}
                >
                    {'下一页 →'}
                </Pager.Item>

            </Pager>
        );
    }

}
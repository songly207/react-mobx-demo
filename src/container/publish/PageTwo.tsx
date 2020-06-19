import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { IPublish } from '../../interface/IPublish';
import { Pager, Table, Checkbox, FormGroup, FormControl, SplitButton, MenuItem, Popover, OverlayTrigger, Button } from 'react-bootstrap';
import { customerSource } from '../../contants/Common';
import { isEmpty, isNotEmpty } from '../../util/StringUtils';
import Select from 'react-select';
import { Col, ControlLabel, Form } from 'react-bootstrap';

require('./PageTwo.css');
interface Container extends IPublish {
}

@inject('publishStore')
@observer
class PageTwoTitle extends React.Component<Container> {
    componentDidMount() {
        let val = this.props.publishStore.todo.currTable.fdwTitle;
        this.props.publishStore.setCurrentTableInfo('dataNameCh', val);
    }
    tableTitleChange(event: any) {
        let val = event.target.value;
        this.props.publishStore.setCurrentTableInfo('fdwTitle', val);
    }
    dataNameChChange(event: any) {
        let val = event.target.value;
        this.props.publishStore.setCurrentTableInfo('dataNameCh', val);
    }
    tableDetailChange(event: any) {
        let val = event.target.value;
        this.props.publishStore.setCurrentTableInfo('fdwDetail', val);
    }
    tableProcessLogicChange(event: any){
        let val = event.target.value;
        this.props.publishStore.setCurrentTableInfo('tableProcessLogic', val);
    }

    render() {
        let todo = this.props.publishStore.todo;
        // console.log('todo.data',todo.dataTableSelect);

        let publishType =todo.publishType;
        let notAllowEditTitle = publishType === 'fdw';
        return (
            <div>
                <Form horizontal>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2} className={'text-right'}>
                            {'数据表'}
                        </Col>
                        <Col sm={10}>
                            <FormControl
                                type="text"
                                value={todo.dataTableSelect.value}
                                placeholder="数据表"
                                readOnly={true}
                            />

                        </Col>
                    </FormGroup>

                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2} className={'text-right'}>
                            {'数据表中文名'}
                        </Col>
                        <Col sm={10}>
                            <FormControl
                                type="text"
                                defaultValue={todo.currTable && todo.currTable.fdwTitle || ''}
                                placeholder="表的中文名称"
                                onChange={this.dataNameChChange.bind(this)}
                                readOnly={false}
                            />

                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2} className={'text-right'}>
                            {'表标题'}
                        </Col>
                        <Col sm={10}>
                            <FormControl
                                type="text"
                                value={todo.currTable && todo.currTable.fdwTitle || ''}
                                placeholder="表的标题名称"
                                onChange={this.tableTitleChange.bind(this)}
                                readOnly={notAllowEditTitle}
                            />

                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2} className={'text-right'}>
                            {'表描述'}
                        </Col>
                        <Col sm={10}>
                            <FormControl
                                type="text"
                                value={todo.currTable && todo.currTable.fdwDetail || ''}
                                placeholder="说明表的业务内容，比如页面埋点数据"
                                onChange={this.tableDetailChange.bind(this)}
                                readOnly={notAllowEditTitle}
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2} className={'text-right'}>
                            {'表加工逻辑'}
                        </Col>
                        <Col sm={10}>
                            <FormControl
                                type="text"
                                value={todo.currTable && todo.currTable.tableProcessLogic || ''}
                                placeholder="说明表的数据来源，处理逻辑，更新机制等"
                                onChange={this.tableProcessLogicChange.bind(this)}
                            />
                        </Col>
                    </FormGroup>
                </Form>
            </div>
        )
    }
}

@inject('publishStore')
@observer
export class PageTwo extends React.Component<Container> {
    previousPage() {
        this.props.publishStore.previousPage();
    }
    nextPage() {
        let isPuublisTypeOther =  this.props.publishStore.todo.publishType === 'other';
        let tableDetail = this.props.publishStore.todo.currTableDetail;
        let currTable = this.props.publishStore.todo.currTable;
        if (!tableDetail || tableDetail.length <= 0) {
            toastr.error('发生异常，请返回上一页！');
            return;
        }
        let checkedSuccess = true;
        let errorMsg = '';
        if (!currTable.dataNameCh) { //fdw 和 other 必填
            errorMsg += '<p>请输入数据表中文名</p>';
            checkedSuccess = false;
        }
        if (isPuublisTypeOther && !currTable.fdwTitle ) {
            errorMsg += '<p>请输入表标题</p>';
            checkedSuccess = false;
        }
        if (isPuublisTypeOther && !currTable.fdwDetail) {
            errorMsg += '<p>请输入表描述</p>';
            checkedSuccess = false;
        }
        if (!currTable.tableProcessLogic) { //fdw 和 other 必填
            errorMsg += '<p>请输入表加工逻辑</p>';
            checkedSuccess = false;
        }

        tableDetail.slice().forEach((e: any) => {
            if (isPuublisTypeOther && (e.level == 0)) {
                errorMsg += `<p>字段${e.name}请选择非"未知"的保密级别选项</p>`;
                checkedSuccess = false;
            }
            if (isPuublisTypeOther && isEmpty(e.detail)) {
                errorMsg += `<p>字段${e.name}需填写字段中文名。</p>`;
                checkedSuccess = false;
            }
            if (isPuublisTypeOther && isEmpty(e.remark)) {
                errorMsg += `<p>字段${e.name}需填写补充说明。</p>`;
                checkedSuccess = false;
            }
            if (isPuublisTypeOther && isEmpty(e.level)) {
                errorMsg += `<p>字段${e.name}需填写保密级别。</p>`;
                checkedSuccess = false;
            }

            if (isPuublisTypeOther && isEmpty(e.is_mask)) {
                errorMsg += `<p>字段${e.name}需填写脱敏状态。</p>`;
                checkedSuccess = false;
            }
            if (isEmpty(e.detail) && isNotEmpty(e.remark) && e.remark.replace(/[^\u4E00-\u9FA5]/g,'').length < 10) {
                errorMsg += `<p>字段${e.name}补充说明不能少于10个汉字。</p>`;
                checkedSuccess = false;
            }
            if(e.remarkCode === '1' && isEmpty(e.customerType)) {
                errorMsg += `<p>字段${e.name}需选择用户识别码类型。</p>`;
                checkedSuccess = false;
            }
        });

        if (!checkedSuccess) {
            toastr.error(errorMsg);
            return;
        }
        this.props.publishStore.nextPage();
    }
    handleSelectChange(e: any, newVal: any) {
        this.props.publishStore.editTable(e.name, 'customerType', newVal);
    }
    handleCheckBoxChange(event: any, e: any) {
        this.props.publishStore.editTable(e.name, 'remarkCode', e.remarkCode === '1' ? '0' : '1');
        if(e.remarkCode === '1') {
            this.props.publishStore.editTable(e.name, 'customerType', null);
        }
    }
    handleInputChange(event: any, e: any) {
        this.props.publishStore.editTable(e.name, 'remark', event.target.value);
    }
    getOption() {
        return Object.keys(customerSource).map(e => {
            return { label: customerSource[e], value: e };
        });
    }
    render() {
        // 是否为空dropDownItem
        let todo = this.props.publishStore.todo;
        let publishStore = this.props.publishStore;
        let isPublishTypeFdw = todo.publishType === 'fdw';
        const mainKeyTips: JSX.Element = (
            <Popover id="popover-data-group">
                <p className="popover-class">
                   在业务上能确定唯一一条记录的字段。
                </p>
            </Popover>
        );
        return (
            <Pager>
                <PageTwoTitle/>

                <Table>
                    <tbody>
                        <tr className='row text-center info'>

                            <td className='col-md-1'>{'字段名英文'}</td>
                            <td className='col-md-1'>{'类型'}</td>
                            <td className='col-md-1'>{'是否为空'}</td>
                            <td className='col-md-1'>{'是否脱敏'}</td>
                            <td className='col-md-2'>{'保密级别'}</td>
                            <td className='col-md-1'>{'字段中文名'}</td>
                            <td className='col-md-1'>{'标记识别码'}</td>
                            <td className='col-md-2'>{'用户识别码类型'}</td>
                            <td className='col-md-1'>{'主键'}
                                <OverlayTrigger
                                    trigger={'click'}
                                    placement="top"
                                    rootClose
                                    overlay={ mainKeyTips }
                                >
                                    <Button className="popover-tips">?</Button>
                                </OverlayTrigger>
                            </td>
                            <td className='col-md-1'>{'补充说明'}</td>
                        </tr>

                        {this.props.publishStore.todo.currTableDetail &&
                            this.props.publishStore.todo.currTableDetail.slice().map((e: any, index: number) => {
                                if(e.level == '0'){//未知改为默认的机密(L3)
                                    e.level = '13';
                                }
                                // 是否为空option
                                let isNullItem = (() => {
                                    return todo.isNullList.slice().map((item: any, i: any) => {
                                        return (
                                            <MenuItem eventKey={item.value}
                                                      key={e.name + 'isNull' + i}
                                                      onSelect={(eventKey: any) => {
                                                        publishStore.setCurrentTableFieldInfo('is_null', e.name, eventKey)
                                                      }}
                                            >
                                                {item.label}
                                            </MenuItem>
                                        )
                                    });
                                })();

                                // 是否为主键
                                let isMainKeyItem = (() => {
                                    return todo.isKeyList.slice().map((item: any, i: any) => {
                                        return (
                                            <MenuItem eventKey={item.value}
                                                key={e.name + 'primaryKey' + i}
                                                onSelect={(eventKey: any) => {
                                                    publishStore.setCurrentTableFieldInfo('primaryKey', e.name, eventKey)
                                                }}
                                            >
                                                {item.label}
                                            </MenuItem>
                                        )
                                    });
                                })();
                                // 是否脱敏dropDownItem
                                let isMaskItem = (()=> {
                                    return todo.isMaskList.slice().map((item: any, i: any) => {
                                        return (
                                            <MenuItem eventKey={item.value}
                                                      key={e.name + 'mask' + i}
                                                      onSelect={(eventKey: any) => {
                                                        publishStore.setCurrentTableFieldInfo('is_mask', e.name, eventKey)
                                                      }}
                                            >
                                                {item.label}
                                            </MenuItem>
                                        )

                                    });
                                })();
                                //字段中文名
                                let fieldNameCn = (
                                    <FormControl
                                        type="text"
                                        key={e.name + index}
                                        disabled={isPublishTypeFdw}
                                        value={e.detail || ''}
                                        placeholder="请输入"
                                        onChange={(event) => {
                                            let val = event.target.value;
                                            publishStore.setCurrentTableFieldInfo('detail', e.name, val);
                                        }}
                                    />
                                );
                                // 保密级别
                                let levelItem = (()=> {
                                    return todo.levelList.slice().map((item: any, i: any) => {
                                        return (
                                            <MenuItem eventKey={item.value}
                                                      key={e.name + 'level' + i}
                                                      disabled={item.disabled}
                                                      onSelect={(eventKey: any) => {
                                                        publishStore.setCurrentTableFieldInfo('level', e.name, eventKey)
                                                      }}
                                            >
                                                {item.label}
                                            </MenuItem>
                                        )

                                    });
                                })();

                                return (
                                    <tr key={index} className='row text-center table-boder-tr'>
                                        <td>{e.name}</td>
                                        <td>{e.type}</td>
                                        <td className="drop-item">
                                            <SplitButton
                                                disabled={isPublishTypeFdw}
                                                bsStyle={'default'}
                                                title={todo.isNullListObject[e.is_null] || ''}
                                                key={`dropdown-mask-${index}`}
                                                id={`dropdown-mask-${index}`}
                                            >
                                                {isNullItem}
                                            </SplitButton>
                                        </td>
                                        <td className="drop-item">
                                            <SplitButton
                                                disabled={isPublishTypeFdw}
                                                bsStyle={'default'}
                                                title={todo.isMaskListObject[e.is_mask] || ''}
                                                key={`dropdown-mask-${index}`}
                                                id={`dropdown-mask-${index}`}
                                            >
                                                {isMaskItem}
                                            </SplitButton>

                                        </td>
                                        <td className="drop-item">
                                            <SplitButton
                                                disabled={isPublishTypeFdw}
                                                bsStyle={'default'}
                                                title={todo.levelListObject[e.level] || ''}
                                                key={`dropdown-level-${index}`}
                                                id={`dropdown-level-${index}`}
                                            >
                                                {levelItem}
                                            </SplitButton>
                                        </td>
                                        <td>
                                            {fieldNameCn}
                                        </td>
                                        <td>
                                            <FormGroup style={{ marginBottom: '0' }}>
                                                <Checkbox onChange={(event) => { this.handleCheckBoxChange(event, e) }} checked={e.remarkCode === '1'}></Checkbox>
                                            </FormGroup>
                                        </td>
                                        <td>
                                            {e.remarkCode === '1' && <Select options={this.getOption()} placeholder={'请选择'} closeOnSelect={true}
                                                simpleValue value={e.customerType}
                                                onChange={(newVal) => { this.handleSelectChange(e, newVal) }}
                                            />}
                                        </td>
                                        <td>
                                            <SplitButton
                                                bsStyle={'default'}
                                                title={todo.isKeyListObject[e.primaryKey] || ''}
                                                key={`dropdown-key-${index}`}
                                                id={`dropdown-key-${index}`}
                                            >
                                                {isMainKeyItem}
                                            </SplitButton>
                                        </td>
                                        <td>
                                            <FormGroup style={{marginBottom: '0'}}>
                                                <FormControl
                                                    type="text"
                                                    value={e.remark}
                                                    placeholder="请输入"
                                                    onChange={(event) => { this.handleInputChange(event, e) }}
                                                />
                                            </FormGroup>
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </Table>
                <Pager>
                    <Pager.Item disabled={this.props.publishStore.todo.edit} onClick={this.previousPage.bind(this)} previous href="#">{'← 上一页'}</Pager.Item>
                    <Pager.Item next onClick={this.nextPage.bind(this)} href="#">{'下一页 →'}</Pager.Item>
                </Pager>
            </Pager>);
    }
}
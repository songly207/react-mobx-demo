import * as React from 'react';
import { FormGroup, InputGroup, Button, FormControl, Badge } from 'react-bootstrap';
import { SearchButtonGroup } from '../../components/basic/SearchButtonGroup';
import { SearchInfoList } from './SearchInfoList';
import { inject, observer } from 'mobx-react';
import { IBase } from '../../contants/base';
import { LabelWithClose } from '../../components/basic/LabelWithClose';
import { SearchInfoList2 } from './SearchInfoList2';

@inject('store')
@observer
export class SearchInput extends React.Component<IBase> {
    constructor(props: any) {
        super(props);
    }
    componentDidMount() {
        this.props.store.query();
    }
    handleChange(e: any) {

        this.props.store.todo.queryArg = e.target.value;
    }
    validationState(): 'success' | 'warning' | 'error' {
        const length = this.props.store.todo.queryArg.length;
        if (length > 10) return 'success';
        else if (length > 5) return 'warning';
        else if (length > 0) return 'error';
        return 'error';
    }
    handleClick() {
        this.props.store.query();
    }
    handleEnterKey = (e:any) => {
        if(e.nativeEvent.keyCode === 13){ //e.nativeEvent获取原生的事件对像
            this.props.store.query();
        }
    }
    render() {
        return (
            <div className='post newpost row col-md-12'>
                <div className={'row'}>
                    <div style={{ marginBottom: '15px' }}>
                        {/*{this.props.store.todo.toggleEdmNode &&*/}
                        {/*<LabelWithClose click={() => this.props.store.cancelNode('edm')}>{`${this.props.store.todo.toggleEdmNode.name}`}</LabelWithClose>*/}
                        {/*}*/}
                        {/*{this.props.store.todo.toggleEdwNode &&*/}
                        {/*<LabelWithClose click={() => this.props.store.cancelNode('edw')}>{`${this.props.store.todo.toggleEdwNode.name}`}</LabelWithClose>*/}
                        {/*}*/}
                        {/*{this.props.store.todo.toggleEdmNode && this.props.store.todo.toggleEdwNode && this.props.store.todo.toggleOdsNode &&*/}
                        {/*<span>&nbsp;</span>*/}
                        {/*}*/}
                        {/*{this.props.store.todo.toggleOdsNode &&*/}
                        {/*<LabelWithClose click={() => this.props.store.cancelNode('ods')}>{`${this.props.store.todo.toggleOdsNode.name}`}</LabelWithClose>*/}
                        {/*}*/}
                        {this.props.store.todo.toggleSearchNode &&
                        <LabelWithClose click={() => this.props.store.cancelNode('all')}>{`${this.props.store.todo.toggleSearchNode.name}`}</LabelWithClose>
                        }
                    </div>
                    <div className="seart-content clearfix">
                        <FormGroup>
                            <InputGroup>
                                <FormControl
                                    type="text"
                                    value={this.props.store.todo.queryArg}
                                    placeholder="请输入"
                                    onChange={e => this.handleChange(e)}
                                    onKeyPress={this.handleEnterKey}
                                />
                                <InputGroup.Button>
                                    <Button onClick={this.handleClick.bind(this)}>搜索</Button>
                                </InputGroup.Button>
                            </InputGroup>
                            <FormControl.Feedback />
                        </FormGroup>
                        {/*<br />*/}
                        <h4>{'命中 '}<Badge>{this.props.store.todo.data.total}</Badge>{' 条结果'}</h4>
                        {/*<hr />*/}
                    </div>
                    <SearchButtonGroup />
                </div>
                {this.props.store.todo.toggleSearchNode &&
                    <div className="desc-content">
                        <h5>{this.props.store.todo.toggleSearchNode.name}</h5>
                        <p>主题描述：{this.props.store.todo.typeDesc}</p>
                    </div>
                }
                {
                    (this.props.store.todo.toggleEdwNode && this.props.store.todo.toggleEdwNode.name === '个人数据源分布')
                    ? <SearchInfoList2 /> : <SearchInfoList />
                }
            </div>
        );
    }
}
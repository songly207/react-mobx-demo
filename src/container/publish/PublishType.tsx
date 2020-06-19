/**
 * @file 数据中心数据发布类型
 * @author zhangxinzhu (zhangxinzhu@duxiaoman.com)
 *
 */
import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { IPublish } from '../../interface/IPublish';
import { ControlLabel, Col, Row, Radio } from 'react-bootstrap';
import './PublishType.css';

@inject('publishStore')
@observer
export  class PublishType extends React.Component<IPublish> {
    render() {
        let dataSourceType = this.props.publishStore.todo.publishType;
        let currPage = this.props.publishStore.todo.page.currPage;
        if (currPage !== 1) {
            return null;
        }
        return (
            <div>
                <Row>
                    <Col componentClass={ControlLabel} sm={2}/>
                    <Col sm={10}>
                        <Radio checked={dataSourceType === 'fdw'}
                               inline
                               onChange={this.setPublishType.bind(this, 'fdw')}
                        >
                            从FDW发布中选择
                        </Radio>
                        <Radio checked={dataSourceType !== 'fdw'}
                               inline
                               onChange={this.setPublishType.bind(this, 'other')}
                        >
                            未做过发布&重新发布
                        </Radio>
                    </Col >
                </Row>
            </div>
        );
    }
    setPublishType(type: any) {
        this.props.publishStore.setPublishType(type);
    }
    
}

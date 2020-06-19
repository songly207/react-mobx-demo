import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { IPublish } from '../../interface/IPublish';
import { PageOne } from './PageOne';
import { PageThree } from './PageThree';
import { PageTwo } from './PageTwo';
import { ControlLabel, Col, Row } from 'react-bootstrap';
import { PublishType } from './PublishType';



@inject('publishStore')
@observer
export class Publish extends React.Component<IPublish> {
    componentWillMount() {
        if (!this.props.publishStore.todo.edit) {
            this.props.publishStore.queryDataBase();
        }
        this.props.publishStore.queryNode();
    }
    componentWillUnmount() {
        this.props.publishStore.clean(false);
    }
    // setCurpage(currPage: Number) {
    //     this.props.publishStore.setCurpage(currPage);
    // }
    render() {
        // let tabItems = [
        //     { name: '填写基本信息', index: 1 },
        //     { name: '数据信息配置', index: 2 },
        //     { name: '发布位置配置', index: 3 },
        // ];
        let currPage = this.props.publishStore.todo.page.currPage;
        let page: JSX.Element;
        switch (currPage) {
            case 1:
                page = <PageOne />;
                break;
            case 2:
                page = <PageTwo />;
                break;
            case 3:
                page = <PageThree />;
                break;
            default:
                page = <PageOne />;
        }
        return (
            <div>
                <div className='post'>
                    {/* <Row>
                        <Col componentClass={ControlLabel} sm={2} />
                        <Col sm={10}>
                            <div className='tab-content'>
                                {tabItems.map(item => {
                                    return <div key={item.index}
                                        onClick={this.setCurpage.bind(this, item.index)}
                                        className={`tab-item ${item.index === currPage ? "tab-item-active" : null}`}>{item.name}</div>
                                })}
                            </div>
                        </Col >
                    </Row> */}
                    <PublishType/>
                    {page}

                </div>
            </div>

        );
    }
}
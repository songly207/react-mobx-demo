import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { IStore } from '../../contants/base';
import { Label } from 'react-bootstrap';
import { withRouter, Link } from 'react-router-dom';

@withRouter
@inject('store')
@observer
export class SearchCell extends React.Component<{ data: any, store?: IStore }> {
    constructor(props: any) {
        super(props);
    }

    clickForDetail() {
        // console.log('成功改变没？');
        // this.props.history.push('/details');
        this.props.store.clickDataName(this.props.data.dataDetailId)
    }
    //
    render() {
        return (
            <article>
                <hr />
                <h4 className="dataMapListTitle">
                    <Link target="_blank" to={'/details#/'+ this.props.data.dataDetailId}>
                        {this.props.data.dataNameCh ? this.props.data.dataNameCh : ""}</Link>
                    &nbsp;&nbsp;
                    {/*<small>{this.props.data.dataName}</small>*/}
                    <span></span>
                </h4>
                <p className="clearfix row" style={{paddingLeft: 0}}>
                    <span className="col-md-4">数据库：{this.props.data.database}</span>
                    <span className="col-md-8">数据表：{this.props.data.dataName}</span>
                </p>
                
                {/* <p className="clearfix row">
                    <span className="col-md-4">数据标题：{this.props.data.dataNameCh ? this.props.data.dataNameCh:this.props.data.dataTitle}</span>
                </p> */}
                <p className="descDeta clearfix row" style={{ paddingLeft: 0 }}>
                    <span className="col-md-12">描述：{this.props.data.dataDesc}</span>
                </p>
                <p className="clearfix row" style={{marginLeft: 0,paddingLeft: 0}}>
                    {this.props.data.typeNameList ? this.props.data.typeNameList.map((item: any, index: any) => {
                        return <Label bsStyle='primary' key={index}>{item}</Label>
                    }) : <Label bsStyle='primary'></Label>}
                    <Label bsStyle='success'>{this.props.data.edwType}</Label>
                    {this.props.data.edwType && <span>{' '}</span>}
                    <Label bsStyle='primary'>{this.props.data.odsType}</Label>
                </p>
            </article>
        );
    }
}
//  withRouter(SearchCell);
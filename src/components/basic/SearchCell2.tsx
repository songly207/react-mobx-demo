import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { IStore } from '../../contants/base';
import { Label } from 'react-bootstrap';

@inject('store')
@observer
export class SearchCell2 extends React.Component<{ data: any, store?: IStore }> {
    render() {
        return (
            <article>
                <hr />
                <h4><a onClick={() => this.props.store.clickDataName(this.props.data.dataDetailId)}>
                    {this.props.data.dataTitle}</a>
                    &nbsp;&nbsp;
                    <small>{this.props.data.dataName}</small>
                </h4>
                <p>{this.props.data.dataDesc}</p>
                <Label bsStyle='success'>{this.props.data.edwType}</Label>
                {this.props.data.edwType && <span>{' '}</span>}
                <Label bsStyle='primary'>{this.props.data.odsType}</Label>
            </article>
        );
    }
}
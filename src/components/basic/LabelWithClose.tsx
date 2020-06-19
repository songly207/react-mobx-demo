import * as React from 'react';
import { Label } from 'react-bootstrap';

require('./LabelWithClose.css')

export class LabelWithClose extends React.Component<{ click?: Function }, { show: boolean }> {
    constructor(props: any) {
        super(props);
        this.state = { show: true };
    }
    componentWillReceiveProps(nextProp: any) {
        this.setState({ show: nextProp.show });
    }
    handleClick() {
        this.props.click && this.props.click();
    }
    render() {
        return (
            <Label>
                <span>{this.props.children}</span>
                <span onClick={this.handleClick.bind(this)} className='cursor-pointer'>&nbsp;&nbsp;{'x'}</span>
            </Label>
        );
    }
}
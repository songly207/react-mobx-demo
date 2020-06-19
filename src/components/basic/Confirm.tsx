import * as React from 'react';
import { Modal, ButtonToolbar, Button } from 'react-bootstrap';

export class Confirm extends React.Component<{ msg: string, show?: boolean }, { show: boolean, msg: string }> {
    constructor(prop: any) {
        super(prop);
        this.state = { show: false, msg: '' };
    }
    componentDidMount() {
        this.setState({ show: this.props.show, msg: this.props.msg });
    }
    componentWillReceiveProps(nextProp: any) {
        this.setState({ show: nextProp.show, msg: nextProp.msg });
    }
    onHide() {
        this.setState({ show: false });
    }
    render() {
        return (
            <Modal onHide={this.onHide.bind(this)} show={this.state.show}>
                <Modal.Body>
                    <div className='container'>
                        <h3>{this.props.msg}</h3>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <ButtonToolbar>
                        <Button bsClass='primary'>{'确定'}</Button>
                        <Button bsClass='danger'>{'取消'}</Button>
                    </ButtonToolbar>
                </Modal.Footer>
            </Modal>
        );
    }
}
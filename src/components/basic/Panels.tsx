import * as React from 'react';
import { Panel } from 'react-bootstrap';

export class Panels extends React.Component<{ header?: string }> {
    render() {
        return (<Panel>
            {this.props.header && <div className='panel-heading' style={{ padding: '5px 15px' }}>
                <h5>{this.props.header}</h5>
            </div>}
            <div style={{ padding: '15px' }}>{this.props.children}</div>
        </Panel>);
    }
}
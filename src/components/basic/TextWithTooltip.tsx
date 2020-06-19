import * as React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

export default class TextWithTooltip extends React.Component<{ tooltip: string }, {}> {
    render() {
        let tooltip = <Tooltip id={this.props.tooltip}>{this.props.tooltip}</Tooltip>;
        return (
            <OverlayTrigger overlay={tooltip} placement='top' delayShow={300} delayHide={150}>
                <span>{this.props.children}</span>
            </OverlayTrigger>
        );
    }
}
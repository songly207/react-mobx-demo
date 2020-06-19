import * as React from 'react';
import { ButtonToolbar, Button, Col, FormGroup } from 'react-bootstrap';
import { IBase, ISeatchButton } from '../../contants/base';
import { observer, inject } from 'mobx-react';

@inject('store')
@observer
export class SearchButtonGroup extends React.Component<IBase> {
    constructor(props: any) {
        super(props);
    }
    handleClick(e: ISeatchButton) {
        this.props.store.clickButton(e.key);
        this.props.store.query();
    }
    render() {
        return (
            <FormGroup className={'row row-search-label'}>
                <Col sm={12}>
                    <ButtonToolbar>
                        {this.props.store.todo.buttons.map((e, index) => {
                            return <Button key={index} bsStyle={e.isChecked ? 'success' : 'default'}
                                onClick={() => this.handleClick(e)}>
                                {e.desc}
                            </Button>
                        })}
                    </ButtonToolbar>
                </Col>
            </FormGroup>
        );
    }
}
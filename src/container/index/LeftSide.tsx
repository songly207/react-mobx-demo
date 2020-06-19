import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { IBase } from '../../contants/base';
// import { EdmTree } from './EdmTree';
import { EdwTree } from './EdwTree';
// import { OdsTree } from './OdsTree';
import { Button } from 'react-bootstrap';
import { withRouter } from 'react-router';


@withRouter
@inject('store')
@observer
export class LiftSide extends React.Component<IBase|any> {
    constructor(props: any) {
        super(props);
        this.state = { cursor: null, data: [] };
    }
    componentDidMount() {
        $('body').removeClass('data-map-detail');
        this.props.store.queryNode();
        //     this.props.history.listen((location, type) => {
        //         const prePath = this.props.location.pathname;
        //         const nextPath = location.pathname;
        //           if (prePath === '/' && nextPath === '/error') return     
        //       })
    }
    handleClick() {
        this.props.history.push('/publish');
    }
    render() {
        return (
            <div>
                <div style={{paddingBottom: '17px'}}>
                    <Button block onClick={this.handleClick.bind(this)}>
                        <span className='fa fa-plus'>{' 数据发布'}</span>
                    </Button>
                </div>
                {/*<EdmTree />*/}
                <EdwTree />
                {/*<OdsTree />*/}
            </div>
        );
    }
}
//  withRouter(LiftSide);
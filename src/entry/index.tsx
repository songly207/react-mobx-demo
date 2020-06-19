import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
    Navbar, NavbarBrand,
    Nav, NavItem
} from 'react-bootstrap';
import { SearchInput } from '../container/index/SearchInput';
import Store from '../stores/store';
import { Provider, observer } from 'mobx-react';
import { LiftSide } from '../container/index/LeftSide';
import { BrowserRouter as Router, Switch, Route, withRouter } from 'react-router-dom';
import { Publish } from '../container/publish/Publish';
import PublishStore from '../stores/publishStore';
import CenterStore from '../stores/centerStore';
import { DataTableModal } from '../container/index/DataTableModal';
import { DataTableModal2 } from '../container/index/DataTableModal2';
require('./index.css');

// import 'moment/locale/zh-cn';
// const moment = require('_moment@2.24.0@moment');
// moment.locale('zh-cn');
import { LocaleProvider, Modal } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';

const rootStore = {
    store: new Store(),
    publishStore: new PublishStore(),
    centerStore: new CenterStore(),
};

class Search extends React.Component<{}> {
    componentWillMount(){
        window.location.href = 'usercenter/search';
        return;
    }
    componentDidMount(){
        let reg = /edw.fpd.baidu-int.com/g;
        reg.lastIndex = 0;
        if(! reg.test(window.location.host))return;
        Modal.info({
            title:'重要通知',
            content: <span>因度小满与集团拆分，当前百度域名将于<span style={{ color: '#d14' }}>5月13日</span>失效，为保障大家正常使用，<span style={{color:'#d14'}}>5月13日</span>后请切换新域名进行访问：<a href="javascript:void()" target="_blank">{'http://edw.duxiaoman-int.com'}</a></span>,
            icon: null,
        })
    }
    render() {
        return '';
        return (
            <div className='row'>
                <aside className='col-md-3 sidebar'>
                    <LiftSide />
                </aside>
                <div className='col-md-9 pull-right main'>
                    <SearchInput />
                </div>
            </div>
        );
    }
}

@withRouter
@observer
class App extends React.Component<any> {
    constructor(props : any){
        super(props);
    }
    handleClick(url: string) {
        this.props.history.push(url);
    }
    componentDidCatch() {
        this.props.history.push('/error');
    }
    render() {
        return (
            // style={{ minHeight: 'calc(100% - 67px)',width:'100%',position:'relative',background:'#ebebeb'}}
            <div>
                <Navbar style={{ backgroundColor: '#3a3a3a' }}>
                    <NavbarBrand>
                        <div style={{ padding: '0px' }}>
                            {/*<a className='logo' href='/'>度小满金融</a>*/}
                            <a className='newLogo' href="http://fbi.duxiaoman-int.com/easy/">
                                <img src="../img/home-logo.svg" alt="logo" height="50" width="140"/>
                                <span>数据服务中心</span>
                            </a>
                        </div>
                    </NavbarBrand>
                    <Nav>
                        <NavItem onClick={() => window.location.href = '/usercenter/search'}>
                            {'数据地图'}
                        </NavItem>
                        <NavItem onClick={() => this.handleClick('/publish')}>
                            {'数据发布'}
                        </NavItem>
                        <NavItem onClick={() => window.location.href = 'http://fbi.duxiaoman-int.com/easy/market/qe_task/'}>
                            {'数据查询'}
                        </NavItem>
                        <NavItem onClick={() => window.location.href = 'http://newicafe.baidu.com/issues/space/DSC/'}>
                            {'数据需求'}
                        </NavItem>
                        <NavItem onClick={() => window.location.href = '/usercenter/publish'}>
                            {'个人中心'}
                        </NavItem>
                    </Nav>
                </Navbar>
                {/*  style={{background:'#ebebeb'}} */}
                <div className='container'>
                    <Switch>
                        <Route exact path='/details' component={DataTableModal} />
                        <Route exact path='/datasource' component={DataTableModal2} />
                        <Route exact path='/publish' component={Publish} />
                        <Route exact path='/error' render={() => <div style={{height: '450px'}} className='container'>
                            <h1 >页面崩溃了···</h1>
                            <h1 >别着急</h1>
                            <h1>请联系开发人员</h1>
                        </div>} />
                        <Route path='/' component={Search} />
                    </Switch >
                </div>
                <footer className='bs-docs-footer'>
                    <div className='container footer-container'>
                        {/*<p>{'©2018Baidu沪ICP备18016253号-1'}</p>*/}
                        <div className="newLogo">
                            <a href="http://fbi.duxiaoman-int.com/easy/">
                                <img src="../img/home-logo.svg" alt="logo" height="50" width="140"/>
                            </a>
                            <span>数据服务中心</span>
                        </div>
                        <div className="chatme">联系我们：fsg-bi@duxiaoman.com</div>
                    </div>
                </footer>
            </div>
        );

    }
}
//  withRouter(App);

@observer
export class Index extends React.Component<{}> {
    constructor(props: any) {
        super(props);
    }
    render() {
        return (
            <LocaleProvider locale={zh_CN}>
                <Provider {...rootStore}>
                    <Router>
                        <App />
                    </Router>
                </Provider>
            </LocaleProvider>
        );
    }
}

ReactDom.render(<Index />, document.getElementById('container'));
import React, { Component } from 'react';
import { Layout, Drawer, BackTop } from 'antd';
import { withCookies } from 'react-cookie';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import BreadcrumbComponent from '../Layout/BreadcrumbComponent';
import SiderComponent from '../Layout/SiderComponent/SiderComponent';
import SwitchComponent from '../Layout/SwitchComponent';
import HeaderComponent from '../Layout/HeaderComponent/HeaderComponent';
import reducer from './AppProvider/reducer';
import injectReducer from '@injectReducer';
import { createStructuredSelector } from 'reselect';
import { makeSelectToggleSider } from '../Layout/HeaderComponent/selectors';
import { changeToggleSider } from '../Layout/HeaderComponent/actions';
import { makeGetMyInfo, makeGetPermission } from '../Layout/HeaderComponent/HeaderProvider/selectors';
import privateRoutes from '../Layout/PrivateRoutes';
import constantsRoutes from '../Layout/ConstantsRoutes';
import './App.scss';

const { Content, Footer } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: false,
    };
    this.checkScreenWidth = this.checkScreenWidth.bind(this);
  }

  componentDidMount() {
    this.checkScreenWidth();
    window.addEventListener('resize', this.checkScreenWidth);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.checkScreenWidth);
  }

  checkScreenWidth() {
    const screenWidth = window.screen.width;
    if (screenWidth) {
      const isMobile = screenWidth < 768;
      if (isMobile !== this.state.isMobile) {
        this.props.onToggleSider(isMobile);
        this.setState({ isMobile });
      }
    }
  }

  getMenu(){
    let  {myInfoResponse, myPermission} = this.props;
    if (!myInfoResponse) return []
    let roleUser = myInfoResponse.role;

    let routersList = []
    constantsRoutes.forEach(curr => {
      // nếu role mà tồn tại ở myPermission
      if((myPermission.hasOwnProperty(curr.url) && myPermission[curr.url].xem) || curr.url === 'all') routersList.push(curr)
      else{
        if(curr.children && Array.isArray(curr.children)){
          let children = curr.children
          children = children.filter(data => {
            return myPermission.hasOwnProperty(data.url) && myPermission[data.url].xem
          })
          if(children.length){
            curr.children = children
            routersList.push(curr)
          }
        }
      }
      /*if(curr.role.indexOf(roleUser) !== -1){
        // nếu là root menu thì chỉ đưa những menu con có phân quyền.
        if(curr.children && Array.isArray(curr.children)){
          let children = curr.children
          children = children.filter(data => {
            return data.role.indexOf(roleUser) !== -1
          })
          curr.children = children
        }

        routersList.push(curr)
      }*/
    })
    return routersList;
  }

  render() {

    const { cookies, hiddenSider } = this.props;
    const checkUser = !!cookies.get('token');
    const { isMobile } = this.state;
    const routersList = this.getMenu();
    if (!checkUser) {
      return <SwitchComponent routersList={privateRoutes} />;
    }

    return (
      <Layout theme="dark">
        {isMobile ?
          <Drawer
            maskClosable
            closable={false}
            onClose={() => this.props.onToggleSider(true)}
            visible={!hiddenSider}
            placement="left"
            width={260}
            height='100vh'
            bodyStyle={{ padding: '0' }}>
            <SiderComponent isDrawer history={this.props.history} routersList={routersList}/>
          </Drawer>
          : <SiderComponent history={this.props.history} routersList={routersList}/>
        }

        <Layout theme="dark" className="site-layout" id="primaryLayout">
          <HeaderComponent/>
          <div id='content-container' className='custom-scrollbar'>
            <Content>
              <BreadcrumbComponent/>
              <SwitchComponent routersList={routersList}/>
            </Content>

            <BackTop
              className="back-top"
              target={() => document.querySelector('#content-container')}
            >
            </BackTop>

            <Footer className='footer globalFooter' style={{ textAlign: 'center' }}>
              <div className='copyright'>
                Powered By Tech36
              </div>
            </Footer>
          </div>
        </Layout>
      </Layout>
    );
  }
}

const withReducer = injectReducer({ key: 'App', reducer });

const mapStateToProps = createStructuredSelector({
  hiddenSider: makeSelectToggleSider(),
  myInfoResponse: makeGetMyInfo(),
  myPermission: makeGetPermission()
});

function mapDispatchToProps(dispatch) {
  return {
    onToggleSider: (toggle) => dispatch(changeToggleSider(toggle)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default withConnect(withCookies(withReducer(withRouter(App))));
// export default withCookies(compose(withConnect)(withRouter(App)))

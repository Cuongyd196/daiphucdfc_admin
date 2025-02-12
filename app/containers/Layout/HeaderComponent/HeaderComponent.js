import React, { Component, Fragment } from 'react';
import { Layout, Menu, Avatar } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import jwtDecode from 'jwt-decode';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { makeSelectToggleSider } from './selectors';
import { changeToggleSider } from './actions';
import './Header.scss';

import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { loadMyInfo } from './HeaderProvider/actions';
import { makeGetMyInfo } from './HeaderProvider/selectors';

import { getFullname, getShortname, getAvatarSrc } from '@models/user';

import reducer from './HeaderProvider/reducer';
import saga from './HeaderProvider/saga';
import injectReducer from '@injectReducer';
import injectSaga from '@injectSaga';
import { URL } from '@url';
import { myInfoLoadingError } from '@containers/Layout/HeaderComponent/HeaderProvider/actions';
const currentTime = Math.floor(Date.now() / 1000);

class HeaderComponent extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };

  componentWillMount() {
    const { cookies } = this.props;
    const token = cookies.get('token');
    const decoded = jwtDecode(token);
    if (decoded.exp < currentTime) {
      cookies.remove('token', { path: '/' });
    } else {
      this.props.onGetMyInfo();
    }
  }

  componentDidMount() {

  }

  signOut() {
    const { cookies } = this.props;
    this.props.history.push(URL.HOMEPAGE);
    this.props.myInfoLoadingError(null);
    cookies.remove('token', { path: '/' });

  }

  toggle() {
    this.props.onToggleSider(!this.props.toggleSider);
  };

  render() {
    const { myInfoResponse, toggleSider, tinhthanh, quoctich  } = this.props;
    return (
      <Layout.Header className={`header fixed p-0 ${toggleSider ? 'fixed-closed' : 'fixed-open'}`}>
        <div className='left-container d-flex'>
          <div className="menu__toggle" onClick={() => this.toggle()}>
            {toggleSider ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
          </div>
        </div>

        <div className='right-container'>
          <Menu key="user" mode="horizontal" selectedKeys={[]}>
            <Menu.SubMenu title={
              <Fragment>
                <span className='unselectable'>{getFullname(myInfoResponse)}</span>
                <Avatar style={{ marginLeft: 10 }} src={getAvatarSrc(myInfoResponse)}>
                  {getShortname(myInfoResponse)}
                </Avatar>
              </Fragment>}>
              <Menu.Item key={URL.PROFILE}>
                <Link to={URL.PROFILE}>
                  <div>Hồ sơ cá nhân</div>
                </Link>
              </Menu.Item>
              <Menu.Item key="SignOut" onClick={this.signOut.bind(this)}>
                <div>Đăng xuất</div>
              </Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </div>
      </Layout.Header>
    );
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    onGetMyInfo: () => dispatch(loadMyInfo()),
    myInfoLoadingError: () => dispatch(myInfoLoadingError()),
    onToggleSider: (toggle) => dispatch(changeToggleSider(toggle))
  };
}

const mapStateToProps = createStructuredSelector({
  myInfoResponse: makeGetMyInfo(),
  toggleSider: makeSelectToggleSider()
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'HeaderComponent', reducer });
const withSaga = injectSaga({ key: 'HeaderComponent', saga });


export default withCookies(compose(withConnect, withReducer, withSaga)(withRouter(HeaderComponent)));

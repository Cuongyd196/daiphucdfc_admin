import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import { Link, withRouter } from 'react-router-dom';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { makeSelectToggleSider } from '../HeaderComponent/selectors';

import LOGO from '@assets/images/logos/logo.svg';
import constantsRoutes from '../ConstantsRoutes';
import './SiderComponent.scss';

class SiderComponent extends Component {
  constructor() {
    super();
    this.state = {
      pathName: '',
      openKeys: undefined
    };
  }

  componentDidMount() {
    this.getPathName(this.props.location.pathname);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    let {routersList} = this.props;
    if(routersList !== prevProps.routersList){
      this.getPathName(this.props.location.pathname);
    }
  }

  async shouldComponentUpdate(nextProps) {
    const { location } = nextProps;
    if (location !== this.props.location) {
      const pathName = location.pathname;
      this.getPathName(pathName);
    }
    return true;
  }

  getPathName(pathName) {
    let {routersList} = this.props
    let openKeys = '';
    routersList.forEach((route, index) => {
      if (Array.isArray(route.children)) {
        route.children.forEach(child => {
          if (child.path === pathName) {
            openKeys = index.toString();
          }
        });
      }
    });

    this.setState({ pathName, openKeys });
  }

  componentWillUpdate(nextProps, nextState, nextContext) {
    const { location } = nextProps;
    if (location !== this.props.location) {

      if (location.pathname === this.props.location.pathname && !location.search && this.props.location.search) {
        this.props.history.replace(this.props.location);
      }
      const container = document.querySelector('#content-container');
      if (container)
        container.scrollTop = 0;
    }
  }

  render() {
    const { toggleSider, isDrawer, routersList } = this.props;
    const { pathName, openKeys } = this.state;
    return (
      <Layout.Sider theme="dark" trigger={null} width={260} collapsible
                    collapsed={isDrawer ? false : toggleSider}>
        <div className='sticky-menu'>
          <div className="brand ">
            <div className="logo">
              {/* <img src={LOGO} alt='' className='logo'/> */}
              <h1>ĐẠI PHÚC</h1>
            </div>
          </div>
          <div className='position-relative'>
            <Menu theme="dark" selectedKeys={[pathName]} mode="inline"
                  className='menu-container'>
              {routersList.map((route, index) => {
                if (route.menuName && (!route.children && !route.submenu)) {
                  if (route.groupName) {
                    return (
                      <Menu.ItemGroup key={route.path} title={<i>{route.groupName}</i>}>
                        <Menu.Item icon={route.icon} key={route.path}>
                          <Link to={route.path}>{route.menuName}</Link>
                        </Menu.Item>
                      </Menu.ItemGroup>
                    )
                  }
                  return (
                    <Menu.Item key={route.path} icon={route.icon}>
                      <Link to={route.path}>{route.menuName}</Link>
                    </Menu.Item>
                  );
                }
                else if (route.menuName && Array.isArray(route.children)) {
                  if (route.groupName) {
                    return (
                      <Menu.ItemGroup key={index} title={<i>{route.groupName}</i>}>
                        <Menu.SubMenu title={route.menuName} icon={route.icon} key={index}>
                          {route.children.map((child) => {
                            if (child.menuName) {
                              return (
                                <Menu.Item key={child.path} icon={child.icon}>
                                  <Link to={child.path}>{child.menuName}</Link>
                                </Menu.Item>
                              )
                            }
                          })}
                        </Menu.SubMenu>
                      </Menu.ItemGroup>
                    )
                  }
                  return (
                    <Menu.SubMenu key={index} title={route.menuName} icon={route.icon}>
                      {route.children.map((child) => {
                        if (child.menuName) {
                          return (
                            <Menu.Item key={child.path} icon={child.icon}>
                              <Link to={child.path}>{child.menuName}</Link>
                            </Menu.Item>
                          )
                        }
                      })}
                    </Menu.SubMenu>
                  );
                }
                else if (route.menuName && Array.isArray(route.submenu)) {
                  return <Menu.SubMenu key={index} title={route.menuName} icon={route.icon}>
                    {
                      route.submenu.map((sub, idx) => {
                        return <Menu.SubMenu key={idx} title={sub.menuName} icon={sub.icon}>
                          {sub.children.map((child) => {
                            if (child.menuName) {
                              return (
                                <Menu.Item key={child.path} icon={child.icon}>
                                  <Link to={child.path}>{child.menuName}</Link>
                                </Menu.Item>
                              )
                            }
                          })}
                        </Menu.SubMenu>
                      })
                    }
                  </Menu.SubMenu>
                }
              })}
            </Menu>
          </div>
        </div>
      </Layout.Sider>
    );
  }
}

const mapStateToProps = createSelector(
  makeSelectToggleSider(),
  toggleSider => ({ toggleSider }),
);

export default connect(mapStateToProps)(withRouter(SiderComponent));

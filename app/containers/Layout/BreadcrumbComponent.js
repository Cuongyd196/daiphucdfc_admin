import React, { Component } from 'react';
import { Breadcrumb } from 'antd';
import { Link, withRouter, matchPath } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';

import { URL } from '@url';
import constantsRoutes from './ConstantsRoutes';

class BreadcrumbComponent extends Component {
  getBreadcrumbName(data) {
    return data.breadcrumbName ? data.breadcrumbName : (data.menuName || '');
  }

  render() {
    let { pathname } = this.props.location;
    if(pathname === URL.HOMEPAGE) return null
    if (pathname.includes(`${URL.OFFICIALS}/`) && !pathname.includes(URL.OFFICIALS_CREATE)
      && !pathname.includes('/exam/')) {
      pathname = URL.OFFICIALS_ID.format(':id');
    }
    else if (pathname.includes(`${URL.INDUSTRY_OFFICIALS}/`) && !pathname.includes(URL.INDUSTRY_OFFICIALS_CREATE)) {
      pathname = URL.INDUSTRY_OFFICIALS_ID.format(':id');
    }
    else if (pathname.includes(`${URL.MEDICAL_EXAM}/`) && pathname.includes(`${URL.OFFICIALS}/`)) {
      pathname = URL.EXAM_DETAIL.format(':id', ':officialsId');
    }
    else if (pathname.includes(`${URL.KHAM_CHUA_BENH}/`)) {
      pathname = URL.KHAM_CHUA_BENH_ID.format(':id');
    }
    else if (pathname.includes(`${URL.CAN_BO}/`)) {
      pathname = URL.CANBO_ID.format(':id');
    }
    else if (pathname.includes(`${URL.KHAM_DINH_KY}/`)) {
      pathname = URL.KHAM_DINH_KY_ID.format(':id');
    }
    else if (pathname.includes(`${URL.KHAM_SUC_KHOE}/`)) {
      pathname = URL.KHAM_SUC_KHOE_ID.format(':id');
    }

    return (
      <Breadcrumb className='my-2'>
        <Breadcrumb.Item>
          <Link to={URL.HOMEPAGE}><HomeOutlined/><span style={{ marginLeft: '4px' }}>Trang chủ</span></Link>
        </Breadcrumb.Item>
        {constantsRoutes.map((route, routeIndex) => {
          if (!route.children) {
            if (pathname !== URL.HOMEPAGE && route.path === pathname) {
              return <Breadcrumb.Item key={routeIndex}>{this.getBreadcrumbName(route)}</Breadcrumb.Item>;
            }
          }
          if (Array.isArray(route.children)) {
            return route.children.map((child, childIndex) => {
              if (pathname !== URL.HOMEPAGE && child.path === pathname) {
                return (
                  <React.Fragment key={childIndex}>
                    <Breadcrumb.Item>{this.getBreadcrumbName(route)}</Breadcrumb.Item>
                    <Breadcrumb.Item>{this.getBreadcrumbName(child)}</Breadcrumb.Item>
                  </React.Fragment>
                );
              }
            });
          }
        })}
      </Breadcrumb>
    );
  }
}

export default withRouter(BreadcrumbComponent);

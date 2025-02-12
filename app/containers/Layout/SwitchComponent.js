import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import constantsRoutes from './ConstantsRoutes';
import NotFoundPage from '../Pages/NotFoundPage/Loadable';

class SwitchComponent extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    let {routersList} = this.props
    if(!routersList.length) return null;
    return (
      <div className="site-layout-background">
        <Switch>
          {routersList.map((route, index) => {
            if (!route.children && !route.submenu) {
              return <Route path={route.path} component={route.component} exact={route.exact} key={index}/>;
            } else if (Array.isArray(route.children)) {
              return route.children.map((child, childIndex) => {
                return <Route path={child.path} component={child.component} exact={child.exact} key={childIndex}/>;
              });
            } else if (Array.isArray(route.submenu)) {
              return route.submenu.map((sub, idx) => {
                return sub.children.map((child, childIndex) => {
                  return <Route path={child.path} component={child.component} exact={child.exact} key={childIndex}/>;
                });
              });
            }
          })}
          <Route component={NotFoundPage}/>
        </Switch>
      </div>
    );
  }
}

export default (SwitchComponent);

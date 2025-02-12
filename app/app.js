import '@babel/polyfill';
// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { QueryParamProvider } from 'use-query-params';
import { ConfigProvider, message } from 'antd';
import viVN from 'antd/es/locale/vi_VN';
import history from 'utils/history';

// Import root app
import App from '@containers/App';

// Load the favicon and the .htaccess file
/* eslint-disable import/no-unresolved, import/extensions */
import '!file-loader?name=[name].[ext]!./assets/images/favicon.ico';
import 'file-loader?name=.htaccess!./.htaccess';
/* eslint-enable import/no-unresolved, import/extensions */

import configureStore from './configureStore';

import './styles/app.css';
import 'antd/dist/antd.css';
import 'font-awesome/css/font-awesome.css';

import './styles/fonts.css';
import './styles/main.scss';
import './styles/layouts.scss';
import './styles/customTheme.scss';

import { toggleLoading } from '@containers/App/AppProvider/actions';
import { COMMON_APP } from './commons/common_app';

// define format of string
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] !== 'undefined'
        ? args[number]
        : ''
        ;
    });
  };
}

// Create redux store with history
const initialState = {};
const store = configureStore(initialState, history);
const MOUNT_NODE = document.getElementById('app');

const { dispatch } = store;
let countApiRequest = 0
let countApiResponse = 0;
// console.log(countApiRequest, countApiResponse, '1')
axios.interceptors.request.use((config) => {
  let { cookie } = document;
  cookie = cookie.replace('token=', '');
  countApiRequest++;
  let loading = true;
  if (config.hasOwnProperty('loading')) {
    loading = config.loading;
    delete config.loading;
  }
  if (!config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${COMMON_APP.getCookie('token')}`;
  }
  config.timeout = 20000;
  if (loading) {
    dispatch(toggleLoading(true));
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

try {
  axios.interceptors.response.use(res => {
    countApiResponse++;
    if (countApiRequest === countApiResponse)
      dispatch(toggleLoading(false));

    if (res.data.success === false) {
      message.error(res.data.message);
      res.data = null;
    }
    return res;
  }, error => {
    countApiResponse++;
    let messageShow = 'Có lỗi xảy ra, vui lòng kiểm tra và thử lại.';
    if(error?.response?.data?.message)
      messageShow = error.response.data.message
    message.error(messageShow);
    if (countApiRequest === countApiResponse)
      dispatch(toggleLoading(false));
    return Promise.reject(error);
  });
} catch (error) {
  message.error('Có lỗi xảy ra, vui lòng kiểm tra và thử lại.');
  countApiResponse++;
  if (countApiRequest === countApiResponse)
    dispatch(toggleLoading(false));
}


const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <ConfigProvider locale={viVN}>
        <ConnectedRouter history={history}>
          <QueryParamProvider ReactRouterRoute={Route} stringifyOptions={{ sort: false }}>
            <App/>
          </QueryParamProvider>
        </ConnectedRouter>
      </ConfigProvider>
    </Provider>,
    MOUNT_NODE,
  );
};

if (module.hot) {
  module.hot.accept(['containers/App'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    render();
  });
}

// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
  new Promise(resolve => resolve(import('intl')))
    .then(() => Promise.all([import('intl/locale-data/jsonp/en.js')]))
    .then(() => render())
    .catch(err => {
      throw err;
    });
} else {
  render();
}

if (process.env.NODE_ENV === 'production') {
  require('offline-plugin/runtime').install(); // eslint-disable-line global-require
}

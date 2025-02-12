import React, { Component, Fragment } from 'react';
import { Button, Row, Input, Form } from 'antd';
import { Link } from "react-router-dom";
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import './Login.scss';
import LOGO from '../../../assets/images/logos/logo.svg';
import { login } from './services';
import { createStructuredSelector } from 'reselect';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';
import { connect } from 'react-redux';
import { SaveOutlined } from '@ant-design/icons';
import { URL } from '@url';

const FormItem = Form.Item;

class Login extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };

  async handleLogin(value) {
    const { cookies } = this.props;
    const apiResponse = await login(value);
    if (apiResponse) {
      cookies.set('token', apiResponse, { path: '/' });
    }
  }

  render() {
    const { loading } = this.props;

    return (
      <div style={{ height: "100vh" }}>
        <div id='login' className='login-form'>
          <div className='logo'>
            <img alt="logo" src={LOGO}/>
            <span>Đại phúc DFC</span>
          </div>
          <Form onFinish={this.handleLogin.bind(this)}>
            <FormItem name="username" rules={[{ required: true, message: 'Không được để trống' }]} hasFeedback>
              <Input placeholder='Tài khoản' disabled={loading}/>
            </FormItem>
            <FormItem name="password" rules={[{ required: true, message: 'Không được để trống' }]} hasFeedback>
              <Input.Password placeholder='Mật khẩu' disabled={loading}/>
            </FormItem>
            <Row>
              <Button type="primary" htmlType="submit" loading={loading}>Đăng nhập</Button>
            </Row>
          </Form>
          <div style={{ marginTop: 10 }}>
            <Link to={URL.FORGET_PASSWORD}>
              Quên mật khẩu?
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  loading: makeGetLoading(),
});

const withConnect = connect(mapStateToProps);

export default withCookies(withConnect(Login));

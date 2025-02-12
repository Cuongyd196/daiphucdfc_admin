import React, { Component } from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';
import './homepage.scss';
import {getToken} from '@services/powerbiService';

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      embedUrl: '',
      accessToken: '',
      expiration: ''
    }
  }

  async componentDidMount() {
    let data = await getToken();
    if (data) {
      let embedUrl = data.embedUrl;
      let id = data.id
      this.setState({ accessToken: data.token, embedUrl, id })
    }
  }

  render() {
    let { accessToken, id, embedUrl } = this.state;

    if (!accessToken) return null;

    return <>
    TRANG QUẢN LÝ DỮ LIỆU
    </>
    
  }
}

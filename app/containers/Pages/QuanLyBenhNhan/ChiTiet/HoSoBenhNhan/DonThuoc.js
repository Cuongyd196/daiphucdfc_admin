import React, { Component, Fragment, useEffect } from 'react';
import { Button, Col, Divider, Form, Row, Spin, Table, Tabs, Tooltip } from 'antd';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';
import Box from '@containers/Box';
import { getChiTietDonThuocId, getKetQuaCLSId } from '@services/qlbenhnhan/qlbenhnhanService';
import ModalGhiChu from '../../ChiTietSuDungThuoc/ModalGhiChu'
import { RightCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { URL } from '@url';
import moment from 'moment';
import { dateFormatter } from '@commons/dateFormat';
import ChiTietDonThuoc from 'Pages/QuanLyDonThuoc/ChiTietDonThuoc';
const DonThuoc = ({mabn}) => {
  let loaded = false
  const [data, setData] = React.useState([]);
  useEffect(() => {
    fetchData();
  }, [mabn]);

  const fetchData = async () => {
    let data = await getChiTietDonThuocId(mabn);
    if (data) {
      setData(data);
    }
    loaded = true
  };

  return <Spin spinning={loaded}>
    {data.length === 0 && loaded && <div className="text-red-500">Không có lịch sử đơn thuốc</div>}
    {(data.map((item, index) => (
      <ChiTietDonThuoc donthuoc={item} donthuocct={item.donthuocct} key={index}/>
    )))}
  </Spin>;
}

export default DonThuoc



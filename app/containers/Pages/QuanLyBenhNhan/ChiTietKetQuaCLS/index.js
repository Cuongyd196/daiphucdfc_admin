import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';
import Box from '@containers/Box';
import ThongTinBenhNhan from 'Pages/QuanLyBenhNhan/ThongTinBenhNhan';
import CanLamSang from 'Pages/QuanLyBenhNhan/ChiTiet/HoSoBenhNhan/CanLamSang';

class KetQuaCanLamSan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: props.match.params.id
    }
  }
  render() {
    return <Fragment>
      <Box title='Thông tin bệnh nhân'>
        <ThongTinBenhNhan mabn={this.state._id}/>
      </Box>
      <CanLamSang mabn={this.state._id}/>
    </Fragment>;
  }
}
export default KetQuaCanLamSan;



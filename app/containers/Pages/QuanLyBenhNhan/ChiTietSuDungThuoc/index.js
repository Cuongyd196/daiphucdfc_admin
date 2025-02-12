import React, { Component, Fragment } from 'react';
import { Col, Form, Row, Skeleton, Table, Tabs } from 'antd';
import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';
import Box from '@containers/Box';
import { getChiTietDonThuocId } from '@services/qlbenhnhan/qlbenhnhanService';
import { getById } from '@services/qlbenhnhan/qlbenhnhanService'
import ChiTietDonThuoc from 'Pages/QuanLyDonThuoc/ChiTietDonThuoc';
import ThongTinBenhNhan from '../ThongTinBenhNhan';
class QlDonThuocBenhNhanChiTiet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataRef: [],
      dataRefBN: [],
      _id: props.match.params.id,
    };
    this.formRef = React.createRef();
  }

  async componentWillMount() {
    const data = await getChiTietDonThuocId(this.state._id)
    if (data) {
      this.setState({ dataRef: data })
    }
  }

  render() {
    let { dataRef } = this.state;
    return <Fragment>
      <Box title='Thông tin đơn thuốc bệnh nhân'>
        <ThongTinBenhNhan mabn={this.state._id}/>
      </Box>
      {dataRef.length === 0 && <div className="text-red-500 bg-white py-1 flex justify-center">Không có lịch sử đơn thuốc</div>}
      {(dataRef.map((item, index) => (<ChiTietDonThuoc donthuoc={item} donthuocct={item.donthuocct} key={index}/>)))}
    </Fragment>;
  }
}

const mapStateToProps = createStructuredSelector({
  loading: makeGetLoading(),
});

const withConnect = connect(mapStateToProps);

export default withConnect(QlDonThuocBenhNhanChiTiet);



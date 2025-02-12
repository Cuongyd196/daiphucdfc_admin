import React, { Component, Fragment } from 'react';
import { Button, Col, Form, Input, Modal, Row, Table, Tabs } from 'antd';
import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';
import { getById, getGhiChuDonTHuoc } from '@services/qlbenhnhan/donthuocService';
import { dateFormatter } from '@commons/dateFormat';
import moment from 'moment'
class ModalGhiChu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      donthuoc: {},
      dsghichu: [],
    };
    this.formRef = React.createRef();
  }

  async componentDidUpdate(prevProps) {
    let { showModalThuoc, iddonthuoc } = this.props;
    if (showModalThuoc !== prevProps.showModalThuoc) {
      let [donthuoc, dsghichu] = await Promise.all([
        getById(iddonthuoc), getGhiChuDonTHuoc(iddonthuoc),
      ]);
      if (donthuoc && dsghichu) {
        this.setState({ donthuoc, dsghichu, showModal: true });
      }
    }
  }

  toggleModal = () => this.setState({ showModal: false });

  render() {
    let { loading } = this.props;
    let { donthuoc, dsghichu } = this.state;
    const labelColCol = { 'xs': 12, 'sm': 12, 'md': 12, 'lg': 12, 'xl': 8 };
    return <Modal
      title="Tình trạng sử dụng thuốc"
      visible={this.state.showModal}
      onCancel={loading ? () => null : this.toggleModal}
      footer={false}
      style={{zIndex: 9999999999}}
      width={900}
    >
      <Row>

        <Col xs={24} sm={12} md={12} lg={12} xl={8}>
          <Form.Item
            label='Mã đơn thuốc'
            className="label_from_item"
            labelCol={labelColCol}>
            <span>{donthuoc?._id}</span>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12} xl={8}>
          <Form.Item
            label='Ngày kê'
            className="label_from_item"
            labelCol={labelColCol}>
            <span>{dateFormatter(donthuoc.ngay)}</span>
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Table size="small" rowKey="_id" bordered dataSource={dsghichu}
                 pagination={false}>
            <Table.Column  title="STT" width={50} dataIndex="mahh" render={(value, row, idx) => idx + 1}
                          align="center"/>
            <Table.Column title="Ngày" align="center" dataIndex="ngay" render={value => moment(value).format('DD/MM/YYYY')}/>
            <Table.Column title="Nội dung" dataIndex="noidung"/>
          </Table>
        </Col>

      </Row>
    </Modal>;
  }
}

const mapStateToProps = createStructuredSelector({
  loading: makeGetLoading(),
});

const withConnect = connect(mapStateToProps);

export default withConnect(ModalGhiChu);



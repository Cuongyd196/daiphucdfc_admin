import React, { Component, Fragment, useMemo } from 'react';
import { Button, Form, Row, Table, Tabs, Tooltip, Modal, Col, Skeleton, Image, Spin, message } from 'antd';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';
import Box from '@containers/Box';
import { HistoryOutlined, EyeOutlined } from '@ant-design/icons';
import {
  getChiTietKhamBenhId,
  getById,
  getHenKhamKhamBenhId,
  getChanDoanHinhAnhImage,
} from '@services/qlbenhnhan/qldangkykhamService';
import { dateFormatter } from '../../../../commons/dateFormat';
import LichsukhamDialog from '../../QuanLyBenhNhan/LichsukhamDialog';
import ParagraphText from '@components/ParagraphText';
import { getCdha, getKetQuaCLSById } from '@services/qlbenhnhan/qlbenhnhanService';
import ThongTinBenhNhan from 'Pages/QuanLyBenhNhan/ThongTinBenhNhan';

function CustomSkeleton(props) {
  const { children, isShowSkeleton, ...rest } = props;
  if (isShowSkeleton) return <Skeleton.Input active size='small' className='w-full' />;
  return React.cloneElement(children, rest);
}

class ChiTietDangKyKham extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataRef: [],
      _id: props.match.params.id,
      showModal: false,
      showModalImg: false,
      dataRefKQ: [],
      henkham: [],
      hinhanh: [],
      listDetail: [],
      benhnhan_id: '',
      dataBN: {},
      loaikqcls: 0,
      ketquacdha: '',
    };
    this.lichsukhamDialog = React.createRef();
  }

  async componentDidMount() {
    this.getDataInit(this.state._id);
  }

  async getDataInit(id) {
    const [dataBN, henkham, data] = await Promise.all([
      getById(id),
      getHenKhamKhamBenhId(id),
      getChiTietKhamBenhId(id),
    ]);
    this.setState({
      dataRef: data,
      henkham: henkham,
      benhnhan_id: dataBN?.benhnhan_id?._id,
      _id: id,
      dataBN,
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.getDataInit(this.props.match.params.id);
    }
  }

  onDetailImage = async (id, stt) => {
    let hinhanh = await getCdha(id, stt);
    if (hinhanh && hinhanh.length) {
      let hinhanhArr = hinhanh.map((e) => e.Pic.data);
      this.setState({ showModalImg: !this.state.showModalImg, hinhanh: hinhanhArr });
    } else {
      this.setState({ showModalImg: !this.state.showModalImg, hinhanh: [] });
    }
  };

  xemhinhanh(data) {
    return (
      <Tooltip title='Xem kết quả hình ảnh' color='#2db7f5'>
        <Button
          icon={<EyeOutlined />}
          onClick={() => this.onDetailImage(data._id, data.stt)}
          size='small'
          type='primary'
        />
      </Tooltip>
    );
  }

  toggleModalImg = async () => {
    const { showModalImg } = this.state;
    await this.setState({ showModalImg: !showModalImg });
  };

  render() {
    const { loading } = this.props;
    const { dataBN } = this.state;
    const labelCol = { xs: 0, sm: 0, md: 0, lg: 0, xl: 0 };
    const labelColCol = { xs: 12, sm: 12, md: 12, lg: 12, xl: 8 };

    return (
      <Spin spinning={loading}>
        <Box
          title='Thông tin bệnh nhân'
          boxActions={
            <Button
              size='small'
              icon={<HistoryOutlined />}
              onClick={() => this.lichsukhamDialog.current?.open(this.state.benhnhan_id)}
            >
              Lịch sử khám
            </Button>
          }
        >
          <LichsukhamDialog ref={this.lichsukhamDialog} mabn={dataBN?.benhnhan_id?._id} />
          <ThongTinBenhNhan mabn={dataBN?.benhnhan_id?._id} />
        </Box>
        {Array.isArray(this.state.dataRef) && !!this.state.dataRef.length && (
          <Box title='Thông tin khám bệnh'>
            <Form size='small' autoComplete='off' className='form-info'>
              <Tabs>
                {this.state.dataRef.map((khoa, index) => {
                  return (
                    <Tabs.TabPane tab={khoa?.maphong?.tenphong} key={index}>
                      <Row gutter={24}>
                        <Col xs={24} sm={12} xl={8}>
                          <Form.Item label={<b>Phòng khám</b>} labelCol={labelColCol}>
                            <span>{khoa?.dmphong_id?.fullname}</span>
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={12} lg={12} xl={8}>
                          <Form.Item label={<b>Ngày khám</b>} labelCol={labelColCol}>
                            <span>{dateFormatter(khoa?.ngayud, true)}</span>
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={12} lg={12} xl={8}>
                          <Form.Item label={<b>Bác sĩ</b>} labelCol={labelColCol}>
                            <span>{khoa?.bsdt?.tennv}</span>
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={12} lg={12} xl={8}>
                          <Form.Item label={<b>Huyết áp</b>} labelCol={labelColCol}>
                            <span>{khoa?.huyetap} mmHg</span>
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={12} lg={12} xl={8}>
                          <Form.Item label={<b>Mạch</b>} labelCol={labelColCol}>
                            <span>{khoa?.mach} L/P</span>
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={12} lg={12} xl={8}>
                          <Form.Item label={<b>Nhiệt độ</b>} labelCol={labelColCol}>
                            <span>{khoa?.nhietdo} độ C</span>
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={12} lg={12} xl={8}>
                          <Form.Item label={<b>Cân nặng</b>} labelCol={labelColCol}>
                            <span>{khoa?.cannang} Kg</span>
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} xl={8}>
                          <Form.Item label={<b>ICD</b>} labelCol={labelColCol}>
                            <span>{khoa?.icd}</span>
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={12} lg={12} xl={8}>
                          <Form.Item labelCol={labelColCol} />
                        </Col>
                        <Col xs={24} sm={12} md={12} lg={12}>
                          <Form.Item label={<b>Chẩn đoán</b>} labelCol={{ xs: 12, lg: 6 }}>
                            <span>{khoa?.chandoan}</span>
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={12} lg={12}>
                          <Form.Item label={<b>Chẩn đoán sơ bộ</b>} labelCol={{ xs: 12, lg: 6 }}>
                            <span>{khoa?.chandoansobo}</span>
                          </Form.Item>
                        </Col>

                        {khoa?.donthuocct && khoa?.donthuocct.length !== 0 ? (
                          <>
                            <Col xs={24}>
                              <Form.Item label={<b>Đơn thuốc</b>} labelAlign='left' labelCol={{ xs: 24 }} />
                            </Col>
                            <Col xs={6}>
                              <Form.Item label={<b>Ngày kê</b>} labelCol={labelColCol}>
                                <span>{dateFormatter(khoa?.donthuoc?.ngay)}</span>
                              </Form.Item>
                            </Col>
                            <Col xs={18}>
                              <Form.Item label={<b>Ghi chú</b>} labelCol={{ xs: 6 }}>
                                <span className='whitespace-pre-wrap'>{khoa?.donthuoc?.ghichu}</span>
                              </Form.Item>
                            </Col>

                            <Col xs={24}>
                              <Table
                                size='small'
                                rowKey='_id'
                                bordered
                                dataSource={khoa?.donthuocct}
                                pagination={false}
                              >
                                <Table.Column
                                  title='Mã BD'
                                  dataIndex={['dmthuocvattu_id', '_id']}
                                  align='center'
                                />
                                <Table.Column title='Tên BD' dataIndex={['dmthuocvattu_id', 'ten']} />
                                <Table.Column title='Số lượng' dataIndex='soluong' align='center' />
                                <Table.Column title='Ghi chú' dataIndex='ghichu' />
                              </Table>
                            </Col>
                          </>
                        ) : (
                          ''
                        )}
                        {khoa?.dichvu && khoa?.dichvu.length !== 0 ? (
                          <Col xs={24}>
                            <Form.Item
                              label={<b>Dịch vụ chỉ định</b>}
                              labelCol={{ xs: 24 }}
                              labelAlign='left'
                            />
                            <Form.Item labelCol={labelCol}>
                              <Table
                                size='small'
                                rowKey='_id'
                                bordered
                                dataSource={khoa?.dichvu}
                                pagination={false}
                              >
                                <Table.Column
                                  title='STT'
                                  render={(value, row, index) => index + 1}
                                  align='center'
                                />
                                <Table.Column
                                  title='Tên dịch vụ'
                                  dataIndex='dmgiadichvu_id'
                                  render={(value) => value?.ten}
                                />
                                <Table.Column
                                  title='Phòng khám'
                                  dataIndex='dmphong_id'
                                  align='center'
                                  render={(value) => value?.fullname}
                                />
                                <Table.Column
                                  title='Bác sĩ điều trị'
                                  dataIndex='bsdt'
                                  align='center'
                                  render={(value) => value?.tennv}
                                />
                              </Table>
                            </Form.Item>
                          </Col>
                        ) : (
                          ''
                        )}

                        {khoa?.chandoanhinhanh && khoa?.chandoanhinhanh.length !== 0 ? (
                          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <Form.Item
                              label={<b>Kết quả chẩn đoán hình ảnh:</b>}
                              labelAlign='left'
                              labelCol={{ xs: 24, sm: 24, md: 24, lg: 24, xl: 24 }}
                            />
                            <Form.Item labelCol={labelCol}>
                              <Table
                                size='small'
                                rowKey='_id'
                                bordered
                                dataSource={khoa?.chandoanhinhanh}
                                pagination={false}
                              >
                                <Table.Column
                                  title='STT'
                                  render={(value, row, index) => index + 1}
                                  align='center'
                                />
                                <Table.Column
                                  title='Loại dịch vụ'
                                  dataIndex='dmdichvu_id'
                                  render={(value) => value?.ten}
                                />
                                <Table.Column
                                  title='Dịch vụ'
                                  dataIndex='dmgiadichvu_id'
                                  render={(value) => value?.ten}
                                />
                                <Table.Column
                                  title='Bác sĩ điều trị'
                                  dataIndex='bsdt'
                                  align='center'
                                  render={(value) => value}
                                />
                                <Table.Column
                                  title='Bác sĩ CĐHA'
                                  dataIndex='bscdha'
                                  align='center'
                                  render={(value) => value?.tennv}
                                />
                                <Table.Column
                                  title='Kết quả'
                                  dataIndex='mota'
                                  render={(value) => <ParagraphText content={value} />}
                                />
                                <Table.Column
                                  title='Hình ảnh'
                                  dataIndex='soluongpic'
                                  align='center'
                                  render={(value, row, index) => this.xemhinhanh(row)}
                                />
                              </Table>
                            </Form.Item>
                          </Col>
                        ) : (
                          ''
                        )}

                        {!!this.state.henkham.length && (
                          <Col xs={24}>
                            <Form.Item
                              label={<b>Thông tin hẹn khám</b>}
                              labelCol={{ xs: 24 }}
                              labelAlign='left'
                            />
                            <Table
                              size='small'
                              rowKey='_id'
                              bordered
                              dataSource={this.state.henkham}
                              pagination={false}
                            >
                              <Table.Column
                                align='center'
                                title='STT'
                                dataIndex='_id'
                                render={(cell, r, i) => i + 1}
                              />
                              <Table.Column
                                align='center'
                                title='Ngày hẹn'
                                dataIndex='ngayhen'
                                render={(cell) => dateFormatter(cell)}
                              />
                              <Table.Column
                                align='center'
                                title='Bác sĩ'
                                dataIndex='benhan_id'
                                render={(cell) => cell.bsdt?.tennv}
                              />
                            </Table>
                          </Col>
                        )}
                      </Row>
                    </Tabs.TabPane>
                  );
                })}
              </Tabs>
            </Form>
          </Box>
        )}
        <Modal
          title='Kết quả chẩn đoán hình ảnh'
          visible={this.state.showModalImg}
          onCancel={loading ? () => null : this.toggleModalImg}
          footer={null}
          style={{ top: '10px' }}
          bodyStyle={{ display: 'flex', justifyContent: 'space-around' }}
          width={800}
        >
          {this.state.hinhanh.length === 0 && <div className='text-red-500'>Hình ảnh hiển thị trống</div>}
          <Image.PreviewGroup>
            {this.state.hinhanh.map((data, idx) => {
              return <Image width={300} src={`data:image/png;base64,${data}`} key={idx} />;
            })}
          </Image.PreviewGroup>
        </Modal>
      </Spin>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  loading: makeGetLoading(),
});

const withConnect = connect(mapStateToProps);

export default withConnect(ChiTietDangKyKham);

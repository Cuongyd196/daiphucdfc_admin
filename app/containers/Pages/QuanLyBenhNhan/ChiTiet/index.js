import React, { Component, Fragment } from 'react';
import {
  DatePicker, Row, Col, Input, Button, Form, Skeleton, Select, message, Card, Tabs, Divider, Tooltip,
} from 'antd';
import {
  EyeOutlined,
  FileSearchOutlined,
  SaveOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';

import { RULE } from '@constants';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';

import { dongbobenhnhanHis, getById, updateById } from '@services/qlbenhnhan/qlbenhnhanService';

import moment from 'moment';
import { compose } from 'redux';
import { makeGetMyInfo, makeGetPermission } from '@containers/Layout/HeaderComponent/HeaderProvider/selectors';
import { withTinhThanh } from '@reduxApp/TinhThanh/connect';
import { withPhai } from '@reduxApp/Phai/connect';
import { getAllQuanHuyenById } from '@services/danhmucdiachi/tinhthanhService';
import { getAllPhuongXaById } from '@services/danhmucdiachi/quanhuyenService';
import BenhNhanModal from 'Pages/LichHen/ChiTiet/BenhNhanModal';
import { URL } from '@url';
import HoSoBenhNhan from './HoSoBenhNhan';
import HoSoSucKhoe from './HoSoSucKhoe';
import HinhAnhBenhNhan from '../HinhAnhBenhNhan';
import { Link } from 'react-router-dom';
const { TabPane } = Tabs;

function CustomSkeleton(props) {
  const { children, isShowSkeleton, ...rest } = props;
  if (isShowSkeleton) return <Skeleton.Input active size='small'/>;
  return React.cloneElement(children, rest);
}

class QlBenhNhanChiTiet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      _id: props.match.params.id,
      activeKey: '1',
      taikhoan: '',
      quanhuyen: [],
      phuongxa: [],
      mabn: '',
      makcb: '',
      taikhoanhis: '',
      mabnmoi:''
    };
    this.formRef = React.createRef();
    this.url = 'benhnhan';
  }

  async componentDidMount() {
    if (this.state._id) {
      let [data] = await Promise.all([getById(this.state._id)]);
      if (data) {
        this.getDiaChi(data);
        this.formRef.current.setFieldsValue({
          ...data,
          maphai: data?.maphai?._id,
          matt: data?.matt?._id,
          maqh: data?.maqh?._id,
          mapx: data?.mapx?._id,
          ngaysinh: moment(data.ngaysinh),
          matkhau: '',
          confirm: '',
          taikhoan: data?.taikhoan

        });
        this.setState({
          taikhoan: data.taikhoan,
          taikhoanhis: data.taikhoanhis,
          mabnmoi: data.mabnmoi
        });
      }
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.componentDidMount();
    }
  }

  async getDiaChi(data) {
    if (!!data?.matt?._id) {
      const quanhuyen = await getAllQuanHuyenById(data.matt._id);
      if (quanhuyen) {
        this.setState({ quanhuyen, phuongxa: [] });
      }
    }
    if (!!data?.maqh?._id) {
      const phuongxa = await getAllPhuongXaById(data.maqh._id);
      if (phuongxa) {
        this.setState({ phuongxa });
      }
    }
  }

  onFinish = async (data) => {
    const { _id } = this.state;
    if (this.state.activeKey === '1') {
      const dataup = {
        hoten: data.hoten,
        dienthoai: data.dienthoai,
        address: data.address,
        maphai: data.maphai,
        matt: data.matt,
        maqh: data.maqh,
        mapx: data.mapx,
        ngaysinh: data.ngaysinh,
        thannhan: data.thannhan
      };

      if (data.matkhau && data.confirm && data.matkhau !== data.confirm) {
        message.warning('Mật khẩu và nhập lại mật khẩu là bắt buộc nhập');
        return;
      }else if(data.matkhau && data.confirm && data.taikhoan){
        dataup.matkhau=data.matkhau
        dataup.taikhoan= data.taikhoan
      }

      const apiResponse = await updateById(_id, dataup);
      if (apiResponse) {
        this.setState({taikhoan: apiResponse.taikhoan})
        message.success('Cập nhật dữ liệu thành công');
      }
    }
  };

  onChangeTabs = (activeKey) => {
    this.setState({ activeKey });
  };

  onFinishFailed = ({ values, errorFields, outOfDate }) => {
    if (errorFields.length) {
      this.setState({ activeKey: '1' });
    }
  };

  onFieldsChange = async (changedValues, allValues) => {
    if (changedValues.hasOwnProperty('matt')) {
      this.formRef.current.setFieldsValue({ maqh: '', mapx: '' });
      const quanhuyen = await getAllQuanHuyenById(changedValues['matt']);
      if (quanhuyen) {
        this.setState({ quanhuyen, phuongxa: [] });
      }
    } else if (changedValues.hasOwnProperty('maqh')) {
      this.formRef.current.setFieldsValue({ mapx: '' });
      const phuongxa = await getAllPhuongXaById(changedValues['maqh']);
      if (phuongxa) {
        this.setState({ phuongxa });
      }
    }
  };

  getInfoPatient = (benhnhanInfo) => {
    let thongtin = '';
    if (benhnhanInfo) {
      thongtin = 'Mã BN: ' + benhnhanInfo?._id + ' - Tên: ' + benhnhanInfo?.hoten + ' - Ngày sinh: ' + (moment(benhnhanInfo.ngaysinh).format('DD/MM/YYYY')) + ' - SĐT: ' + (benhnhanInfo?.dienthoai || '');
    }
    return thongtin;
  };

  getInfoKCB = (makcb, benhnhanInfo) => {
    if (makcb) {
      let thongtin = this.getInfoPatient(benhnhanInfo);
      this.setState({ makcb: makcb, showModal: false, mabn: benhnhanInfo._id });
      this.formRef.current.setFieldsValue({
        makcb: makcb,
        info: thongtin,
      });
    } else {
      this.setState({ showModal: false });
    }
  };

  showModalMKCB = () => this.setState({ showModal: true });

  dongboBNFunc = async () => {
    let { mabn, makcb, _id } = this.state;
    let apiRes = await dongbobenhnhanHis(_id, { mabn: mabn });
    if (apiRes) {
      message.success('Đồng bộ bệnh nhân thành công');
      await this.setState({ _id: mabn });
      this.props.history.push(URL.QL_BENHNHAN_ID.format(mabn));
    }
  };

  render() {

    const { loading, tinhthanh, phai, myPermission } = this.props;
    const { quanhuyen, phuongxa } = this.state;
    const layoutCol = { 'xs': 24, 'sm': 12, 'md': 12, 'lg': 12, 'xl': 8, 'xxl': 6 };
    const labelCol = { 'xs': 24, 'sm': 12, 'md': 12, 'lg': 12, 'xl': 12, 'xxl': 12 };

    return <Card size="small" title={<span>
      <UnorderedListOutlined className="icon-card-header"/> &nbsp;Thông tin bệnh nhân
      </span>} md="24" bordered extra={this.state._id ? <Fragment>
    </Fragment> : null}>

      <Tabs activeKey={this.state.activeKey} onChange={this.onChangeTabs} tabBarExtraContent={
        (myPermission?.[this.url]?.sua)  && this.state.activeKey === '1' &&
        <Button form="formModal" size="small" icon={<SaveOutlined/>} type="primary" htmlType="submit" loading={loading}>Lưu dữ
          liệu</Button>
      }>

        <TabPane tab="Thông tin hành chính" key="1">
          <Form ref={this.formRef} layout='vertical' size='small' autoComplete='off'
                onValuesChange={this.onFieldsChange}
                onFinishFailed={this.onFinishFailed}
                onFinish={this.onFinish}
                name="formModal"
          >

            <Divider orientation="left" plain>
              <span className="text-pink-500">Thông tin bệnh nhân</span>
            </Divider>

            <Row gutter={10}>
              <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                <Form.Item label="Mã bệnh nhân" name="_id" labelCol={labelCol}
                           validateTrigger={['onChange', 'onBlur']}>
                  <CustomSkeleton isShowSkeleton={false}><Input disabled/></CustomSkeleton>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                <Form.Item label="Họ và tên" name="hoten" labelCol={labelCol}
                           validateTrigger={['onChange', 'onBlur']}
                           rules={[{ required: true, message: 'Họ tên không được để trống' }]}>
                  <CustomSkeleton isShowSkeleton={false}><Input placeholder='Nhập họ tên'
                                                                disabled={loading}/></CustomSkeleton>
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                <Form.Item label="Điện thoại" name="dienthoai" labelCol={labelCol}
                           >
                  <CustomSkeleton isShowSkeleton={false}><Input placeholder='Nhập điện thoại cố định'
                                                                disabled={loading}/></CustomSkeleton>
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={12} xl={3}>
                <Form.Item label="Ngày sinh" name="ngaysinh"
                           rules={[{ required: true, message: 'Ngày sinh không được để trống' }]}
                           validateTrigger={['onChange', 'onBlur']}>
                  <CustomSkeleton isShowSkeleton={false}>
                    <DatePicker size='small' className="w-full" format="DD-MM-YYYY"
                                placeholder='Ngày sinh' disabled={loading}
                                dropdownClassName='small'/>
                  </CustomSkeleton>
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={12} xl={3}>
                <Form.Item label="Giới tính" name="maphai"
                           rules={[{ required: true, message: 'Giới tính không được để trống' }]}
                           validateTrigger={['onChange', 'onBlur']}>
                  <CustomSkeleton isShowSkeleton={false}>
                    <Select placeholder='Chọn giới tính' disabled={loading} dropdownClassName='small'>
                      {phai?.map((gender, i) => {
                        return <Select.Option key={i} value={gender._id}>
                          {gender.tenphai}
                        </Select.Option>;
                      })}
                    </Select>
                  </CustomSkeleton>
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                <Form.Item label="Địa chỉ" name="address" labelCol={layoutCol}
                           validateTrigger={['onChange', 'onBlur']}>
                  <Input placeholder='Địa chỉ' disabled={loading}/>
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                <Form.Item label="Tỉnh thành" name="matt"
                           validateTrigger={['onChange', 'onBlur']}>
                  <CustomSkeleton isShowSkeleton={false}>
                    <Select placeholder='Chọn tỉnh thành' disabled={loading} dropdownClassName='small' showSearch
                            filterOption={(input, option) => {
                              return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                            }}>
                      {tinhthanh?.map(data => {
                        return <Select.Option key={data._id} value={data._id}>
                          {data.tentinh}
                        </Select.Option>;
                      })}
                    </Select>
                  </CustomSkeleton>
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                <Form.Item label="Quận huyện" name="maqh"
                           validateTrigger={['onChange', 'onBlur']}>
                  <CustomSkeleton isShowSkeleton={false}>
                    <Select placeholder='Chọn quận huyện' disabled={loading} dropdownClassName='small' showSearch
                            filterOption={(input, option) => {
                              return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                            }}>
                      {quanhuyen?.map(data => {
                        return <Select.Option key={data._id} value={data._id}>
                          {data.tenhuyen}
                        </Select.Option>;
                      })}
                    </Select>
                  </CustomSkeleton>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                <Form.Item label="Xã phường" name="mapx"
                           validateTrigger={['onChange', 'onBlur']}>
                  <CustomSkeleton isShowSkeleton={false}>
                    <Select placeholder='Chọn xã phường' disabled={loading} dropdownClassName='small' showSearch
                            filterOption={(input, option) => {
                              return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                            }}>
                      {phuongxa?.map(data => {
                        return <Select.Option key={data._id} value={data._id}>
                          {data.tenxa}
                        </Select.Option>;
                      })}
                    </Select>
                  </CustomSkeleton>
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                <Form.Item label="Thân nhân" name="thannhan" labelCol={layoutCol}
                           validateTrigger={['onChange', 'onBlur']}>
                  <CustomSkeleton isShowSkeleton={false}><Input placeholder='Thân nhân'
                                                                disabled={loading}/></CustomSkeleton>
                </Form.Item>
              </Col>

            </Row>

            <Divider orientation="left" plain>
              <span className="text-pink-500">Thông tin tài khoản</span>
            </Divider>

            <Row gutter={10}>
              <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                <Form.Item label="Tài khoản" name="taikhoan">
                  <Input disabled={this.state.taikhoan || loading} autoComplete="off" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                <Form.Item label="Nhập mật khẩu" name="matkhau" hasFeedback>
                  <Input.Password disabled={loading} autoComplete="off"/>

                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={6}>
                <Form.Item label="Nhập lại mật khẩu" dependencies={['matkhau']} name="confirm" hasFeedback rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('matkhau') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject('Vui lòng nhập 2 mật khẩu giống nhau!');
                    },
                  })]}>
                  <Input.Password disabled={loading} autoComplete="off" />
                </Form.Item>
              </Col>
            </Row>

            {
              !this.state.taikhoanhis && <Row gutter={10}>
                <Divider orientation="left" plain>
                  <span className="text-pink-500 mt-5">Đồng bộ bệnh nhân</span>
                </Divider>
                {!this.state.mabnmoi ? <>
                  <Col xs={24} lg={12} xl={6}>
                    <Form.Item label="Mã khám chữa bệnh" name="makcb">
                      <Input disabled={true}/>
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item label=" ">
                      <Button size='small' type="primary" icon={<FileSearchOutlined/>}
                              onClick={this.showModalMKCB}>Chọn</Button>
                    </Form.Item>
                  </Col>
                </> : <Row style={{marginLeft: '10px'}}>
                  <Link to={URL.QL_BENHNHAN_ID.format(this.state.mabnmoi)}>
                    <Button onClick={ () => {this.setState({_id : this.state.mabnmoi})}}> Đã đồng bộ với bệnh nhân: {this.state.mabnmoi}
                    </Button>
                  </Link>
                </Row>
                }
                {
                  !!this.state.makcb &&
                  <Col xs={24} sm={12}>
                    <Form.Item label="Thông tin bệnh nhân" name="info">
                      <Input disabled={true}/>
                    </Form.Item>
                  </Col>
                }
                {
                  !!this.state.makcb &&
                  <Col>
                    <Form.Item label=" ">
                      <Tooltip placement="top" title="Lưu dữ liệu đồng bộ bệnh nhân" color="#2db7f5">
                        <Button icon={<SaveOutlined/>} size="small" type="danger"
                                onClick={this.dongboBNFunc}>Lưu đồng bộ</Button>
                      </Tooltip>
                    </Form.Item>
                  </Col>
                }
              </Row>
            }
          </Form>
        </TabPane>
        <TabPane tab="Hồ sơ sức khỏe" key="3" disabled={loading}>
          <HoSoSucKhoe mabn={this.state._id}/>
        </TabPane>
        <TabPane tab="Lịch sử khám bệnh" key="4" disabled={loading}>
          <HoSoBenhNhan mabn={this.state._id}/>
        </TabPane>
        <TabPane tab="Gửi hình ảnh cho bệnh nhân" key="5" disabled={loading}>
          <HinhAnhBenhNhan mabn={this.state._id} taikhoanhis={this.state.taikhoanhis} />
        </TabPane>
      </Tabs>

      <BenhNhanModal showModal={this.state.showModal} taikhoanhis={false} dangkybn={true}
                     mabn={this.state.mabn} makcb={this.state.makcb} getInfoKCB={this.getInfoKCB}
      />
    </Card>;
  }
}

const mapStateToProps = createStructuredSelector({
  loading: makeGetLoading(),
  myInfoResponse: makeGetMyInfo(),
  myPermission: makeGetPermission(),
});


const withConnect = connect(mapStateToProps);
export default compose(withConnect, withTinhThanh, withPhai)(QlBenhNhanChiTiet);

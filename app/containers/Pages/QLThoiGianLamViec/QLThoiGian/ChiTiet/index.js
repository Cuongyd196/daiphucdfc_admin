import React from 'react';
import moment from 'moment';
import {
  Form,
  Row,
  Col,
  Button,
  Divider,
  Tooltip,
  Table,
  Modal, Card, Popconfirm, message,
} from 'antd';
import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
  ScheduleOutlined,
} from '@ant-design/icons';
import Box from '@containers/Box';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { getById } from '@services/qlthoigianlamviec/qlthoigianService';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';
import { dateFormatter } from '@commons/dateFormat';
import Checkbox from 'antd/es/checkbox';
import Select from 'antd/es/select';
import { getAll } from '@services/danhmucchung/nhanvienService';
import {
  getAllLichLamViec,
  updateByIdLichLamViec,
  addLichLamViec,
  delByIdLichLamViec
} from '@services/qlthoigianlamviec/quanlylichlamviecService';
import DatePicker from 'antd/es/date-picker';
import { makeGetPermission } from '@containers/Layout/HeaderComponent/HeaderProvider/selectors';
import LichBacSiNghi from '../LichBacSiNghi';

const layoutCol = { 'xs': 24, 'sm': 12, 'md': 12, 'lg': 12, 'xl': 4, 'xxl': 4 };

class ChiTietLich extends React.Component {
  columns = [
    {
      title: 'STT',
      render: (value, row, index) => (index + 1),
      align: 'center',
    },
    {
      title: 'Ngày',
      dataIndex: 'ngay',
      render: (value, rowData) => rowData.ngayle ? `*${dateFormatter(value)} (ngày lễ)` : dateFormatter(value),
      align: 'center',
      width: 200,
    },
    {
      title: 'Chi tiết',
      dataIndex: 'bacsy_idLich',
      render: (value, rowData) => {
        return (
          <>
            <div>
              - Ca sáng bác sĩ:{' '}
              {rowData?.casang_bacsy_id.map((data) => {
                return data.tennv + ', ';
              })}
            </div>
            <div>
              - Ca chiều bác sĩ:{' '}
              {rowData?.cachieu_bacsy_id.map((data) => {
                return data.tennv + ', ';
              })}
            </div>
            {!rowData?.ngayle ? (
              <div>
                - Ca tối bác sĩ:{' '}
                {rowData?.catoi_bacsy_id.map((data) => {
                  return data.tennv + ', ';
                })}
              </div>
            ) : null}
          </>
        );
      },
    },
    {
      title: '',
      align: 'center',
      width: 90,
      render: value => this.formatActionCell(value),
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      _idLich: props.match.params.id,
      casang: false,
      cachieu: false,
      catoi: false,
      _id: '',
      ngaybatdau: '',
      ngayketthuc: '',
      listAllDate: [],
      listFilterDate: [],
      ngayle: false,
    };
    this.formRef = React.createRef();
    this.formDate = React.createRef();
  }

  async componentDidMount() {
    this.getDataFilter();
    this.getDataDoctor();
    this.getDateRange();
  }

  async getDateRange() {
    const dataRes = await getById(this.state._idLich);
    if (dataRes) {
      this.dateRange(dataRes.ngaybatdau, dataRes.ngayketthuc);
      this.formDate.current.setFieldsValue({
        ngaybatdau: moment(dataRes.ngaybatdau),
        ngayketthuc: moment(dataRes.ngayketthuc),
      });
      this.setState({
        ngaybatdau: moment(dataRes.ngaybatdau),
        ngayketthuc: moment(dataRes.ngayketthuc),
      });
    }
  }

  dateRange(startDate, endDate) {
    let listAllDate = [];
    let currentDate = moment(startDate).format('YYYY-MM-DD');
    endDate = moment(endDate).format('YYYY-MM-DD');
    while (currentDate <= endDate) {
      listAllDate.push(currentDate);
      currentDate = moment(currentDate).add(1, 'd').format('YYYY-MM-DD')
    }
    this.setState({listAllDate})
  }

  async getDataDoctor() {
    let queryStr = '';
    queryStr += `${'&bacsikham={0}'.format(true)}`;
    const apiResponse = await getAll(1, 0, queryStr);
    if (apiResponse) {
      this.setState({ dataDoctor: apiResponse.docs });
    }
  }

  async getDataFilter() {
    let queryStr = '';
    queryStr += `${'&ql_thoigian_id={0}'.format(this.state._idLich)}`;
    queryStr += `${'&sort_by=ngay'}`;
    const apiResponse = await getAllLichLamViec(1, 0, queryStr);
    if (apiResponse) {
      this.setState({ dataCalendar: apiResponse.docs });
    }
  }

  toggleModal = async () => {
    const { showModal } = this.state;
    if(showModal){
      this.setState({showModal: !showModal})
    }else{
      let listFilterDate = this.getListFilterData();
      await this.setState({
        showModal: !showModal, _id: '', casang: false, cachieu: false, catoi: false, listFilterDate
      })
      this.formRef.current.resetFields();
    }
  };

  getListFilterData = (date) => {
    let {listAllDate, dataCalendar} = this.state;
    let arrDate = dataCalendar.map(data => moment(data.ngay).format('YYYY-MM-DD'))
    let listFilterDate = listAllDate.filter(data => {
      return arrDate.indexOf(data) === -1 || (date === data)
    })

    return listFilterDate
  }

  async edit(value) {
    let listFilterDate = this.getListFilterData(moment(value.ngay).format('YYYY-MM-DD'));
    await this.setState({
      showModal: true,
      _id: value._id,
      casang: value.casang,
      cachieu: value.cachieu,
      catoi: value.catoi,
      listFilterDate,
      ngayle: value.ngayle ? value.ngayle : false,
    });

    this.formRef.current.setFieldsValue({
      ngay: moment(value.ngay).format('YYYY-MM-DD'),
      casang_bacsy_id: value.casang_bacsy_id.map(data => data._id),
      cachieu_bacsy_id: value.cachieu_bacsy_id.map(data => data._id),
      catoi_bacsy_id: value.catoi_bacsy_id.map(data => data._id)
    });
  }

  formatActionCell(value) {
    return (
      <>
        <Tooltip placement="left" title="Cập nhật thông tin" color="#2db7f5">
          <Button
            icon={<EditOutlined/>}
            size="small"
            type="primary"
            className="mr-1"
            onClick={() => this.edit(value)}
          />
        </Tooltip>
        <Popconfirm
          key={value._idLich}
          title="Bạn chắc chắn muốn xoá?"
          onConfirm={() => this.handleDelete(value)}
          okText="Xoá"
          cancelText="Huỷ"
          okButtonProps={{ type: 'danger' }}
        >
          <Tooltip placement="right" title="Xóa dữ liệu" color="#f50">
            <Button icon={<DeleteOutlined/>} type="danger" size="small" className="mr-1"/>
          </Tooltip>
        </Popconfirm>
      </>
    );
  }

  onChangeCa = e => {
    this.setState({
      [e.target.name]: e.target.checked,
    });
  };

  async handleDelete(value) {
    const apiResponse = await delByIdLichLamViec(value._id);
    if (apiResponse) {
      let {listFilterDate, dataCalendar} = this.state
      listFilterDate = listFilterDate.filter(data => data !== moment(value.ngay).format('YYYY-MM-DD'))
      dataCalendar = dataCalendar.filter(data => data._id !== value._id)
      this.setState({listFilterDate, dataCalendar})
      message.success('Xoá dữ liệu thành công');
    }
  }

  handleSaveData = async data => {
    let { _id, casang, cachieu, catoi, _idLich, ngayle } = this.state;
    data.ql_thoigian_id = _idLich;
    data.casang = casang;
    data.cachieu = cachieu;
    data.catoi = catoi;
    data.casang_bacsy_id = casang ? data.casang_bacsy_id : data.casang_bacsy_id = [];
    data.cachieu_bacsy_id = cachieu ? data.cachieu_bacsy_id : data.cachieu_bacsy_id = [];
    data.catoi_bacsy_id = catoi ? data.catoi_bacsy_id : data.catoi_bacsy_id = [];
    data.ngay = data.ngay;
    data.ngayle = ngayle ? ngayle : false;
    if(data.ngayle) {
      data.catoi = false;
      data.catoi_bacsy_id = [];
    }

    if (!_id) {
      const apiResponse = await addLichLamViec(data);
      if (apiResponse) {
        this.setState({ showModal: false });
        this.getDataFilter();
        message.success('Thêm mới dữ liệu thành công');
      }
    } else {
      // edit
      const apiResponse = await updateByIdLichLamViec(_id, data);
      if (apiResponse) {
        const dataCalendar = this.state.dataCalendar.map(data => {
          if (data._id === apiResponse._id) {
            return apiResponse;
          }
          return data;
        });
        this.setState({dataCalendar, showModal: false})
        message.success('Chỉnh sửa dữ liệu thành công');
      }
    }
  };

  render() {
    const { loading, myPermission } = this.props;
    const { _id, dataCalendar, dataDoctor, listFilterTime, listFilterDate, ngaybatdau, ngayketthuc } = this.state;
    return (
      <div>
        <Box
          title='Phân công lịch làm việc của bác sĩ'
          boxActions={
            <Button
              type='primary'
              onClick={this.toggleModal}
              className='pull-right'
              size='small'
              icon={<PlusOutlined />}
            >
              Thêm
            </Button>
          }
        >
          <Form size='small' className='form-info' ref={this.formDate} layout='vertical'>
            <Divider orientation='left'>Thời gian phân công công việc</Divider>
            <Row gutter={10}>
              <Col {...layoutCol}>
                <Form.Item label='Ngày bắt đầu phân công' name='ngaybatdau'>
                  <DatePicker format='DD-MM-YYYY' disabled className='w-full' />
                </Form.Item>
              </Col>
              <Col {...layoutCol}>
                <Form.Item label='Ngày kết thúc' name='ngayketthuc'>
                  <DatePicker format='DD-MM-YYYY' disabled className='w-full' />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Form
            size='small'
            className='form-info'
            ref={this.formRef}
            id='formSub'
            name='formSub'
            onValuesChange={this.onValuesChange}
            layout='vertical'
            onFinish={this.handleSaveData}
          >
            <Divider orientation='left'>Lịch làm việc chi tiết cho bác sĩ</Divider>
            <Card size='small' md='24' bordered>
              <Table
                loading={loading}
                bordered
                columns={this.columns}
                dataSource={dataCalendar}
                size='small'
                rowKey='_id'
                pagination={false}
              />
            </Card>
          </Form>
        </Box>

        <Modal
          title={_id ? 'Chỉnh sửa lịch làm việc ' : 'Thêm mới lịch làm việc'}
          visible={this.state.showModal}
          onCancel={loading ? () => null : this.toggleModal}
          footer={[
            <Button
              key={1}
              size='small'
              onClick={this.toggleModal}
              disabled={loading}
              type='danger'
              icon={<CloseOutlined />}
            >
              Huỷ
            </Button>,
            <Button
              key={2}
              size='small'
              type='primary'
              htmlType='submit'
              form='formModal'
              loading={loading}
              icon={<SaveOutlined />}
            >
              {_id ? 'Cập nhật' : 'Lưu'}
            </Button>,
          ]}
        >
          <Form
            ref={this.formRef}
            onFinish={this.handleSaveData}
            id='formModal'
            name='formModal'
            autoComplete='off'
            labelAlign='right'
          >
            <Form.Item name='ngayle' label='Ngày lễ' labelCol={{ span: 7 }} hasFeedback>
              <Checkbox
                name='ngayle'
                checked={this.state?.ngayle}
                onChange={(e) => this.setState({ ngayle: e.target.checked })}
              />
            </Form.Item>
            <Form.Item
              name='ngay'
              label='Ngày phân công'
              labelCol={{ span: 7 }}
              hasFeedback
              rules={[{ required: true, message: 'Ngày phân công là bắt buộc' }]}
              validateTrigger={['onBlur', 'onChange']}
            >
              <Select placeholder='Danh sách ngày' disabled={loading} dropdownClassName='small'>
                {listFilterDate?.map((data) => (
                  <Select.Option style={{ width: '80%' }} key={data} value={data}>
                    {moment(data).format('DD-MM-YYYY')}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Row>
              <Form.Item
                name='casang'
                style={{
                  width: '20%',
                }}
              >
                <Checkbox name='casang' checked={this.state.casang} onChange={this.onChangeCa}>
                  Ca sáng
                </Checkbox>
              </Form.Item>
              {this.state.casang === true ? (
                <Form.Item
                  name='casang_bacsy_id'
                  hasFeedback
                  rules={[{ required: true, message: 'Bác sĩ là bắt buộc' }]}
                  style={{
                    width: '80%',
                  }}
                >
                  <Select
                    className='w-full'
                    mode='multiple'
                    placeholder='Danh sách bác sĩ'
                    disabled={loading}
                    dropdownClassName='small'
                  >
                    {dataDoctor?.map((data) => (
                      <Select.Option key={data?._id} value={data?._id}>
                        {data?.tennv}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              ) : null}
            </Row>
            <Row>
              <Form.Item
                name='cachieu'
                style={{
                  width: '20%',
                }}
              >
                <Checkbox name='cachieu' checked={this.state.cachieu} onChange={this.onChangeCa}>
                  Ca chiều
                </Checkbox>
              </Form.Item>
              {this.state.cachieu === true ? (
                <Form.Item
                  name='cachieu_bacsy_id'
                  hasFeedback
                  rules={[{ required: true, message: 'Bác sĩ là bắt buộc' }]}
                  style={{
                    width: '80%',
                  }}
                >
                  <Select
                    mode='multiple'
                    className='w-full'
                    placeholder='Danh sách bác sĩ'
                    disabled={loading}
                    dropdownClassName='small'
                  >
                    {dataDoctor?.map((data) => (
                      <Select.Option key={data?._id} value={data?._id}>
                        {data?.tennv}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              ) : null}
            </Row>
            {!this.state?.ngayle ? (
              <Row>
                <Form.Item name='catoi' style={{ width: '20%' }}>
                  <Checkbox name='catoi' checked={this.state.catoi} onChange={this.onChangeCa}>
                    Ca tối
                  </Checkbox>
                </Form.Item>
                {this.state.catoi === true ? (
                  <Form.Item
                    name='catoi_bacsy_id'
                    hasFeedback
                    rules={[{ required: true, message: 'Bác sĩ là bắt buộc' }]}
                    style={{
                      width: '80%',
                    }}
                  >
                    <Select
                      mode='multiple'
                      className='w-full'
                      placeholder='Danh sách bác sĩ'
                      disabled={loading}
                      dropdownClassName='small'
                    >
                      {dataDoctor?.map((data) => (
                        <Select.Option key={data?._id} value={data?._id}>
                          {data?.tennv}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                ) : null}
              </Row>
            ) : null}
          </Form>
        </Modal>

        <LichBacSiNghi ngaybatdau={ngaybatdau} ngayketthuc={ngayketthuc} nhanviens={dataDoctor} />
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  loading: makeGetLoading(),
  myPermission: makeGetPermission(),
});

const withConnect = connect(mapStateToProps);
export default compose(withConnect)(ChiTietLich);


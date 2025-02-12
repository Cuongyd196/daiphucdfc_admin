import React from 'react';
import moment from 'moment';
import { Button, Form, Table, Popconfirm, message, Modal, Card, Tooltip } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  CloseOutlined,
  SaveOutlined, EyeOutlined,
} from '@ant-design/icons';

import { connect } from 'react-redux';
import queryString from 'query-string';
import { stringify } from 'qs';
import { createStructuredSelector } from 'reselect';

import { add, getAll, delById, updateById } from '@services/qlthoigianlamviec/qlthoigianService';
import { PAGINATION_CONFIG } from '@constants';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';
import { dateFormatter } from '@commons/dateFormat';
import DatePicker from 'antd/es/date-picker';
import { Link } from 'react-router-dom';
import { URL } from '@url';
import { makeGetPermission } from '@containers/Layout/HeaderComponent/HeaderProvider/selectors';

class QLThoiGian extends React.Component {
  columns = [
    {
      title: 'STT',
      render: (value, row, index) => (this.state.page - 1) * this.state.limit + (index + 1),
      align: 'center',
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'ngaybatdau',
      render: value => dateFormatter(value),
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'ngayketthuc',
      render: value => dateFormatter(value),
    },
    {
      title: 'Người tạo',
      dataIndex: 'nguoitao_id',
      render: value => value.full_name,
      align: 'center',
    },
    {
      title: 'Hành động',
      width: 120,
      align: 'center',
      render: value => this.formatActionCell(value),
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      dataRes: [],
      page: 1,
      limit: 10,
      totalDocs: 0,
      _id: '',
    };
    this.formRef = React.createRef();
    this.url = 'quan-ly-thoi-gian';
  }

  async componentDidMount() {
    this.getDataFilter();
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.search !== prevProps.location.search) {
      this.getDataFilter();
    }
  }

  async getDataFilter() {
    const apiResponse = await getAll(this.state.page, this.state.limit, '');
    if (apiResponse) {
      const dataRes = apiResponse.docs;
      this.setState({
        dataRes,
        totalDocs: apiResponse.totalDocs,
        limit: apiResponse.limit,
        page: apiResponse.page,
      });
    }
  }

  async handleDelete(value) {
    const apiResponse = await delById(value._id);
    if (apiResponse) {
      this.getDataFilter();
      message.success('Xoá dữ liệu thành công');
    }
  }

  toggleModal = async () => {
    const { showModal } = this.state;
    await this.setState({ showModal: !showModal, _id: '' });
    this.formRef.current.resetFields();
  };

  formatActionCell(value) {
    let { myPermission } = this.props;
    return (
      <>
        <Tooltip placement="left" title="Xem chi tiết" color="#2db7f5">
          <Link to={URL.QL_THOI_GIAN_ID.format(value?._id)}>
            <Button
              icon={<EyeOutlined/>}
              size="small"
              type="primary"
              className="mr-1"/>
          </Link>
        </Tooltip>

        {
          myPermission?.[this.url]?.sua &&
          <Tooltip placement="left" title="Cập nhật thông tin" color="#2db7f5">
            <Button
              icon={<EditOutlined/>}
              size="small"
              type="primary"
              className="mr-1"
              onClick={() => this.edit(value)}/>
          </Tooltip>
        }
        {
          myPermission?.[this.url]?.xoa &&
          <Popconfirm
            key={value._id}
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
        }
      </>
    );
  }

  async edit(data) {
    await this.setState({ showModal: true, _id: data._id });
    this.formRef.current.setFieldsValue({
      ...data,
      ngaybatdau: moment(data.ngaybatdau),
      ngayketthuc: moment(data.ngayketthuc),
    });
  }

  handleRefresh = (newQuery, changeTable) => {
    const { location, history } = this.props;
    const { pathname } = location;
    let { page, limit } = this.state;
    let objFilterTable = { page, limit };
    if (changeTable) {
      newQuery = queryString.parse('');
      delete newQuery.page;
      delete newQuery.limit;
    }
    newQuery = Object.assign(objFilterTable, newQuery);
    history.push({ pathname, search: stringify({ ...newQuery }, { arrayFormat: 'repeat' }) });
  };

  onChangeTable = page => {
    this.setState({ page: page.current, limit: page.pageSize }, () => this.handleRefresh({}, true));
  };

  handleSaveData = async data => {
    const { _id } = this.state;
    if (moment(data.ngaybatdau) > moment(data.ngayketthuc)) {
      message.warning('Ngày kết thúc nhỏ hơn ngày bắt đầu!');
      return;
    }
    if (!_id) {
      // create
      const apiResponse = await add(data);
      if (apiResponse) {
        this.setState({ showModal: false });
        this.getDataFilter();
        message.success('Thêm mới dữ liệu thành công');
      }
    } else {
      // edit
      const apiResponse = await updateById(_id, data);
      if (apiResponse) {
        const dataRes = this.state.dataRes.map(data => {
          if (data._id === apiResponse._id) {
            return apiResponse;
          }
          return data;
        });
        await this.setState({ dataRes, showModal: false });
        message.success('Chỉnh sửa dữ liệu thành công');
      }
    }
  };

  disabledDate(current) {
    return current && current < moment().startOf('day');
  }

  render() {
    const { loading } = this.props;
    const { dataRes, totalDocs, page, limit, _id } = this.state;

    return (
      <div>
        <Card
          size="small"
          title={<span><UnorderedListOutlined className="icon-card-header"/> &nbsp;Danh sách lịch làm việc</span>}
          md="24"
          bordered
          extra={
            <div>
              <Button
                type="primary"
                onClick={this.toggleModal}
                className="pull-right"
                size="small"
                icon={<PlusOutlined/>}>
                Thêm
              </Button>
            </div>
          }>
          <Table
            loading={loading}
            bordered
            columns={this.columns}
            dataSource={dataRes}
            size="small"
            rowKey="_id"
            pagination={{
              ...PAGINATION_CONFIG,
              current: page,
              pageSize: limit,
              total: totalDocs,
            }}
            onChange={this.onChangeTable}
          />
        </Card>
        <Modal
          title={_id ? 'Chỉnh sửa lịch làm việc' : 'Thêm mới lịch làm việc'}
          visible={this.state.showModal}
          onCancel={loading ? () => null : this.toggleModal}
          footer={[
            <Button
              key={1}
              size="small"
              onClick={this.toggleModal}
              disabled={loading}
              type="danger"
              icon={<CloseOutlined/>}>
              Huỷ
            </Button>,
            <Button
              key={2}
              size="small"
              type="primary"
              htmlType="submit"
              form="formModal"
              loading={loading}
              icon={<SaveOutlined/>}>
              {_id ? 'Cập nhật' : 'Lưu'}
            </Button>,
          ]}>
          <Form
            ref={this.formRef}
            id="formModal"
            name="formModal"
            autoComplete="off"
            onFinish={this.handleSaveData}
            labelAlign="right">
            <Form.Item
              label="Ngày bắt đầu"
              name="ngaybatdau"
              labelCol={{ span: 11 }}
              rules={[{ required: true, message: 'Ngày bắt đầu không được để trống' }]}>
              <DatePicker disabled={loading} format="DD-MM-YYYY"/>
            </Form.Item>
            <Form.Item
              label="Ngày kết thúc"
              name="ngayketthuc"
              labelCol={{ span: 11 }}
              rules={[{ required: true, message: 'Ngày kết thúc không được để trống' }]}>
              <DatePicker disabled={loading} format="DD-MM-YYYY"/>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  loading: makeGetLoading(),
  myPermission: makeGetPermission(),
});

export default connect(mapStateToProps)(QLThoiGian);

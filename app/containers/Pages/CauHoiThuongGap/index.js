import React from 'react';
import { Input, Button, Form, Table, Popconfirm, message, Modal, InputNumber, Card, Tooltip } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  CloseOutlined,
  SaveOutlined,
} from '@ant-design/icons';

import { connect } from 'react-redux';
import queryString from 'query-string';
import { stringify } from 'qs';
import { createStructuredSelector } from 'reselect';

import Search from '@components/Search/Search';
import { add, getAll, deleteById, updateById } from '@services/cauhoi/cauhoiService';
import { PAGINATION_CONFIG } from '@constants';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';
import { dateFormatter } from '@commons/dateFormat';
import { makeGetPermission } from '@containers/Layout/HeaderComponent/HeaderProvider/selectors';

class CauHoiThuongGap extends React.Component {
  columns = [
    {
      title: 'STT',
      render: (value, row, index) => (this.state.page - 1) * this.state.limit + (index + 1),
      align: 'center',
    },
    {
      title: 'Câu hỏi',
      dataIndex: 'cauhoi',
    },
    {
      title: 'Trả lời',
      dataIndex: 'traloi',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      render: value => dateFormatter(value),
      align: 'center',
    },
    {
      title: 'Hành động',
      width: 100,
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
    this.url = 'cau-hoi-thuong-gap';
  }

  componentDidMount() {
    this.getDataFilter();
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.search !== prevProps.location.search) {
      this.getDataFilter();
    }
  }

  async getDataFilter() {
    let search = queryString.parse(this.props.location.search);
    let page = parseInt(search.page ? search.page : this.state.page);
    let limit = parseInt(search.limit ? search.limit : this.state.limit);
    let queryStr = '';
    queryStr += `${search.cauhoi ? '&cauhoi[like]={0}'.format(search.cauhoi) : ''}`;
    const apiResponse = await getAll(page, limit, queryStr);
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
    const apiResponse = await deleteById(value._id);
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

  handleSaveData = async data => {
    let cauhoi = data.cauhoi;
    if (!cauhoi.trim()) {
      this.formRef.current.setFieldsValue({ cauhoi: cauhoi.trim() });
      this.formRef.current.validateFields();
      return;
    }

    const { _id } = this.state;
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

  formatActionCell(value) {
    let { myPermission } = this.props;
    return (
      <>
        {
          myPermission?.[this.url].sua &&
          <Tooltip placement="left" title="Cập nhật thông tin" color="#2db7f5">
            <Button
              icon={<EditOutlined/>}
              size="small"
              type="primary"
              className="mr-1"
              onClick={() => this.edit(value)}
            />
          </Tooltip>
        }

        {
          myPermission?.[this.url].xoa &&
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
    this.formRef.current.setFieldsValue(data);
  }

  handleRefresh = (newQuery, changeTable) => {
    const { location, history } = this.props;
    const { pathname } = location;
    let { page, limit } = this.state;
    let objFilterTable = { page, limit };
    if (changeTable) {
      newQuery = queryString.parse(this.props.location.search);
      delete newQuery.page;
      delete newQuery.limit;
    }
    newQuery = Object.assign(objFilterTable, newQuery);
    history.push({ pathname, search: stringify({ ...newQuery }, { arrayFormat: 'repeat' }) });
  };

  onChangeTable = page => {
    this.setState({ page: page.current, limit: page.pageSize }, () => this.handleRefresh({}, true));
  };

  render() {
    const { loading, myPermission } = this.props;
    const { dataRes, totalDocs, page, limit, _id } = this.state;

    const dataSearch = [{
      name: 'cauhoi',
      label: 'Câu hỏi muốn tìm',
      type: 'text',
      operation: 'like',
    },
    ];

    return (
      <div>
        <Card size="small"
              title={<span><UnorderedListOutlined
                className="icon-card-header"/> &nbsp;Danh sách câu hỏi thường gặp</span>}
              md="24"
              bordered
              extra={
                <div>
                  <Button
                    type="primary"
                    onClick={this.toggleModal}
                    className="pull-right"
                    size="small"
                    icon={<PlusOutlined/>}
                  >
                    Thêm
                  </Button>
                </div>
              }
        >
          <Search onFilterChange={this.handleRefresh} dataSearch={dataSearch}/>
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
          title={_id ? 'Chỉnh sửa câu hỏi' : 'Thêm mới câu hỏi'}
          visible={this.state.showModal}
          onCancel={loading ? () => null : this.toggleModal}
          footer={[
            <Button
              key={1}
              size="small"
              onClick={this.toggleModal}
              disabled={loading}
              type="danger"
              icon={<CloseOutlined/>}
            >
              Huỷ
            </Button>,
            <Button
              key={2}
              size="small"
              type="primary"
              htmlType="submit"
              form="formModal"
              loading={loading}
              icon={<SaveOutlined/>}
            >
              {_id ? 'Lưu' : 'Thêm'}
            </Button>,
          ]}
        >
          <Form
            ref={this.formRef}
            id="formModal"
            name="formModal"
            autoComplete="off"
            onFinish={this.handleSaveData}
            labelAlign="right"
          >
            <Form.Item
              label="Câu hỏi"
              name="cauhoi"
              hasFeedback
              labelCol={{ span: 6 }}
              rules={[{ required: true, whitespace: true, message: 'Câu hỏi không được để trống' }]}
            >
              <Input.TextArea placeholder="Nhập câu hỏi" disabled={loading}/>
            </Form.Item>
            <Form.Item label="Câu trả lời" name="traloi" labelCol={{ span: 6 }}
                       rules={[{ required: true, whitespace: true, message: 'Câu trả lời không được để trống' }]}
                       hasFeedback>
              <Input.TextArea placeholder="Nhập câu trả lời" disabled={loading}/>
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

export default connect(mapStateToProps)(CauHoiThuongGap);

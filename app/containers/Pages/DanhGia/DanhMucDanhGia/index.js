import React, { Component } from 'react';
import {
  Input,
  Button,
  Form,
  Table,
  InputNumber,
  Popconfirm,
  message,
  Card,
  Tooltip,
  Modal,
  Checkbox,
  Switch,
} from 'antd';
import {
  DeleteOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  CloseOutlined,
  SaveOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { getAll, add, updateById, delById } from '@services/danhmucchung/danhgia/danhgiaService';
import { PAGINATION_CONFIG, RULE } from '@constants';
import { createStructuredSelector } from 'reselect';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';
import { connect } from 'react-redux';
import Search from '@components/Search/Search';
import { stringify } from 'qs';
import queryString from 'query-string';
import { compose } from 'redux';
import { makeGetPermission } from '@containers/Layout/HeaderComponent/HeaderProvider/selectors';

class DanhMucDanhGia extends Component {

  columns = [
    {
      title: 'STT',
      render: (value, row, index) => (this.state.page - 1) * this.state.limit + (index + 1),
      width: 50,
      align: 'center',
    },
    {
      title: 'Tên đánh giá',
      dataIndex: 'tendanhgia',
    },
    {
      title: 'Số thứ tự',
      dataIndex: 'sothutu',
      align: 'center',
      width: 90,
    },
    {
      title: 'Trạng thái',
      width: 120,
      align: 'center',
      dataIndex: 'trangthai',
      render: (value) => <Checkbox checked={value}/>,
    },
    {
      title: 'Hành động',
      render: (value) => this.formatActionCell(value),
      width: 90,
      align: 'center',
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
    this.url = 'danh-gia-dich-vu';
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
    queryStr += `${search.tendanhgia ? '&tendanhgia[like]={0}'.format(search.tendanhgia) : ''}`;
    queryStr += `${search.trangthai ? '&trangthai={0}'.format(search.trangthai) : ''}`;
    const apiResponse = await getAll(page, limit, queryStr);
    const dataRes = apiResponse.docs;
    if (apiResponse) {
      this.setState({
        dataRes,
        totalDocs: apiResponse.totalDocs,
        limit: apiResponse.limit,
        page: apiResponse.page,
      });
    }
  }

  async edit(data) {
    await this.setState({ showModal: true, _id: data._id, trangthai: data.trangthai === true ? 1 : 2 });
    this.formRef.current.setFieldsValue({ ...data });
  }

  async handleDelete(value) {
    const apiResponse = await delById(value._id);
    if (apiResponse) {
      this.getDataFilter();
      message.success('Xoá dữ liệu thành công');
    }
  }

  formatActionCell(value) {
    let { myPermission } = this.props;
    return <>
      {
        myPermission?.[this.url].sua &&
        <Tooltip title="Xem chi tiết" color="#2db7f5">
          <Button icon={<EditOutlined/>} size='small' type="primary" className='mr-1'
                  onClick={() => this.edit(value)}></Button>
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
    </>;
  }

  toggleModal = async () => {
    const { showModal } = this.state;
    await this.setState({ showModal: !showModal, _id: '' });
    this.formRef.current.resetFields();
  };

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
    history.push({
      pathname, search: stringify({ ...newQuery }, { arrayFormat: 'repeat' }),
    });
  };

  onChangeTable = (page) => {
    this.setState({ page: page.current, limit: page.pageSize },
      () => {
        this.handleRefresh({}, true);
      });
  };

  handleSaveData = async data => {
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

  render() {
    const { loading, myPermission } = this.props;

    const { dataRes, totalDocs, page, limit, _id } = this.state;
    const dataSearch = [
      {
        type: 'text',
        name: 'tendanhgia',
        label: 'Tên đánh giá',
      },
      {
        type: 'select',
        name: 'trangthai',
        label: 'Trạng thái',
        options: [
          { label: 'Hoạt động', value: 'true' },
          { label: 'Ngừng hoạt động', value: 'false' },
        ],
        key: 'value',
        value: 'label',
      }];
    return <div>
      <Card size="small" title={<span>
        <UnorderedListOutlined className="icon-card-header"/> &nbsp;Danh mục đánh giá
      </span>} extra={
        <div>
          {
            myPermission?.[this.url].them &&
            <Button type="primary" onClick={this.toggleModal} className="pull-right" size="small" icon={<PlusOutlined/>}>
              Thêm
            </Button>
          }

        </div>
      }>
        <Search onFilterChange={this.handleRefresh} dataSearch={dataSearch}/>
        <Table loading={loading} bordered columns={this.columns} dataSource={dataRes}
               size="small" rowKey="_id"
               pagination={{
                 ...PAGINATION_CONFIG,
                 current: page,
                 pageSize: limit,
                 total: totalDocs,
               }}
               onChange={this.onChangeTable}/>
      </Card>
      <Modal
        title={_id ? 'Chỉnh sửa' : 'Thêm mới'}
        visible={this.state.showModal}
        footer={null}
        onCancel={loading ? () => null : this.toggleModal}
        footer={[
          <Button size="small" onClick={this.toggleModal} disabled={loading} type="danger" icon={<CloseOutlined/>}>
            Huỷ
          </Button>,
          <Button size="small" type="primary" htmlType="submit" form="formModal" loading={loading}
                  icon={<SaveOutlined/>}
          >
            {_id ? 'Lưu' : 'Thêm'}
          </Button>,
        ]}>
        <Form ref={this.formRef} id="formModal" name="formModal" autoComplete="off" labelAlign="right"
              onFinish={this.handleSaveData}>
          <Form.Item label="Tên đánh giá" name="tendanhgia" hasFeedback labelCol={{ span: 8 }} rules={[RULE.REQUIRED]}>
            <Input placeholder="Nhập tên đánh giá" disabled={loading}/>
          </Form.Item>
          <Form.Item label="Số thứ tự" name="sothutu" labelCol={{ span: 8 }} hasFeedback rules={[RULE.NUMBER_FLOAT]}>
            <InputNumber placeholder="Nhập thứ tự" disabled={loading}/>
          </Form.Item>
          <Form.Item label="Trạng thái đánh giá" name="trangthai"
                     labelCol={{ span: 8 }} valuePropName="checked">
            <Switch/>
          </Form.Item>
        </Form>
      </Modal>
    </div>;
  }
}

const mapStateToProps = createStructuredSelector({
  loading: makeGetLoading(),
  myPermission: makeGetPermission(),
});


const withConnect = connect(mapStateToProps);
export default compose(withConnect)(DanhMucDanhGia);



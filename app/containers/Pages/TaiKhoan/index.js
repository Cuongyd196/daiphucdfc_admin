import React, { Component, Fragment } from 'react';
import {
  Input,
  Button,
  Form,
  Table,
  Popconfirm,
  message,
  Modal,
  Card,
  Tooltip,
  Row,
  Col,
  DatePicker, Select, Switch, Checkbox,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  CloseOutlined,
  SaveOutlined,
  CheckOutlined,
} from '@ant-design/icons';

import { add, getAll, delById, updateById } from '@services/userService';
import { PAGINATION_CONFIG, ROLE_OPTIONS } from '@constants';
import { createStructuredSelector } from 'reselect';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';
import { connect } from 'react-redux';
import Search from '@components/Search/Search';
import { stringify } from 'qs';
import queryString from 'query-string';
import moment from 'moment';
import { getAll as getAll_Role } from '@services/phanquyenvaitroService';
import { makeGetPermission } from '@containers/Layout/HeaderComponent/HeaderProvider/selectors';

const { Option, OptGroup } = Select;

class TaiKhoan extends Component {

  columns = [
    {
      title: 'STT',
      render: (value, row, index) => (this.state.page - 1) * this.state.limit + (index + 1),
      align: 'center',
    },
    {
      title: 'Họ tên',
      dataIndex: 'full_name',
    },
    {
      title: 'Tài khoản',
      dataIndex: 'username',
    },
    {
      title: 'Điện thoại',
      dataIndex: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Vai trò',
      dataIndex: ['role_id', 'tenvaitro'],
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      render: (value) => <Checkbox checked={value}/>,
      align: 'center',
    },
    {
      title: '#',
      render: (value) => this.formatActionCell(value),
      width: 100,
      align: 'center',
    },
  ];

  dataSearch = [
    {
      type: 'text',
      name: 'full_name',
      label: 'Họ tên',
    }, {
      type: 'text',
      name: 'username',
      label: 'Tài khoản',
    }, {
      type: 'text',
      name: 'phone',
      label: 'Điện thoại',
    }, {
      type: 'select',
      name: 'role',
      options: ROLE_OPTIONS,
      label: 'Vai trò',
      key: 'value',
      value: 'label',
    },
    {
      type: 'select',
      name: 'active',
      options: [
        { label: 'Hoạt động', value: 'true' },
        { label: 'Ngừng hoạt động', value: 'false' },
      ],
      label: 'Trạng thái',
      key: 'value',
      value: 'label',
    }];

  constructor(props) {
    super(props);
    this.state = {
      dataRes: [],
      page: 1,
      limit: 10,
      totalDocs: 0,
      _id: '',
      role: '',
      active: true,
      dataRes_Role: [],
    };
    this.formRef = React.createRef();
    this.url = 'tai-khoan';
  }

  componentDidMount() {
    this.getDataFilter();
    this.getAllRole();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.location.search !== prevProps.location.search) {
      this.getDataFilter();
    }
  }

  async getDataFilter() {
    let search = queryString.parse(this.props.location.search);
    let page = parseInt(search.page ? search.page : this.state.page);
    let limit = parseInt(search.limit ? search.limit : this.state.limit);
    let queryStr = '';
    queryStr += `${search.full_name ? '&full_name[like]={0}'.format(search.full_name) : ''}`;
    queryStr += `${search.username ? '&username[like]={0}'.format(search.username) : ''}`;
    queryStr += `${search.phone ? '&phone[like]={0}'.format(search.phone) : ''}`;
    queryStr += `${search.role ? '&role={0}'.format(search.role) : ''}`;
    queryStr += `${search.active ? '&active={0}'.format(search.active) : ''}`;
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

  async getAllRole() {
    const apiResponse = await getAll_Role();
    if (apiResponse) {
      const dataRes_Role = apiResponse.docs;
      this.setState({
        dataRes_Role,
      });
    }
  }

  async handleDelete(value) {
    const apiResponse = await delById(value._id);
    if (apiResponse) {
      this.getDataFilter();
      message.success('Xoá tài khoản thành công');
    }
  }

  toggleModal = async () => {
    const { showModal } = this.state;
    await this.setState({ showModal: !showModal,  _id: '', role: '', active: true });
    this.formRef.current.resetFields();
  };

  handleSaveData = async (data) => {
    const { _id } = this.state;
    if (_id) {
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
        message.success('Cập nhật tài khoản thành công');
      }

    } else {
      // create
      const apiResponse = await add(data);
      if (apiResponse) {
        this.setState({ showModal: false });
        this.getDataFilter();
        message.success('Thêm mới tài khoản thành công');
      }
    }
  };

  formatActionCell(value) {
    let { myPermission } = this.props;
    return <>
      {myPermission?.[this.url]?.sua &&
      <Tooltip placement="left" title={'Cập nhật thông tin'} color="#2db7f5">
        <Button icon={<EditOutlined/>} size='small' type="primary" className='mr-1' //ant-tag-cyan
                onClick={() => this.edit(value)}></Button>
      </Tooltip>}
      {myPermission?.[this.url]?.xoa &&
      <Popconfirm key={value._id} title="Bạn chắc chắn muốn xoá?"
                  onConfirm={() => this.handleDelete(value)}
                  cancelText='Huỷ' okText='Xoá' okButtonProps={{ type: 'danger' }}>
        <Tooltip placement="right" title={'Xóa dữ liệu'} color="#f50">
          <Button icon={<DeleteOutlined/>} type='danger' size='small' className="mr-1"></Button>
        </Tooltip>
      </Popconfirm>}
    </>;
  }

  async edit(data) {
    data.birthday = data.birthday ? moment(data.birthday) : '';
    await this.setState({ showModal: true, _id: data._id, active: data.active });
    data.role_id = data.role_id?._id;
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

  render() {
    const { loading, myPermission } = this.props;
    const { dataRes, dataRes_Role, totalDocs, page, limit, _id, role } = this.state;

    return <div>

      <Card size="small" title={<span>
        <UnorderedListOutlined className="icon-card-header"/> &nbsp;Danh sách tài khoản
      </span>} md="24" bordered extra={<div>
        {
          myPermission?.[this.url]?.them &&
          <Button type="primary" onClick={this.toggleModal} className='pull-right' size="small"
                  icon={<PlusOutlined/>}>Thêm</Button>
        }

      </div>}>
        <Search onFilterChange={this.handleRefresh} dataSearch={this.dataSearch}/>
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

      <Modal title={_id ? 'Cập nhật tài khoản' : 'Thêm mới tài khoản'}
             visible={this.state.showModal}
             width='760px'
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
               <Button key={2} size="small" type="primary" htmlType="submit" form="formModal" loading={loading}
                       icon={<SaveOutlined/>}>
                 {_id ? 'Lưu' : 'Thêm'}
               </Button>,
             ]}>
        <Form ref={this.formRef} id="formModal" name='formModal' autoComplete='off'
              onFinish={this.handleSaveData} labelAlign="right" layout='vertical' size='small' colon={true}
        >
          <Row gutter={10}>
            <Col xs={24} sm={12}>
              <Form.Item label="Họ tên" name="full_name" validateTrigger={['onChange', 'onBlur']}
                         rules={[{ required: true, whitespace: true, message: 'Họ tên không được để trống' }]}>
                <Input placeholder='Nhập họ tên' disabled={loading}/>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Điện thoại" name="phone" validateTrigger={['onChange', 'onBlur']}
                         rules={[{ required: true, whitespace: true, message: 'Điện thoại không được để trống' }]}>
                <Input placeholder='Điện thoại' disabled={loading}/>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item label="Email" name="email" validateTrigger={['onChange', 'onBlur']}
                         rules={[{ required: true, whitespace: true, message: 'Email không được để trống' }]}>
                <Input placeholder='Email' disabled={loading}/>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Ngày sinh" name="birthday">
                <DatePicker className="w-100" format="DD-MM-YYYY" placeholder="Ngày sinh" disabled={loading}/>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Tài khoản" name="username" validateTrigger={['onChange', 'onBlur']}
                         rules={[{ required: true, whitespace: true, message: 'Tài khoản không được để trống' }]}>
                <Input placeholder='Nhập tài khoản' disabled={_id}/>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Vai trò" name="role_id"
                         validateTrigger={['onChange', 'onBlur']}
                         rules={[{ required: true, message: 'Vai trò không được bỏ trống' }]}>
                <Select placeholder='Chọn vai trò' disabled={loading} dropdownClassName='small'>
                  {dataRes_Role.map((role, key) => {
                    return <Select.Option key={key} value={role._id}>
                      {role.tenvaitro}
                    </Select.Option>;
                  })}
                </Select>
              </Form.Item>
            </Col>

            {!_id && <>
              <Col xs={24} sm={12}>
                <Form.Item name="password" label="Mật khẩu"
                           rules={[{ required: true, whitespace: true, message: 'Mật khẩu là bắt buộc nhập' }]}>
                  <Input.Password placeholder="Nhập mật khẩu"/>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="confirm"
                  label="Nhập lại mật khẩu"
                  dependencies={['password']}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: 'Nhập lại mât khẩu là bắt buộc nhập!',
                    },
                    ({ getFieldValue }) => ({
                      validator(rule, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }

                        return Promise.reject('Nhập lại mật khẩu không đúng.');
                      },
                    }),
                  ]}
                >
                  <Input.Password/>
                </Form.Item>
              </Col>
            </>
            }

            <Col xs={24}>
              <Form.Item label="Trạng thái tài khoản" name="active" valuePropName="checked">
                <Switch
                  // checkedChildren={<CheckOutlined />}
                  // unCheckedChildren={<CloseOutlined />}
                  // checked={this.state.active}
                />
              </Form.Item>
            </Col>

          </Row>

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

export default withConnect(TaiKhoan);



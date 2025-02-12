import React, { Component } from 'react';
import {
  Statistic,
  Button,
  Select,
  Form,
  Table,
  Popconfirm,
  Input,
  Skeleton,
  message,
  Card,
  Tooltip,
  Modal,
  Switch,
  Checkbox,
} from 'antd';
import {
  UnorderedListOutlined,
  EditOutlined,
  DeleteOutlined,
  CloseOutlined,
  SaveOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { add, deleteById, getAll, updateById } from '@services/danhmucdichvu/giadichvuService';
import { PAGINATION_CONFIG } from '@constants';
import { createStructuredSelector } from 'reselect';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';
import { connect } from 'react-redux';
import Search from '@components/Search/Search';
import { stringify } from 'qs';
import queryString from 'query-string';
import { compose } from 'redux';
import { withDanhMucGia } from '@reduxApp/DanhMucGia/connect';
import { makeGetPermission } from '@containers/Layout/HeaderComponent/HeaderProvider/selectors';

function CustomSkeletonSL(props) {
  const { children, isShowSkeleton, ...rest } = props;
  if (isShowSkeleton) return <Skeleton.Input active size='small'/>;
  return React.cloneElement(children, rest);
}

class GiaDichVu extends Component {
  columns = [
    {
      title: 'Mã dịch vụ',
      dataIndex: 'mahh',
      align: 'center',
    },
    {
      title: 'Mã view',
      dataIndex: 'maview',
      align: 'center',
    },
    {
      title: 'Tên dịch vụ',
      dataIndex: 'tenhh',
    },
    {
      title: 'Giá dịch vụ',
      dataIndex: 'giadichvu',
      align: 'center',
      render: (value) => <Statistic value={value} suffix="VNĐ" valueStyle={{
        fontSize: '12px',
        fontWeight: 'bold',
        color: 'green',
      }}
      />,
    },
    {
      title: 'Nhóm dịch vụ',
      dataIndex: ['manhomdichvu', 'tennhomdichvu'],
    },
    {
      title: 'Loại dịch vụ',
      dataIndex: ['maloaidichvu', 'tenloaidichvu'],
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
      showModal: false,
      kiemtra: 0,
    };
    this.formRef = React.createRef();
    this.url = 'quan-ly-dich-vu';
  }

  formatActionCell(value) {
    let {myPermission} = this.props
    return (
      <>
        { myPermission?.[this.url]?.sua &&
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
        {(value.madmgia) && myPermission?.[this.url]?.xoa || (!value.mahh) && myPermission?.[this.url]?.xoa ?
          <>
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
          </> : <></>
        }
      </>
    );
  }

  toggleModal = async () => {
    const { showModal } = this.state;
    await this.setState({ showModal: !showModal, _id: '' });
    this.formRef.current.resetFields();
  };

  async edit(data) {
    await this.setState({ showModal: true, _id: data._id, kiemtra: ((data.madmgia) || (!data.mahh)) ? 1 : 0 });
    this.formRef.current.setFieldsValue({
      maloaidichvu: data.maloaidichvu ? data.maloaidichvu._id : data.maloaidichvu,
      manhomdichvu: data.manhomdichvu ? data.manhomdichvu._id : data.manhomdichvu,
      tenhh: data.tenhh,
      giadichvu: data.giadichvu,
      madmgia: data.madmgia ? data.madmgia._id : data.madmgia,
      maview: data.maview,
      ghichu: data.ghichu,
    });
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
    let search = queryString.parse(this.props.location.search);
    let page = parseInt(search.page ? search.page : this.state.page);
    let limit = parseInt(search.limit ? search.limit : this.state.limit);
    let queryStr = '';
    queryStr += `${search.mahh ? '&mahh={0}'.format(search.mahh) : ''}`;
    queryStr += `${search.maview ? '&maview[like]={0}'.format(search.maview) : ''}`;
    queryStr += `${search.tenhh ? '&tenhh[like]={0}'.format(search.tenhh) : ''}`;
    queryStr += `${search.maloaidichvu ? '&maloaidichvu={0}'.format(search.maloaidichvu) : ''}`;
    queryStr += `${search.manhomdichvu ? '&manhomdichvu={0}'.format(search.manhomdichvu) : ''}`;
    queryStr += `${search.madmgia ? '&madmgia={0}'.format(search.madmgia) : ''}`;

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

  handleSaveData = async data => {
    let tenhh = data.tenhh;
    if (!tenhh.trim()) {
      this.formRef.current.setFieldsValue({ tenhh: tenhh.trim() });
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

  async handleDelete(value) {
    const apiResponse = await deleteById(value._id);
    if (apiResponse) {
      this.getDataFilter();
      message.success('Xoá dữ liệu thành công');
    }
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
    const { loading, loaidv, nhomdv, dmgia, myPermission } = this.props;

    const { dataRes, totalDocs, page, limit, _id } = this.state;
    const dataSearch = [
      {
        type: 'text',
        name: 'mahh',
        label: 'Mã dịnh vụ',
      },
      {
        type: 'text',
        name: 'maview',
        label: 'Mã view',
      },
      {
        type: 'text',
        name: 'tenhh',
        label: 'Dịch vụ',
      },
      {
        type: 'select',
        name: 'manhomdichvu',
        label: 'Nhóm dịch vụ',
        options: nhomdv,
        key: '_id',
        value: 'tennhomdichvu',
      },
      {
        type: 'select',
        name: 'madmgia',
        label: 'Danh mục giá',
        options: dmgia,
        key: '_id',
        value: 'tendmgia',
      }];
    return <div>
      <Card size="small" title={<span>
        <UnorderedListOutlined className="icon-card-header"/> &nbsp;Danh mục giá dịch vụ
        </span>}
            md="24"
            bordered
            extra={
              <div>
              {
                myPermission?.[this.url]?.them && <Button
                  type="primary"
                  onClick={this.toggleModal}
                  className="pull-right"
                  size="small"
                  icon={<PlusOutlined />}
                >
                  Thêm
                </Button>
              }

            </div>
            }
      >
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
        className="modal_giadichvu"
        title={_id ? 'Chỉnh sửa giá dịch vụ' : 'Thêm mới giá dịch vụ'}
        visible={this.state.showModal}
        onCancel={loading ? () => null : this.toggleModal}
        footer={
          myPermission?.[this.url]?.sua ?
            [<Button
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
            ] : null}
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
            label="Tên dịch vụ"
            name="tenhh"
            hasFeedback
            labelCol={{ span: 6 }}
            rules={[{ required: true, whitespace: true, message: 'Tên dịch vụ không được để trống' }]}
          >
            <Input.TextArea placeholder="Nhập tên dịch vụ"/>
          </Form.Item>
          <Form.Item label="Danh mục giá" name="madmgia"
                     labelCol={{ span: 6 }}
                     rules={this.state.kiemtra === 1 ? [] : [{
                       required: true,
                       whitespace: true,
                       message: 'Danh mục giá không được để trống',
                     }]}
                     validateTrigger={['onChange', 'onBlur']}>
            <CustomSkeletonSL isShowSkeleton={false}>
              <Select placeholder='Chọn danh mục giá' disabled={this.state.kiemtra === 1 ? { loading } : ''}
                      dropdownClassName='small'>
                {dmgia.map((gender, i) => {
                  return <Select.Option key={i} value={gender._id}>
                    {gender.tendmgia}
                  </Select.Option>;
                })}
              </Select>
            </CustomSkeletonSL>
          </Form.Item>

          <Form.Item
            label="Giá dịch vụ"
            name="giadichvu"
            hasFeedback
            rules={[{ required: true, message: 'Giá dịch vụ không được để trống' }]}
            labelCol={{ span: 6 }}>
            <Input placeholder="Nhập giá dịch vụ" type="number"/>
          </Form.Item>
          <Form.Item
            label="Mã view"
            name="maview"
            hasFeedback
            rules={[{ whitespace: true, message: 'Giá dịch vụ không được để trống' }]}
            labelCol={{ span: 6 }}>
            <Input placeholder="Nhập mã view" type="text" disabled={this.state.kiemtra === 0 ? { loading } : ''}/>
          </Form.Item>
          <Form.Item label="Nhóm dịch vụ" name="manhomdichvu"
                     labelCol={{ span: 6 }}
                     validateTrigger={['onChange', 'onBlur']}>
            <CustomSkeletonSL isShowSkeleton={false}>
              <Select placeholder='Chọn nhóm dịch vụ' disabled={this.state.kiemtra === 0 ? { loading } : ''}
                      dropdownClassName='small'>
                {nhomdv.map((gender, i) => {
                  return <Select.Option key={i} value={gender._id}>
                    {gender.tennhomdichvu}
                  </Select.Option>;
                })}
              </Select>
            </CustomSkeletonSL>
          </Form.Item>

          <Form.Item
            label="Ghi chú"
            name="ghichu"
            hasFeedback
            labelCol={{ span: 6 }}
            rules={[{ whitespace: true, message: 'Ghi chú không được để trống' }]}
          >
            <Input.TextArea placeholder="Nhập tên ghi chú" disabled={loading}/>
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
export default compose(withConnect, withDanhMucGia)(GiaDichVu);



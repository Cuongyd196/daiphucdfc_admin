import React, { Component } from 'react';

import {
  Input, Button, Form, Table, InputNumber, Skeleton, Select, Card, Tooltip, Modal, Row, Col, Checkbox,
  Upload, Avatar, Space, message, Image, Switch, Popconfirm 
} from 'antd';
import {
  UnorderedListOutlined,
  EyeOutlined,
  CloseOutlined,
  SaveOutlined,
  DownloadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined 
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { updateById, getAll, delById } from '@services/danhmucchung/nhanvienService';
import { PAGINATION_CONFIG, RULE } from '@constants';
import { createStructuredSelector } from 'reselect';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';
import { connect } from 'react-redux';
import Search from '@components/Search/Search';
import { stringify } from 'qs';
import queryString from 'query-string';
import { compose } from 'redux';
import { withPhai } from '@reduxApp/Phai/connect';
import { uploadImages } from '@services/uploadServices';
import { getBase64 } from '@utils/imageUtil';
import { API } from '@api';
import { makeGetPermission } from '@containers/Layout/HeaderComponent/HeaderProvider/selectors';
import { URL } from '@url';

function CustomSkeleton(props) {
  const { children, isShowSkeleton, ...rest } = props;
  if (isShowSkeleton) return <Skeleton.Input active size='small'/>;
  return React.cloneElement(children, rest);
}

class DanhMucNhanVien extends Component {
  columns = [
    {
      title: 'STT',
      render: (value, row, index) => (this.state.page - 1) * this.state.limit + (index + 1),
      align: 'center',
    },
    // {
    //   title: 'Avatar',
    //   dataIndex: 'hinhanh',
    //   align: 'center',
    //   render: (value) => {
    //     if (value) {
    //       return <Avatar
    //         src={<Image src={API.FILES.format(value)}/>}
    //       />;
    //     }
    //     return null;
    //   },
    // },
    {
      title: 'Tên giáo viên',
      dataIndex: 'tennv',
    },
    {
      title: 'Trình độ',
      dataIndex: 'trinhdo',
    },
    {
      title: 'Chuyên ngành',
      dataIndex: 'chuyennganh',
    },
    // {
    //   title: 'Số điện thoại',
    //   dataIndex: 'dienthoai',
    // },
    {
      title: 'Đơn vị công tác',
      dataIndex: 'donvi',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'ghichu',
    },

    // {
    //   title: 'Giới tính',
    //   dataIndex: ['maphai', 'tenphai'],
    //   align: 'center',
    // },
    // {
    //   title: 'Hiển thị trên App',
    //   dataIndex: 'hienthi',
    //   render: (value) => <Checkbox disabled={true} checked={value}/>,
    //   align: 'center',
    // },
    // {
    //   title: 'Bác sĩ phòng khám',
    //   dataIndex: 'bacsikham',
    //   render: (value) => <Checkbox disabled={true} checked={value}/>,
    //   align: 'center',
    // },
    {
      title: 'Hành động',
      render: (value) => this.formatActionCell(value),
      width: 100,
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
      setImageFile: '',
      getimageFile: '',
      check: false,
      avatarUpl: null,
    };
    this.formRef = React.createRef();
    this.onSetImage = this.onSetImage.bind();
    this.url = 'dmnhanvien'
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
    const search = queryString.parse(this.props.location.search);
    const page = parseInt(search.page ? search.page : this.state.page);
    const limit = parseInt(search.limit ? search.limit : this.state.limit);
    let queryStr = '';
    queryStr += `${search._id ? '&_id={0}'.format(search._id) : ''}`;
    queryStr += `${search.tennv ? '&tennv[like]={0}'.format(search.tennv) : ''}`;
    queryStr += `${search.dienthoai ? '&dienthoai[like]={0}'.format(search.dienthoai) : ''}`;
    queryStr += `${search.donvi ? '&donvi[like]={0}'.format(search.donvi) : ''}`;
    queryStr += `${search.chuyennganh ? '&chuyennganh[like]={0}'.format(search.chuyennganh) : ''}`;
    queryStr += `${search.hienthi ? '&hienthi={0}'.format(search.hienthi) : ''}`;
    queryStr += `${search.maphai ? '&maphai={0}'.format(search.maphai) : ''}`;
    // queryStr += `${search.bacsikham ? '&bacsikham={0}'.format(search.bacsikham) : ''}`;
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

  onSave = async (values) => {
    const { setImageFile, _id } = this.state;
    if (setImageFile) {
      const arrayImageFile = [setImageFile.file];
      const files = await uploadImages(arrayImageFile);
      if (files && files.length) {
        values.hinhanh = files[0];
      }
    }

    const apiResponse = await updateById(_id, values);
    if (apiResponse) {
      const dataRes = this.state.dataRes.map(data => {
        if (data._id === apiResponse._id) {
          return apiResponse;
        }
        return data;
      });
      await this.setState({ dataRes, showModal: false });
      message.success('Cập nhật dữ liệu thành công.');
    }
    this.setState({setImageFile: null})
  };

  formatActionCell(value) {
    console.log(URL.DANHMUC_NHANVIEN_ID.format(value._id), value._id, 'value._idvalue._id')
    return <>
      <Tooltip title='Cập nhật thông tin' color="#2db7f5">
        <Link to={{ pathname: `${URL.DANHMUC_NHANVIEN_ID.format(value._id)}`}}>
          <Button icon={<EditOutlined/>} size='small' type="primary" ></Button>
        </Link>
      </Tooltip>
      {
        this.props.myPermission?.[this.url]?.xoa &&
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

   async handleDelete(value) {
      const apiResponse = await delById(value._id);
      if (apiResponse) {
        this.getDataFilter();
        message.success('Xoá dữ liệu thành công');
      }
    }

  async edit(data) {
    console.log('data',data);
    await this.setState({
      showModal: true, _id: data?._id,
      getimageFile: data?.hinhanh ? API.FILES.format(data.hinhanh) : '',
    });
    this.formRef.current.setFieldsValue({
      ...data, maphai: data?.maphai?._id,
    });
  }

  toggleModal = async () => {
    const { showModal } = this.state;
    if(showModal === true) this.setState({setImageFile: null})
    await this.setState({ showModal: !showModal, _id: '' });
    this.formRef.current.setFieldsValue();
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

  onSetImage = async ({ file }) => {
    this.setState({
      setImageFile: file,
      getimageFile: await getBase64(file.file),
    });
  };

  render() {
    const { loading, phai, myPermission } = this.props;
    const { dataRes, totalDocs, page, limit } = this.state;
    const dataSearch = [
      {
        type: 'text',
        name: 'tennv',
        label: 'Tên giáo viên',
      },
      {
        type: 'text',
        name: 'dienthoai',
        label: 'Điện thoại',
      },
      {
        type: 'text',
        name: 'donvi',
        label: ' Đơn vị công tác',
      },
      {
        type: 'text',
        name: 'chuyennganh',
        label: 'Chuyên ngành',
      },
      {
        type: 'select',
        name: 'maphai',
        label: 'Giới tính',
        options: phai,
        key: '_id',
        value: 'tenphai',
      }, 
      {
        type: 'select',
        name: 'hienthi',
        options: [
          { label: 'Hiển thị', value: true },
          { label: 'Không hiển thị', value: false },
        ],
        label: 'Hiển thị',
        key: 'value',
        value: 'label',
      },
      // {
      //   type: 'select',
      //   name: 'bacsikham',
      //   options: [
      //     { label: 'Hiển thị', value: true },
      //     { label: 'Không hiển thị', value: false },
      //   ],
      //   label: 'Bs khám',
      //   key: 'value',
      //   value: 'label',
      // }
    ];
    return <div>
      <Card size="small" title={<span>
        <UnorderedListOutlined className="icon-card-header"/> &nbsp;Danh sách giáo viên
      </span>}
      extra={
        myPermission?.[this.url]?.them &&  <Link to={URL.DANHMUC_NHANVIEN_ADD}>
          <Button type="primary" size="small" icon={<PlusOutlined />} className="pull-right">
            Thêm
          </Button>
        </Link>
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
        className="modal_nhanvien"
        title="Thông tin giáo viên"
        visible={this.state.showModal}
        onCancel={loading ? () => null : this.toggleModal}
        footer={
          myPermission?.[this.url]?.sua ? [
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
            Lưu
          </Button>
        ]: null}
      >
        <Form
          ref={this.formRef}
          id="formModal"
          name="formModal"
          autoComplete="off"
          labelAlign="right"
          onFinish={this.onSave}
          layout="vertical"
        >
          <Row gutter={10}>
            <Col sm={24} md={12}>
              <Form.Item className="text-center" name="logo">
                <Space direction="vertical">
                  <Avatar shape="square" src={this.state.getimageFile} size={100} style={{ fontSize: 48 }}/>
                  <Upload
                    accept="image/*"
                    onChange={(file) => this.onSetImage({ file })}
                    beforeUpload={file => {
                      const maxSize = 5; // MB
                      const isJpgOrPng = ['image/jpeg', 'image/png', 'image/gif'];
                      if (!isJpgOrPng) {
                        message.error('Bạn chỉ có thể tải lên tệp JPG/PNG/GIF!');
                        return false;
                      }
                      const isSizeValid = file.size / 1024 / 1024 < maxSize;
                      if (!isSizeValid) {
                        message.error(`Kích thước ảnh phải nhỏ hơn ${maxSize}MB!`);
                        return false;
                      }
                      // Upload file manually after
                      return false;
                    }}
                    showUploadList={false}
                  >
                    <Button size="small" type="primary" shape="round" icon={<DownloadOutlined/>}>Thay ảnh đại
                      diện</Button>
                  </Upload>
                </Space>
              </Form.Item>
            </Col>
            <Col sm={24} md={12}>
              <Row gutter={10}>
                {/* <Col sm={24}>
                  <Form.Item label="Hiển thị trên App" name="hienthi" valuePropName="checked">
                    <Switch/>
                  </Form.Item>
                </Col>
                <Col sm={24}>
                  <Form.Item label="Bác sĩ phòng khám" name="bacsikham" valuePropName="checked">
                    <Switch/>
                  </Form.Item>
                </Col> */}
                <Col sm={24}>
                  <Form.Item label="Thứ tự hiển thị" name="thutuhienthi" hasFeedback rules={[RULE.NUMBER_FLOAT]}>
                    <InputNumber disabled={loading}/>
                  </Form.Item>
                </Col>

              </Row>
            </Col>

            <Col sm={24} md={12}>
              <Form.Item label="Họ Tên" name="tennv" hasFeedback rules={[RULE.REQUIRED]}>
                <Input disabled={loading}/>
              </Form.Item>
            </Col>

            <Col sm={24} md={12}>
              <Form.Item label="Email" name="email" hasFeedback>
                <Input disabled={loading}/>
              </Form.Item>
            </Col>
            <Col sm={24} md={12}>
              <Form.Item label="Số điện thoại" name="dienthoai" hasFeedback>
                <Input disabled={loading}/>
              </Form.Item>
            </Col>
            <Col sm={24} md={12}>
              <Form.Item label="Giới tính" name="maphai"
                         validateTrigger={['onChange', 'onBlur']}>
                <CustomSkeleton isShowSkeleton={false}>
                  <Select placeholder='Chọn giới tính' disabled={loading} dropdownClassName='small'>
                    {phai.map((gender, i) => {
                      return <Select.Option key={i} value={gender._id}>
                        {gender.tenphai}
                      </Select.Option>;
                    })}
                  </Select>
                </CustomSkeleton>
              </Form.Item>
            </Col>
            <Col sm={24}>
              <Form.Item label="Giới thiệu" name="gioithieu" hasFeedback>
                <Input.TextArea disabled={loading}/>
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
  myPermission: makeGetPermission()
});


const withConnect = connect(mapStateToProps);
export default compose(withConnect, withPhai)(DanhMucNhanVien);



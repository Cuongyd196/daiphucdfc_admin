import React from 'react';
import {Input, Button, Form, Table, Popconfirm, message, Modal, Card, Tooltip, Upload, Avatar, Image, Typography} from 'antd';
import ImgCrop from 'antd-img-crop';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  CloseOutlined,
  SaveOutlined,
} from '@ant-design/icons';

import {connect} from 'react-redux';
import queryString from 'query-string';
import {stringify} from 'qs';
import {createStructuredSelector} from 'reselect';

import Search from '@components/Search/Search';
import {add, getAll, deleteById, updateById} from '@services/danhmucdichvu/dmgoidichvuService';
import {PAGINATION_CONFIG} from '@constants';
import {makeGetLoading} from '@containers/App/AppProvider/selectors';
import {dateFormatter} from '@commons/dateFormat';
import {makeGetPermission} from '@containers/Layout/HeaderComponent/HeaderProvider/selectors';
import {API} from "@api";
import {getBase64} from "@utils/imageUtil";
import {uploadImage} from "@services/uploadServices";
const { Text } = Typography;

class DmGoiDichVu extends React.Component {
  columns = [
    {
      title: 'STT',
      render: (value, row, index) => (this.state.page - 1) * this.state.limit + (index + 1),
      align: 'center',
    },
    {
      title: 'Ảnh',
      dataIndex: 'avatar',
      align: 'center',
      render: (value) => {
        if (value)
          return <Image
            width={70}
            src={API.FILES.format(value)}
            className="rounded-full"
          />
        return null
      }
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'tendmgoidv',
    },
    {
      title: 'Mô tả',
      dataIndex: 'mota',
    },
    {
      title: 'Thứ tự',
      dataIndex: 'thutu',
    },
    {
      title: 'Người tạo',
      dataIndex: ['nguoitao_id', 'full_name'],
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
      imageFile: null,
      imageSrc: ''
    };
    this.formRef = React.createRef();
    this.url = 'quan-ly-dich-vu';
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
    queryStr += `${search.tendmgoidv ? '&tendmgoidv[like]={0}'.format(search.tendmgoidv) : ''}`;
    queryStr += `${search.thutu ? '&thutu[like]={0}'.format(search.thutu) : ''}`;
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
    const {showModal} = this.state;
    await this.setState({showModal: !showModal, _id: '', imageFile: null, imageSrc: ''});
    this.formRef.current.resetFields();
  };

  handleSaveData = async data => {

    if (this.state.imageFile) {
      const avatar = await uploadImage(this.state.imageFile);
      if (avatar) data.avatar = avatar;
    } else delete data.avatar;

    let tendmgoidv = data.tendmgoidv;
    if (!tendmgoidv.trim()) {
      this.formRef.current.setFieldsValue({tendmgoidv: tendmgoidv.trim()});
      this.formRef.current.validateFields();
      return;
    }

    const {_id} = this.state;
    if (!_id) {
      // create
      const apiResponse = await add(data);
      if (apiResponse) {
        this.setState({showModal: false});
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
        await this.setState({dataRes, showModal: false});
        message.success('Chỉnh sửa dữ liệu thành công');
      }
    }
  };

  formatActionCell(value) {
    let {myPermission} = this.props;
    return (
      <>
        {
          myPermission?.[this.url]?.sua &&
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
          myPermission?.[this.url]?.xoa &&
          <Popconfirm
            key={value._id}
            title="Bạn chắc chắn muốn xoá?"
            onConfirm={() => this.handleDelete(value)}
            okText="Xoá"
            cancelText="Huỷ"
            okButtonProps={{type: 'danger'}}
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
    let imageSrc = null
    if (data.avatar) {
      imageSrc = API.FILES.format(data.avatar)
    }
    await this.setState({showModal: true, _id: data._id, imageSrc});
    this.formRef.current.setFieldsValue(data);
  }

  handleRefresh = (newQuery, changeTable) => {
    const {location, history} = this.props;
    const {pathname} = location;
    let {page, limit} = this.state;
    let objFilterTable = {page, limit};
    if (changeTable) {
      newQuery = queryString.parse(this.props.location.search);
      delete newQuery.page;
      delete newQuery.limit;
    }
    newQuery = Object.assign(objFilterTable, newQuery);
    history.push({pathname, search: stringify({...newQuery}, {arrayFormat: 'repeat'})});
  };

  onChangeTable = page => {
    this.setState({page: page.current, limit: page.pageSize}, () => this.handleRefresh({}, true));
  };

  onChangeImage = async (imageFile) => {
    let imageSrc = await getBase64(imageFile)
    this.setState({imageFile, imageSrc})
  }

  render() {
    const {loading, myPermission} = this.props;
    const {dataRes, totalDocs, page, limit, _id} = this.state;

    const dataSearch = [{
      name: 'tendmgoidv',
      label: 'Danh mục giá',
      type: 'text',
      operation: 'like',
    },
      {
        name: 'thutu',
        label: 'Thứ tự',
        type: 'text',
        operation: 'like',
      },
    ];

    return (
      <div>
        <Card size="small"
              title={<span><UnorderedListOutlined className="icon-card-header"/> &nbsp;Danh sách danh mục giá</span>}
              md="24"
              bordered
              extra={
                <div>
                  {
                    myPermission?.[this.url]?.them &&
                    <Button
                      type="primary"
                      onClick={this.toggleModal}
                      className="pull-right"
                      size="small"
                      icon={<PlusOutlined/>}
                    >
                      Thêm
                    </Button>
                  }
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
          title={_id ? 'Chỉnh sửa danh mục gói dịch vụ' : 'Thêm mới danh mục gói dịch vụ'}
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
              label="Tên danh mục"
              name="tendmgoidv"
              hasFeedback
              labelCol={{span: 6}}
              rules={[{required: true, whitespace: true, message: 'Tên danh mục không được để trống'}]}
            >
              <Input.TextArea placeholder="Nhập tên danh mục" disabled={loading}/>
            </Form.Item>
            <Form.Item label="Mô tả" name="mota" labelCol={{span: 6}}
                       rules={[{required: true, whitespace: true, message: 'Mô tả không được để trống'}]}
                       hasFeedback>
              <Input.TextArea placeholder="Nhập mô tả" disabled={loading}/>
            </Form.Item>
            <Form.Item
              label="Thứ tự"
              name="thutu"
              hasFeedback
              labelCol={{span: 6}}>
              <Input placeholder="Nhập thứ tự" type="number" disabled={loading}/>
            </Form.Item>
            <Form.Item name="avatar" label="Ảnh đại diện" labelCol={{span: 6}} className="text-center">
              <Image
                width={128}
                src={this.state.imageSrc || ''}
                fallback="data:image/png;base64,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"
              />
              <br/>
              <ImgCrop rotate>
                <Upload
                  accept="image/*"
                  // onChange={({file}) => this.onChangeImage(file)}
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
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                      this.setState({imageFile: file, imageSrc: reader.result})
                    };
                    // Upload file manually after
                    return false;
                  }}
                  showUploadList={false}
                >
                  <Button size="small">Thay đổi hình đại diện</Button>
                </Upload>
              </ImgCrop>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  loading: makeGetLoading(),
  myPermission: makeGetPermission()
});

export default connect(mapStateToProps)(DmGoiDichVu);
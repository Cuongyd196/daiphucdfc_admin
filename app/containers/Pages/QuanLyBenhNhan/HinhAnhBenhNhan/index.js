import React, { useState, Component } from 'react';
import debounce from 'lodash/debounce';
import { useAsyncMemo } from 'use-async-memo';
import { connect, useSelector } from 'react-redux';
import {
  Col,
  Row,
  Form,
  Input,
  Space,
  Button,
  Upload,
  Avatar,
  Typography,
  message,
  InputNumber,
  Modal,
  Radio,
  Tag,
  Checkbox,
  Table,
  Card, Tooltip, Image, Popconfirm, Divider,
} from 'antd';
import {
  SaveOutlined,
  UploadOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UnorderedListOutlined,
  PlusOutlined,
  CloseOutlined, EditOutlined, DeleteOutlined, FileSearchOutlined,
} from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { getBase64 } from '@utils/imageUtil';

import { getOne, update } from '@services/thongtinchungService';

import { makeGetLoading } from '@containers/App/AppProvider/selectors';

// Update ảnh lên server
import { uploadImage, uploadImages } from '@services/uploadServices';

import { makeGetMyInfo, makeGetPermission } from '@containers/Layout/HeaderComponent/HeaderProvider/selectors';
import ImgUplMulti from '@components/ImageUploadComp/ImgUplMulti';
import { add, getAll, updateById, deleteById } from '@services/qlbenhnhan/hinhanhbenhnhanService';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { PAGINATION_CONFIG } from '@constants';
import Search from '@components/Search/Search';
import {Link, withRouter} from 'react-router-dom';
import {getfileDetail} from "@commons/functionCommons";
import {API} from "@api";
import moment from 'moment';
import BenhNhanModal from "Pages/LichHen/ChiTiet/BenhNhanModal";
import {URL} from "@url";
class HinhAnhBenhNhan extends Component {
  columns = [
    {
      title: 'STT',
      render: (limit, page, value) => this.formatSTT(this.state.limit, this.state.page, value),
      width: 5,
      align: 'center',
    },
    {
      title: 'Ảnh',
      width: '20%',
      align: 'center',
      dataIndex: 'hinhanh',
      render: (value) => {
        if (value)
          return <Image.PreviewGroup>
            {
              value.map(data => {
                return <Image width={40} src={value ? API.FILES.format(data) : 'error'}/>
              })
            }
          </Image.PreviewGroup>

      },

    },
    {
      title: 'Nội dung',
      dataIndex: 'noidung',
      width: 150,
      align: 'center',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'ghichu',
      width: 150,
      align: 'center',
    },
    {
      title: 'Thông tin',
      dataIndex: 'nguoigui_id',
      width: 140,
      render: (val, row) => {
        return <>
          <div>-Người gửi:{val?.full_name}</div>
          <div>-Ngày gửi: {moment(row?.created_at).format('DD/MM/YYYY hh:mm')}</div>
          {
            row.makcb && <div>-Mã KCB: <Link to={URL.QL_DANGKYKHAM_ID.format(row.makcb)}>
              {row.makcb}
            </Link></div>
          }

        </>
      },
    },
    {
      title: 'Hành động',
      render: (value) => this.formatActionCell(value),
      width: 70,
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
      chonBenhNhan: true,
      search: {},
      _id: '',
      hinhanh: [],
      makcb: ''
    };
    this.formRef = React.createRef();
  }

  componentDidMount() {
    this.getDataFilter();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.search !== prevState.search || this.state.page !== prevState.page
    || this.state.limit !== prevState.limit) {
      this.getDataFilter();
    }
  }

  async getDataFilter() {
    const { search, page, limit } = this.state;
    let queryStr = '&mabn=' + this.props.mabn;
    queryStr += `${search.from_date ? '&created_at[from]={0}'.format(search.from_date) : ''}`;
    queryStr += `${search.to_date ? '&created_at[to]={0}'.format(search.to_date) : ''}`;
    queryStr += `${search.noidung ? '&noidung[like]={0}'.format(search.noidung) : ''}`;

    const apiResponse = await getAll(page, limit, queryStr);
    if (apiResponse) {
      const dataRes = apiResponse.docs;
      this.setState({
        dataRes: dataRes,
        totalDocs: apiResponse.totalDocs,
        limit: apiResponse.limit,
        page: apiResponse.page,
      });
    }
  }

  formatActionCell(value) {
    return <div>
      <Tooltip placement="left" title="Xem chi tiết" color="#2db7f5">
        <Button className="mr-1" icon={<EditOutlined/>} size="small" type="primary" onClick={() => {this.handleShowModal(value)}}/>
      </Tooltip>
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
    </div>;
  }

  async handleDelete(value) {
    const apiResponse = await deleteById(value._id);
    if (apiResponse) {
      this.getDataFilter();
      message.success('Xoá dữ liệu thành công');
    }
  }

  handleShowModal = async (data) => {
    let hinhanh = []
    if(Array.isArray(data.hinhanh)){
      hinhanh = data.hinhanh.map((data, idx) => {
        return {
          uid: idx,
          name: data,
          status: 'done',
          url: API.FILES.format(data)
        }
      })
    }

    this.setState({
      showModal: true,
      data: data,
      hinhanh,
      _id: data._id,
      makcb: data.makcb
    }, () => {
      this.formRef.current.setFieldsValue({
      ...data,
      nguoigui_id: data?.nguoigui_id?.full_name,
      created_at: moment(data.created_at).format('DD/MM/YYYY')
    })});
  }

  formatSTT(limit, page, index) {
    return (page - 1) * limit + (index + 1);
  }

  onChangeTable = (page) => {
    this.setState({ page: page.current, limit: page.pageSize });
  };

  handleRefresh = (newQuery) => {
    this.setState({ search: newQuery });
  };

  toggleModal = async () => {
    const { showModal } = this.state;
    await this.setState({ showModal: !showModal, _id: '', hinhanh: [], makcb: '' });
    this.formRef.current.resetFields();
  };

  handleSaveData = async (data) => {
    let [originFileNm, fileUpload] = getfileDetail(data.hinhanh);
    if (fileUpload.length) {
      const image_id_list = await uploadImages(fileUpload);
      if (image_id_list && image_id_list.length) originFileNm = [...originFileNm, ...image_id_list];
    }
    data.hinhanh = originFileNm
    if(this.state._id){
      let apiRequest = await updateById(this.state._id, data);
      if (apiRequest) {
        let {dataRes} = this.state
        dataRes = dataRes.map(data => {
          if(data._id === this.state._id) return  apiRequest
          return data
        })
        this.setState({showModal: false, dataRes});
        message.success('Cập nhật dữ liệu thành công.');
      }
    }else{
      data.mabn = this.props.mabn;
      let apiRequest = await add(data);
      if (apiRequest) {
        this.getDataFilter();
        this.setState({showModal: false});
        message.success('Thêm mới dữ liệu thành công.');
      }
    }
  };

  showModalMKCB = () => this.setState({ showModalKCB: true });

  getInfoKCB = (makcb) => {
    if (makcb) {
      this.setState({ showModalKCB: false, makcb });
      this.formRef.current.setFieldsValue({
        makcb: makcb
      });
    } else {
      this.setState({ showModalKCB: false });
    }
  };

  render() {
    const { loading, myPermission } = this.props;
    const { dataRes, totalDocs, page, limit, _id } = this.state;
    const dataSearch = [
      {
        type: 'date',
        name: 'from_date',
        label: 'Từ ngày',
      },
      {
        type: 'date',
        name: 'to_date',
        label: 'Đến ngày',
      },
      {
        type: 'text',
        name: 'noidung',
        label: 'Nội dung',
      }
    ];

    return (
      <>
        <Card
          size='small'
          title={
            <span>
              <UnorderedListOutlined className='icon-card-header' /> &nbsp; Lịch sử gửi hình ảnh
            </span>
          }
          md='24'
          bordered
          extra={<Button
            type='primary'
            onClick={this.toggleModal}
            className='pull-right'
            size='small'
            icon={<PlusOutlined />}
          >
            Gửi hình ảnh
          </Button>}
        >
          <Search onFilterChange={this.handleRefresh} dataSearch={dataSearch} />
          <Table
            loading={loading}
            bordered
            columns={this.columns}
            dataSource={dataRes}
            size='small'
            rowKey='_id'
            pagination={{
              ...PAGINATION_CONFIG,
              current: page,
              pageSize: limit,
              total: totalDocs,
            }}
            onChange={this.onChangeTable}
          />

          <Modal
            title={_id ? 'Chỉnh sửa' : 'Gửi hình ảnh'}
            visible={this.state.showModal}
            onCancel={loading ? () => null : this.toggleModal}
            width={900}
            style={{top: 10}}
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
                form='formModalformModal'
                loading={loading}
                icon={<SaveOutlined />}
              >
                Lưu dữ liệu
              </Button>,
            ]}
          >

            <Form
              ref={this.formRef}
              id='formModalformModal'
              name='formModalformModal'
              autoComplete='off'
              onFinish={this.handleSaveData}
              labelAlign='right'
              layout="vertical"
              size="small"
            >
              <Row gutter={10}>
                {
                  this.state._id && <>
                    <Col xs={24} xl={12}>
                      <Form.Item label='Người gửi ' name='nguoigui_id'>
                        <Input placeholder='Nhập tên người gửi' disabled={loading} disabled />
                      </Form.Item>
                    </Col>
                    <Col xs={24} xl={12}>
                      <Form.Item label='Ngày gửi ' name='created_at'>
                        <Input placeholder='Ngày gửi' disabled={loading} disabled />
                      </Form.Item>
                    </Col>
                  </>
                }

                <Col xs={24} xl={12}>
                  <Form.Item label='Nội dung' name='noidung'>
                    <Input.TextArea placeholder='Nhập nội dung' disabled={loading} />
                  </Form.Item>
                </Col>
                <Col xs={24} xl={12}>
                  <Form.Item label='Ghi chú' name='ghichu'>
                    <Input.TextArea placeholder='Nhập ghi chú' disabled={loading} />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item label='Hình ảnh' name='hinhanh' labelCol={{ span: 6 }}>
                    <ImgUplMulti fileListOrg={this.state.hinhanh} />
                  </Form.Item>
                </Col>

              </Row>
              {
                !this.props.taikhoanhis &&
                <Row gutter={10}>
                  <Divider orientation="left" plain>
                    <span className="text-pink-500 mt-5">Mã KCB</span>
                  </Divider>
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
                </Row>
              }

            </Form>
          </Modal>
          <BenhNhanModal showModal={this.state.showModalKCB} taikhoanhis={true} dangkybn={true}
                         mabn={this.props.mabn} makcb={this.state.makcb} getInfoKCB={this.getInfoKCB}
          />
        </Card>
      </>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  loading: makeGetLoading(),
  myPermission: makeGetPermission(),
  myInfo: makeGetMyInfo(),
});

const withConnect = connect(mapStateToProps);
export default compose(withConnect)(withRouter(HinhAnhBenhNhan));

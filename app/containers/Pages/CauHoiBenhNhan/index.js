import React, { Component, Fragment } from 'react';
import { Input, Button, Form, Table, Skeleton, Popconfirm, message, Modal, InputNumber, Card, Tooltip, Radio, Select } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  CloseOutlined,
  EyeOutlined,
  SaveOutlined
} from "@ant-design/icons";

import { connect } from "react-redux";
import { compose } from 'redux';
import queryString from "query-string";
import { stringify } from "qs";
import { createStructuredSelector } from "reselect";
import { Link } from 'react-router-dom'

import Search from "@components/Search/Search";
import { getAll, updateById } from "@services/cauhoi/cauhoibenhnhanService";
import { makeGetLoading } from "@containers/App/AppProvider/selectors";
import { dateFormatter, dateFormatYMD} from '@commons/dateFormat';
import { withPhong } from "@reduxApp/Phong/connect";
import { getAllPhongById } from "@services/danhmucphong/khoakhamService";
import { URL } from "@url";
import "./cauhoibenhnhan.scss";
import { PAGINATION_CONFIG ,CONSTANTS, GENDER_OPTIONS, RULE } from "@constants";

function CustomSkeletonSL(props) {
  const {children, isShowSkeleton, ...rest} = props;
  if(isShowSkeleton) return <Skeleton.Input active size='small'/>
  return React.cloneElement(children, rest)
}

class CauHoiBenhNhan extends React.Component {
  columns = [
    {
      title: 'STT',
      render: (limit, page, value) => this.formatSTT(this.state.limit, this.state.page, value),
      width: 60,
      align: "center",
    },
    {
      title: "Bệnh nhân hỏi",
      render: (value) => value?.mabn?.hoten,
      width: 180,
    },
    {
      title: 'Thông tin câu hỏi',
      width: 190,
      render: (value, rowData, rowIndex) => {
        return <>
          <div>-Khoa khám: {rowData?.makk?.tenkk}</div>
          <div>-Phòng khám: {rowData?.maphong?.tenphong}</div>
          <div>-Ngày đăng: {dateFormatter(rowData?.created_at)}</div>
          <div>-Trạng thái: {this.formatTrangThai(rowData)}</div>
        </>
      }
    },
    {
      title: "Câu hỏi",
      render: (value) => this.cauhoiFormatter(value?.cauhoi),
    },
    {
      title: "Hành động",
      width: 90,
      align: "center",
      render: value => this.formatActionCell(value)
    }
  ];

  constructor(props) {
    super(props);
    this.state = {
      dataRes: [],
      page: 1,
      limit: 10,
      totalDocs: 0,
      cauhoi: '',
      trangthai: 1,
      phong: [],
      trangthai_sc:[{_id:1,trangthai:"Đang chờ"},{_id:2,trangthai:"Đã trả lời"},{_id:3,trangthai:"Bị từ chối"}],
    };
    this.formRef = React.createRef();
  }

  componentDidMount() {
    this.getDataFilter();
  }


  componentDidUpdate(prevProps) {
    if (this.props.location.search !== prevProps.location.search) {
      this.getDataFilter();
    }
  }


  onFieldsChange = async (changedValues, allValues) => {
    if (changedValues.hasOwnProperty('makk')) {
      this.formRef.current.setFieldsValue({ maphong: ''});
      const phong = await getAllPhongById(changedValues['makk']);
      if (phong) {
        this.setState({phong});
      }
    }
  }

  async getDataFilter() {
    const search = queryString.parse(this.props.location.search);
    const page = parseInt(search.page ? search.page : this.state.page);
    const limit = parseInt(search.limit ? search.limit : this.state.limit);
    let queryStr = "";
      queryStr += `${search.cauhoi ? "&cauhoi[like]={0}".format(search.cauhoi) : ""}`;
      queryStr += `${search.mabn ? "&mabn[like]={0}".format(search.mabn) : ""}`;
      queryStr += `${search.makk ? "&makk={0}".format(search.makk) : ""}`;
      queryStr += `${search.maphong ? "&maphong={0}".format(search.maphong) : ""}`;
      queryStr += `${search.trangthai ? "&trangthai={0}".format(search.trangthai) : ""}`;
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

  formatSTT(limit, page, index){
    return (page-1)*limit + (index +1)
  }

  formatTrangThai(value){
    if(value?.trangthai === 1){
      return "Đang chờ"
    }
    if(value?.trangthai === 2){
      return "Đã trả lời"
    }
    if(value?.trangthai === 3){
      return "Bị từ chối"
    }
  }

  cauhoiFormatter(value){
    return  value.slice(0, 300) + " ..."
  }

  toggleModal = async () => {
    const { showModal } = this.state;
    await this.setState({ showModal: !showModal, _id: "" });
    this.formRef.current.resetFields();
  };

  onChange = e => {
    this.setState({
      trangthai: e.target.value,
    });
  };

  raidoGroup(){
    return <>
      <Radio.Group labelCol={{ span: 24 }} value={this.state.trangthai} onChange={this.onChange} >
        <Radio value={1}>
          Đang chờ
        </Radio>
        <Radio value={2}>
          Đã trả lời
        </Radio>
        <Radio value={3}>
          Từ chối
        </Radio>
      </Radio.Group>
    </>
  }

  handleSaveData = async data => {
    if(data.traloi){
      let traloi = data.traloi
      if (!traloi.trim()) {
        this.formRef.current.setFieldsValue({ traloi: traloi.trim() });
        this.formRef.current.validateFields();
        return;
      }
    }
    if(data.lydotuchoi){
      let lydotuchoi = data.lydotuchoi
      if (!lydotuchoi.trim()) {
        this.formRef.current.setFieldsValue({ lydotuchoi: lydotuchoi.trim() });
        this.formRef.current.validateFields();
        return;
      }
    }
    const { _id } = this.state;
    
    data.trangthai = this.state.trangthai;
    data.ngaytraloi = dateFormatYMD(Date.now());
    
    const apiResponse = await updateById(_id, data);
    if (apiResponse) {
      this.getDataFilter()
      await this.setState({showModal: false });
      message.success("Chỉnh sửa dữ liệu thành công");
    }
  };

  formatActionCell(value) {
    return (
      <>
        <Tooltip placement="left" title="Cập nhật câu trả lời" color="#2db7f5">
          <Button
            icon={<EyeOutlined />}
            size="small"
            type="primary"
            className="mr-1"
            onClick={() => this.edit(value)}
          />
        </Tooltip>
        <Tooltip placement="left" title="Xem chi tiết" color="#2db7f5">
          <Link
            to={URL.CAU_HOIBN_ID.format(value._id)}>
            <Button
              icon={<EditOutlined />}
              size="small"
              type="primary"
              className="mr-1"
            />
          </Link>
        </Tooltip>
      </>
    );
  }

  async edit(data) {
    await this.setState({ showModal: true, _id: data._id, cauhoi: data.cauhoi, trangthai: data.trangthai });
    data?.maphong?._id ? this.getPhong(data) : ""
    this.formRef.current.setFieldsValue({...data, traloi: '', makk: data?.makk?._id, maphong: data?.maphong?._id});
  }

  async getPhong(data) {
    const phong = await getAllPhongById(data?.makk?._id);
    if (phong) {
      this.setState({phong});
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
    history.push({ pathname, search: stringify({ ...newQuery }, { arrayFormat: "repeat" }) });
  };

  onChangeTable = (page) => {
    this.setState({ page: page.current, limit: page.pageSize }, () => this.handleRefresh({}, true));
  };

  render() {
    const { loading, khoa, sphong} = this.props;
    const { dataRes, totalDocs, page, limit, _id, cauhoi, trangthai, trangthai_sc, phong} = this.state;

    const dataSearch = [{
        name: "mabn",
        label: "Mã bệnh nhân",
        type: "text",
        operation: "like",
        
      },
      {
        name: "cauhoi",
        label: "Câu hỏi",
        type: "text",
        operation: "like",
      },
      {
        type: 'select',
        name: 'makk',
        label: 'Câu hỏi thuộc khoa',
        options: khoa,
        key: '_id',
        value: 'tenkk',
      },
      {
        type: 'select',
        name: 'maphong',
        label: 'Câu hỏi thuộc phòng',
        options: sphong,
        key: '_id',
        value: 'tenphong'
      },
      {
        type: 'select',
        name: 'trangthai',
        label: 'Trạng thái',
        options: trangthai_sc,
        key: '_id',
        value: 'trangthai'
      }
    ];

    return (
      <div>
        <Card
          size="small"
          title={
            <span>
              <UnorderedListOutlined className="icon-card-header" /> &nbsp;Danh sách câu hỏi của bệnh nhân
            </span>
          }
          md="24"
          bordered>
            <Search onFilterChange={this.handleRefresh} dataSearch={dataSearch} />
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
          className="modal_CauHoiBN"
          title={"Chỉnh sửa câu trả lời"}
          visible={this.state.showModal}
          onCancel={loading ? () => null : this.toggleModal}
          footer={[
            <Button
              key={1}
              size="small"
              onClick={this.toggleModal}
              disabled={loading}
              type="danger"
              icon={<CloseOutlined />}
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
              icon={<SaveOutlined />}
            >
              Lưu
            </Button>
          ]}
        >
          <Form
            ref={this.formRef}
            id="formModal"
            name="formModal"
            autoComplete="off"
            onFinish={this.handleSaveData}
            labelAlign="right"
            onValuesChange={this.onFieldsChange}
          >
            <Form.Item label="Trạng thái câu hỏi : " name="trangthai" labelCol={{ span: 8 }} className="radio" >
              {this.raidoGroup()}
            </Form.Item>
            <Form.Item className="cauhoi"  labelCol={{ span: 7 }} >
              Câu hỏi của bệnh nhân:
              <br/>
              <span>
                {cauhoi}
              </span>
            </Form.Item>
            {trangthai === 2 ? <> 
              <Form.Item label="Thời gian trả lời " labelCol={{ span: 7 }} name="thoigiantraloi">
                {dateFormatter(Date.now())}
              </Form.Item>
            </> : ""}
            {trangthai !== 3 && trangthai !== 1 ? <> 
              <Form.Item label="Câu hỏi thuộc Khoa" name="makk"
                labelCol={{ span: 7 }} 
                validateTrigger={['onChange', 'onBlur']}>
                <CustomSkeletonSL isShowSkeleton={false}>
                  <Select placeholder='Chọn khoa của câu hỏi' disabled={loading} dropdownClassName='small'>
                    {khoa?.map((gender, i) => {
                      return <Select.Option key={i} value={gender?._id}>
                        {gender?.tenkk}
                        </Select.Option>;
                    })}
                  </Select>
                </CustomSkeletonSL>
              </Form.Item>
              <Form.Item label="Câu hỏi thuộc phòng" name="maphong"
                labelCol={{ span: 7 }} 
                validateTrigger={['onChange', 'onBlur']}>
                <CustomSkeletonSL isShowSkeleton={false}>
                  <Select placeholder='Chọn phòng của câu hỏi' disabled={loading} dropdownClassName='small'>
                    {phong.map((gender, i) => {
                      return <Select.Option key={i} value={gender._id}>
                        {gender.tenphong}
                        </Select.Option>;
                    })}
                  </Select>
                </CustomSkeletonSL>
              </Form.Item>
              <Form.Item
                label="Câu trả lời"
                name="traloi"
                rules={[RULE.REQUIRED]}
                labelCol={{ span: 7 }}>
                <Input.TextArea placeholder="Nhập câu trả lời" disabled={loading} />
              </Form.Item>
            </> : ""}
            {trangthai === 3 ? <>
              <Form.Item
                label="Lý do từ chối"
                name="lydotuchoi"
                rules={[RULE.REQUIRED]}
                labelCol={{ span: 6 }}>
                <Input.TextArea placeholder="Nhập lý do từ chối" disabled={loading} />
              </Form.Item>
            </>: ""}
          </Form>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  loading: makeGetLoading()
});

const withConnect = connect(mapStateToProps);
export default compose(withConnect, withPhong)(CauHoiBenhNhan);


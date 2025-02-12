import React from "react";
import { Radio, Input, Button, Form, Table, Popconfirm, message, Modal, Card, Tooltip, Checkbox, Select } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  CloseOutlined,
  SaveOutlined
} from "@ant-design/icons";

import { connect } from "react-redux";
import queryString from "query-string";
import { stringify } from "qs";
import { createStructuredSelector } from "reselect";

import Search from "@components/Search/Search";
import { add, getAll, delById, updateById } from "@services/danhmucdichvu/banggiadichvuService";
import { PAGINATION_CONFIG } from "@constants";
import { makeGetLoading } from "@containers/App/AppProvider/selectors";
import { dateFormatter } from "@commons/dateFormat";
import { makeGetPermission } from "@containers/Layout/HeaderComponent/HeaderProvider/selectors";

const { Option } = Select;

class BangGiaDichVu extends React.Component {
  listDichVu = [
    { loaidichvu: 1, tenmota: "Khám bệnh" },
    { loaidichvu: 2, tenmota: "Nội soi" },
    { loaidichvu: 3, tenmota: "Siêu âm" },
    { loaidichvu: 4, tenmota: "Chụp X quang" },
    { loaidichvu: 5, tenmota: "Thủ thuật" }
  ];

  columns = [
    {
      title: "STT",
      render: (value, row, index) => (this.state.page - 1) * this.state.limit + (index + 1),
      width: 60,
      align: "center"
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "tendichvu"
    },
    {
      title: "Giá dịch vụ",
      render: (value, row, index) => {
        return <div style={{ whiteSpace: "pre-wrap" }}>{value?.giadichvu}</div>;
      }
    },
    {
      title: "Loại dịch vụ",
      render: (value, row, index) => this.listDichVu.find(item => item.loaidichvu == value.loaidichvu).tenmota
    },
    {
      title: "Hành động",
      width: 120,
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
      totalDocs: 0
    };
    this.formRef = React.createRef();
    this.url = "thong-tin-chung";
  }

  componentDidMount() {
    this.getDataFilter();
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
    let queryStr = "";
    queryStr += `${search.tendichvu ? "&tendichvu[like]={0}".format(search.tendichvu) : ""}`;
    const apiResponse = await getAll(page, limit, queryStr);
    if (apiResponse) {
      const dataRes = apiResponse.docs;
      this.setState({
        dataRes,
        totalDocs: apiResponse.totalDocs,
        limit: apiResponse.limit,
        page: apiResponse.page
      });
    }
  }

  async handleDelete(value) {
    const apiResponse = await delById(value._id);
    if (apiResponse) {
      this.getDataFilter();
      message.success("Xoá dữ liệu thành công");
    }
  }

  toggleModal = async () => {
    const { showModal } = this.state;
    await this.setState({ showModal: !showModal, _id: "" });
    this.formRef.current.resetFields();
  };

  handleSaveData = async data => {
    let tendichvu = data.tendichvu;
    if (!tendichvu.trim()) {
      this.formRef.current.setFieldsValue({ tendichvu: tendichvu.trim() });
      this.formRef.current.validateFields();
      return;
    }
    let { _id, dataRes } = this.state;
    if (!_id) {
      const apiResponse = await add(data);
      if (apiResponse) {
        await this.setState({ showModal: false });
        this.getDataFilter();
        message.success("Thêm mới dữ liệu thành công");
      }
    } else {
      const apiResponse = await updateById(_id, data);
      if (apiResponse) {
        dataRes = dataRes.map(data => {
          if (data._id === apiResponse._id) {
            return apiResponse;
          }
          return data;
        });
        await this.setState({ dataRes, showModal: false });
        message.success("Chỉnh sửa dữ liệu thành công");
      }
    }
  };

  formatActionCell(value) {
    return (
      <>
        <Tooltip placement="left" title="Cập nhật thông tin" color="#2db7f5">
          <Button
            icon={<EditOutlined />}
            size="small"
            type="primary"
            className="mr-1"
            onClick={() => this.edit(value)}
          />
        </Tooltip>

        <Popconfirm
          key={value._id}
          title="Bạn chắc chắn muốn xoá?"
          onConfirm={() => this.handleDelete(value)}
          okText="Xoá"
          cancelText="Huỷ"
          okButtonProps={{ type: "danger" }}
        >
          <Tooltip placement="right" title="Xóa dữ liệu" color="#f50">
            <Button icon={<DeleteOutlined />} type="danger" size="small" className="mr-1" />
          </Tooltip>
        </Popconfirm>
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
    history.push({ pathname, search: stringify({ ...newQuery }, { arrayFormat: "repeat" }) });
  };

  onChangeTable = page => {
    this.setState({ page: page.current, limit: page.pageSize }, () => this.handleRefresh({}, true));
  };

  handleChange = data => {};

  render() {
    const { loading, myPermission } = this.props;
    const { dataRes, totalDocs, page, limit, _id } = this.state;

    const dataSearch = [
      {
        name: "tendichvu",
        label: "Tên dịch vụ",
        type: "text",
        operation: "like"
      }
    ];

    return (
      <div>
        <Card
          size="small"
          title={
            <span>
              <UnorderedListOutlined className="icon-card-header" /> &nbsp;Bảng giá dịch vụ
            </span>
          }
          md="24"
          bordered
          extra={
            <div>
              <Button
                type="primary"
                onClick={this.toggleModal}
                className="pull-right"
                size="small"
                icon={<PlusOutlined />}
              >
                Thêm
              </Button>
            </div>
          }
        >
          <Search onFilterChange={this.handleRefresh} dataSearch={dataSearch} />
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
              total: totalDocs
            }}
            onChange={this.onChangeTable}
          />
        </Card>
        <Modal
          title={_id ? "Chỉnh sửa" : "Thêm mới"}
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
              {_id ? "Lưu" : "Thêm"}
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
          >
            <Form.Item
              label="Tên dịch vụ"
              name="tendichvu"
              hasFeedback
              labelCol={{ span: 6 }}
              validateTrigger={["onChange", "onBlur"]}
              rules={[{ required: true, whitespace: true, message: "Tên dịch vụ không được để trống" }]}
            >
              <Input placeholder="Nhập tên dịch vụ" disabled={loading} />
            </Form.Item>
            <Form.Item
              label="Giá dịch vụ"
              name="giadichvu"
              labelCol={{ span: 6 }}
              hasFeedback
              rules={[{ required: true, message: "Giá dịch vụ không được để trống" }]}
            >
              <Input.TextArea placeholder="Nhập giá dịch vụ" disabled={loading} />
            </Form.Item>
            <Form.Item
              label="Loại dịch vụ"
              name="loaidichvu"
              labelCol={{ span: 6 }}
              rules={[{ required: true, message: "Loại dịch vụ không được để trống" }]}
            >
              <Select onChange={this.handleChange} placeholder="Chọn loại dịch vụ">
                {this.listDichVu.map(item => (
                  <Option key={item.loaidichvu} value={item.loaidichvu}>
                    {item.tenmota}
                  </Option>
                ))}
              </Select>
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

export default connect(mapStateToProps)(BangGiaDichVu);

import React from "react";
import { Button, Table, Popconfirm, message, Card, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined, UnorderedListOutlined } from "@ant-design/icons";

import { connect } from "react-redux";
import queryString from "query-string";
import { stringify } from "qs";
import { createStructuredSelector } from "reselect";
import { Link } from "react-router-dom";

import Search from "@components/Search/Search";
import { getAll, delById } from "@services/tintucyte/tintucService";
import { URL } from "@url";
import { PAGINATION_CONFIG } from "@constants";
import { makeGetLoading } from "@containers/App/AppProvider/selectors";
import { dateFormatter } from "@commons/dateFormat";
import { makeGetMyInfo, makeGetPermission } from '@containers/Layout/HeaderComponent/HeaderProvider/selectors';

class Tintuc extends React.Component {
  columns = [
    {
      title: 'STT',
      render: (limit, page, value) => this.formatSTT(this.state.limit, this.state.page, value),
      width: 20,
      align: "center",
    },
    {
      title: "Tiêu đề",
      dataIndex: "tieude"
    },
    {
      title: "Danh mục",
      dataIndex: ["danhmuc_id", "ten"],
      width: 130,
    },
    {
      title: "Mô tả",
      dataIndex: "mota"
    },
    // {
    //   title: "Thông báo trên App",
    //   dataIndex: "sothongbao",
    //   width: 147,
    //   render: value => {
    //     if (value) return <div>Tạo <b>{value}</b> thông báo</div>
    //     else return <div className="text-red-600">Chưa tạo thông báo</div>
    //   }
    // },
    {
      title: "Thông tin",
      dataIndex: "created_at",
      width: 190,
      render: (value, row) => {
        return <div>
          <p>Thứ tự: {row.thutu}</p>
          <p>Ngày tạo: {dateFormatter(value)}</p>
          <p>Người tạo: {row.nguoitao_id?.full_name}</p>
        </div>
      }
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
      totalDocs: 0
    };
    this.url = 'tintuc'
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
    queryStr += `${search.tieude ? "&tieude[like]={0}".format(search.tieude) : ""}`;
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

  formatSTT(limit, page, index) {
    return (page - 1) * limit + (index + 1)
  }

  async handleDelete(value) {
    const apiResponse = await delById(value._id);
    if (apiResponse) {
      this.getDataFilter();
      message.success("Xoá dữ liệu thành công");
    }
  }

  formatActionCell(value) {
    let {myPermission} = this.props
    return (
      <>

        <Link to={URL.TINTUC_ID.format(value._id)}>
          <Tooltip placement="left" title="Cập nhật thông tin" color="#2db7f5">
            <Button icon={<EditOutlined />} size="small" type="primary" className="mr-1" />
          </Tooltip>
        </Link>

        { myPermission?.[this.url].xoa &&
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
        }
      </>
    );
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

  render() {
    const { loading, myPermission } = this.props;
    const { dataRes, totalDocs, page, limit, _id } = this.state;

    const dataSearch = [
      {
        name: "tieude",
        label: "Tiêu đề",
        type: "text",
        operation: "like"
      }
    ];

    return (
      <Card
        size="small"
        title={
          <span>
            <UnorderedListOutlined className="icon-card-header" /> &nbsp;Danh sách tin tức
          </span>
        }
        md="24"
        bordered
        extra={
          <div>
            {
              myPermission?.[this.url].them &&
              <Link to={URL.TINTUC_ADD}>
                <Button type="primary" size="small" icon={<PlusOutlined />} className="pull-right">
                  Thêm
                </Button>
              </Link>
            }
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
    );
  }
}

const mapStateToProps = createStructuredSelector({
  loading: makeGetLoading(),
  users: makeGetMyInfo(),
  myPermission: makeGetPermission()
});

export default connect(mapStateToProps)(Tintuc);

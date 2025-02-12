import React from "react";
import { Table, Card, Button, Tooltip } from 'antd';
import { EyeOutlined, UnorderedListOutlined } from '@ant-design/icons';

import { connect } from "react-redux";
import { compose } from 'redux';
import queryString from "query-string";
import { stringify } from "qs";
import { createStructuredSelector } from "reselect";

import Search from "@components/Search/Search";
import { getAll } from "@services/danhgia/dichvubenhvienService";
import { PAGINATION_CONFIG } from "@constants";
import { makeGetLoading } from "@containers/App/AppProvider/selectors";
import { dateFormatter } from "@commons/dateFormat";
import { withDmDanhGia } from "@reduxApp/DmDanhGia/connect";
import { Link } from 'react-router-dom';
import { URL } from '@url';

class ChiTietDanhGiaDichVu extends React.Component {
  columns = [
    {
      title: 'STT',
      render: (value, row, index) => (this.state.page - 1) * this.state.limit + (index + 1),
      width: 50,
      align: 'center'
    },
    {
      title: "Bệnh nhân",
      render: value => value?.mabn?.hoten
    },
    {
      title: "Tên danh mục đánh giá",
      render: value => value?.dmdanhgia_id?.tendanhgia
    },
    {
      title: "Điểm số",
      render: value => value?.diem,
      align: 'center'
    },
    {
      title: "Ngày đánh giá",
      render: value => dateFormatter(value?.created_at),
      align: 'center'
    },
    {
      title: "",
      dataIndex: 'makcb',
      render: value => <Tooltip placement="topLeft" title="Xem chi tiết" color="#2db7f5">
        <Link to={URL.QL_DANGKYKHAM_ID.format(value)}>
          <Button icon={<EyeOutlined />} size="small" type="primary"/>
        </Link>
      </Tooltip>,
      align: 'center'
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      dataRes: [],
      page: 1,
      limit: 10,
      totalDocs: 0
    };
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
    const search = queryString.parse(this.props.location.search);
    const page = parseInt(search.page ? search.page : this.state.page);
    const limit = parseInt(search.limit ? search.limit : this.state.limit);
    let queryStr = "";
    queryStr += `${search.diem ? "&diem={0}".format(search.diem) : ""}`;
    queryStr += `${search.dmdanhgia_id ? `&dmdanhgia_id={0}`.format(search.dmdanhgia_id) : ""}`
    queryStr += `${search.from_date ? '&created_at[from]={0}'.format(search.from_date) : ''}`
    queryStr += `${search.to_date ? '&created_at[to]={0}'.format(search.to_date) : ''}`
    queryStr += `${search.hoten ? '&hoten[like]={0}'.format(search.hoten) : ''}`
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
    const { loading, dmdanhgia } = this.props;
    const { dataRes, totalDocs, page, limit, _id } = this.state;
    const diem = [{_id: 1, diem: 1},{_id: 2, diem: 2},{_id: 3, diem: 3},{_id: 4, diem: 4},{_id: 5, diem: 5}]

    const dataSearch = [
      {
        type: 'select',
        name: 'dmdanhgia_id',
        label: 'Tên đánh giá',
        options: dmdanhgia,
        key: '_id',
        value: 'tendanhgia'
      },
      {
          type: 'date',
          name: 'from_date',
          label: 'Từ ngày'
      },
      {
          type: 'date',
          name: 'to_date',
          label: 'Đến ngày'
      },
      {
        type: 'select',
        name: 'diem',
        label: 'Điểm',
        options: diem,
        key: '_id',
        value: 'diem'
      },
      {
        type: 'text',
        name: 'hoten',
        label: 'Bệnh nhân'
      },
    ];

    return (
      <Card
        size="small"
        title={
          <span>
            <UnorderedListOutlined className="icon-card-header" /> &nbsp;Danh sách đánh giá của bệnh nhân
          </span>
        }
        md="24"
        bordered
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
  loading: makeGetLoading()
});

const withConnect = connect(mapStateToProps);
export default compose(withConnect, withDmDanhGia)(ChiTietDanhGiaDichVu);

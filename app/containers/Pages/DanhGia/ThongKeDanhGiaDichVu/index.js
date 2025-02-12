import React from "react";
import { Button, Card, Table, Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { Link } from 'react-router-dom'
import { connect } from "react-redux";
import { compose } from 'redux';
import { createStructuredSelector } from "reselect";
import queryString from "query-string";
import { stringify } from "qs";
import { makeGetLoading } from "@containers/App/AppProvider/selectors";
import Search from "@components/Search/Search";
import { withDmDanhGia } from "@reduxApp/DmDanhGia/connect";

import { danhgiadichvubv } from "@services/danhgia/dichvubenhvienService";
import { URL } from "@url";

class ThongKeDanhGiaDichVuBenhVien extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataRes: [],
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
    let queryStr = "";
    queryStr += `${search.dmdanhgia_id ? "&dmdanhgia_id={0}".format(search.dmdanhgia_id) : ""}`;
    queryStr += `${search.from_date ? '&created_at[from]={0}'.format(search.from_date) : ''}`
    queryStr += `${search.to_date ? '&created_at[to]={0}'.format(search.to_date) : ''}`
    const apiResponse = await danhgiadichvubv(queryStr);
    if (apiResponse) {
      const dataRes = apiResponse;
      this.setState({
        dataRes,
      });
    }
  }

  handleRefresh = (newQuery, changeTable) => {
    const { location, history } = this.props;
    const { pathname } = location;
    if (changeTable) {
      newQuery = queryString.parse(this.props.location.search);
    }
    newQuery = Object.assign({ page: 1, limit: 10 }, newQuery);
    history.push({ pathname, search: stringify({ ...newQuery }, { arrayFormat: "repeat" }) });
  };

  thongkedanhgiadichvu(value) {
    const search = queryString.parse(this.props.location.search);
    let query = `?dmdanhgia_id=${value}`
    if(search.from_date) query += '&from_date=' + search.from_date
    if(search.to_date) query += '&to_date=' + search.to_date
    return <Tooltip placement="left" title="Xem chi tiết" color="#2db7f5">
      <Link to={`${URL.DANH_GIA_DICH_VU_BENH_VIEN}${query}`}>
        <Button icon={<EyeOutlined />} size="small" type="primary"/>
      </Link>
    </Tooltip>
  }

  render() {
    const { loading, dmdanhgia } = this.props;
    const { dataRes } = this.state
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

    ];
    return (
      <Card size="small" title={<span>&nbsp;Thống kê đánh giá dịch vụ</span>} md="24" bordered>
        <Search onFilterChange={this.handleRefresh} dataSearch={dataSearch} />
        <Table size="small" rowKey="_id" bordered dataSource={dataRes} pagination={false} loading={loading}>
          <Table.Column title="STT" render={(value, row, index) => (index + 1)} align="center"/>
          <Table.Column title="Tên danh mục đánh giá" dataIndex="dmdanhgia_id" render={value => value[0]?.tendanhgia} />
          <Table.Column title="Điểm trung bình" dataIndex="diemtrungbinh" align="center"/>
          <Table.Column title="Tổng lượt đánh giá" dataIndex="tongluotdanhgia" align="center"/>
          <Table.Column dataIndex="_id" render={(value) => this.thongkedanhgiadichvu(value)} align="center"/>
        </Table>
      </Card>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  loading: makeGetLoading()
});

const withConnect = connect(mapStateToProps);
export default compose(withConnect, withDmDanhGia)(ThongKeDanhGiaDichVuBenhVien);

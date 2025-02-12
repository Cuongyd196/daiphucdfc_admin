import React from "react";
import { Timeline, Card, Pagination } from "antd";
import {
  UnorderedListOutlined,
} from '@ant-design/icons';
import { connect } from "react-redux";
import queryString from "query-string";
import { stringify } from "qs";
import { createStructuredSelector } from "reselect";
import { getAll } from "@services/lichsuhoatdong/lichsuhoatdongService"
import { makeGetLoading } from "@containers/App/AppProvider/selectors";
import { makeGetMyInfo } from '@containers/Layout/HeaderComponent/HeaderProvider/selectors';
import Search from "@components/Search/Search";
import { timeFormatter } from '@commons/dateFormat';
import { withUser } from '@reduxApp/Users/connect';
import { compose } from 'redux';
import moment from "moment";
import 'moment/locale/fr';
moment.locale('vi');

class LichSuHoatDong extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataRes: [],
      page: 1,
      limit: 10,
      totalDocs: 0,
      _id: ""
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
    let search = queryString.parse(this.props.location.search);
    let page = parseInt(search.page ? search.page : this.state.page);
    let limit = parseInt(search.limit ? search.limit : this.state.limit);
    let queryStr = "";
    queryStr += `${search.from_date ? '&created_at[from]={0}'.format(search.from_date) : ""}`;
    queryStr += `${search.to_date ? '&created_at[to]={0}'.format(search.to_date) : ""}`;
    queryStr += `${search.thaotac ? '&thaotac={0}'.format(search.thaotac) : ""}`;
    queryStr += `${search.user_id ? '&user_id={0}'.format(search.user_id) : ""}`;
    queryStr += `${this.props.myInfoResponse ? this.props.myInfoResponse.role === "ADMIN" ? "" : '&user_id={0}'.format(this.props.myInfoResponse._id) : ""}`
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

  onChangeTable = (current, pageSize) =>{
    this.setState({ page: current, limit: pageSize }, () => this.handleRefresh({}, true));
  }

  render() {
    const { loading, user } = this.props;
    const { dataRes, totalDocs, page, limit, _id } = this.state;

    const hanhdong = [{ _id: "1", value: "Thêm" },{ _id: "2", value: "Sửa" },{ _id: "3", value: "Xoá" },{ _id: "5", value: "Trả lời" },{ _id: "6", value: "Xác nhận" },{_id: "7", value: "Gửi hình ảnh"}];

    const dataSearch = [
      {
        type: 'select',
        name: 'thaotac',
        label: 'Hành động',
        options: hanhdong,
        key: '_id',
        value: 'value'
      },
      {
        type: 'date',
        name: 'from_date',
        label: "Từ ngày",
      },
      {
        type: 'date',
        name: 'to_date',
        label: "Đến ngày",
      },
    ];

    const dataSearchAdmin =
      {
        type: 'select',
        name: 'user_id',
        label: 'Họ tên',
        options: user,
        key: '_id',
        value: 'full_name'
      };

    return (
      <div style={{background: 'white'}}>
        <Card
          size="small"
          title={
            <span>
              <UnorderedListOutlined className="icon-card-header" /> &nbsp;Lịch sử hoạt động
            </span>
          }
          md="24"
          bordered>
        <Search onFilterChange={this.handleRefresh} dataSearch={this.props.myInfoResponse.role === "ADMIN" ? [dataSearchAdmin, ...dataSearch] : dataSearch} />
        <Timeline style={{paddingTop: '20px', paddingLeft: '50px', paddingRight: '20px'}}>
          { dataRes && dataRes.length > 0 ? 
          <div>
            {dataRes.map( e => (
              <Timeline.Item key={e._id} color={e.thaotac === '1' ? "blue" : e.thaotac === '2' ? "green" : e.thaotac === '5' ? "yellow" : e.thaotac === '6' ? "violet" : "red"} >
                <p style={{ wordWrap: 'break-word'}}>
                  <a href={this.props.myInfoResponse._id === e.user_id._id? "/ho-so-ca-nhan" : "/tai-khoan"} style={{color: '#1890FF'}}>
                    {e.user_id.full_name} 
                  </a>
                  {` đã ${e.thaotac === '1' ? "thêm mới " : e.thaotac === '2' ? "sửa " : e.thaotac === '5' ? "trả lời ": e.thaotac === '6' ? "xác nhận " : e.thaotac === '7' ? "gửi hình ảnh " : "xoá "}`}
                  {e.thaotac === '3' ? e.tieude : 
                    <a href={e?.urltrang} style={{color: '#1890FF'}}>
                      {e.tieude}
                    </a>
                  }
                  {` từ trang `} 
                  <a href={`/${e?.urltrang.split("/")[1]}`} style={{color: '#1890FF'}}>
                    {e.tentrang} 
                  </a>
                </p>
                <p>
                  {`${timeFormatter(e.created_at)} (${moment(e.created_at).fromNow()})`}
                </p>
              </Timeline.Item>
            ))}
            <div className="pull-right">
              <Pagination
                size="small"
                total={totalDocs}
                showTotal={(total, range) => `${range[0]}-${range[1]} của ${total}`}
                showSizeChanger
                onShowSizeChange={this.onChangeTable}
                defaultPageSize={limit}
                defaultCurrent={page}
                onChange={this.onChangeTable}
              />
            </div>
          </div>
          :
          <p>
            Bạn không có lịch sử hoạt động
          </p>
          }
        </Timeline>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  loading: makeGetLoading(),
  myInfoResponse: makeGetMyInfo(),
});
const withConnect = connect(mapStateToProps);
export default compose(withConnect, withUser)(LichSuHoatDong);

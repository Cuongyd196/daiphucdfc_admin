import React from "react";
import { Button, Table, Card, Tooltip, Tag } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { connect } from "react-redux";
import queryString from "query-string";
import { stringify } from "qs";
import { createStructuredSelector } from "reselect";
import { Link } from 'react-router-dom'
import Search from "@components/Search/Search";
import { getAll } from "@services/lichhen/lichhenService";
import { PAGINATION_CONFIG } from "@constants";
import { makeGetLoading } from "@containers/App/AppProvider/selectors";
import { URL } from "@url";
import moment from 'moment';
class LichHen extends React.Component {
  columns = [
    {
      title: 'STT',
      render: (value, row, index) => (this.state.page - 1) * this.state.limit + (index + 1),
      width: 60,
      align: "center",
    },
    {
      title: "Bệnh nhân",
      render: (value) => <div>
        <div>{value?.mabn?.hoten}</div>
        <div className="text-xs text-blue-500">-Mã BN: {value?.mabn?._id}</div>
      </div>,
    },
    {
      title: "Bác sỹ",
      render: (value) => <div className="text-xs text-blue-500">{value?.bacsy_id?.tennv}</div>
    },
    {
      title: 'Lý do đặt lịch',
      dataIndex: 'trieuchung',
      render: value => this.lydoFormatter(value)
    },
    {
      title: "Ngày đặt lịch hẹn",
      dataIndex: 'ngaydatlich',
      render: (value, row) => moment(value).format('DD/MM/YYYY - H:mm'),
      width: 150,
      align: 'center'
    },

    {
      title: "Trạng thái",
      render: (value) => {
        if (value?.tabindex === 0) {
          return <Tag icon={<ExclamationCircleOutlined  />} color="error" className="font-medium">Mới đặt lịch</Tag>
        }
        else if (value?.tabindex === 1) {
          return <Tag icon={<CheckCircleOutlined />} color="warning" className="font-medium">Đã xác nhận</Tag>
        }

        else if (value?.tabindex === 2) {
          return <Tag icon={<CloseCircleOutlined  />} color="success" className="font-medium">Đã khám</Tag>
        }
      },
      align: 'center',
      width: 100
    },
    {
      title: "Mã KCB",
      render: (value) => {
        if(value.tabindex !== 0 && value.makcb){
          return <Link to={URL.QL_DANGKYKHAM_ID.format(value.makcb?._id)}>
            {value.makcb?._id}
          </Link>
        }
        return ''
      },
      width: 160
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
      _id: ""
    };
    this.formRef = React.createRef();
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
    queryStr += `${search.from_date ? '&thoigian[from]={0}'.format(search.from_date) : ""}`;
    queryStr += `${search.to_date ? '&thoigian[to]={0}'.format(search.to_date) : ""}`;
    queryStr += `${search.from_date_1 ? '&ngaytraloi[from]={0}'.format(search.from_date_1) : ""}`;
    queryStr += `${search.to_date_1 ? '&ngaytraloi[to]={0}'.format(search.to_date_1) : ""}`;
    queryStr += `${search.mabn ? "&mabn[like]={0}".format(search.mabn) : ""}`;
    queryStr += `${search.tenbn ? "&tenbn[like]={0}".format(search.tenbn) : ""}`;
    queryStr += `${search.tabindex ? "&tabindex={0}".format(search.tabindex) : ""}`;
    queryStr += `${search.loaitaikhoan ? "&loaitaikhoan={0}".format(search.loaitaikhoan) : ""}`
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

  lydoFormatter(value) {
    if (value && value.length > 400)
      return value.slice(0, 400) + " ..."
    return value
  }

  formatActionCell(value) {
    return <Tooltip placement="left" title="Xem chi tiết" color="#2db7f5">
      <Link to={URL.LICH_HEN_ID.format(value._id)}>
        <Button icon={<EditOutlined />} size="small" type="primary"/>
      </Link>
    </Tooltip>
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
    const { loading } = this.props;
    const { dataRes, totalDocs, page, limit, _id } = this.state;
    const trangthai_sc = [{ _id: 0, tabindex: "Mới đặt lịch" },
    { _id: 1, tabindex: "Đã xác nhận" },
    { _id: 2, tabindex: "Đã khám" }];

    const loaitaikhoan = [{ _id: "1", value: "Tài khoản His" },{ _id: "2", value: "Tài khoản App" }];
    const dataSearch = [
      {
        name: "mabn",
        label: "Mã bệnh nhân",
        type: "text"
      },
      {
        name: "tenbn",
        label: "Tên bệnh nhân",
        type: "text"
      },
      {
        type: 'date',
        name: 'from_date',
        label: "Từ ngày hẹn",
      },
      {
        type: 'date',
        name: 'to_date',
        label: "Đến ngày hẹn",
      },
      {
        type: 'select',
        name: 'tabindex',
        label: 'Trạng thái',
        options: trangthai_sc,
        key: '_id',
        value: 'tabindex'
      },
      {
        type: 'select',
        name: 'loaitaikhoan',
        label: 'Loại tài khoản',
        options: loaitaikhoan,
        key: '_id',
        value: 'value'
      },
    ];

    return (
      <div>
        <Card
          size="small"
          title={
            <span>
              <UnorderedListOutlined className="icon-card-header" /> &nbsp;Danh sách lịch hẹn
            </span>
          }
          md="24"
          bordered>
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
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  loading: makeGetLoading()
});

export default connect(mapStateToProps)(LichHen);

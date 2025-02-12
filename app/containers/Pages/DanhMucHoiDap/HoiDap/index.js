import React from "react";
import { Button, Table, Card, Tooltip, Tag } from "antd";
import {
  EditOutlined,
  UnorderedListOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";

import { connect } from "react-redux";
import queryString from "query-string";
import { stringify } from "qs";
import { createStructuredSelector } from "reselect";
import { Link } from 'react-router-dom'

import Search from "@components/Search/Search";
import { getAll } from "@services/danhmucchung/hoidap/hoidapService";
import { getAll as getAllDmHoiDap} from "@services/danhmucchung/hoidap/danhmuchoidapService";
import { getAll as getAllDmNhanVien } from "@services/danhmucchung/nhanvienService";
import { PAGINATION_CONFIG } from "@constants";
import { makeGetLoading } from "@containers/App/AppProvider/selectors";
import { dateFormatter } from '@commons/dateFormat';
import { URL } from "@url";
class CauHoi extends React.Component {
  columns = [
    {
      title: 'STT',
      render: (value, row, index) => (this.state.page - 1) * this.state.limit + (index + 1),
      width: 60,
      align: "center",
    },
    {
      title: "Ngày hỏi",
      dataIndex: 'created_at',
      render: (value) => dateFormatter(value),
      width: 90,
    },
    {
      title: "Bệnh nhân hỏi",
      dataIndex: ['mabn', 'hoten'],
      width: 150,
    },
    {
      title: "Hỏi bác sĩ",
      dataIndex: ['bacsi_id', 'tennv'],
      width: 150,
    },
    {
      title: 'Danh mục câu hỏi',
      width: 140,
      dataIndex: ['madm', 'tendm']
    },
    {
      title: "Câu hỏi",
      dataIndex: 'cauhoi',
      render: (value) => this.cauhoiFormatter(value),
    },
    {
      title: "Trạng thái",
      render: (value) => {
        if (value?.trangthai === 1) {
          return <Tag icon={<ExclamationCircleOutlined  />} color="warning" className="font-medium">Đang chờ</Tag>
        }
        if (value?.trangthai === 2) {
          return <Tag icon={<CheckCircleOutlined />} color="success" className="font-medium">Đã trả lời</Tag>
        }
        if (value?.trangthai === 3) {
          return <Tag icon={<CloseCircleOutlined  />} color="error" className="font-medium">Từ chối</Tag>
        }
        if (value?.trangthai === 4) {
          return <Tag icon={<CloseCircleOutlined  />} color="magenta" className="font-medium">Bỏ qua</Tag>
        }
      },
      width: 85,
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
      _id: "",
      dmhoidap: [],
      dmbacsi: [],
    };
    this.formRef = React.createRef();
  }

  async componentDidMount() {
    this.getDataFilter();
    let dmhoidap = await getAllDmHoiDap(1, 0, '&trangthai=true')
    if(dmhoidap) this.setState({dmhoidap: dmhoidap.docs})
    let dmbacsi = await getAllDmNhanVien(1, 0, '&bacsikham=true');
    if(dmbacsi) this.setState({dmbacsi: dmbacsi.docs})
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
    queryStr += `${search.from_date ? '&created_at[from]={0}'.format(search.from_date) : ''}`
    queryStr += `${search.to_date ? '&created_at[to]={0}'.format(search.to_date) : ''}`
    queryStr += `${search.madm ? '&madm={0}'.format(search.madm) : ''}`
    queryStr += `${search.cauhoi ? "&cauhoi[like]={0}".format(search.cauhoi) : ""}`;
    queryStr += `${search.trangthai ? "&trangthai={0}".format(search.trangthai) : ""}`;
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

  cauhoiFormatter(value) {
    if (value.length > 300)
      return value.slice(0, 300) + " ..."
    else
      return value.slice(0, 300)
  }

  formatActionCell(value) {
    return (
      <>
        <Tooltip placement="left" title="Xem chi tiết" color="#2db7f5">
          <Link
            to={URL.HOIDAP_ID.format(value._id)}>
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
    const trangthai_sc = [
      { _id: 1, trangthai: 'Đang chờ' },
      { _id: 2, trangthai: 'Đã trả lời' },
      { _id: 3, trangthai: 'Bị từ chối' },
      { _id: 4, trangthai: 'Bỏ qua' },
    ];

    const dataSearch = [
      {
        name: "from_date",
        label: "Từ ngày",
        type: "date"
      },
      {
        name: "to_date",
        label: "Đến ngày",
        type: "date"
      },
      {
        name: "cauhoi",
        label: "Câu hỏi",
        type: "text",
        operation: "like",
      },
      {
        type: 'select',
        name: 'bacsi_id',
        label: 'Hỏi bác sĩ',
        options: this.state.dmbacsi,
        key: '_id',
        value: 'tennv'
      },
      {
        type: 'select',
        name: 'trangthai',
        label: 'Trạng thái',
        options: trangthai_sc,
        key: '_id',
        value: 'trangthai'
      },
      {
        type: 'select',
        name: 'madm',
        label: 'Danh mục',
        options: this.state.dmhoidap,
        key: '_id',
        value: 'tendm'
      }
    ];

    return (
      <div>
        <Card
          size="small"
          title={
            <span>
              <UnorderedListOutlined className="icon-card-header" /> &nbsp;Danh sách hỏi đáp-góp ý
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

export default connect(mapStateToProps)(CauHoi);

import React from "react";
import { Button, Table, Card, Tooltip, Tag, Modal, Form } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, CloseOutlined, SaveOutlined, EditOutlined, ExclamationCircleOutlined, UnorderedListOutlined, EyeOutlined, ClockCircleTwoTone, UsergroupAddOutlined } from '@ant-design/icons';
import { connect } from "react-redux";
import queryString from "query-string";
import { stringify } from "qs";
import { createStructuredSelector } from "reselect";
import { Link } from 'react-router-dom'
import Search from "@components/Search/Search";
import { getAll } from "@services/danhmucdichvu/dkgoidichvuService";
import { PAGINATION_CONFIG } from "@constants";
import { makeGetLoading } from "@containers/App/AppProvider/selectors";
import { dateFormatter, timeFormatter } from '@commons/dateFormat';
import { URL } from "@url";
import moment from 'moment';
class DangKyGoiDichVu extends React.Component {
  columns = [
    {
      title: 'STT',
      render: (value, row, index) => (this.state.page - 1) * this.state.limit + (index + 1),
      width: 60,
      align: "center",
    },
    {
      title: "Bệnh nhân",
      width: 200,
      dataIndex: 'benhnhan_id',
      render: (value, row) => <div>
        <div>{value?.hoten}</div>
        <div className="text-xs">-Mã BN: {value?._id}</div>
        {
          !row.dangkybn && <div className="text-xs text-blue-500 font-medium">
            -Đăng ký {row?.nguoithan_id?.moiquanhe}: {row?.nguoithan_id?.hoten}
          </div>
        }
      </div>
    },
    {
        title: "Gói dịch vụ",
        render: (value) => value?.goidichvu_id?.tengoi,
    },
    {
        title: "Ngày đăng ký",
        dataIndex: 'ngaydangky',
        render: (value, row) => moment(value).format('DD/MM/YYYY') + '-' + moment(value).format('HH:mm'),
        width: 150,
        align: 'center'
    },
    {
      title: 'Tổng gói khám',
      width: 150,
      render: value => this.formatTongGoiKham(value)
    },
    {
      title: "Trạng thái",
      render: (value) => {
        if (value?.trangthai === -1) {
          return <Tag icon={<ExclamationCircleOutlined  />} color="warning" className="font-medium">Đang chờ</Tag>
        }
        if (value?.trangthai === 1) {
          return <Tag icon={<CheckCircleOutlined />} color="success" className="font-medium">Đã xác nhận</Tag>
        }
        if (value?.trangthai === 2) {
          return <Tag icon={<CheckCircleOutlined />} color="processing" className="font-medium">Đã trả kết quả</Tag>
        }
        if (value?.trangthai === 0) {
          return <Tag icon={<CloseCircleOutlined  />} color="error" className="font-medium">Từ chối</Tag>
        }
      },
      align: 'center',
      width: 100
    },
    {
      title: "Thông tin xác nhận",
      render: (value) => {
        if(value.trangthai !== -1){
          return <>
            <div><ClockCircleTwoTone /> {timeFormatter(value?.ngayxacnhan)}</div>
            <div><UsergroupAddOutlined /> {(value?.user_id?.full_name)}</div>
          </>
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
      dataResModal: [],
      page: 1,
      limit: 10,
      totalDocs: 0,
      _id: "",
      showModal: false,
    };
    this.columnsModal = [
      {
        title: 'Tên dịch vụ',
        dataIndex: 'magiadichvu',
        render: value => value?.tenhh
      },
      {
        title: 'Giá dịch vụ',
        width: 150,
        dataIndex: 'giadichvu',
      },
    ];
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
    queryStr += `${search.from_date ? '&ngaydangky[from]={0}'.format(search.from_date) : ""}`;
    queryStr += `${search.to_date ? '&ngaydangky[to]={0}'.format(search.to_date) : ""}`;
    queryStr += `${search.from_date_1 ? '&ngayxacnhan[from]={0}'.format(search.from_date_1) : ""}`;
    queryStr += `${search.to_date_1 ? '&ngayxacnhan[to]={0}'.format(search.to_date_1) : ""}`;
    queryStr += `${search.tengoi ? "&tengoi[like]={0}".format(search.tengoi) : ""}`;
    queryStr += `${search.tenbn ? "&tenbn[like]={0}".format(search.tenbn) : ""}`;
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

  lydoFormatter(value) {
    if (value.length > 400)
      return value.slice(0, 400) + " ..."
    return value
  }

  formatActionCell(value) {
    return <Tooltip placement="left" title="Xem chi tiết" color="#2db7f5">
      <Link to={URL.DK_GOI_DICH_VU_ID.format(value._id)}>
        <Button icon={<EditOutlined />} size="small" type="primary"/>
      </Link>
    </Tooltip>
  }

  formatTongGoiKham(value){
      return <div>
        <span>Có {value.dichvu.length ? value.dichvu.length  : 0} dịch vụ</span>
        <Tooltip className="pull-right" color="#2db7f5">
          <Button icon={<EyeOutlined />} onClick={() => this.showModal(value.dichvu)} size="small" type="primary"/>
        </Tooltip>
      </div>
  }

  showModal(value){
    const { showModal } = this.state;
    this.setState({
      showModal: !showModal,
      dataResModal: value
    })
  }

  toggleModal = async () => {
    const { showModal } = this.state;
    await this.setState({ showModal: !showModal });
  };

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
    const trangthai_sc = [{ _id: 0, trangthai: "Từ chối" },
    { _id: 1, trangthai: "Đã xác nhận" },
    { _id: 2, trangthai: "Đã trả kết quả" }];

    const dataSearch = [
      {
        name: "tenbn",
        label: "Tên bệnh nhân",
        type: "text"
      },
      {
        name: "tengoi",
        label: "Tên gói dịch vụ",
        type: "text"
      },
      {
        type: 'date',
        name: 'from_date',
        label: "Ngày đăng ký",
      },
      {
        type: 'date',
        name: 'to_date',
        label: "Đến ngày",
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
        type: 'date',
        name: 'from_date_1',
        label: "Ngày xác nhận",
      },
      {
        type: 'date',
        name: 'to_date_1',
        label: "Đến ngày",
      },
    ];

    return (
      <div>
        <Card
          size="small"
          title={
            <span>
              <UnorderedListOutlined className="icon-card-header" /> &nbsp;Danh sách đăng ký gói dịch vụ
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
        <Modal
          title={"Chi tiết dich vụ trong gói"}
          visible={this.state.showModal}
          onCancel={loading ? () => null : this.toggleModal}
          footer={false}
        >
          <Table columns={this.columnsModal} dataSource={this.state.dataResModal} pagination={{ position:['none', 'none'] }} scroll={{ y: 400 }} />
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  loading: makeGetLoading()
});

export default connect(mapStateToProps)(DangKyGoiDichVu);

import React, { Component,} from 'react';
import { Input, Button, Form, Table, Popconfirm, message, Card, Tooltip, Modal } from "antd";
import { DeleteOutlined, PrinterOutlined, PlusOutlined, UnorderedListOutlined, EyeOutlined } from '@ant-design/icons';
import { getById, getAll} from '@services/danhmucthuoc/thuocvavattuService';
import { PAGINATION_CONFIG } from '@constants';
import { createStructuredSelector } from 'reselect';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';
import { connect } from 'react-redux';
import Search  from "@components/Search/Search";
import { stringify } from 'qs';
import queryString from 'query-string';
import { compose } from 'redux';
import { withThuoc } from '@reduxApp/Thuoc/connect';

class ThuocVaVatTu extends Component {

  columns = [
    {
        title: 'STT',
        render: (limit, page, value) => this.formatSTT(this.state.limit, this.state.page, value),
        width: 5,
    },
    {
        title: 'Mã thuốc',
        dataIndex: '_id',
        width: 20,
    },
    {
      title: 'Tên thuốc',
      dataIndex: 'tenhh',
      width: 60,
    },
    {
        title: 'Thông tin thuốc',
        width: 170,
        render: (value, rowData, rowIndex) => {
          return <>
            <div>-Nhóm thuốc: {rowData?.manhomthuoc?.tennhomthuoc}</div>
            <div>-Hoạt chất: {rowData?.mahoatchat?.tenhoatchat}</div>
            <div>-Đường dong: {rowData?.maduongdung?.tenduongdung}</div>
          </>
        }
    },
    {
        title: 'Thông tin chung thuốc',
        width: 170,
        render: (value, rowData, rowIndex) => {
          return <>
            <div>-Hàm lượng: {rowData?.hamluong}</div>
            <div>-Hãng sản xuất: {rowData?.hangsanxuat}</div>
            <div>-Năm sản xuất: {rowData?.namsanxuat}</div>
          </>
        }
    },
    {
        title: 'Thông tin dịch vụ',
        width: 170,
        render: (value, rowData, rowIndex) => {
          return <>
            <div>-Loại dịch vụ: {rowData?.maloaidichvu?.tenloaidichvu}</div>
            <div>-Đơn vị tính: {rowData?.madonvitinh?.tendonvitinh}</div>
          </>
        }
    },
    {
        title: 'Tên BHYT',
        dataIndex: 'tenbhyt',
        width: 100,
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      dataRes: [],
      page: 1,
      limit: 10,
      totalDocs: 0,
      _id: "",
    };
    this.formRef = React.createRef();
  }

  async  componentDidMount() {
    this.getDataFilter();
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.search !== prevProps.location.search) {
      this.getDataFilter()
    }
  }

  async getDataFilter() {
    let search = queryString.parse(this.props.location.search);
    let page = parseInt(search.page ? search.page : this.state.page);
    let limit = parseInt(search.limit ? search.limit : this.state.limit);
    let queryStr = ''
    queryStr += `${search._id ? '&_id={0}'.format(search._id) : ''}`
    queryStr += `${search.madichvu ? '&madichvu={0}'.format(search.madichvu) : ''}`
    queryStr += `${search.maloaidichvu ? '&maloaidichvu={0}'.format(search.maloaidichvu) : ''}`
    queryStr += `${search.mahoatchat ? '&mahoatchat={0}'.format(search.mahoatchat) : ''}`
    queryStr += `${search.manhomthuoc ? '&manhomthuoc={0}'.format(search.manhomthuoc) : ''}`
    queryStr += `${search.maduongdung ? '&maduongdung={0}'.format(search.maduongdung) : ''}`
    const apiResponse = await getAll(page, limit, queryStr);
    const dataRes = apiResponse.docs;
    if (apiResponse) {
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

  handleRefresh = (newQuery, changeTable) => {
    const { location, history } = this.props;
    const { pathname } = location;
    let {page, limit} = this.state;
    let objFilterTable = {page, limit }
    if(changeTable){
      newQuery = queryString.parse(this.props.location.search)
      delete newQuery.page
      delete newQuery.limit
    }
    newQuery = Object.assign(objFilterTable, newQuery);
    history.push({ pathname, search: stringify({ ...newQuery }, { arrayFormat: "repeat" })
    });
  };

  onChangeTable = (page) => {
    this.setState({page: page.current, limit: page.pageSize},
      () => {this.handleRefresh({},true)})
  }

  render() {
    const { loading, dv, dvt, loaidv, hoatchat, nhomthuoc, duongdung } = this.props;

    const { dataRes, totalDocs, page, limit } = this.state;
    const dataSearch = [
    {
        type: 'text',
        name: '_id',
        label: 'Mã thuốc'
    },
    {
      type: 'text',
      name: 'tenhh',
      label: 'Tên thuốc'
   },
    {
        type: 'select',
        name: 'maloaidichvu',
        label: 'Loại dịch vụ',
        options: loaidv,
        key: '_id',
        value: 'tenloaidichvu',
    },
    {
        type: 'select',
        name: 'manhomthuoc',
        label: 'Nhóm thuốc',
        options: nhomthuoc,
        key: '_id',
        value: 'tennhomthuoc',
    },
    {
        type: 'select',
        name: 'mahoatchat',
        label: 'Hoạt chất',
        options: hoatchat,
        key: '_id',
        value: 'tenhoatchat',
    },
    {
        type: 'select',
        name: 'maduongdung',
        label: 'Đường dùng',
        options: duongdung,
        key: '_id',
        value: 'tenduongdung',
    },
    {
        type: 'select',
        name: 'madonvitinh',
        label: 'Đơn vị tính',
        options: dvt,
        key: '_id',
        value: 'tendonvitinh',
    }]
    return <div>
      <Card size="small" title={<span>
        <UnorderedListOutlined className="icon-card-header"/> &nbsp;Danh mục bệnh
      </span>}>
        <Search onFilterChange={this.handleRefresh} dataSearch={dataSearch}/>
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
    </div>;
  }
}

const mapStateToProps = createStructuredSelector({
  loading: makeGetLoading()
});


const withConnect = connect(mapStateToProps);
export default compose(withConnect, withThuoc)(ThuocVaVatTu);



import React, { Component } from 'react';
import { Input, Button, Form, Table, Popconfirm, message, Card, Tooltip } from 'antd';
import { DeleteOutlined, PlusOutlined, UnorderedListOutlined, EyeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { getAll, deleteById } from '@services/danhmucdichvu/goidichvuService';
import { getAll as getAllGoiDichVu } from '@services/danhmucdichvu/dmgoidichvuService';
import { PAGINATION_CONFIG } from '@constants';
import { createStructuredSelector } from 'reselect';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';
import { connect } from 'react-redux';
import Search from '@components/Search/Search';
import { stringify } from 'qs';
import { compose } from 'redux';
import queryString from 'query-string';
import { URL } from '../../../../constants/URL';
import { makeGetPermission } from '@containers/Layout/HeaderComponent/HeaderProvider/selectors';

class GoiDichVu extends Component {

  columns = [
    {
      title: 'STT',
      render: (value, row, index) => (this.state.page - 1) * this.state.limit + (index + 1),
      width: 50,
      align: 'center',
    },
    {
      title: 'Tên gói',
      dataIndex: 'tengoi',
      width: 350,
    },
    {
      title: 'Tổng số dịch vụ',
      dataIndex: 'dichvu',
      width: 70,
      render: (value) => this.formatTongDichVu(value),
      align: 'center',
    },
    {
      title: 'Hành động',
      render: (value) => this.formatActionCell(value),
      width: 60,
      align: 'center',
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      dataRes: [],
      page: 1,
      limit: 10,
      totalDocs: 0,
      dmgoidichvu: [],
    };
    this.url = 'quan-ly-dich-vu';
  }

  async componentDidMount() {
    let dmgoidichvu = await getAllGoiDichVu(1, 0);
    if (dmgoidichvu) {
      this.setState({ dmgoidichvu: dmgoidichvu.docs });
    }
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
    let queryStr = '';
    queryStr += `${search.dmgoidichvu_id ? '&dmgoidichvu_id={0}'.format(search.dmgoidichvu_id) : ''}`;
    queryStr += `${search.tengoi ? '&tengoi[like]={0}'.format(search.tengoi) : ''}`;
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

  async handleDelete(value) {
    const apiResponse = await deleteById(value._id);
    if (apiResponse) {
      this.getDataFilter();
      message.success('Xoá thành công');
    }
  }

  formatTongDichVu(value) {
    if (value)
      return <>
        <div style={{ color: '#54ce12' }}> Có {value} dịch vụ</div>
      </>;
    else
      return <>
        <div style={{ color: '#F7424C' }}> Không có dịch vụ</div>
      </>;
  }

  formatActionCell(value) {
    let { myPermission } = this.props;
    return (
      <>
        <Link to={URL.GOI_DICH_VU_ID.format(value._id)}>
          <Tooltip title={'Xem chi tiết'} color="#2db7f5">
            <Button icon={<EyeOutlined/>} size='small' type="primary" className='mr-1'></Button>
          </Tooltip>
        </Link>
        {
          myPermission?.[this.url]?.xoa &&
          <Popconfirm
            key={value._id}
            title="Bạn chắc chắn muốn xoá?"
            onConfirm={() => this.handleDelete(value)}
            okText="Xoá"
            cancelText="Huỷ"
            okButtonProps={{ type: 'danger' }}
          >
            <Tooltip placement="right" title="Xóa dữ liệu" color="#f50">
              <Button icon={<DeleteOutlined/>} type="danger" size="small" className="mr-1"/>
            </Tooltip>
          </Popconfirm>
        }
      </>);
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
    history.push({
      pathname, search: stringify({ ...newQuery }, { arrayFormat: 'repeat' }),
    });
  };

  onChangeTable = (page) => {
    this.setState({ page: page.current, limit: page.pageSize },
      () => {
        this.handleRefresh({}, true);
      });
  };

  render() {
    const { loading, myPermission } = this.props;
    const { dataRes, totalDocs, page, limit, _id } = this.state;
    const dataSearch = [{
      type: 'select',
      name: 'dmgoidichvu_id',
      label: 'Danh mục gói',
      options: this.state.dmgoidichvu,
      key: '_id',
      value: 'tendmgoidv',
    }, {
      type: 'text',
      name: 'tengoi',
      label: 'Tên gói',
    }];
    return <div>
      <Card size="small" title={<span>
        <UnorderedListOutlined className="icon-card-header"/> &nbsp;Danh sách các gói dịch vụ
        </span>}
            md="24"
            bordered
            extra={
              myPermission?.[this.url]?.them &&
              <Link to={`${URL.GOI_DICH_VU}/add`}>
                <Button type="primary" className='pull-right' size="small" icon={<PlusOutlined/>}>Thêm</Button>
              </Link>}>
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
  loading: makeGetLoading(),
  myPermission: makeGetPermission()
});
const withConnect = connect(mapStateToProps);
export default compose(withConnect)(GoiDichVu);



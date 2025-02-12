import React from 'react';
import moment from 'moment';
import { Button, Form, Table, Popconfirm, message, Modal, Card, Tooltip } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  CloseOutlined,
  SaveOutlined, EyeOutlined,
} from '@ant-design/icons';

import { connect } from 'react-redux';
import queryString from 'query-string';
import { stringify } from 'qs';
import { createStructuredSelector } from 'reselect';

import { add, getAll, delById, updateById } from '@services/qlthoigianlamviec/qlthoigianService';

import { getAll as getAllBacSy } from '@services/danhmucchung/nhanvienService';

import { PAGINATION_CONFIG } from '@constants';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';
import { dateFormatter } from '@commons/dateFormat';
import DatePicker from 'antd/es/date-picker';
import { Link } from 'react-router-dom';
import { URL } from '@url';
import { makeGetPermission } from '@containers/Layout/HeaderComponent/HeaderProvider/selectors';
import Search from '@components/Search/Search';
import { getAllLichLamViec } from '@services/qlthoigianlamviec/quanlylichlamviecService';

class LichBacSy extends React.Component {
  columns = [
    {
      title: 'STT',
      render: (value, row, index) => (this.state.page - 1) * this.state.limit + (index + 1),
      align: 'center',
    },
    {
      title: 'Ngày',
      dataIndex: 'ngay',
      render: value => dateFormatter(value),
      align: 'center',
      width: 200,
    },
    {
      title: 'Chi tiết',
      dataIndex: 'bacsy_idLich',
      render: (value, rowData) => {
        return <>
          <div>- Ca sáng bác sĩ: {rowData?.casang_bacsy_id.map(data => {
            return data.tennv + ', ';
          })}</div>
          <div>- Ca chiều bác sĩ: {rowData?.cachieu_bacsy_id.map(data => {
            return data.tennv + ', ';
          })}</div>
          <div>- Ca tối bác sĩ: {rowData?.catoi_bacsy_id.map(data => {
            return data.tennv + ', ';
          })}</div>
        </>;
      },
    },
    {
      title: '',
      align: 'center',
      width: 90,
      render: value => this.formatActionCell(value),
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      dataRes: [],
      page: 1,
      limit: 10,
      totalDocs: 0,
      _id: '',
      dataDoctor: []
    };
    this.formRef = React.createRef();
    this.url = 'quan-ly-thoi-gian';
  }

  async componentDidMount() {
    this.getDataFilter();
    this.getDataDoctor();
  }

  async getDataDoctor() {
    let queryStr = '';
    queryStr += `${'&bacsikham={0}'.format(true)}`;
    const apiResponse = await getAllBacSy(1, 0, queryStr);
    if (apiResponse) {
      this.setState({ dataDoctor: apiResponse.docs });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.search !== prevProps.location.search) {
      this.getDataFilter();
    }
  }

  async getDataFilter() {

    let search = queryString.parse(this.props.location.search);
    let page = parseInt(search.page ? search.page : this.state.page);
    let limit = parseInt(search.limit ? search.limit : this.state.limit);
    let queryStr = ''

    queryStr += `${search.from_date ? '&ngay[from]={0}'.format(search.from_date) : ''}`
    queryStr += `${search.to_date ? '&ngay[to]={0}'.format(search.to_date) : ''}`
    queryStr += `${search.bacsy_id ? '&bacsy_id={0}'.format(search.bacsy_id) : ''}`
    if(search.calamviec){
      if(search.calamviec === 'casang')
        queryStr += `&casang=true`
      else if(search.calamviec === 'cachieu')
        queryStr += `&cachieu=true`
      else if(search.calamviec === 'catoi')
        queryStr += `&catoi=true`
    }

    queryStr += `${'&sort_by=ngay'}`;
    const apiResponse = await getAllLichLamViec(page, limit, queryStr);
    if (apiResponse) {
      this.setState({
        dataRes: apiResponse.docs,
        totalDocs: apiResponse.totalDocs,
        limit: apiResponse.limit,
        page: apiResponse.page
      });
    }
  }

  toggleModal = async () => {
    const { showModal } = this.state;
    await this.setState({ showModal: !showModal, _id: '' });
    this.formRef.current.resetFields();
  };

  formatActionCell(value) {
    return <Tooltip placement="left" title="Xem chi tiết" color="#2db7f5">
      <Link to={URL.QL_THOI_GIAN_ID.format(value.ql_thoigian_id)}>
        <Button
          icon={<EyeOutlined/>}
          size="small"
          type="primary"
          className="mr-1"/>
      </Link>
    </Tooltip>
  }

  handleRefresh = (newQuery, changeTable) => {
    const { location, history } = this.props;
    const { pathname } = location;
    let { page, limit } = this.state;
    let objFilterTable = { page, limit };
    if (changeTable) {
      newQuery = queryString.parse('');
      delete newQuery.page;
      delete newQuery.limit;
    }
    newQuery = Object.assign(objFilterTable, newQuery);
    history.push({ pathname, search: stringify({ ...newQuery }, { arrayFormat: 'repeat' }) });
  };

  onChangeTable = page => {
    this.setState({ page: page.current, limit: page.pageSize }, () => this.handleRefresh({}, true));
  };

  render() {
    const { loading } = this.props;
    const { dataRes, totalDocs, page, limit, _id } = this.state;
    const dataSearch = [
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
        name: 'bacsy_id',
        label: 'Bác sỹ',
        options: this.state.dataDoctor,
        key: '_id',
        value: 'tennv'
      },
      {
        type: 'select',
        name: 'calamviec',
        label: 'Ca làm việc',
        options: [{_id: 'casang', value: 'Ca sáng'}, {_id: 'cachieu', value: 'Ca chiều'}, {_id: 'catoi', value: 'Ca tối'}],
        key: '_id',
        value: 'value'
      }
    ]
    return (
      <div>
        <Card
          size="small"
          title={<span><UnorderedListOutlined className="icon-card-header"/> &nbsp;Danh sách lịch làm việc</span>}
          md="24"
          bordered>
          <Search onFilterChange={this.handleRefresh} dataSearch={dataSearch} layoutBtn={{xs: 24}}/>
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
              total: totalDocs,
            }}
            onChange={this.onChangeTable}
          />
        </Card>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  loading: makeGetLoading(),
  myPermission: makeGetPermission(),
});

export default connect(mapStateToProps)(LichBacSy);

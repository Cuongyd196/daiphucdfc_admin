import React, { Component } from 'react';
import { Input, Button, Table, Card, Tooltip, Modal, Popconfirm, message } from 'antd';
import { UnorderedListOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAll, add, update, delById } from '@services/danhmuchanhchinh/danhmucquoctichService';
import { PAGINATION_CONFIG } from '@constants';
import { createStructuredSelector } from 'reselect';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';
import { connect } from 'react-redux';
import Search from '@components/Search/Search';
import { stringify } from 'qs';
import queryString from 'query-string';
import { compose } from 'redux';
import { makeGetPermission } from '@containers/Layout/HeaderComponent/HeaderProvider/selectors';

class DanhMucQuocTich extends Component {

  columns = [
    {
      title: 'STT',
      render: (value, row, index) => (this.state.page - 1) * this.state.limit + (index + 1),
      width: 60,
      align: 'center',
    },
    {
      title: 'Quốc tịch',
      dataIndex: 'tenquoctich',
    },
    {
      title: 'Hành động',
      width: 90,
      align: 'center',
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
      quoctich: '',
      showModal: false,
    };
    this.url = 'dmquoctich';
  }

  componentDidMount() {
    this.getDataFilter();
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
    let queryStr = '';
    queryStr += `${search.tenquoctich ? '&tenquoctich[like]={0}'.format(search.tenquoctich) : ''}`;
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

  formatActionCell(value) {
    const { myPermission } = this.props;
    return (
      <>
        {myPermission?.[this.url]?.sua &&
        <Tooltip placement="left" title="Cập nhật thông tin" color="#2db7f5">
          <Button icon={<EditOutlined/>} size="small" type="primary" className="mr-1"
                  onClick={() => {this.setState({showModal: true, quoctich: value.tenquoctich, _id: value._id})}}/>
        </Tooltip>
        }
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
      </>
    );
  }

  async handleDelete(value) {
    const apiResponse = await delById(value._id);
    if (apiResponse) {
      this.getDataFilter();
      message.success('Xoá dữ liệu thành công');
    }
  }

  toggleModal = async () => {
    await this.setState({ showModal: false, _id: '', quoctich: '' });
  };

  inputChange = (e) => this.setState({ quoctich: e.target.value });

  saveData = async () => {
    const { quoctich, _id } = this.state;
    const regex = /^\s+$/;
    if (regex.test(quoctich) === true || quoctich ==='' || !quoctich )
      message.error('Tên quốc tịch không được để trống');
    else {
      const dataSave = { tenquoctich: quoctich };
      if (!_id) {
        const apiResponse = await add(dataSave);
        if (apiResponse) {
           this.setState({ showModal: false, quoctich: '' });
          this.getDataFilter();
          message.success('Thêm dữ liệu thành công');
        }
      } else {
        const apiResponse = await update(dataSave, _id);
        if (apiResponse) {
          const dataRes = this.state.dataRes.map(data => {
            if (data._id === apiResponse._id) {
              return apiResponse;
            }
            return data;
          });
          await this.setState({ showModal: false, quoctich: '', _id: '', dataRes });
          message.success('Cập nhật dữ liệu thành công');
        }
      }
    }
  };

  render() {
    const { loading, myPermission } = this.props;
    const { dataRes, totalDocs, page, limit, _id } = this.state;
    const dataSearch = [
      {
        type: 'text',
        name: 'tenquoctich',
        label: 'Quốc tịch',
      }];
    return <div>
      <Card size="small" title={<span>
        <UnorderedListOutlined className="icon-card-header"/> &nbsp;Danh mục quốc tịch
      </span>}
            extra={
              myPermission?.[this.url]?.them &&
              <Button type="primary" size="small" icon={<PlusOutlined/>} className="pull-right"
                      onClick={() => this.setState({ showModal: true })}>
                Thêm
              </Button>
            }>
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
      <Modal
        visible={this.state.showModal}
        footer={[
          <Button key="back" onClick={this.toggleModal}>
            Huỷ
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={this.saveData}>
            Lưu dữ liệu
          </Button>
        ]}
        onCancel={loading ? () => null : this.toggleModal}
        width={400}
        style={{ top: 30 }}
      >
        <div>
          {_id ? <center><b style={{ color: '#40A8FF' }}>CẬP NHẬT QUỐC TỊCH</b></center> :
            <center><b style={{ color: '#40A8FF' }}>THÊM TÊN QUỐC TỊCH</b></center>
          }
          <br/>
          <div><Input onChange={this.inputChange} placeholder="Nhập quốc tịch" value={this.state.quoctich}/></div>
        </div>
      </Modal>
    </div>;
  }
}

const mapStateToProps = createStructuredSelector({
  loading: makeGetLoading(),
  myPermission: makeGetPermission(),
});


const withConnect = connect(mapStateToProps);
export default compose(withConnect)(DanhMucQuocTich);



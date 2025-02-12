import React, { Component } from 'react';
import { Input, Button, Form, Table, Skeleton, message, Card, Tooltip, Modal, Switch, Checkbox } from 'antd';
import { UnorderedListOutlined, EditOutlined, CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { getAll, updateById } from '@services/danhmucdichvu/dichvuService';
import { PAGINATION_CONFIG } from '@constants';
import { createStructuredSelector } from 'reselect';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';
import { connect } from 'react-redux';
import Search from '@components/Search/Search';
import { stringify } from 'qs';
import queryString from 'query-string';
import { compose } from 'redux';
import { makeGetPermission } from '@containers/Layout/HeaderComponent/HeaderProvider/selectors';

const danhgia = [{ key: true, value: 'Có' }, { key: false, value: 'Không' }];

class DanhMucDV extends Component {
  columns = [
    {
      title: 'Mã dịch vụ',
      dataIndex: '_id',
      align: 'center',
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'ten',
    },
    {
      title: 'Tên tắt',
      dataIndex: 'tentat',
    },
    // {
    //   title: 'Đánh giá',
    //   dataIndex: 'danhgia',
    //   render: (value) => <Checkbox checked={value}/>,
    //   align: 'center',
    // },
    {
      render: (value) => this.formatActionCell(value),
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
      _id: '',
      showModal: false,
    };
    this.formRef = React.createRef();
    this.url = 'quan-ly-dich-vu';
  }

  async componentDidMount() {
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
    queryStr += `${search._id ? '&_id={0}'.format(search._id) : ''}`;
    queryStr += `${search.ten ? '&ten[like]={0}'.format(search.ten) : ''}`;
    queryStr += `${search.tentat ? '&tentat={0}'.format(search.tentat) : ''}`;
    const apiResponse = await getAll(page, limit, queryStr);
    console.log('apiResponse',apiResponse);
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

  formatActionCell(value) {
    let {myPermission} = this.props
    return <>
      { myPermission?.[this.url]?.sua &&
        <Tooltip title={'Cập nhật thông tin'} color="#2db7f5">
          <Button icon={<EditOutlined/>} size='small' type="primary" className='mr-1'
                  onClick={() => this.toggleModal(value)}></Button>
        </Tooltip>
      }
    </>;
  }

  toggleModal = async (value) => {
    const { showModal } = this.state;
    await this.setState({ showModal: !showModal, _id: value._id });
    console.log(value, 'value');
    if (!value.hasOwnProperty('danhgia')) value.danhgia = false;
    this.formRef.current.setFieldsValue(value);
  };

  handleSaveData = async (data) => {
    const { _id } = this.state;
    const apiResponse = await updateById(_id, data?.danhgia === '1' ? { danhgia: false } : { danhgia: true });
    if (apiResponse) {
      await this.setState({ showModal: false });
      message.success('Chỉnh sửa dữ liệu thành công');
      this.getDataFilter();
    }
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
    const { loading, loaidv, nhomdv, baohiem, dvt, myPermission } = this.props;

    const { dataRes, totalDocs, page, limit } = this.state;
    const dataSearch = [
      {
        type: 'text',
        name: '_id',
        label: 'Mã dịnh vụ',
      },
      {
        type: 'text',
        name: 'ten',
        label: 'Dịch vụ',
      },
      {
        type: 'text',
        name: 'tentat',
        label: 'Tên tắt',
      }
      ];
    return <div>
      <Card size="small" title={<span>
        <UnorderedListOutlined className="icon-card-header"/> &nbsp;Danh mục dịch vụ
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
      <Modal
        title="Thông tin chi tiết dịch vụ"
        id="formModal"
        name="formModal"
        autoComplete="off"
        labelAlign="right"
        visible={this.state.showModal}
        footer={
          myPermission?.[this.url]?.sua ? [
            <Button key={1} size="small" onClick={this.toggleModal} disabled={loading} type="danger"
                    icon={<CloseOutlined/>}>
              Huỷ
            </Button>,
            <Button key={2} size="small" type="primary" htmlType="submit" form="formModal" loading={loading}
                    icon={<SaveOutlined/>}>
              Lưu
            </Button>,
          ] : null}
        onCancel={loading ? () => null : this.toggleModal}>
        <Form ref={this.formRef} id="formModal" name="formModal" autoComplete="off" labelAlign="right"
              onFinish={this.handleSaveData}>
          <Form.Item label="Mã dịch vụ" name="_id" labelCol={{ span: 6 }} hasFeedback>
            <Input.TextArea disabled/>
          </Form.Item>
          <Form.Item label="Tên dịch vụ" name="ten" labelCol={{ span: 6 }} hasFeedback>
            <Input.TextArea disabled/>
          </Form.Item>
          <Form.Item label="Hiển thị đánh giá" name="danhgia" valuePropName="checked"
                     labelCol={{ span: 6 }}>
            <Switch/>
          </Form.Item>
        </Form>
      </Modal>
    </div>;
  }
}

const mapStateToProps = createStructuredSelector({
  loading: makeGetLoading(),
  myPermission: makeGetPermission(),
});

const withConnect = connect(mapStateToProps);
export default compose(withConnect)(DanhMucDV);



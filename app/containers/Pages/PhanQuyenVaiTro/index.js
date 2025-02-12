import React, { Component, Fragment } from 'react';
import { createStructuredSelector } from 'reselect';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';
import { connect } from 'react-redux';
import { Popconfirm, message, Modal, Card, Tooltip, Row, Col, Table, Input, Button, Form, Checkbox } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  CloseOutlined,
  SaveOutlined
} from '@ant-design/icons';

import { add, getAll, deleteById, updateById } from '@services/phanquyenvaitroService';
import queryString from 'query-string';
import { ROLE_PAGES } from '@constants';
import { makeGetPermission } from '@containers/Layout/HeaderComponent/HeaderProvider/selectors';
import _ from "lodash"
class TableEdit extends Component {
  columns = [
    {
      title: 'STT',
      width: '10%',
      render: (value, row, index) => (this.state.page - 1) * this.state.limit + (index + 1),
      align: 'center',
    }, {
      title: 'Vai trò',
      dataIndex: 'tenvaitro',
    }, {
      title: '#',
      render: (value) => this.formatActionCell(value),
      width: 100,
      align: 'center',
    }];

  columnsPQ = [
    {
      title: 'STT',
      render: (value, row, index) => index ? index : '',
      align: 'center',
      width: '10%',
    }, {
      title: 'Tên trang',
      dataIndex: 'tentrang',
    },
    {
      title: 'Tất cả',
      align: 'center',
      width: '10%',
      dataIndex: 'all',
      render: (value, row, index) => <Checkbox onChange={(e) => this.onChange(e.target.checked, row, index,'all')} checked={value}/>,
    },
    {
      title: 'Hiển thị',
      align: 'center',
      width: '10%',
      dataIndex: 'xem',
      render: (value, row, index) => <Checkbox className={(row.quyen.indexOf('xem') === -1) && 'invisible' } onChange={(e) => this.onChange(e.target.checked, row, index,'xem')} checked={value}/>,
    }, {
      title: 'Thêm',
      align: 'center',
      width: '10%',
      dataIndex: 'them',
      render: (value, row, index) => <Checkbox className={(row.quyen.indexOf('them') === -1) && 'invisible' } onChange={(e) => this.onChange(e.target.checked, row, index,'them')} checked={value}/>,
    }, {
      title: 'Sửa',
      align: 'center',
      width: '10%',
      dataIndex: 'sua',
      render: (value, row, index) => <Checkbox className={(row.quyen.indexOf('sua') === -1) && 'invisible' } onChange={(e) => this.onChange(e.target.checked, row, index,'sua')} checked={value}/>,
    }, {
      title: 'Xoá',
      align: 'center',
      width: '10%',
      dataIndex: 'xoa',
      render: (value, row, index) => <Checkbox className={(row.quyen.indexOf('xoa') === -1) && 'invisible' } onChange={(e) => this.onChange(e.target.checked, row, index, 'xoa')} checked={value}/>,
    }];

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      dataRes: [],
      page: 1,
      limit: 10,
      totalDocs: 0,
      showModal: false,
      _id: ''
    };
    this.formRef = React.createRef();
    this.url = 'phan-quyen-vai-tro'
  }

  componentDidMount() {
    this.getDataFilter();
  }

  showIndexRow = (text, record, index) => {
    let { page, limit } = this.state;
    return (<div>{(page - 1) * this.state.limit + index + 1}</div>);
  };

  onChange(value, row, index, key) {
    let dataSource = _.cloneDeep(this.state.dataSource);
    if(index === 0){
      if(key === 'all'){
        dataSource = dataSource.map(rowData => {
          rowData.all = value
          rowData.quyen.forEach(curr => {
            rowData[curr] = value
          })
          return rowData
        })
      }else{
        dataSource = dataSource.map(rowData => {
          rowData[key] = value
          return rowData
        })
      }
    }
    else{
      row[key] = value
      if(!value){
        row.all = value
        dataSource[0] = {...dataSource[0], [key]: value}
        dataSource[0] = {...dataSource[0], all: value}
        // dataSource[0][key] = value
        // dataSource[0][key] = value
        // dataSource[0].all = value
      }
      if(key === 'all'){
        row.quyen.forEach(curr => {
          row[curr] = value
        })
      }
      dataSource[index] = {...dataSource[index], ...row}
    }

    this.setState({ dataSource });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.location.search !== prevProps.location.search) {
      this.getDataFilter();
    }
  }

  async getDataFilter() {
    const search = queryString.parse(this.props.location.search);
    const page = parseInt(search.page ? search.page : this.state.page);
    const limit = parseInt(search.limit ? search.limit : this.state.limit);
    let queryStr = '';
    const apiResponse = await getAll(page, limit, queryStr);
    if (apiResponse) {
      this.setState({
        dataRes: apiResponse.docs,
        totalDocs: apiResponse.totalDocs,
        limit: apiResponse.limit,
        page: apiResponse.page,
        showModal: false,
      });
    }
  }

  toggleModal = async () => {
    const { showModal } = this.state;
    this.setState({ showModal: !showModal, _id: '' });
  };

  toggleModalVaiTro = async () => {
    this.setState({
      showModal: true,
      tenvaitro: '',
      dataSource: JSON.parse(JSON.stringify(ROLE_PAGES)),
      _id: '' });
  };

  edit(data) {
    let dataSource = JSON.parse(JSON.stringify(ROLE_PAGES));
    let vaitro = data.vaitro || {}

    dataSource = dataSource.map(rowData => {
      if(vaitro.hasOwnProperty(rowData.trang)){
        rowData = {...rowData, ...vaitro[rowData.trang]}
      }
      return rowData
    })

    this.setState({
      showModal: true,
      dataSource: dataSource,
      tenvaitro: data.tenvaitro,
      _id: data._id });
  }


  formatActionCell(value) {
    let {myPermission} = this.props
    return <>
      {
        myPermission?.[this.url]?.sua &&
        <Tooltip placement="left" title='Phân quyền cho tài khoản' color="#2db7f5">
          <Button icon={<EditOutlined/>} size='small' type="primary" className='mr-1'
                  onClick={() => this.edit(value)}></Button>
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
    </>;
  }

  handleRefresh = (newQuery, changeTable) => {

  };

  onChangeTable = (page) => {

  };

  saveModal = async () => {
    const { dataSource } = this.state;
    let obj = {}
    dataSource.forEach((rowData, index) => {
      if(index !== 0){
        let quyen = rowData.quyen
        let isCheck = false
        let objQuyen = {}
        quyen.forEach(curr => {
          objQuyen[curr] = false
          if(rowData[curr]){
            isCheck = true
            objQuyen[curr] = true
          }

        })
        if(isCheck){
          obj[rowData.trang] = objQuyen
        }
      }
    })
    let data = {
      tenvaitro: this.state.tenvaitro,
      vaitro: obj
    }

    if(this.state._id){
      let dataResApi = await updateById(this.state._id, data)
      if(dataResApi){
        let dataRes = this.state.dataRes.map(vtro => {
          if(vtro._id === this.state._id) return dataResApi
          return vtro
        })
        message.success('Cập nhật dữ liệu thành công');
        this.setState({showModal: false, dataRes})

      }
    }else{
      let dataResApi = await add(data)
      if(dataResApi){
        message.success('Thêm mới dữ liệu thành công');
        this.setState({showModal: false, dataRes: [...this.state.dataRes, dataResApi]})
      }
    }
  }

  async handleDelete(value) {
    const dataRes = [...this.state.dataRes];
    const apiRequestDelete = await deleteById(value._id);
    if (apiRequestDelete) {
      message.success('Xoá vai trò thành công');
      const index = dataRes.findIndex(e => e._id === apiRequestDelete._id);
      if (index !== -1) {
        dataRes.splice(index, 1);
        this.setState({
          dataRes,
        });
      }
    }
  }

  render() {
    const { loading, myPermission } = this.props;
    const { dataRes, dataSource } = this.state;

    return (
      <div>
        <Card size="small" title={<span>
          <UnorderedListOutlined className="icon-card-header"/> &nbsp;Danh sách các vai trò
          </span>} md="24"
              bordered
              extra={<div>
                {
                  myPermission?.[this.url]?.them &&
                  <Button type="primary" onClick={this.toggleModalVaiTro} className="pull-right" size="small"
                          icon={<PlusOutlined/>}>
                    Thêm vai trò
                  </Button>
                }
              </div>}>

          <Table loading={loading} bordered columns={this.columns} dataSource={dataRes} size="small" rowKey="_id"
                 pagination={false}
                 onChange={this.onChangeTable}/>
        </Card>

        <Modal title='Phân quyền cho vai trò'
               className="modal-width-60"

               style={{ top: 10 }}
               visible={this.state.showModal}
               onCancel={loading ? () => null : this.toggleModal}
               footer={[
                 <Button size="small" onClick={this.toggleModal} disabled={loading} type="danger"
                         icon={<CloseOutlined/>}>Huỷ
                 </Button>,
                 <Button size="small" type="primary" loading={loading}
                         onClick={() => this.saveModal()}
                         icon={<SaveOutlined/>}>Lưu
                 </Button>,
               ]}>
          <Row gutter={10}>
            <Col xs={12}>
              <Input value={this.state.tenvaitro} onChange={(e) => {this.setState({tenvaitro: e.target.value})}}
                     addonBefore="Tên vai trò" size="small"/>
            </Col>

            <Table
              dataSource={dataSource}
              size="small"
              scroll={{y: 'calc(100vh - 18em)'}}
              className="w-full mt-1"
              columns={this.columnsPQ}
              bordered
              rowKey="trang"
              pagination={false}
              onChange={this.onChangeTable}/>
          </Row>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  loading: makeGetLoading(),
  myPermission: makeGetPermission()
});

const withConnect = connect(mapStateToProps);

export default withConnect(TableEdit);

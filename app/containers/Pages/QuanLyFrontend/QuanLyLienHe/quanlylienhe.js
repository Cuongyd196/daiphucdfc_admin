import React from 'react';
import { Button, Table, Card, Tooltip, Tag, Modal, Form, Divider, Row, Col, Input, Radio, message } from 'antd';
import {
  CheckCircleOutlined, CloseOutlined,
  EditOutlined,
  ExclamationCircleOutlined, SaveOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Search from '@components/Search/Search';
import { PAGINATION_CONFIG } from '@constants';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';
import moment from 'moment';
import { getAllLienHe, updateLienHeById } from '@services/thongtinchungService';
import { makeGetPermission } from '@containers/Layout/HeaderComponent/HeaderProvider/selectors';
import { dateFormatter, } from '@commons/dateFormat';
const { TextArea } = Input;

class QuanLyLienHe extends React.Component {
  columns = [
    {
      title: 'STT',
      render: (value, row, index) => (this.state.page - 1) * this.state.limit + (index + 1),
      width: 50,
      align: 'center',
    },
    {
      title: 'Người liên hệ',
      width: 200,
      render: (value) => <div style={{ textAlign: 'left' }}>
        <div>Họ tên: {value.hoten}</div>
      </div>,
      align: 'center',
    },
    {
      title: 'Điện Thoại',
      width: 150,
      dataIndex: 'phone',
      align: 'center',
    },
    {
      title: 'Ngày liên hệ',
      dataIndex: 'ngaylienhe',
      render: (value) => moment(value).format('DD/MM/YYYY'),
      width: 150,
      align: 'center',
    },

    {
      title: 'Trạng thái',
      render: (value) => {
        if (!value?.status) {
          return <Tag icon={<ExclamationCircleOutlined/>} color="warning" className="font-medium">Chờ liên hệ</Tag>;
        } else if (value.status) {
          return <Tag icon={<CheckCircleOutlined/>} color="success" className="font-medium">Đã liên hệ</Tag>;
        }
      },
      align: 'center',
      width: 150,
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
      data: {},
      search: {},
      showModal: false,
    };
    this.formRef = React.createRef();
    this.url = 'quan-ly-frontend'
  }

  componentDidMount() {
    this.getDataFilter();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.search !== prevState.search || this.state.page !== prevState.page
      || this.state.limit !== prevState.limit) {
      this.getDataFilter();
    }
  }

  async getDataFilter() {
    const { search, page, limit } = this.state;
    let queryStr = '';
    queryStr += `${search.from_date ? '&ngaylienhe[from]={0}'.format(search.from_date) : ''}`;
    queryStr += `${search.to_date ? '&ngaylienhe[to]={0}'.format(search.to_date) : ''}`;
    queryStr += `${search.tenbn ? '&hoten[like]={0}'.format(search.tenbn) : ''}`;
    queryStr += `${search.status ? '&status={0}'.format(search.status) : ''}`;
    const apiResponse = await getAllLienHe(page, limit, queryStr);
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

  formatActionCell(value) {
    return <Tooltip placement="left" title="Xem chi tiết" color="#2db7f5">
      <Button icon={<EditOutlined/>} size="small" type="primary" onClick={() => {this.handleShowModal(value)}}/>
    </Tooltip>;
  }

  handleRefresh = (newQuery) => {
    this.setState({ search: newQuery });
  };

  onChangeTable = page => {
    this.setState({ page: page.current, limit: page.pageSize });
  };

  handleShowModal = async (data) => {
    this.setState({
      showModal: true,
      data: data
    }, () => {this.formRef.current.setFieldsValue({
      ...data,
      ngaylienhe: dateFormatter(data.ngaylienhe),
      user_id: data?.user_id?.full_name,
      ngaytraloi: dateFormatter(data.ngaytraloi),
    })});
  }

  handleSaveData = async (values) => {
    try {
      let data = {
        status: values.status,
        remark: values.remark
      }
      const apiResponse = await updateLienHeById(values._id, data);
      if (apiResponse) {
        message.success("Cập nhật liên hệ thành công");
        let {dataRes} = this.state
        const newArray =  dataRes.map(data => {
          if (data._id === values._id) {
            return apiResponse
          }
          return data
        });
        this.setState({ dataRes: newArray });
        this.formRef.current.setFieldsValue({
          user_id: apiResponse?.user_id?.full_name,
          ngaytraloi: dateFormatter(apiResponse.ngaytraloi),
        })
      }
    }catch(e){
      console.log(e);
    }
  }


  toggleModal = () => {
    this.setState({ showModal: false, data: {} });
    this.formRef.current.resetFields();
  }

  render() {
    const { loading, myPermission } = this.props;
    const { dataRes, totalDocs, page, limit } = this.state;
    const trangthai_sc = [{ _id: 0, tabindex: 'Chờ liên hệ' }, { _id: 1, tabindex: 'Đã liên hệ' }];
    const layoutCol = { 'xs': 24, 'sm': 12, 'md': 12, 'lg': 6 };
    const dataSearch = [

      {
        name: 'tenbn',
        label: 'Tên người liên hệ',
        type: 'text',
      },
      {
        type: 'date',
        name: 'from_date',
        label: 'Từ ngày',
      },
      {
        type: 'date',
        name: 'to_date',
        label: 'Đến ngày',
      },
      {
        type: 'select',
        name: 'status',
        label: 'Trạng thái',
        options: trangthai_sc,
        key: '_id',
        value: 'tabindex',
      },
    ];

    return (
      <div>
        <Card
          size="small"
          title={
            <span>
              <UnorderedListOutlined className="icon-card-header"/> &nbsp;Danh sách liên hệ
            </span>
          }
          md="24"
          bordered>
          <Search onFilterChange={this.handleRefresh} dataSearch={dataSearch}/>
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
        <Modal
          title="Chi tiết liên hệ"
          visible={this.state.showModal}
          onCancel={loading ? () => null : this.toggleModal}
          footer={
            myPermission?.[this.url]?.sua ? [
              <Button
                key={1}
                size="small"
                onClick={this.toggleModal}
                disabled={loading}
                type="danger"
                icon={<CloseOutlined/>}
              >
                Huỷ
              </Button>,
              <Button
                key={2}
                size="small"
                type="primary"
                htmlType="submit"
                form="formModal"
                loading={loading}
                icon={<SaveOutlined/>}
              >
                Lưu
              </Button>  ]: null
          }
          width={900}
        >
          <Form size="small" className="form-info" ref={this.formRef} id="formModal" name="formModal"
                layout="vertical" onFinish={this.handleSaveData}>
            <Row gutter={10}>
              <Col xs={24}>
                <Form.Item label="_id" name="_id" hidden='true'>
                  <Input disabled/>
                </Form.Item>
              </Col>
              <Col {...layoutCol}>
                <Form.Item label="Tên người liên hệ" name="hoten">
                  <Input disabled/>
                </Form.Item>
              </Col>

              <Col {...layoutCol}>
                <Form.Item label="Số điện thoại" name="phone">
                  <Input disabled/>
                </Form.Item>
              </Col>

              <Col {...layoutCol}>
                <Form.Item label="Email" name="email">
                  <Input disabled/>
                </Form.Item>
              </Col>

              <Col {...layoutCol}>
                <Form.Item label="Ngày liên hệ" name="ngaylienhe">
                  <Input disabled/>
                </Form.Item>
              </Col>

              <Col xs={24} lg={18}>
                <Form.Item label="Nội dung liên hệ" name="content">
                  <TextArea type="" autoSize='false' disabled/>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10} style={{paddingTop: '10px'}}>
              <Col xs={24}>
                <Form.Item name="status" label="Trạng thái:" style={{display: 'flex', flexDirection: 'row'}}
                           labelCol={{sm: 4, xxl: 2}}>
                  <Radio.Group compact>
                    <Radio value={false}><Tag icon={<ExclamationCircleOutlined  />} color="warning" className="font-medium">Chưa liên hệ</Tag></Radio>
                    <Radio value><Tag icon={<CheckCircleOutlined />} color="success" className="font-medium">Đã liên hệ</Tag></Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>

              <Col {...layoutCol}>
                <Form.Item label="Người liên hệ" name="user_id">
                  <Input disabled/>
                </Form.Item>
              </Col>
              <Col {...layoutCol}>
                <Form.Item label="Ngày trả lời" name="ngaytraloi">
                  <Input disabled/>
                </Form.Item>
              </Col>

              <Col  xs={24}>
                <Form.Item label="Ghi chú" name="remark">
                  <TextArea type="" autoSize='false'/>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  loading: makeGetLoading(),
  myPermission: makeGetPermission()
});

export default connect(mapStateToProps)(QuanLyLienHe);

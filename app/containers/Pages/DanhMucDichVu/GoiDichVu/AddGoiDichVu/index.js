import React, { Component, Fragment } from 'react';
import {
  Table, Input, InputNumber, Popconfirm, Form, Statistic, Button, Row, Col, Divider, Modal, Select, Tooltip,
  Avatar, Upload, Space, Image
} from 'antd';
import ImgCrop from 'antd-img-crop';
import QuillEditor from '@components/QuillEditor';
import { DeleteOutlined, EditOutlined, PlusOutlined, SaveOutlined, UnorderedListOutlined } from '@ant-design/icons';

import {  PAGINATION_CONFIG, RULE } from '@constants';
import { createStructuredSelector } from 'reselect';
import { makeGetLoading } from 'containers/App/AppProvider/selectors';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { URL } from '../../../../../constants/URL';
import Box from '../../../../Box';
import produce from 'immer';
import { withDanhMucGia } from '@reduxApp/DanhMucGia/connect';

import { add } from '@services/danhmucdichvu/goidichvuService';
import { getAll as getAllDichVu } from '@services/danhmucdichvu/giadichvuService';
import { getAll as getAllDmDichVu } from '@services/danhmucdichvu/dmgoidichvuService';
import { getAll as getDmDichVu } from '@services/danhmucdichvu/dichvuService';
import {uploadImage} from "@services/uploadServices";

class AddGoiDichVu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      limit: 50,
      totalDocs: 0,

      pageModal: 1,
      limitModal: 50,
      totalDocsModal: 0,
      objectFilterModal: {},
      showModal: false,

      list_AllDichVu_Modal: [],

      list_IdDichVu_Modal: [],
      list_DichVu_Modal: [],

      list_Selected_DichVu: [],
      list_Selected_IdDichVu: [],

      editingKey: '',
      dmgoidichvu: [],
      dmdichvu: [],
      dmgoidichvu_id: '',

      mota: '',
      imageFile: null,
      imageSrc: ''
    };
    this.url = 'quan-ly-dich-vu';
    this.formRef = React.createRef();
    this.formRefModal = React.createRef();
    this.formTable = React.createRef();

    this.columns = [
      {
        title: 'STT',
        width: 50,
        render: (cell, row, index) => this.showIndexRow(cell, row, index),
        align: 'center',
      },
      { title: 'Dịch vụ', dataIndex: 'ten', width: 200 },
      {
        title: 'Giá tiền',
        align: 'center',
        editable: true,
        dataIndex: 'giayeucau',
        render: (value) =>
          <Statistic value={value} suffix="VNĐ" valueStyle={{
            fontSize: '12px',
            fontWeight: 'bold',
            color: 'green',
          }}/>,
      },
      {
        title: 'Ghi chú',
        editable: true,
        dataIndex: 'ghichu',
        render: (value) => value,
      },
      {
        title: <Button size='small' type="primary" ghost onClick={this.toggleModal} icon={<PlusOutlined/>}>
          Thêm dịch vụ
        </Button>,
        align: 'right',
        width: 150,
        render: (value) => {
          const editable = this.isEditing(value);
          return editable ? (
            <span>
              <Tooltip>
                <Button onClick={() => this.save(value)} size='small' type="primary" className='mr-1'>Lưu</Button>
              </Tooltip>
              <Popconfirm title="Bạn chắc chắn muốn hủy?" onConfirm={this.cancel}
                          cancelText='Huỷ' okText='Xác nhận' okButtonProps={{ type: 'danger' }}>
                  <Button type='danger' ghost size='small' className="mr-1">Hủy</Button>
              </Popconfirm>
           </span>
          ) : (this.formatActionCell(value));
        },
      },
    ];

    this.columnsModal = [
      {
        title: 'STT',
        width: 50,
        render: (cell, row, index) => this.showIndexRow(cell, row, index),
        align: 'center',
      },
      { title: 'Dịch vụ', dataIndex: 'ten', width: 200 },
      {
        title: 'Giá tiền',
        align: 'center',
        editable: true,
        dataIndex: 'giayeucau',
        render: (value) =>
          <Statistic value={value} suffix="VNĐ" valueStyle={{
            fontSize: '12px',
            fontWeight: 'bold',
            color: 'green',
          }}/>,
      },
      {
        title: 'Ghi chú',
        editable: true,
        dataIndex: 'ghichu',
        render: (value) => value,
      },
    ];
  }

  async componentDidMount() {
    let [dmgoidichvu, dmdichvu] = await Promise.all([getAllDmDichVu(1, 0), getDmDichVu(1, 0)]) ;
    if (dmgoidichvu) this.setState({ dmgoidichvu: dmgoidichvu.docs, dmdichvu: dmdichvu.docs || [] });
  }

  formatActionCell(value) {
    return <>
      <Tooltip>
        <Button disabled={this.state.editingKey !== ''} icon={<EditOutlined/>} size='small' type="primary"
                className='mr-1' onClick={() => this.edit(value)}>Sửa</Button>
      </Tooltip>
      <Popconfirm key={value._id} title="Bạn chắc chắn muốn xoá?"
                  onConfirm={() => this.handleDelete(value)}
                  cancelText='Huỷ' okText='Xoá' okButtonProps={{ type: 'danger' }}>
        <Button disabled={this.state.editingKey !== ''} icon={<DeleteOutlined/>} type='danger' ghost size='small'
                className="mr-1">Xoá</Button>
      </Popconfirm>
    </>;
  }

  getListDichVuModal = async (page, limit, objectFilterModal) => {
    let queryStr = '&_id[nin]=';
    this.state.list_Selected_DichVu.map((item, index) => {
      queryStr += `${item._id}`;
      if (index != (this.state.list_Selected_DichVu - 1)) {
        queryStr += `,`;
      }
    });
    queryStr += `${objectFilterModal.ten ? '&ten[like]={0}'.format(objectFilterModal.ten) : ''}`;
    queryStr += `${objectFilterModal.dmdichvu_id ? '&dmdichvu_id={0}'.format(objectFilterModal.dmdichvu_id) : ''}`;
    const listDichVuApi = await getAllDichVu(page, limit, queryStr);
    if (listDichVuApi) {
      this.setState({
        list_AllDichVu_Modal: listDichVuApi.docs,
        totalDocsModal: listDichVuApi.totalDocs,
        limitModal: listDichVuApi.limit,
        pageModal: listDichVuApi.page,
        objectFilterModal,
      });
    }
  };

  onFinishFilter = async () => {
    const fields = this.formRefModal.current.getFieldsValue();
    const objectFilterModal = produce(fields, draft => {
      draft.ten = draft.ten;
      draft.dmdichvu_id = draft.dmdichvu_id;
    });
    this.getListDichVuModal(1, 50, objectFilterModal);
  };

  clearFilter = async () => {
    const fields = this.formRefModal.current.getFieldsValue();
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = [];
        } else {
          fields[item] = undefined;
        }
      }
    }
    this.formRefModal.current.setFieldsValue(fields);
    let queryStr = '&_id[nin]=';
    this.state.list_Selected_DichVu.map((item, index) => {
      queryStr += `${item._id}`;
      if (index != (this.state.list_Selected_DichVu - 1)) {
        queryStr += `,`;
      }
    });
    const listDichVuApi = await getAllDichVu(1, 50, queryStr);
    if (listDichVuApi) {
      this.setState({
        list_AllDichVu_Modal: listDichVuApi.docs,
        totalDocsModal: listDichVuApi.totalDocs,
        limitModal: listDichVuApi.limit,
        pageModal: listDichVuApi.page,
      });
    }
  };

  onChangeTableModal = (page) => {
    let { objectFilterModal } = this.state;
    this.formRefModal.current.setFieldsValue(objectFilterModal);
    this.getListDichVuModal(page.current, page.pageSize, objectFilterModal);
  };

  onSelectTableModal = (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows, 'record, selected, selectedRows');
  };

  handleAddPatient = async () => {
    let { list_IdDichVu_Modal, list_DichVu_Modal, list_Selected_DichVu } = this.state;
    list_DichVu_Modal.map((item, index) => {
      if (item !== undefined) {
        const select_item = { _id: item._id, ten: item.ten, giayeucau: item.giayeucau, ghichu: item.ghichu };
        list_Selected_DichVu = [...list_Selected_DichVu, select_item];
      }
    });
    this.setState({
      list_Selected_IdDichVu: list_IdDichVu_Modal,
      list_Selected_DichVu: list_Selected_DichVu,
      showModal: false,
    });

  };

  handleDelete = async (value) => {
    try {
      const row = await this.formTable.current.validateFields();
      const newData = [...this.state.list_Selected_DichVu];
      console.log('newData', newData);
      const index = newData.findIndex(item => value._id === item._id);
      if (index > -1) {
        newData.splice(index, 1);
        await this.setState({ editingKey: '', list_Selected_DichVu: newData });
      } else {
        newData.push(row);
        await this.setState({ editingKey: '', list_Selected_DichVu: newData });
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  toggleModal = async () => {
    const { showModal } = this.state;

    // đóng Modal.
    if (showModal) {
      this.setState({
        showModal: false,
        // dsIdDichVuModal: this.state.dsIdDichVu
      });
    } else {
      this.setState({ showModal: !this.state.showModal });
      let queryStr = '&_id[nin]=';
      this.state.list_Selected_DichVu.map((item, index) => {
        queryStr += `${item._id}`;
        if (index !== (this.state.list_Selected_DichVu - 1)) {
          queryStr += `,`;
        }
      });
      queryStr = queryStr.slice(0, queryStr.length - 1);
      const listDichVuApi = await getAllDichVu(1, 50, queryStr);
      if (listDichVuApi) {
        this.setState({
          list_AllDichVu_Modal: listDichVuApi.docs,
          totalDocsModal: listDichVuApi.totalDocs,
          limitModal: listDichVuApi.limit,
          pageModal: listDichVuApi.page,
          showModal: true,
          list_IdDichVu_Modal: this.state.list_DichVu_Modal,
        });
      }
    }
  };

  EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
    const inputNode = inputType === 'number' ? <InputNumber/> : <Input/>;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  isEditing = (value) => value._id === this.state.editingKey;

  showIndexRow = (text, record, index) => {
    let { page, limit } = this.state;
    return (<div>{(page - 1) * this.state.limit + index + 1}</div>);
  };

  get mergedColumns() {
    const mergedColumn = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (value) => ({
          value,
          inputType: col.dataIndex === 'giadichvu' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(value),
        }),
      };
    });
    return mergedColumn;
  }

  cancel = async () => {
    await this.setState({ editingKey: '' });
  };

  edit = async (value) => {
    this.formTable.current.setFieldsValue({
      tengoi: '',
      gia: '',
      ghichu: '',
      ...value,
    });
    await this.setState({ editingKey: value._id });
  };

  save = async (value) => {
    try {
      const row = await this.formTable.current.validateFields();
      const newData = [...this.state.list_Selected_DichVu];
      const index = newData.findIndex(item => value._id === item._id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        await this.setState({ editingKey: '', list_Selected_DichVu: newData });
      } else {
        newData.push(row);
        await this.setState({ editingKey: '', list_Selected_DichVu: newData });
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  onFinish = async (values) => {
    values.mota = this.state.mota;
    const {imageFile, _id} = this.state;

    if (imageFile) {
      const avatar = await uploadImage(imageFile);
      if (avatar) {
        values.avatar = avatar;
      }
    }else delete values.avatar;

    let list_Selected_DichVu_Add = [];
    this.state.list_Selected_DichVu.map(item => {
      const item_add = { magiadichvu: item._id, giadichvu: item.giayeucau, ghichu: item.ghichu };
      list_Selected_DichVu_Add = [...list_Selected_DichVu_Add, item_add];
    });
    values.dichvu = list_Selected_DichVu_Add;
    const apiResponse = await add(values);
    if (apiResponse) {
      this.props.history.push(URL.GOI_DICH_VU_ID.format(apiResponse._id));
    }
  };

  onSelectChange = (list_IdDichVu_Modal, list_DichVu_Modal) => {
    this.setState({ list_IdDichVu_Modal, list_DichVu_Modal });
  };

  handleEditorChange = (value) => {
    this.setState({mota: value});
  }

  render() {
    const { loading } = this.props;
    const layoutFilter = {
      labelAlign: 'left',
      labelCol: { span: 10 },
      wrapperCol: { span: 16 },
    };
    return (
      <div>
        <Box title='Thông tin gói dịch vụ' boxActions={
          <Button size='small' type="primary" icon={<SaveOutlined/>}
                  htmlType="submit" form="formSub">Cập nhật</Button>
        }>
          <Form ref={this.formRef} layout='vertical' size='small' id="formSub" autoComplete='off' onFinish={this.onFinish}>
            <Row gutter={10}>
              <Col xl={16} md={24}>
                <Row gutter={10}>
                  <Col xs={24} sm={12} md={12} lg={12} xl={6}>
                    <Form.Item
                      name="dmgoidichvu_id"
                      label="Danh mục gói dịch vụ"
                      rules={[{ required: true, message: 'Danh mục gói dịch vụ là bắt buộc' }]}
                      validateTrigger={['onBlur', 'onChange']}
                    >
                      <Select
                        placeholder="Chọn danh mục gói dịch vụ"
                        disabled={this.props.loading}
                        dropdownClassName="small"
                        filterOption={(input, option) => {
                          return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                        }}
                      >
                        {this.state.dmgoidichvu?.map(data => (
                          <Select.Option key={data._id} value={data._id}>
                            {data.tendmgoidv}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={18}>
                    <Form.Item label="Tên gói dịch vụ" name="tengoi"
                               validateTrigger={['onChange', 'onBlur']}
                               rules={[{ required: true, message: 'Tên gói dịch vụ không được để trống' }]}>
                      <Input placeholder='Nhập tên gói dịch vụ' disabled={loading}/>
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item label="Mô tả ngắn" name="motangan"
                               validateTrigger={['onChange', 'onBlur']}>
                      <Input placeholder="Nhập tên gói dịch vụ" disabled={loading}/>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col xl={8} md={24}>
                <Form.Item className="text-center" name="avatar">
                  <Space direction="vertical">
                    <Image
                      width={200}
                      src={this.state.imageSrc || ''}
                      fallback="data:image/png;base64,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"
                    />
                    <ImgCrop rotate modalTitle="Tải ảnh lên">
                      <Upload
                        accept="image/*"
                        // onChange={({file}) => this.onChangeImage(file)}
                        beforeUpload={file => {
                          const maxSize = 5; // MB
                          const isJpgOrPng = ['image/jpeg', 'image/png', 'image/gif'];
                          if (!isJpgOrPng) {
                            message.error('Bạn chỉ có thể tải lên tệp JPG/PNG/GIF!');
                            return false;
                          }
                          const isSizeValid = file.size / 1024 / 1024 < maxSize;
                          if (!isSizeValid) {
                            message.error(`Kích thước ảnh phải nhỏ hơn ${maxSize}MB!`);
                            return false;
                          }

                          const reader = new FileReader();
                          reader.readAsDataURL(file);
                          reader.onload = () => {
                            this.setState({imageFile: file, imageSrc: reader.result})
                          };
                          // Upload file manually after
                          return false;
                        }}
                        showUploadList={false}
                      >
                        <Button size="small">Thay đổi hình đại diện</Button>
                      </Upload>
                    </ImgCrop>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <Divider orientation="left">
            Danh sách các dịch vụ đã chọn
          </Divider>
          <Form ref={this.formTable} autoComplete='off'>
            <Table
              size="small"
              components={{
                body: {
                  cell: this.EditableCell,
                },
              }}
              bordered
              dataSource={this.state.list_Selected_DichVu}
              columns={this.mergedColumns}
              rowClassName="editable-row"
              pagination={{
                onChange: this.cancel,
              }}
            />
          </Form>

          <Divider orientation="left">
            Mô tả
          </Divider>
          <QuillEditor onChange={this.handleEditorChange} value={this.state.mota}/>
        </Box>

        <Modal title='Chọn dịch vụ thêm vào gói'
               width={900} style={{ top: 10 }} visible={this.state.showModal}
               onCancel={loading ? () => null : this.toggleModal}
               footer={[
                 <Button size='small' key={1} onClick={this.toggleModal} disabled={loading}>Đóng</Button>,
                 <Button size='small' key={2} type="primary" htmlType="button" form="formRefModal"
                         icon={<i className='fa fa-check mr-1'/>} disabled={loading}
                         onClick={this.handleAddPatient}>
                   Xác nhận
                 </Button>,
               ]}>
          <Form ref={this.formRefModal} id="formRefModal" className='form-no-feedback' name='formRefModal'
                autoComplete='off' size='small'
                onFinish={this.onFinishFilter.bind(this)}>
            <Divider orientation="left" plain>
              <span>Điều kiện lọc</span>
            </Divider>

            <Row gutter={10}>

              <Col xs={24} md={12}>
                <Form.Item label="Tên dịch vụ" name="ten" {...layoutFilter}>
                  <Input placeholder='Nhập dịch vụ' disabled={loading}/>
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item label="Nhóm dịch vụ" name="dmdichvu_id" {...layoutFilter}>
                  <Select placeholder='Chọn danh mục giá' disabled={loading} dropdownClassName='small'>
                    {this.state.dmdichvu.map(data => {
                      return <Select.Option key={data._id} value={data._id}>{data.ten}</Select.Option>;
                    })}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={12} className='ml-auto'>
                <Button htmlType='submit' size='small' type='primary' className='pull-right'
                        loading={loading} icon={<i className="fa fa-filter mr-1"/>}>
                  Lọc
                </Button>
                <Button htmlType='button' size='small' className='pull-right mr-2' danger
                        icon={<DeleteOutlined/>}
                        onClick={this.clearFilter.bind(this)}>
                  Xoá bộ lọc
                </Button>
              </Col>
            </Row>
          </Form>

          <Divider orientation="left" plain>
            <span>Danh sách các dịch vụ</span>
          </Divider>

          <Table columns={this.columnsModal} dataSource={this.state.list_AllDichVu_Modal}
                 bordered
                 pagination={{
                   ...PAGINATION_CONFIG,
                   size: 'small',
                   pageSizeOptions: [50, 100, 200, 500], showSizeChanger: true, defaultPageSize: 50,
                   current: this.state.pageModal,
                   pageSize: this.state.limitModal,
                   total: this.state.totalDocsModal,
                 }}
                 scroll={{ y: 'calc(100vh - 28em)' }}
                 rowKey="_id"
                 onChange={this.onChangeTableModal}
                 loading={loading} size='small'
                 fixed={true}
                 rowSelection={{
                   selectedRowKeys: this.state.list_IdDichVu_Modal,
                   onChange: this.onSelectChange,
                   preserveSelectedRowKeys: true,
                 }}/>

        </Modal>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  loading: makeGetLoading(),
});

const withConnect = connect(mapStateToProps);
export default compose(withConnect, withDanhMucGia)(AddGoiDichVu);

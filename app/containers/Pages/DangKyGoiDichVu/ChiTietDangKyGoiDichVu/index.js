import React from 'react';
import moment from 'moment';
import {
  Input,
  Form,
  Row,
  Col,
  Button,
  message,
  Radio,
  Divider,
  Tag,
  Upload,
  Modal,
  Table,
  DatePicker, Statistic, Tooltip,
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  SaveOutlined, UploadOutlined,
  FileSearchOutlined, EyeOutlined,
} from '@ant-design/icons';
import Box from '@containers/Box';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { getById, updateById } from '@services/danhmucdichvu/dkgoidichvuService';
import { makeGetLoading } from '@containers/App/AppProvider/selectors';
import { timeFormatter, dateFormatter } from '@commons/dateFormat';
import { RULE } from '@constants';
import { makeGetPermission } from '@containers/Layout/HeaderComponent/HeaderProvider/selectors';
import { withNhanVien } from '@reduxApp/NhanVien/connect';

const layoutCol = { 'xs': 24, 'sm': 12, 'md': 12, 'lg': 12, 'xl': 6, 'xxl': 6 };
const layoutCol1 = { 'xs': 24, 'sm': 12 };
// Update ảnh lên server
import { uploadFiles, uploadImages } from '@services/uploadServices';
import { getBase64 } from '@utils/imageUtil';
import { API } from '@api';
import { getfileDetail, getPreviewFile, getPreviewImage } from '@commons/functionCommons';
import Search from '@components/Search/Search';
import BenhNhanModal from 'Pages/LichHen/ChiTiet/BenhNhanModal';
import { Link } from 'react-router-dom';
import { URL } from '@url';

class ChiTietDangKyGoiDichVu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: props.match.params.id,
      trangthai: -1,
      previewVisible: false,
      previewImage: '',
      previewTitle: '',
      photoList: [],
      listFiles: [],
      showModal: false,
      makcb: '',
      taikhoanhis: false,
      mabn: '',
      info: '',
      infoPatient: [],
      dangkybn: '',
      dichvu: []
    };
    this.formRef = React.createRef();
    this.url = 'dang-ky-goi-dich-vu';
  }

  async componentDidMount() {
    const dataRes = await getById(this.state._id);
    let tongtien = 0;
    dataRes.dichvu.map(item => tongtien += item.giadichvu);
    if (dataRes) {
      let photoList = getPreviewImage(dataRes?.hinhanh || []);
      let listFiles = getPreviewFile(dataRes?.files || []);
      let thongtin = ''
      if(dataRes.trangthai === 2 && dataRes.benhnhan_id){
        thongtin = this.getInfoPatient(dataRes?.benhnhan_id)
      }

      this.setState({
        trangthai: dataRes.trangthai,
        taikhoanhis: dataRes.benhnhan_id.taikhoanhis,
        mabn: dataRes.benhnhan_id._id,
        makcb: dataRes?.dangky_id?._id,
        info: thongtin,
        dangkybn: dataRes.dangkybn,
        dichvu: [...dataRes.dichvu, {_id: '', magiadichvu: {ten: 'TỔNG TIỀN'}, giadichvu: tongtien}],
        photoList,
        listFiles
      });

      this.formRef.current.setFieldsValue({
        ...dataRes,
        benhnhan: dataRes?.benhnhan_id?.hoten,
        mabn: dataRes?.benhnhan_id?._id,
        taikhoan: dataRes?.benhnhan_id?.taikhoan,

        nguoithan_id: dataRes?.nguoithan_id?.moiquanhe + ': ' + dataRes?.nguoithan_id?.hoten,
        nt_ngaysinh: dataRes?.nguoithan_id?.ngaysinh ? dateFormatter(dataRes?.nguoithan_id?.ngaysinh) : '' ,
        nt_maphai: dataRes?.nguoithan_id?.maphai?.tenphai,
        nt_dienthoai: dataRes?.nguoithan_id?.dienthoai,
        nt_bhyt: dataRes?.nguoithan_id?.bhyt,
        nt_cmnd: dataRes?.nguoithan_id?.cmnd,
        nt_ghichu: dataRes?.nguoithan_id?.ghichu,

        tengoidichvu: dataRes?.goidichvu_id?.tengoi,
        diachi: dataRes?.diachi,
        ghichu: dataRes?.ghichu,
        ngaydangky: moment(dataRes?.ngaydangky),
        nguoixacnhan: dataRes?.user_id?.full_name,
        dienthoai: dataRes?.dienthoai,
        ngayxacnhan: timeFormatter(dataRes?.ngayxacnhan),
        tongtien: (tongtien).toLocaleString('VND', {
          style: 'currency',
          currency: 'VND',
        }),
        ketluan: dataRes?.ketluan,
        makcb: dataRes?.dangky_id?._id,

        info: thongtin,
      });
    }
  }

  getInfoPatient = (benhnhanInfo) => {
    let thongtin = '';
    if(benhnhanInfo){
      thongtin = 'Mã BN: ' + benhnhanInfo?._id + ' - Tên: ' + benhnhanInfo?.hoten + ' - Ngày sinh' + (moment(benhnhanInfo.ngaysinh).format('DD/MM/YYYY'))  + ' - SĐT đăng ký: ' + (benhnhanInfo?.dienthoai || '');
    }
    return thongtin
  }

  handleSaveData = async values => {
    try {
      const { _id } = this.state;
      if (values.trangthai === 2) {
        //upload image
        let [originImgNm, imgUpload] = getfileDetail(this.state.photoList);
        if (imgUpload.length) {
          const image_id_list = await uploadImages(imgUpload);
          if (image_id_list && image_id_list.length) originImgNm = [...originImgNm, ...image_id_list];
        }
        values.hinhanh = originImgNm;

        // upload files
        let [originFileNm, fileUpload] = getfileDetail(this.state.listFiles);
        if (fileUpload.length) {
          const file_id_list = await uploadFiles(fileUpload);
          if (file_id_list && file_id_list.length) originFileNm = [...originFileNm, ...file_id_list];
        }
        values.file = originFileNm;
      }

      const data = {
        trangthai: values.trangthai,
        ghichu: values.ghichu,
        ngaydangky: values.ngaydangky,
        ngayxacnhan: new Date(),
        ketluan: values?.ketluan || '',
        dangky_id: values?.makcb || '',
        hinhanh: values?.hinhanh || [],
        files: values?.file || [],
      };

      const apiResponse = await updateById(_id, data);
      if (apiResponse) {
        message.success('Cập nhật trạng thái thành công');
        this.setPreviewState(apiResponse?.hinhanh);
        this.setListFileState(apiResponse?.files);

        this.setState({
          taikhoanhis: apiResponse.benhnahn_id.taikhoanhis,
          mabn: apiResponse.benhnhan_id._id,
        });

        this.formRef.current.setFieldsValue({
          ngayxacnhan: timeFormatter(data?.ngayxacnhan),
          nguoixacnhan: apiResponse?.user_id?.full_name,
          ketluan: apiResponse?.ketluan,
          benhnhan: apiResponse?.benhnhan_id?.hoten,
          taikhoan: apiResponse?.benhnhan_id?.taikhoan,
          mabn: apiResponse?.benhnhan_id?._id,
          diachi: apiResponse?.diachi
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  onValuesChange = async (changedValues) => {
    if (changedValues.hasOwnProperty('trangthai')) {
      this.setState({ trangthai: changedValues.trangthai });
      this.formRef.current.validateFields();
    }
  };

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.originFileObj.name,
    });
  };

  getInfoKCB = (makcb, benhnhanInfo) => {
    if(makcb){
      let thongtin = this.getInfoPatient(benhnhanInfo)
      this.setState({ makcb: makcb, showModal: false });
      this.formRef.current.setFieldsValue({
        makcb: makcb,
        info: thongtin,
      });
    }else{
      this.setState({showModal: false})
    }
  }


  render() {

    const { trangthai, previewVisible, previewImage, photoList, previewTitle, listFiles, taikhoanhis } = this.state;
    let { loading, myPermission } = this.props;
    return (
      <div>
        <Box title='Chi tiết đăng ký gói dịch vụ của bệnh nhân' boxActions={
          myPermission?.[this.url]?.sua &&
          <Button size='small' type="primary" icon={<SaveOutlined/>} htmlType="submit" form="formSub">Xác nhận</Button>
        }>
          <Form size='small' className='form-info' ref={this.formRef} id="formSub" name="formSub"
                onValuesChange={this.onValuesChange} layout='vertical' onFinish={this.handleSaveData}>
            <Divider orientation="left"><span className="text-blue-500 text-lg">Thông tin người đăng ký</span></Divider>
            <Row gutter={10}>
              <Col {...layoutCol}>
                <Form.Item label="Mã bệnh nhân" name="mabn">
                  <Input disabled/>
                </Form.Item>
              </Col>
              <Col {...layoutCol}>
                <Form.Item label="Tên bệnh nhân" name="benhnhan">
                  <Input disabled/>
                </Form.Item>
              </Col>
              <Col {...layoutCol}>
                <Form.Item label="Số điện thoại" name="dienthoai">
                  <Input disabled/>
                </Form.Item>
              </Col>
              <Col {...layoutCol}>
                <Form.Item label="Tài khoản" name="taikhoan">
                  <Input disabled/>
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left"><span className="text-blue-500 text-lg">Thông tin đăng ký</span></Divider>
            {
              !this.state.dangkybn &&
              <Row gutter={10}>
                <Col {...layoutCol}>
                  <Form.Item label="Đăng ký cho" name="nguoithan_id">
                    <Input disabled/>
                  </Form.Item>
                </Col>
                <Col {...layoutCol}>
                  <Form.Item label="Ngày sinh" name="nt_ngaysinh">
                    <Input disabled/>
                  </Form.Item>
                </Col>
                <Col {...layoutCol}>
                  <Form.Item label="Giới tính" name="nt_maphai">
                    <Input disabled/>
                  </Form.Item>
                </Col>
                <Col {...layoutCol}>
                  <Form.Item label="Điện thoại" name="nt_dienthoai">
                    <Input disabled/>
                  </Form.Item>
                </Col>

                <Col {...layoutCol}>
                  <Form.Item label="Bảo hiểm y tế" name="nt_bhyt">
                    <Input disabled/>
                  </Form.Item>
                </Col>

                <Col {...layoutCol}>
                  <Form.Item label="CMND/CCCD" name="nt_cmnd">
                    <Input disabled/>
                  </Form.Item>
                </Col>

                <Col {...layoutCol1}>
                  <Form.Item label="Ghi chú" name="nt_ghichu">
                    <Input disabled/>
                  </Form.Item>
                </Col>
              </Row>
            }

            <Row gutter={10}>
              <Col {...layoutCol}>
                <Form.Item label="Tên gói dịch vụ" name="tengoidichvu">
                  <Input disabled/>
                </Form.Item>
              </Col>
              <Col {...layoutCol}>
                <Form.Item label="Thời gian đăng ký" name="ngaydangky" >
                  <DatePicker
                    disabledDate={d => d && d < moment().startOf('day') } showTime format="DD-MM-YYYY HH:mm" className="w-full" disabled={trangthai !== 1}/>
                </Form.Item>
              </Col>
              {/*<Col {...layoutCol}>
                <Form.Item label="Tổng tiền gói dich vụ" name="tongtien">
                  <Input disabled/>
                </Form.Item>
              </Col>*/}
              <Col {...layoutCol1}>
                <Form.Item label="Địa chỉ bệnh nhân" name="diachi">
                  <Input disabled/>
                </Form.Item>
              </Col>
            </Row>

            <div>Dịch vụ</div>
            <Table size="small" rowKey="_id" bordered dataSource={this.state.dichvu} pagination={false}>
              <Table.Column title="STT" align="center" dataIndex="_id" width="100px" render={(value, row, idx) => idx !== this.state.dichvu.length - 1 ? idx + 1 : ''} />
              <Table.Column title="Dịch vụ" dataIndex="magiadichvu" render={(value, row, index) => {
                return <span className={index === this.state.dichvu.length - 1 ? 'font-bold text-red-600' : ''}>{value?.ten}</span>
              }} />
              <Table.Column title="Đơn giá" dataIndex="giadichvu" render={(value, row, index) => {
                return <Statistic value={value} suffix="VNĐ" valueStyle={{
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: index === this.state.dichvu.length - 1 ? 'red' : 'green'
                }}/>
              }}/>
            </Table>

            <Divider orientation="left"><span className="text-blue-500 text-lg">Thông tin xác nhận</span></Divider>

            <Row gutter={10}>
              <Col sm={24}>
                <Form.Item name="trangthai" label="Trạng thái:" style={{ display: 'flex', flexDirection: 'row' }}
                           labelCol={{ sm: 4, xxl: 2 }}>
                  <Radio.Group compact>
                    <Radio value={0}><Tag icon={<CheckCircleOutlined/>} color="error" className="font-medium">Từ
                      chối</Tag></Radio>
                    <Radio value={1}><Tag icon={<CloseCircleOutlined/>} color="success" className="font-medium">Xác
                      nhận</Tag></Radio>
                    <Radio value={2}><Tag icon={<CloseCircleOutlined/>} color="processing" className="font-medium">Đã
                      trả kết quả</Tag></Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>

              {
                (trangthai !== -1) &&
                <>
                  <Col xs={24} sm={12} xl={4}>
                    <Form.Item label="Ngày xác nhận" name="ngayxacnhan">
                      <Input disabled/>
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} xl={4}>
                    <Form.Item label="Người xác nhận" name="nguoixacnhan">
                      <Input disabled/>
                    </Form.Item>
                  </Col>

                  {
                    (trangthai !== 2) && <Col xs={24}>
                      <Form.Item label='Ghi chú' name="ghichu"
                                 rules={trangthai === 0 ? [RULE.REQUIRED] : []}>
                        <Input.TextArea autoSize={{ minRows: 4 }} disabled={loading}/>
                      </Form.Item>
                    </Col>
                  }
                </>
              }
              {
                (trangthai === 2) &&
                <>
                  <Col xs={24}>
                    <Form.Item label='Kết luận' name="ketluan">
                      <Input.TextArea autoSize={{ minRows: 4 }} disabled={loading}/>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} xl={4}>
                    <Form.Item label="Chọn mã khám chữa bệnh" name="makcb">
                      <Input disabled={true}/>
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item label=" ">
                      <Button size='small' type="primary" icon={<FileSearchOutlined/>}
                              onClick={() => this.setState({showModal: true})}>Chọn</Button>
                    </Form.Item>
                  </Col>
                  {
                    this.state.makcb &&
                    <Col xs={24} sm={15}>
                      <Form.Item label="Thông tin" name="info">
                        <Input disabled={true}/>
                      </Form.Item>
                    </Col>
                  }

                  {
                    !!this.state.makcb &&
                    <Col>
                      <Form.Item label=" ">
                        <Tooltip placement="top" title="Xem chi tiết" color="#2db7f5">
                          <Link to={URL.QL_DANGKYKHAM_ID.format(this.state.makcb)}>
                            <Button icon={<EyeOutlined />} size="small" type="primary">Xem kết quả</Button>
                          </Link>
                        </Tooltip>
                      </Form.Item>
                    </Col>
                  }

                  <Col xs={24} xxl={24}>
                    <Form.Item label="Hình ảnh" name="hinhanh">
                      <Upload
                        accept="image/*"
                        listType="picture-card"
                        fileList={photoList}
                        onPreview={this.handlePreview}
                        onRemove={(file) => {
                          let files = photoList.filter(data => {
                            return data.uid !== file.uid;
                          });
                          this.setState({ photoList: files });
                        }}
                        beforeUpload={(file) => {
                          const reader = new FileReader();
                          reader.readAsDataURL(file);
                          reader.onload = () => {
                            this.setState({
                                photoList: [...this.state.photoList, {
                                  originFileObj: file,
                                  thumbUrl: reader.result,
                                }],
                              },
                            );
                          };
                          return false;
                        }}
                        showUploadList={{
                          showPreviewIcon: true,
                          showDownloadIcon: true,
                          showRemoveIcon: true,
                          downloadIcon: (file) => <a download href={file.url}><DownloadOutlined/></a>,
                        }}>
                        <Button className="font-medium" icon={<UploadOutlined/>}>Upload</Button>
                      </Upload>
                    </Form.Item>
                  </Col>
                  <Col {...layoutCol1}>
                    <Form.Item label="File đính kèm" name="files">
                      <Upload
                        accept=".doc,.docx,.pdf, .xls, .xlsx, .xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        fileList={listFiles}
                        beforeUpload={(file) => {
                          this.setState({
                            listFiles: [...this.state.listFiles, { originFileObj: file, name: file.name }],
                          });
                          return false;
                        }}
                        onRemove={(file) => {
                          this.setState(this.setState(state => {
                            const index = state.listFiles.indexOf(file);
                            const newListFiles = state.listFiles.slice();
                            newListFiles.splice(index, 1);
                            return {
                              listFiles: newListFiles,
                            };
                          }));
                        }}>
                        <Button className="font-medium" icon={<UploadOutlined/>}>Select File</Button>
                      </Upload>
                    </Form.Item>
                  </Col>
                </>
              }
            </Row>
          </Form>
        </Box>
        <Modal
          style={{ top: 10 }}
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={() => this.setState({ previewVisible: false })}>
          <img alt="example" style={{ width: '100%' }} src={previewImage}/>
        </Modal>
        <BenhNhanModal showModal={this.state.showModal} taikhoanhis={taikhoanhis} dangkybn={this.state.dangkybn}
                       mabn={this.state.mabn}  makcb={this.state.makcb} getInfoKCB={this.getInfoKCB}
        />
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  loading: makeGetLoading(),
  myPermission: makeGetPermission(),
});

const withConnect = connect(mapStateToProps);
export default compose(withConnect, withNhanVien)(ChiTietDangKyGoiDichVu);


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
  DatePicker,
  Upload,
  Modal, Tooltip,
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined, EyeOutlined,
  ExclamationCircleOutlined, FileSearchOutlined,
  SaveOutlined, UploadOutlined,
} from '@ant-design/icons';
import Box from '@containers/Box';
import { connect } from "react-redux";
import { compose } from 'redux';
import { createStructuredSelector } from "reselect";
import { getById, updateById } from "@services/lichhen/lichhenService";
import { makeGetLoading } from "@containers/App/AppProvider/selectors";
import { dateFormatter, timeFormatter } from '@commons/dateFormat';
import {  RULE } from '@constants';
import { makeGetPermission } from '@containers/Layout/HeaderComponent/HeaderProvider/selectors';
import { getBase64 } from '@utils/imageUtil';
import { API } from '@api';
import { getfileDetail, getPreviewFile, getPreviewImage } from '@commons/functionCommons';
import { uploadFiles, uploadImages } from '@services/uploadServices';
import BenhNhanModal from './BenhNhanModal';
import { Link } from 'react-router-dom';
import { URL } from '@url';
const layoutCol = { "xs": 24, "sm": 12, "md": 12, "lg": 12, "xl": 4, "xxl": 4 };
const layoutCol1 = { "xs": 24, "sm": 12, "xl": 16 };

class ChiTietLichHen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: props.match.params.id,
      tabindex: 0,
      dangkybn: '',

      previewVisible: false,
      previewImage: '',
      previewTitle: '',
      photoList: [],
      listFiles: [],
      taikhoanhis: false,
      showModal: false,
      mabn: ''
    };
    this.formRef = React.createRef();
    this.url = 'lich-hen'
  }

  async componentDidMount() {
    const dataRes = await getById(this.state._id);

    let thongtin = '';
    if(dataRes.tabindex === 2 && dataRes.mabn){
      thongtin = this.getInfoPatient(dataRes.mabn)
    }
    if (dataRes) {
      let photoList = getPreviewImage(dataRes?.hinhanh || []);
      let listFiles = getPreviewFile(dataRes?.files || []);
      this.setState({tabindex: dataRes.tabindex,
        makcb: dataRes.tabindex === 2 ? dataRes?.makcb?._id : '',
        dangkybn: dataRes.dangkybn,
        taikhoanhis: dataRes?.mabn.taikhoanhis,
        mabn: dataRes?.mabn?._id,
        photoList,
        listFiles
      });
      this.formRef.current.setFieldsValue({
        ...dataRes,
        mabn: dataRes?.mabn?._id,
        hoten: dataRes?.mabn?.hoten,
        maphai: dataRes?.mabn?.maphai?.tenphai,
        taikhoan: dataRes?.mabn?.taikhoan,
        ngaysinh: dateFormatter(dataRes?.mabn?.ngaysinh),
        dienthoai: dataRes?.dienthoai,
        bacsy_id: dataRes?.bacsy_id?.tennv,

        tabindex: dataRes?.tabindex,
        makcb: dataRes.tabindex === 2 ? dataRes?.makcb?._id : '',
        ngaydatlich: moment(dataRes?.ngaydatlich),
        full_name: dataRes?.nhanvien_id?.full_name,
        ngaytraloi: timeFormatter(dataRes?.ngaytraloi),

        nguoithan_id: dataRes?.nguoithan_id?.moiquanhe + ': ' + dataRes?.nguoithan_id?.hoten,
        nt_ngaysinh: dataRes?.nguoithan_id?.ngaysinh ? dateFormatter(dataRes?.nguoithan_id?.ngaysinh) : '' ,
        nt_maphai: dataRes?.nguoithan_id?.maphai?.tenphai,
        nt_dienthoai: dataRes?.nguoithan_id?.dienthoai,
        nt_bhyt: dataRes?.nguoithan_id?.bhyt,
        nt_cmnd: dataRes?.nguoithan_id?.cmnd,
        nt_ghichu: dataRes?.nguoithan_id?.ghichu,
        info: thongtin
      })
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
    try{
      const { _id } = this.state;

      if (values.tabindex === 2) {

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
        tabindex: values.tabindex,
        ghichu: values.ghichu,
        ketluan: values.ketluan,
        ngaytraloi: new Date(),
        ngaydatlich: values.ngaydatlich,
        hinhanh: values?.hinhanh || [],
        files: values?.file || [],
        trathucong: true,
        makcb: this.state.makcb
      };

      const apiResponse = await updateById(_id, data);
      if (apiResponse) {
        let photoList = getPreviewImage(apiResponse?.hinhanh || []);
        let listFiles = getPreviewFile(apiResponse?.files || []);
        message.success("Cập nhật thông tin lịch hẹn thành công");
        this.formRef.current.setFieldsValue({
          ngaytraloi: timeFormatter(apiResponse?.ngaytraloi),
          full_name: apiResponse?.nhanvien_id?.full_name,
          mabn: apiResponse?.mabn?._id,
          hoten: apiResponse?.mabn?.hoten,
          taikhoan: apiResponse?.mabn?.taikhoan
        })

        this.setState({
          taikhoanhis: apiResponse.mabn.taikhoanhis,
          mabn: apiResponse.mabn._id,
          photoList, listFiles
        });

      }
    }catch(e){
      console.log(e);
    }
  };

  onValuesChange = async (changedValues, allValues) => {
    if (changedValues.hasOwnProperty('tabindex')) {
      this.setState({ tabindex: changedValues.tabindex })
      this.formRef.current.validateFields();
    }
  }

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

  showModalMKCB = () => this.setState({showModal: true})

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
    const { loading, myPermission } = this.props;
    const { tabindex, previewVisible, previewImage, photoList, previewTitle, listFiles, taikhoanhis} = this.state;
    console.log(this.state.makcb, 'this.state.makcbthis.state.makcb')
    
    return (
      <div>
        <Box title='Chi tiết lịch hẹn của bệnh nhân'  boxActions={
          myPermission?.[this.url]?.sua &&
          <Button size='small' type="primary" icon={<SaveOutlined />} htmlType="submit" form="formSub">Xác nhận lịch hẹn</Button>
        }>
          <Form size='small' className='form-info'  ref={this.formRef} id="formSub" name="formSub"
                onValuesChange={this.onValuesChange} layout='vertical' onFinish={this.handleSaveData}>

            <Divider orientation="left"><span className="text-blue-500 text-lg">Thông tin người đăng ký</span></Divider>
            <Row gutter={10}>
              <Col {...layoutCol}>
                <Form.Item label="Mã bệnh nhân" name="mabn">
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col {...layoutCol}>
                <Form.Item label="Tên bệnh nhân" name="hoten">
                  <Input disabled  />
                </Form.Item>
              </Col>

              <Col {...layoutCol}>
                <Form.Item label="Số điện thoại" name="dienthoai">
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col {...layoutCol}>
                <Form.Item label="Tài khoản" name="taikhoan">
                  <Input disabled/>
                </Form.Item>
              </Col>

              <Col {...layoutCol}>
                <Form.Item label="Giới tính" name="maphai">
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col {...layoutCol}>
                <Form.Item label="Ngày sinh" name="ngaysinh">
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left"><span className="text-blue-500 text-lg">Thông tin lịch hẹn</span></Divider>
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
              </Row>
            }
            <Row gutter={10}>
              <Col {...layoutCol}>
                <Form.Item label="Thời gian đăng ký" name="ngaydatlich" >
                  <DatePicker disabledDate={d => d && d < moment().startOf('day') } showTime format="DD-MM-YYYY HH:mm" className="w-full" disabled={this.state.tabindex !== 1}/>
                </Form.Item>
              </Col>

              <Col {...layoutCol}>
                <Form.Item label='Bác sỹ' name="bacsy_id">
                  <Input disabled/>
                </Form.Item>
              </Col>

              <Col {...layoutCol1}>
                <Form.Item label='Lý do đặt lịch' name="trieuchung">
                  <Input.TextArea disabled />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">Thông tin xác nhận</Divider>

            <Row gutter={10}>
              <Col sm={24}>
                <Form.Item name="tabindex" label="Trạng thái lịch hẹn :" style={{display: 'flex', flexDirection: 'row'}}
                           labelCol={{sm: 4, xxl: 2}}>
                  <Radio.Group compact>
                    <Radio value={0}><Tag icon={<ExclamationCircleOutlined  />} color="warning" className="font-medium">Mới đặt lịch</Tag></Radio>
                    <Radio value={1}><Tag icon={<CheckCircleOutlined />} color="success" className="font-medium">Đã xác nhận</Tag></Radio>
                    <Radio value={2}><Tag icon={<CloseCircleOutlined  />} color="processing" className="font-medium">Đã đến khám</Tag></Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>

              {
                ( tabindex === 1) &&
                <>
                  <Col {...layoutCol}>
                    <Form.Item label="Ngày xác nhận" name="ngaytraloi">
                      <Input disabled />
                    </Form.Item>
                  </Col>

                  <Col {...layoutCol}>
                    <Form.Item label="Người xác nhận" name="full_name">
                      <Input disabled />
                    </Form.Item>
                  </Col>

                  <Col xs={24}>
                    <Form.Item label='Nội dung trả lời' name="ghichu"
                      rules={tabindex === 2 ? [RULE.REQUIRED] : []}>
                      <Input.TextArea autoSize={{minRows: 4}} disabled={loading} />
                    </Form.Item>
                  </Col>
                </>
              }

              {
                ( tabindex === 2) &&
                <>
                  <Col {...layoutCol}>
                    <Form.Item label="Ngày xác nhận" name="ngaytraloi">
                      <Input disabled />
                    </Form.Item>
                  </Col>

                  <Col {...layoutCol}>
                    <Form.Item label="Người xác nhận" name="full_name">
                      <Input disabled />
                    </Form.Item>
                  </Col>



                  <Col xs={24}>
                    <Form.Item label='Kết luận' name="ketluan">
                      <Input.TextArea autoSize={{ minRows: 4 }} disabled={loading}/>
                    </Form.Item>
                  </Col>

                  <Col {...layoutCol}>
                    <Form.Item label="Mã khám chữa bệnh" name="makcb">
                      <Input disabled={true}/>
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item label=" ">
                      <Button size='small' type="primary" icon={<FileSearchOutlined/>}
                              onClick={this.showModalMKCB}>Chọn</Button>
                    </Form.Item>
                  </Col>

                  {
                    !!this.state.makcb &&
                    <Col {...layoutCol1}>
                      <Form.Item label="Thông tin bệnh nhân" name="info">
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
                            <Button icon={<EyeOutlined />} size="small" type="primary">Kết quả</Button>
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

            <Row gutter={10} className="justify-end">
              <Button size='small' type="primary" icon={<SaveOutlined />} htmlType="submit">Xác nhận lịch hẹn</Button>
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
                       mabn={this.state.mabn} makcb={this.state.makcb} getInfoKCB={this.getInfoKCB}
        />
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  loading: makeGetLoading(),
  myPermission: makeGetPermission()
});

const withConnect = connect(mapStateToProps);
export default compose(withConnect)(ChiTietLichHen);


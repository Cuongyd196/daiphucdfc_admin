import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Space,
  Table,
  Upload,
  Tooltip,
  Popconfirm,
  Typography
} from "antd";
import ImgCrop from 'antd-img-crop';
import {DownloadOutlined, PlusOutlined, EditOutlined, DeleteOutlined} from "@ant-design/icons";
import {API} from "@api";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {makeGetPermission} from "@containers/Layout/HeaderComponent/HeaderProvider/selectors";
import {makeGetLoading} from "@containers/App/AppProvider/selectors";
import TextArea from "antd/es/input/TextArea";
import {uploadImage} from "@services/uploadServices";
import { addSlide, putSlide, delSlide } from '@services/thongtinchungService';
import ImageUploadComp from "@components/ImageUploadComp";

export default function SlideFE({id, slideList}) {

  const loading = useSelector(makeGetLoading());

  const myPermission = useSelector(makeGetPermission());
  const url = 'thong-tin-chung';
  const [formModal] = Form.useForm();

  const [visible, setVisible] = useState(false);
  const [slide, setSlide] = useState(slideList);
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    setSlide(slideList);
  }, [slideList]);

  const columns = [
    {
      title: 'STT',
      width: '5%',
      render: (value, row, index) => (index + 1),
      align: 'center',
    },
    {
      title: 'Ảnh',
      width: '20%',
      align: 'center',
      dataIndex: 'image',
      render: (value) => {
        if (value)
          return <Image width={90} src={value ? API.FILES.format(value) : 'error'}/>;
      },

    },
    {
      title: 'Title',
      width: '30%',
      dataIndex: 'title',
      align: 'center'
    },
    {
      title: 'Detail',
      width: '35%',
      dataIndex: 'detail',
      align: 'center'
    },
    {
      title: 'Hành động',
      width: '10%',
      align: 'center',
      render: (value) => formatActionCell(value),
    },
  ];

  const formatActionCell = (value) => {
    return <>
      {myPermission?.[url]?.sua &&
      <>
        <Tooltip title="Cập nhật thông tin" color="#2db7f5">
          <Button icon={<EditOutlined/>} size="small" type="primary" onClick={() => edit(value)}/>
        </Tooltip> &nbsp;
        <Popconfirm key={value.image} title="Bạn chắc chắn muốn xoá?"
                    onConfirm={() => handleDelete(value)}
                    cancelText="Huỷ" okText="Xoá" okButtonProps={{ type: 'danger' }}>
          <Tooltip title="Xóa dữ liệu" color="#f50">
            <Button icon={<DeleteOutlined/>} type="danger" size="small" className="mr-1"/>
          </Tooltip>
        </Popconfirm>
      </>}
    </>;
  };

  const handleDelete = async (value) => {
    const apiRequest = await delSlide(id, value._id);
    if (apiRequest) {
      let slideNew = slide.filter(slide => slide._id !== value._id);
      setSlide(slideNew)
      message.success('Xoá dữ liệu slide thành công');
    }
  };

  const edit = (value) => {
    setVisible(true);
    setImageSrc(value.image);
    formModal.setFieldsValue(value);
  };

  const onFinish = async (values) => {
    if (!values.image) {
      message.error('Ảnh cho slide không được để trống.');
      return;
    }
    if (values?.image?.uid) {
      const image_id = await uploadImage(values.image);
      if (image_id) values.image = image_id;
    } else delete values.image;

    if(values._id){
      let apiRes = await putSlide(id, values._id, values)
      if(apiRes){
        let slideNew = slide.map(slide => {
          if(slide._id === values._id) return apiRes
          return slide
        });
        setSlide(slideNew)
        setVisible(false);
        message.success('Cập nhật slide thành công.');
      }
    }else{
      let apiRes = await addSlide(id, values)
      if(apiRes){
        setVisible(false);
        setSlide(apiRes.slide);
        message.success('Thêm mới slide thành công.');
      }
    }
  }

  return <div>
    <Row className="justify-between">
      <Typography.Title level={5} className="underline">2. Hình ảnh slide</Typography.Title>
      {myPermission?.[url]?.sua &&
      <Button
        type="primary"
        size="small"
        icon={<PlusOutlined/>}
        loading={loading}
        onClick={() => {
          setVisible(true);
          setImageSrc('');
          formModal.resetFields();
        }}>
        Thêm
      </Button>}
    </Row>

    <Table columns={columns} bordered dataSource={slide} size="small" loading={loading} pagination={false}
           rowKey="_id"/>

    <Modal
      visible={visible}
      width={600}
      title="Hình ảnh Slide"
      footer={[
        <Button key="back" onClick={() => setVisible(false)} size="small" type="danger">Huỷ</Button>,
        <Button key="submit" size="small" type="primary" htmlType="submit" form="formModal"
                loading={loading}>Lưu</Button>,
      ]}
      style={{ top: 10 }}
      onCancel={() => setVisible(false)}>
      <Form
        form={formModal}
        name="formModal"
        autoComplete="off"
        onFinish={onFinish}
        layout="vertical">
        <Row gutter={10}>
          <Form.Item name="_id" hidden>
            <Input disabled type="hidden"/>
          </Form.Item>
          <Col sm={24} xl={7}>
            <Form.Item name="image">
              <ImageUploadComp aspect={3.41} imageSrc={imageSrc || ''} btnTitle="Thay đổi hình đại diện"/>
              {/*<Space direction="vertical">
                <Image
                  width={128}
                  src={imageSrc}
                  fallback="data:image/png;base64,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"
                />
                <ImgCrop rotate aspect={3.41}>
                  <Upload
                    accept="image/*"
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
                        setImageFile(file);
                        setImageSrc(reader.result)
                      };
                      return false;
                    }}
                    showUploadList={false}
                  >
                    <Button size="small">Thay đổi hình đại diện</Button>
                  </Upload>
                </ImgCrop>
              </Space>*/}
            </Form.Item>
          </Col>
          <Col sm={24} xl={17}>
            <Form.Item name="title" label="Title" className="form-control">
              <TextArea placeholder="Nhập title"/>
            </Form.Item>
            <Form.Item name="detail" label="Detail">
              <TextArea placeholder="Nhập detail"/>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  </div>
}

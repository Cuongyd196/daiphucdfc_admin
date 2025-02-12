import React from 'react';
import debounce from 'lodash/debounce';
import {useSelector} from 'react-redux';
import {
  Col,
  Row,
  Form,
  Input,
  Button,
  message, Typography, Divider
} from 'antd';
import {
  SaveOutlined,
} from '@ant-design/icons';

import {getOneFE, updateFE, addFE} from '@services/thongtinchungService';

import {makeGetLoading} from '@containers/App/AppProvider/selectors';

// Update ảnh lên server
import {uploadImage} from '@services/uploadServices';

import {RULE} from '@constants';
import {makeGetPermission} from '@containers/Layout/HeaderComponent/HeaderProvider/selectors';
import ImageUploadComp from '@components/ImageUploadComp';
import SlideFE from 'Pages/ThongTinChung/SlideFE';

const CaiDatWebsite = () =>{
  const [form] = Form.useForm();
  const {TextArea} = Input;
  const loading = useSelector(makeGetLoading());
  const url = 'quan-ly-frontend';

  const myPermission = useSelector(makeGetPermission());
  const [dataResponse, setDataResponse] = React.useState([]);

  React.useEffect(() => {
    getDataInfo();
  }, []);

  const getDataInfo = async () => {
    const apiRequest = await getOneFE();
    if (apiRequest) {
      form.setFieldsValue(apiRequest);
      setDataResponse(apiRequest);
    }
  };

  const onSave = debounce(async values => {
    if (values?.logoHeader?.uid) {
      const logoHeaderId = await uploadImage(values.logoHeader);
      if (logoHeaderId) values.logoHeader = logoHeaderId;
    } else delete values.logoHeader;
    if (values?.logoFooter?.uid) {
      const logoFooterId = await uploadImage(values.logoFooter);
      if (logoFooterId) values.logoFooter = logoFooterId;
    } else delete values.logoFooter;
    if (values?.anhdaidien?.uid) {
      const avatarId = await uploadImage(values.anhdaidien);
      if (avatarId) values.anhdaidien = avatarId;
    } else delete values.anhdaidien;
    if (dataResponse._id) {
      const apiRequest = await updateFE(values._id, values);
      if (apiRequest) {
        setDataResponse(apiRequest);
        form.setFieldsValue(apiRequest);
        message.success('Cập nhật dữ liệu thành công.');
      }
    } else {
      const apiRequest = await addFE(values);
      if (apiRequest) {
        setDataResponse(apiRequest);
        form.setFieldsValue(apiRequest);
        message.success('Thêm dữ liệu thành công.');
      }
    }
  });

  return <div>
    <Form size="small" layout="vertical" autoComplete="off" onFinish={onSave} name="form" form={form}>
      <Row  className="justify-between">
        <Typography.Title level={5} className="underline">1. Thông tin phòng khám</Typography.Title>
        {
          myPermission[url].sua && <Button size="small" type="primary" icon={<SaveOutlined/>} htmlType="submit">Lưu dữ liệu</Button>
        }
      </Row>

      <Row gutter={10}>
        <Form.Item name="_id" hidden={true}>
          <Input disabled={true} type="hidden"></Input>
        </Form.Item>
        <Col xs={24} md={12}>
          <Form.Item
            name="tenphongkham"
            label="Tên"
            hasFeedback
            rules={[RULE.REQUIRED]}>
            <Input placeholder="Tên " disabled={loading}/>
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="linkFaceBook"
            label="Link Facebook"
            hasFeedback>
            <Input placeholder="Link" disabled={loading}/>
          </Form.Item>
        </Col>

        {/* <Col xs={24} md={12}>
          <Form.Item
            name="linkGooglePlay"
            label="Link GooglePlay">
            <Input placeholder="Link" disabled={loading}/>
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="linkAppStore"
            label="Link AppStore"
            hasFeedback>
            <Input placeholder="Link" disabled={loading}/>
          </Form.Item>
        </Col> */}

        <Col xs={24} md={12}>
          <Form.Item
            name="titleFooter"
            label="Title Footer"
            rules={[RULE.REQUIRED]}
            hasFeedback>
            <TextArea
              placeholder="Title footer"
              autoSize={{minRows: 5, maxRows: 10}}
              disabled={loading}
              rows={5}/>
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="tomtat"
            label="Tóm tắt"
            rules={[RULE.REQUIRED]}
            hasFeedback>
            <TextArea
              placeholder="Tóm tắt"
              disabled={loading}
              autoSize={{minRows: 5.1, maxRows: 5.1}}/>
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item className="text-center" name="anhdaidien">
            <ImageUploadComp aspect={1.49} imageSrc={dataResponse.anhdaidien || ''} btnTitle="Thay đổi ảnh đại diện"/>
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item className="text-center" name="logoHeader">
            <ImageUploadComp aspect={3.36} imageSrc={dataResponse.logoHeader || ''} btnTitle="Thay Logo Header"/>
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item className="text-center" name="logoFooter">
            <ImageUploadComp aspect={3.36} imageSrc={dataResponse.logoFooter || ''} btnTitle="Thay Logo Footer"/>
          </Form.Item>
        </Col>
      </Row>
    </Form>
    <Divider />

    {
      dataResponse._id && <SlideFE id={dataResponse._id} slideList={dataResponse.slide || []}/>
    }
  </div>
}

export default CaiDatWebsite;

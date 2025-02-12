import React, { useEffect } from 'react';
import { Row, Tabs, Form, Col, Skeleton } from 'antd';
import { dateFormatter } from "@commons/dateFormat";
import { getById as getBenhNhan } from '@services/qlbenhnhan/qlbenhnhanService'

const CustomSkeleton = (props) => {
  const { children, isShowSkeleton, ...rest } = props;
  if (isShowSkeleton) return <Skeleton.Input active size='small' className="w-full" />;
  return React.cloneElement(children, rest);
}

const ThongTinBenhNhan = ({mabn}) => {
  let loaded = false
  const [benhnhan, setBenhNhan] = React.useState({});
  const labelColCol = { 'xs': 12, 'md': 12, 'lg': 12, 'xl': 8 };
  useEffect(() => {
    fetchData();
  }, [mabn]);

  const fetchData = async () => {
    if(mabn){
      const benhnhanRes = await getBenhNhan(mabn);
      if (benhnhanRes) {
        setBenhNhan(benhnhanRes);
      }
    }
    loaded = true
  };

  return <Form size='small' className='form-info'>
    <Row gutter={24}>
      <Col xs={24} md={12} lg={8}>
        <Form.Item
          label={<b>Mã bệnh nhân</b>}
          labelCol={labelColCol}>
          <CustomSkeleton isShowSkeleton={loaded}><span>{benhnhan?._id}</span></CustomSkeleton>
        </Form.Item>
      </Col>
      <Col xs={24} md={12} lg={8} >
        <Form.Item
          label={<b>Tên bệnh nhân</b>}
          labelCol={labelColCol}>
          <CustomSkeleton isShowSkeleton={loaded}><span>{benhnhan?.hoten}</span></CustomSkeleton>
        </Form.Item>
      </Col>
      <Col xs={24} md={12} lg={8}>
        <Form.Item
          label={<b>Giới tính</b>}
          labelCol={labelColCol}>
          <CustomSkeleton isShowSkeleton={loaded}><span>{benhnhan?.maphai?.tenphai}</span></CustomSkeleton>
        </Form.Item>
      </Col>
      <Col xs={24} md={12} lg={8}>
        <Form.Item
          label={<b>Ngày sinh</b>}
          labelCol={labelColCol}>
          <CustomSkeleton isShowSkeleton={loaded}><span>{dateFormatter(benhnhan?.ngaysinh)}</span></CustomSkeleton>
        </Form.Item>
      </Col>
      <Col xs={24} md={12} lg={8}>
        <Form.Item
          label={<b>Điện thoại</b>}
          labelCol={labelColCol}>
          <CustomSkeleton isShowSkeleton={loaded}><span>{benhnhan?.dienthoai}</span></CustomSkeleton>
        </Form.Item>
      </Col>
      <Col xs={24} md={12} lg={8}>
        <Form.Item
          label={<b>Tài khoản</b>}
          labelCol={labelColCol}>
          <CustomSkeleton isShowSkeleton={loaded}><span>{benhnhan?.taikhoan}</span></CustomSkeleton>
        </Form.Item>
      </Col>
    </Row>
  </Form>
}

export default ThongTinBenhNhan;

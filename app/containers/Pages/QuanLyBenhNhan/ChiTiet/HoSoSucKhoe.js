import React, { useEffect } from 'react';
import { useSelector } from "react-redux";
import { Tabs, Table, Image, Tooltip, Divider } from 'antd';
import { makeGetLoading } from "containers/App/AppProvider/selectors";
import { getDiUng, getHoSoNguoiThan, getKetQuaKham, getPTCG } from '@services/hososuckhoe/hososuckhoeService';
import moment from 'moment';
import { API } from '@api';
import { Link } from 'react-router-dom';
import { URL } from '@url';
import { RightCircleOutlined } from '@ant-design/icons';
const { TabPane } = Tabs;

const HoSoSucKhoe = ({mabn}) => {

  const columnDiUng = [
    {
      title: 'STT',
      render: (value, row, index) => (index + 1),
      width: 60,
      align: 'center',
    },
    {
      title: 'Tên dị ứng',
      render: (value) => value?.tendiung,
    },
    {
      title: 'Chất gây dị ứng',
      render: (value) => value?.chatgaydiung,
    },
    {
      title: 'Tình trạng xảy ra',
      render: (value) => value?.tinhtrangxayra,
    },
    {
      title: 'Ngày đặt lịch hẹn',
      dataIndex: 'ngaydatlich',
      render: (value) => moment(value).format('DD/MM/YYYY'),
      width: 150,
      align: 'center',
    },
    {
      title: 'Ghi chú',
      render: (value) => value?.ghichu,
    },
  ];

  const columnDanhBa = [
    {
      title: 'STT',
      render: (value, row, index) => (index + 1),
      width: 60,
      align: 'center',
    },
    {
      title: 'Họ tên',
      dataIndex: 'hoten'
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'ngaysinh',
      render: (value) => moment(value).format('DD/MM/YYYY')
    },
    {
      title: 'Mối quan hệ',
      dataIndex: 'moiquanhe'
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'dienthoai'
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'diachi'
    },
    {
      title: 'Thông tin',
      render: (row) => <div>
        <div>-BHYT: {row.bhyt}</div>
        <div>-CMT/CCCD: : {row.cmnd}</div>
      </div>,
    },
  ];

  const columnPTCG = [
    {
      title: 'STT',
      render: (value, row, index) => (index + 1),
      width: 60,
      align: 'center',
    },
    {
      title: 'Tên dị ứng',
      render: (value) => value?.ten,
    },
    {
      title: 'Nội dung cấy ghép',
      render: (value) => value?.noidungcayghep,
    },
    {
      title: 'Thực hiện bởi',
      render: (value) => value?.bacsi_benhvien,
    },
    {
      title: 'Ngày thực hiện',
      dataIndex: 'ngay',
      render: (value) => moment(value).format('DD/MM/YYYY'),
      width: 150,
      align: 'center',
    },
    {
      title: 'Ghi chú',
      render: (value) => value?.ghichu,
    },
  ];

  const columnKQK = [
    {
      title: 'STT',
      render: (value, row, index) => (index + 1),
      width: '10%',
      align: 'center',
    },
    {
      title: 'Tên',
      render: (value) => value?.ten,
      width: '20%',
    },
    {
      title: 'Ngày thực hiện',
      dataIndex: 'ngay',
      render: (value) => moment(value).format('DD/MM/YYYY'),
      width: '10%',
      align: 'center',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'hinhanh',
      render: (value) => <div>
        <Image.PreviewGroup>
          {
            value.map(data => {
              return <Image width={100} src={API.FILES.format(data)} />
            })
          }
        </Image.PreviewGroup>
      </div>
    },
    {
      title: 'Mô tả',
      width: '20%',
      render: (value) => value?.mota,
    },
  ];

  const loading = useSelector(makeGetLoading());

  const [dataDiUng, setDataDiUng] = React.useState([]);
  const [dataPTCG, setDataPTCG] = React.useState([]);
  const [dataKetQK, setDataKetQK] = React.useState([]);
  const [dataDanhBa, setDataDanhBa] = React.useState([]);

  useEffect( () => {
    fetchData()
  }, [mabn]);

  const fetchData = async () => {
    let [dataDiUng, dataHoSoNguoiThan, dataPTCG, dataKetQK] = await Promise.all([
      getDiUng(1, 0, '&mabn=' + mabn),
      getHoSoNguoiThan(1, 0, '&mabn=' + mabn),
      getPTCG(1, 0, '&mabn=' + mabn),
      getKetQuaKham(1, 0, '&mabn=' + mabn),
    ])
    setDataDiUng(dataDiUng?.docs || [])
    setDataPTCG(dataPTCG?.docs || [])
    setDataKetQK(dataKetQK?.docs || [])
    setDataDanhBa(dataHoSoNguoiThan?.docs || [])
  }

  return <Tabs tabPosition="left" defaultActiveKey="31" type="card" size="small">
    <TabPane tab="Kết quả khám" key="31">
      <Table
        rowKey="_id"
        loading={loading}
        columns={columnKQK}
        dataSource={dataKetQK}
        size="small"
        pagination={false}
      />
    </TabPane>
    <TabPane tab="Dị ứng" key="32">
      <Table
        rowKey="_id"
        loading={loading}
        columns={columnDiUng}
        dataSource={dataDiUng}
        size="small"
        pagination={false}
      />
    </TabPane>
    <TabPane tab="Phẩu thuật, cấy ghép" key="33">
      <Table
        rowKey="_id"
        loading={loading}
        columns={columnPTCG}
        dataSource={dataPTCG}
        size="small"
        pagination={false}
      />
    </TabPane>
    <TabPane tab="Hồ sơ người thân" key="34">
      <Table
        rowKey="_id"
        loading={loading}
        columns={columnDanhBa}
        dataSource={dataDanhBa}
        size="small"
        pagination={false}
      />
    </TabPane>
  </Tabs>
};

export default HoSoSucKhoe;

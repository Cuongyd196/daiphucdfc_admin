import React from 'react';
import {
  HomeOutlined,
  InsertRowLeftOutlined
} from '@ant-design/icons';

import { URL } from '@url';
import { CONSTANTS } from '@constants';

import HomePage from '@containers/Pages/HomePage/Loadable';
import Profile from '@containers/Pages/Profile/Loadable';
import NotFoundPage from '@containers/Pages/NotFoundPage/Loadable';
import ThongTinChung from '@containers/Pages/ThongTinChung/Loadable';

import TaiKhoan from '@containers/Pages/TaiKhoan/Loadable';
import PhanQuyenVaiTro from '@containers/Pages/PhanQuyenVaiTro/Loadable';

import DanhmucTintuc from '@containers/Pages/TintucYte/DanhmucTintuc/Loadable';
import Tintuc from '@containers/Pages/TintucYte/Tintuc/Loadable';
import TintucChitiet from '@containers/Pages/TintucYte/Tintuc/Chitiet/Loadable';

import CauHoiThuongGap from '@containers/Pages/CauHoiThuongGap/Loadable';

import CauHoiBNChitiet from '@containers/Pages/CauHoiBenhNhan/ChiTiet/Loadable';

import QuanLyFrontend from '@containers/Pages/QuanLyFrontend/Loadable';

// Danh mục hành chính
import DanhmucTinhThanh from '@containers/Pages/DanhMucChung/HanhChinh/TinhThanh/Loadable';
import DanhmucQuanHuyen from '@containers/Pages/DanhMucChung/HanhChinh/QuanHuyen/Loadable';
import DanhmucPhuongXa from '@containers/Pages/DanhMucChung/HanhChinh/PhuongXa/Loadable';

// Danh mục Phòng
import DanhmucPhong from '@containers/Pages/DanhMucChung/KhoaPhong/Phong';

// Danh mục y tế
import DanhmucDV from '@containers/Pages/DanhMucDichVu/DichVu/Loadable';
import GiaDichVu from '@containers/Pages/DanhMucDichVu/GiaDichVu/Loadable';
import DmGoiDichVu from '@containers/Pages/DanhMucDichVu/DmGoiDichVu/Loadable';
import DanhmucGia from '@containers/Pages/DanhMucDichVu/DanhMucGia/Loadable';

// Gói dịch vụ
import GoiDichVu from '@containers/Pages/DanhMucDichVu/GoiDichVu/Loadable';
import ChiTietGoiDichVu from '@containers/Pages/DanhMucDichVu/GoiDichVu/ChiTietGoiDichVu/Loadable';
import AddGoiDichVu from '@containers/Pages/DanhMucDichVu/GoiDichVu/AddGoiDichVu/Loadable';

// Đăng ký gói dịch vụ
import DkGoiDichVu from '@containers/Pages/DangKyGoiDichVu/Loadable';
import ChiTietDkGoiDichVu from '@containers/Pages/DangKyGoiDichVu/ChiTietDangKyGoiDichVu/Loadable';

// Danh mục giáo viên
import DanhmucNhanVien from '@containers/Pages/DanhMucChung/NhanVien/Loadable';
import UpdateNhanVien from 'Pages/DanhMucChung/NhanVien/UpdateNhanVien/Loadable';
import AddNhanVien from 'Pages/DanhMucChung/NhanVien/DangkyNhanVien/Loadable';

//Danh mục thuốc
import DanhmucThuocVaVatTu from '@containers/Pages/DanhMucHanhChinh/DanhMucThuoc/ThuocVaVatTu/Loadable';

//Quản lý bệnh nhân
import QLBenhNhan from '@containers/Pages/QuanLyBenhNhan/Loadable';
import QLBenhNhanChiTiet from '@containers/Pages/QuanLyBenhNhan/ChiTiet/Loadable';
import QLDonThuocBenhNhanChiTiet from '@containers/Pages/QuanLyBenhNhan/ChiTietSuDungThuoc/Loadable';
import QLKetQuaCanLamSan from '@containers/Pages/QuanLyBenhNhan/ChiTietKetQuaCLS/Loadable';

import QLDangKyKham from '@containers/Pages/QuanLyDangKyKham/Loadable';
import QLChiTietKhamBenh from '@containers/Pages/QuanLyDangKyKham/ChiTietDangKyKham/Loadable';

import QLDonThuoc from '@containers/Pages/QuanLyDonThuoc/Loadable';
import QLHenKham from '@containers/Pages/QuanLyHenKham/Loadable';

//Hướng dẫn khám chữa bệnh
import DanhMucHuongDan from '@containers/Pages/HuongDanKhamChuaBenh/DanhmucHuongDan/Loadable';
import HuongDan from '@containers/Pages/HuongDanKhamChuaBenh/HuongDan/Loadable';
import ChiTietHuongDan from '@containers/Pages/HuongDanKhamChuaBenh/HuongDan/Chitiet/Loadable';

//Đánh giá dịch vụ
import ChiTietDanhGiaDichVu from '@containers/Pages/DanhGia/ChiTietDanhGiaDichVu/Loadable';
import ThongKeDanhGiaDichVu from '@containers/Pages/DanhGia/ThongKeDanhGiaDichVu/Loadable';
import DanhmucDanhGia from '@containers/Pages/DanhGia/DanhMucDanhGia/Loadable';

//Danh mục hỏi đáp
import DanhmucHoiDap from '@containers/Pages/DanhMucHoiDap/DanhMuc/Loadable';
import HoiDap from '@containers/Pages/DanhMucHoiDap/HoiDap/Loadable';
import ChiTietHoiDap from '@containers/Pages/DanhMucHoiDap/HoiDap/ChiTiet/Loadable';

//Lịch hẹn
import LichHen from '@containers/Pages/LichHen/Loadable';
import ChiTietLichHen from '@containers/Pages/LichHen/ChiTiet/Loadable';

//QL thời gian làm việc


import QLThoiGian from '@containers/Pages/QLThoiGianLamViec/QLThoiGian/Loadable';
import ChiTietLich from '@containers/Pages/QLThoiGianLamViec/QLThoiGian/ChiTiet/Loadable';
import LichBacSy from '@containers/Pages/QLThoiGianLamViec/QLThoiGian/LichBacSy/Loadable';
import DashBoard from '@containers/Pages/DashBoard/Loadable';

//Lịch sử hoạt động
import LichSuHoatDong from '@containers/Pages/LichSuHoatDong/Loadable';

function renderMenuIcon(icon) {
  return (
    <span className="anticon !m-0" style={{ transform: 'translateY(-2px)' }}>
      <i className={`fa ${icon} menu-icon`} aria-hidden="true"/>
    </span>
  );
}

const constantsRoutes = [
  {
    path: URL.HOMEPAGE,
    menuName: 'Trang chủ',
    component: DashBoard,
    icon: <HomeOutlined/>,
    exact: true,
    role: [CONSTANTS.ADMIN, CONSTANTS.MANAGE],
    url: 'all',
  },
  {
    path: URL.PROFILE,
    breadcrumbName: 'Hồ sơ cá nhân',
    component: Profile,
    role: [CONSTANTS.ADMIN, CONSTANTS.MANAGE],
    url: 'all',
  },
  {
    path: URL.NOT_FOUND,
    component: NotFoundPage,
    role: [],
    url: 'all',
  },

  //Danh mục hành chính
  {
    path: URL.CATEGORY,
    menuName: 'Quản lý khám bệnh',
    component: 'Quản lý',
    icon: renderMenuIcon('far fa-tasks'),
    children: [
      {
        path: URL.QL_BENHNHAN,
        menuName: 'Bệnh nhân',
        exact: true,
        component: QLBenhNhan,
        role: [CONSTANTS.ADMIN, CONSTANTS.MANAGE],
        url: 'benhnhan',
      },
      {
        path: `${URL.QL_BENHNHAN}/:id`,
        component: QLBenhNhanChiTiet,
        exact: true,
        role: [CONSTANTS.ADMIN, CONSTANTS.MANAGE],
        url: 'benhnhan',
      },
      {
        path: `${URL.QL_DONTHUOC}/:id/ketquacls`,
        component: QLKetQuaCanLamSan,
        exact: true,
        role: [CONSTANTS.ADMIN, CONSTANTS.MANAGE],
        url: 'benhnhan',
      },
      {
        path: `${URL.QL_DONTHUOC}/:id/donthuoc`,
        component: QLDonThuocBenhNhanChiTiet,
        exact: true,
        role: [CONSTANTS.ADMIN, CONSTANTS.MANAGE],
        url: 'donthuoc',
      },

      {
        path: URL.QL_DANGKYKHAM,
        menuName: 'Đăng ký khám',
        exact: true,
        component: QLDangKyKham,
        role: [CONSTANTS.ADMIN, CONSTANTS.MANAGE],
        url: 'dangky',
      },
      {
        path: `${URL.QL_DANGKYKHAM}/:id`,
        component: QLChiTietKhamBenh,
        exact: true,
        role: [CONSTANTS.ADMIN, CONSTANTS.MANAGE],
        url: 'dangky',
      },
      {
        path: URL.QL_DONTHUOC_TOTAL,
        menuName: 'Đơn thuốc',
        exact: true,
        component: QLDonThuoc,
        role: [CONSTANTS.ADMIN, CONSTANTS.MANAGE],
        url: 'donthuoc'
      },
      {
        path: URL.QL_HENKHAM,
        menuName: 'Hẹn khám',
        exact: true,
        component: QLHenKham,
        role: [CONSTANTS.ADMIN, CONSTANTS.MANAGE],
        url: 'henkham'
      }
    ],
    role: [CONSTANTS.ADMIN, CONSTANTS.MANAGE],
  },

  // Lịch hẹn
  {
    path: URL.LICH_HEN,
    exact: true,
    icon: renderMenuIcon('fa-calendar'),
    menuName: 'Lịch hẹn',
    component: LichHen,
    role: [CONSTANTS.ADMIN, CONSTANTS.MANAGE],
    url: 'lich-hen',
  },
  {
    path: `${URL.LICH_HEN}/:id`,
    exact: true,
    component: ChiTietLichHen,
    role: [CONSTANTS.ADMIN, CONSTANTS.MANAGE],
    url: 'lich-hen',
  },

  // Đăng ký gói dịch vụ
  {
    path: URL.DK_GOI_DICH_VU,
    exact: true,
    icon: renderMenuIcon('fa-calendar'),
    menuName: 'Đăng ký gói dịch vụ',
    component: DkGoiDichVu,
    role: [CONSTANTS.ADMIN, CONSTANTS.MANAGE],
    url: 'dang-ky-goi-dich-vu',
  },
  {
    path: `${URL.DK_GOI_DICH_VU}/:id`,
    exact: true,
    component: ChiTietDkGoiDichVu,
    role: [CONSTANTS.ADMIN, CONSTANTS.MANAGE],
    url: 'dang-ky-goi-dich-vu',
  },
  {
    path: `${URL.QL_THOI_GIAN}/:id`,
    exact: true,
    component: ChiTietLich,
    url: 'quan-ly-thoi-gian',
  },

  {
    menuName: 'Lịch làm việc',
    icon: renderMenuIcon('fa-address-book'),
    children: [
      {
        path: URL.QL_THOI_GIAN,
        menuName: 'Quản lý thời gian',
        component: QLThoiGian
      },
      {
        path: URL.LICH_BAC_SY,
        menuName: 'Lịch bác sỹ khám',
        component: LichBacSy,
      }
    ],
    url: 'quan-ly-thoi-gian',
  },

  {
    menuName: 'Hỏi đáp-góp ý',
    icon: renderMenuIcon('fa-weixin'),
    children: [
      {
        path: URL.HOIDAP,
        menuName: 'Hỏi đáp-góp ý',
        component: HoiDap,
        exact: true,
        role: [CONSTANTS.ADMIN],
        url: 'hoidap',
      },
      {
        path: URL.DANHMUC_HOIDAP,
        menuName: 'Danh mục hỏi đáp',
        component: DanhmucHoiDap,
        role: [CONSTANTS.ADMIN],
        url: 'dmhoidap',
      },
      { path: `${URL.HOIDAP}/:id`, component: ChiTietHoiDap, exact: true, role: [CONSTANTS.ADMIN], url: 'hoidap' },
    ],
    role: [CONSTANTS.ADMIN, CONSTANTS.MANAGE],
  },

  {
    path: `${URL.TINTUC}/add`,
    exact: true,
    component: TintucChitiet,
    role: [CONSTANTS.ADMIN, CONSTANTS.MANAGE],
    url: 'tintuc',
  },
  {
    path: `${URL.TINTUC}/:id`,
    exact: true,
    component: TintucChitiet,
    role: [CONSTANTS.ADMIN, CONSTANTS.MANAGE],
    url: 'tintuc',
  },

  {
    menuName: 'Tin tức',
    icon: renderMenuIcon('fa-newspaper-o'),
    children: [
      {
        path: URL.TINTUC,
        exact: true,
        menuName: 'Tin tức',
        component: Tintuc,
        role: [CONSTANTS.ADMIN, CONSTANTS.MANAGE],
        url: 'tintuc',
      },
      {
        path: URL.DANHMUC_TINTUC,
        exact: true,
        menuName: 'Danh mục tin tức',
        component: DanhmucTintuc,
        role: [CONSTANTS.ADMIN, CONSTANTS.MANAGE],
        url: 'danhmuc-tintuc',
      },
    ],
    role: [CONSTANTS.ADMIN, CONSTANTS.MANAGE],
  },

  {
    menuName: 'Đánh giá dịch vụ',
    icon: renderMenuIcon('fa-thumbs-up'),
    children: [
      {
        path: URL.DANH_GIA_DICH_VU_BENH_VIEN,
        menuName: 'Đánh giá dịch vụ',
        component: ChiTietDanhGiaDichVu,
        exact: true,
        role: [CONSTANTS.ADMIN, CONSTANTS.MANAGE],
      },
      {
        path: URL.DANH_GIA_DICH_VU_BENH_VIEN_BV,
        menuName: 'Thống kê dịch vụ',
        component: ThongKeDanhGiaDichVu,
        role: [CONSTANTS.ADMIN, CONSTANTS.MANAGE],
      },
      { path: URL.DANHMUC_DANHGIA, menuName: 'Danh mục đánh giá', component: DanhmucDanhGia, role: [CONSTANTS.ADMIN] },
    ],
    role: [CONSTANTS.ADMIN, CONSTANTS.MANAGE],
    url: 'danh-gia-dich-vu',
  },

  // Hướng dẫn khám chữa bệnh
  {
    path: `${URL.HUONGDANKCB}/add`,
    exact: true,
    component: ChiTietHuongDan,
    role: [CONSTANTS.ADMIN, CONSTANTS.MANAGE],
    url: 'huongdankhambenh',
  },
  {
    path: `${URL.HUONGDANKCB}/:id`,
    exact: true,
    component: ChiTietHuongDan,
    role: [CONSTANTS.ADMIN, CONSTANTS.MANAGE],
    url: 'huongdankhambenh',
  },
  {
    menuName: 'Hướng dẫn',
    icon: renderMenuIcon('fa-book'),
    children: [
      {
        path: URL.HUONGDANKCB,
        menuName: 'Hướng dẫn',
        exact: true,
        component: HuongDan,
        role: [CONSTANTS.ADMIN, CONSTANTS.MANAGE],
        url: 'huongdankhambenh',
      },
      {
        path: URL.DANHMUC_HUONGDANKCB,
        menuName: 'Danh mục hướng dẫn',
        exact: true,
        component: DanhMucHuongDan,
        role: [CONSTANTS.ADMIN, CONSTANTS.MANAGE],
        url: 'dm-huongdankhambenh',
      },
    ],
    role: [CONSTANTS.ADMIN, CONSTANTS.MANAGE],
  },

  {
    path: `${URL.DANHMUC_NHANVIEN}/add`,
    component: AddNhanVien,
    url: 'dmnhanvien',
    role: [CONSTANTS.ADMIN],
  },

  {
    path: `${URL.DANHMUC_NHANVIEN}/:id`,
    component: UpdateNhanVien,
    breadcrumbName: 'Cập nhật thông tin giáo viên',
    url: 'dmnhanvien',
    role: [CONSTANTS.ADMIN],
  },

  {
    path: URL.DANHMUC_NHANVIEN,
    menuName: 'Quản lý giáo viên',
    component: DanhmucNhanVien,
    icon: renderMenuIcon('fa-user-md'),
    role: [CONSTANTS.ADMIN],
    url: 'dmnhanvien',
  },
  /*{
    path: URL.DANHMUC_DICHVU,
    menuName: 'Quản lý dịch vụ',
    component: DanhmucDV,
    icon: renderMenuIcon('fa-address-book'),
    role: [CONSTANTS.ADMIN],
  },*/
  //{ path: URL.DANHMUC_DICHVU, menuName: 'Dịch vụ', component: DanhmucDV, role: [CONSTANTS.ADMIN] },

  {
    menuName: 'Quản lý dịch vụ',
    icon: renderMenuIcon('fa-address-book'),
    url: 'quan-ly-dich-vu',
    children: [
      {
        path: URL.GOI_DICH_VU,
        menuName: 'Gói dịch vụ',
        component: GoiDichVu,
        exact: true,
        role: [CONSTANTS.ADMIN, CONSTANTS.MANAGE],
      },
      {
        path: URL.DMGIA,
        menuName: 'Danh mục giá dịch vụ',
        component: DanhmucGia,
        role: [CONSTANTS.ADMIN, CONSTANTS.MANAGE],
      },
      {
        path: URL.DMGOIDICHVU,
        menuName: 'Danh mục gói dịch vụ',
        component: DmGoiDichVu,
        role: [CONSTANTS.ADMIN, CONSTANTS.MANAGE],
      },

      {
        path: `${URL.GOI_DICH_VU}/add`,
        component: AddGoiDichVu,
        exact: true,
        role: [CONSTANTS.ADMIN, CONSTANTS.MANAGE],
      },
      {
        path: `${URL.GOI_DICH_VU}/:id`,
        component: ChiTietGoiDichVu,
        exact: true,
        role: [CONSTANTS.ADMIN, CONSTANTS.MANAGE],
      },
    ],
    role: [CONSTANTS.ADMIN, CONSTANTS.MANAGE],
  },


  //{ path: URL.DANHMUC_DICHVU, menuName: 'Dịch vụ', component: DanhmucDV, role: [CONSTANTS.ADMIN] },
  {
    menuName: 'Quản lý phân quyền',
    icon: renderMenuIcon('fa-book'),
    children: [
      {
        path: URL.TAI_KHOAN,
        menuName: 'Quản lý tài khoản',
        component: TaiKhoan,
        icon: renderMenuIcon('fa-users'),
        exact: true,
        role: [CONSTANTS.ADMIN],
        url: 'tai-khoan',
      },
      {
        path: URL.PHAN_QUYEN_VAI_TRO,
        menuName: 'Phân quyền vai trò',
        component: PhanQuyenVaiTro,
        icon: renderMenuIcon('fa-users'),
        exact: true,
        role: [CONSTANTS.ADMIN],
        url: 'phan-quyen-vai-tro',
      },
    ],
    role: [CONSTANTS.ADMIN],
  },


  //Câu hỏi thường gặp
  {
    path: '/cau-hoi-thuong-gap',
    menuName: 'Câu hỏi thường gặp',
    component: CauHoiThuongGap,
    icon: renderMenuIcon('far fa-question-circle'),
    role: [CONSTANTS.ADMIN],
    url: 'cau-hoi-thuong-gap',
  },

  {
    path: URL.CATEGORY,
    breadcrumbName: 'Danh mục',
    menuName: 'Danh mục chung',
    icon: <InsertRowLeftOutlined/>,
    url: 'danh-muc-chung',
    children: [
      // { path: URL.DANHMUC_PHONG, menuName: 'Phòng', component: DanhmucPhong, role: [CONSTANTS.ADMIN] },
      // { path: URL.DANHMUC_PHONG, menuName: 'Phòng', component: DanhmucThuocVaVatTu, role: [CONSTANTS.ADMIN] },
      { path: URL.DANHMUC_TINHTHANH, menuName: 'Tỉnh thành', component: DanhmucTinhThanh, role: [CONSTANTS.ADMIN] },
      { path: URL.DANHMUC_QUANHUYEN, menuName: 'Quận huyện', component: DanhmucQuanHuyen, role: [CONSTANTS.ADMIN] },
      { path: URL.DANHMUC_PHUONGXA, menuName: 'Phường xã', component: DanhmucPhuongXa, role: [CONSTANTS.ADMIN] },
    ]
  },

  //Câu hỏi bệnh nhân
  /*{
    path:  '/cau-hoi-tu-van',
    menuName: 'Câu hỏi bệnh nhân',
    component: CauHoiBenhNhan,
    exact: true,
    icon: renderMenuIcon('far fa-question-circle'),
    role: [CONSTANTS.ADMIN]
  },*/
  {
    path: `${URL.CAU_HOIBN}/:id`,
    exact: true,
    component: CauHoiBNChitiet,
    role: [CONSTANTS.ADMIN, CONSTANTS.MANAGE],
  },
  {
    path: URL.THONGTINCHUNG,
    menuName: 'Cài đặt',
    component: ThongTinChung,
    icon: renderMenuIcon('fa-cogs'),
    role: [CONSTANTS.ADMIN],
    url: 'thong-tin-chung',
  },
  {
    path: URL.LICH_SU_HOAT_DONG,
    menuName: 'Lịch sử hoạt động',
    component: LichSuHoatDong,
    icon: renderMenuIcon('fa-cogs'),
    role: [CONSTANTS.ADMIN, CONSTANTS.MANAGE],
    url: 'lich-su-hoat-dong',
  },
  {
    path: URL.QUAN_LY_FRONTEND,
    menuName: 'Quản lý Frontend',
    component: QuanLyFrontend,
    icon: renderMenuIcon('fa-cogs'),
    role: [CONSTANTS.ADMIN],
    url: 'quan-ly-frontend',
  },
];

export default constantsRoutes;

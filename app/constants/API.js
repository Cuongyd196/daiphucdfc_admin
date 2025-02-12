export const API = {
  // API_HOST: 'https://pktunganh.thinklabs.com.vn',
  API_HOST: 'http://localhost:3000',
  FILE: '/api/files',
  POWERBI: '/api/powerbi',
  POWERBI_MANAGER: '/api/powerbi/manager',

  LOGIN: '/api/users/login',

  FILES: '/api/files/{0}',
  LIST_FILES: '/api/files/files/{0}',

  USER_INFO: '/api/users/me',
  USER: '/api/users',
  USER_QUERY: '/api/users?page={0}&limit={1}{2}',
  USER_ID: '/api/users/{0}',
  USER_UPDATE_AVATAR: '/api/users/{0}/avatar',

  THONG_TIN_CHUNG: '/api/thong-tin-chung',
  THONG_TIN_CHUNG_ID: '/api/thong-tin-chung/{0}',
  THONG_TIN_CHUNG_QUERY: '/api/thong-tin-chung?{0}',
  THONG_TIN_CHUNG_UPDATE_LOGO: '/api/thong-tin-chung/logo',

  USER_RESET_PASSWORD: '/api/users/reset-password',
  USER_CHANGE_PASSWORD: '/api/users/change-password',
  USER_FORGET_PASSWORD: '/api/users/forgot-password-mail',

  TINH_THANH: '/api/tinh-thanh',
  TINH_THANH_QUERY: '/api/tinh-thanh?page={0}&limit={1}{2}',
  TINH_THANH_ID: '/api/tinh-thanh/{0}',

  QUAN_HUYEN: '/api/quan-huyen',
  QUAN_HUYEN_QUERY: '/api/quan-huyen?page={0}&limit={1}{2}',
  QUAN_HUYEN_ID: '/api/quan-huyen/{0}',

  PHUONG_XA: '/api/phuong-xa',
  PHUONG_XA_QUERY: '/api/phuong-xa?page={0}&limit={1}{2}',
  PHUONG_XA_ID: '/api/phuong-xa/{0}',

  TRIEU_CHUNG: '/api/trieu-chung',
  TRIEU_CHUNG_QUERY: '/api/trieu-chung?page={0}&limit={1}{2}',
  TRIEU_CHUNG_ID: '/api/trieu-chung/{0}',

  BENH: '/api/benh',
  BENH_QUERY: '/api/benh?page={0}&limit={1}{2}',
  BENH_ID: '/api/benh/{0}',

  NOI_SOI_HONG: '/api/noi-soi-hong',
  NOI_SOI_HONG_QUERY: '/api/noi-soi-hong?page={0}&limit={1}{2}',
  NOI_SOI_HONG_ID: '/api/noi-soi-hong/{0}',

  SOI_DA: '/api/soi-da',
  SOI_DA_QUERY: '/api/soi-da?page={0}&limit={1}{2}',
  SOI_DA_ID: '/api/soi-da/{0}',

  NGHE_PHOI: '/api/nghe-phoi',
  NGHE_PHOI_QUERY: '/api/nghe-phoi?page={0}&limit={1}{2}',
  NGHE_PHOI_ID: '/api/nghe-phoi/{0}',

  NOI_SOI_TAI: '/api/noi-soi-tai',
  NOI_SOI_TAI_QUERY: '/api/noi-soi-tai?page={0}&limit={1}{2}',
  NOI_SOI_TAI_ID: '/api/noi-soi-tai/{0}',

  DANHMUC_TINTUC: '/api/danhmuc-tintuc',
  DANHMUC_TINTUC_QUERY: '/api/danhmuc-tintuc?page={0}&limit={1}{2}',
  DANHMUC_TINTUC_ID: '/api/danhmuc-tintuc/{0}',

  TINTUC: '/api/tintuc',
  TINTUC_QUERY: '/api/tintuc?page={0}&limit={1}{2}',
  TINTUC_ID: '/api/tintuc/{0}',

  CAU_HOI: '/api/cau-hoi-thuong-gap',
  CAU_HOI_QUERY: '/api/cau-hoi-thuong-gap?page={0}&limit={1}{2}',
  CAU_HOI_ID: '/api/cau-hoi-thuong-gap/{0}',

  // Câu hỏi bệnh nhân
  CAU_HOIBN: '/api/cau-hoi-tu-van',
  CAU_HOIBN_QUERY: '/api/cau-hoi-tu-van?page={0}&limit={1}{2}',
  CAU_HOIBN_ID: '/api/cau-hoi-tu-van/{0}',

  // Hỏi đáp
  DANHMUC_HOIDAP: '/api/dmhoidap',
  DANHMUC_HOIDAP_QUERY: '/api/dmhoidap?page={0}&limit={1}{2}',
  DANHMUC_HOIDAP_ID: '/api/dmhoidap/{0}',

  HOIDAP: '/api/hoidap',
  HOIDAP_QUERY: '/api/hoidap?page={0}&limit={1}{2}',
  HOIDAP_ID: '/api/hoidap/{0}',
  HOIDAP_MESSAGE: '/api/hoidap/message',
  HOIDAP_ID_MESSAGE: '/api/hoidap/{0}/message?page={1}&limit={2}',

  // Danh mục hành chính
  DANHMUC_PHAI: '/api/dmphai',
  DANHMUC_PHAI_QUERY: '/api/dmphai?page={0}&limit={1}{2}',
  DANHMUC_PHAI_ID: '/api/dmphai/{0}',

  DANHMUC_DANTOC: '/api/dmdantoc',
  DANHMUC_DANTOC_QUERY: '/api/dmdantoc?page={0}&limit={1}{2}',
  DANHMUC_DANTOC_ID: '/api/dmdantoc/{0}',

  DANHMUC_NGHENGHIEP: '/api/dmnghenghiep',
  DANHMUC_NGHENGHIEP_QUERY: '/api/dmnghenghiep?page={0}&limit={1}{2}',
  DANHMUC_NGHENGHIEP_ID: '/api/dmnghenghiep/{0}',

  //Danh mục địa chỉ
  DANHMUC_TINHTHANH: '/api/dmtinhthanh',
  DANHMUC_TINHTHANH_QUERY: '/api/dmtinhthanh?page={0}&limit={1}{2}',
  DANHMUC_TINHTHANH_ID: '/api/dmtinhthanh/{0}',

  DANHMUC_QUANHUYEN: '/api/dmquanhuyen',
  DANHMUC_QUANHUYEN_QUERY: '/api/dmquanhuyen?page={0}&limit={1}{2}',
  DANHMUC_QUANHUYEN_ID: '/api/dmquanhuyen/{0}',

  DANHMUC_PHUONGXA: '/api/dmphuongxa',
  DANHMUC_PHUONGXA_QUERY: '/api/dmphuongxa?page={0}&limit={1}{2}',
  DANHMUC_PHUONGXA_ID: '/api/dmphuongxa/{0}',

  DANHMUC_QUOCTICH: '/api/dmquoctich',
  DANHMUC_QUOCTICH_QUERY: '/api/dmquoctich?page={0}&limit={1}{2}',
  DANHMUC_QUOCTICH_ID: '/api/dmquoctich/{0}',

  //Danh mục chung
  DANHMUC_DOITUONG: '/api/dmdoituong',
  DANHMUC_DOITUONG_QUERY: '/api/dmdoituong?page={0}&limit={1}{2}',
  DANHMUC_DOITUONG_ID: '/api/dmdoituong/{0}',

  DANHMUC_KHOAN: '/api/dmkhoan',
  DANHMUC_KHOAN_QUERY: '/api/dmkhoan?page={0}&limit={1}{2}',
  DANHMUC_KHOAN_ID: '/api/dmkhoan/{0}',

  DANHMUC_NHANVIEN: '/api/dmnhanvien',
  DANHMUC_NHANVIEN_QUERY: '/api/dmnhanvien?page={0}&limit={1}{2}',
  DANHMUC_NHANVIEN_ID: '/api/dmnhanvien/{0}',

  DANHMUC_HINHTHUCDK: '/api//dmhinhthucdenkham',
  DANHMUC_HINHTHUCDK_QUERY: '/api//dmhinhthucdenkham?page={0}&limit={1}{2}',
  DANHMUC_HINHTHUCDK_ID: '/api//dmhinhthucdenkham/{0}',

  //Danh mục phòng
  DANHMUC_LOAIKHOA: '/api/dmloaikk',
  DANHMUC_LOAIKHOA_QUERY: '/api/dmloaikk?page={0}&limit={1}{2}',
  DANHMUC_LOAIKHOA_ID: '/api/dmloaikk/{0}',

  DANHMUC_KHOAKHAM: '/api/dmkk',
  DANHMUC_KHOAKHAM_QUERY: '/api/dmkk?page={0}&limit={1}{2}',
  DANHMUC_KHOAKHAM_ID: '/api/dmkk/{0}',

  DANHMUC_PHONG: '/api/dmphong',
  DANHMUC_PHONG_QUERY: '/api/dmphong?page={0}&limit={1}{2}',
  DANHMUC_PHONG_ID: '/api/dmphong/{0}',

  //Danh mục dịch vụ
  DANHMUC_DICHVU: '/api/dmdichvu',
  DANHMUC_DICHVU_QUERY: '/api/dmdichvu?page={0}&limit={1}{2}',
  DANHMUC_DICHVU_ID: '/api/dmdichvu/{0}',

  // Giá dịch vụ
  GIADICHVU: '/api/gia-dich-vu',
  GIADICHVU_QUERY: '/api/gia-dich-vu?page={0}&limit={1}{2}',
  GIADICHVU_ID: '/api/gia-dich-vu/{0}',

  DANHMUC_DONVITINH: '/api/dmdonvitinh',
  DANHMUC_DONVITINH_QUERY: '/api/dmdonvitinh?page={0}&limit={1}{2}',
  DANHMUC_DONVITINH_ID: '/api/dmdonvitinh/{0}',

  DANHMUC_LOAIDICHVU: '/api/dmloaidichvu',
  DANHMUC_LOAIDICHVU_QUERY: '/api/dmloaidichvu?page={0}&limit={1}{2}',
  DANHMUC_LOAIDICHVU_ID: '/api/dmloaidichvu/{0}',

  DANHMUC_NHOMBAOHIEM: '/api/dmnhombh',
  DANHMUC_NHOMBAOHIEM_QUERY: '/api/dmnhombh?page={0}&limit={1}{2}',
  DANHMUC_NHOMBAOHIEM_ID: '/api/dmnhombh/{0}',

  DANHMUC_NHOMDICHVU: '/api/dmdichvu',
  DANHMUC_NHOMDICHVU_QUERY: '/api/dmdichvu?page={0}&limit={1}{2}',
  DANHMUC_NHOMDICHVU_ID: '/api/dmdichvu/{0}',

  //Danh mục chỉ số 
  DANHMUC_CHISO: '/api/dmchiso',
  DANHMUC_CHISO_QUERY: '/api/dmchiso?page={0}&limit={1}{2}',
  DANHMUC_CHISO_ID: '/api/dmchiso/{0}',

  DANHMUC_NHOMCHISO: '/api/dmnhomchiso',
  DANHMUC_NHOMCHISO_QUERY: '/api/dmnhomchiso?page={0}&limit={1}{2}',
  DANHMUC_NHOMCHISO_ID: '/api/dmnhomchiso/{0}',

  //Danh mục bệnh 
  DANHMUC_BENH: '/api/dmbenh',
  DANHMUC_BENH_QUERY: '/api/dmbenh?page={0}&limit={1}{2}',
  DANHMUC_BENH_ID: '/api/dmbenh/{0}',

  DANHMUC_NHOMBENH: '/api/dmnhombenh',
  DANHMUC_NHOMBENH_QUERY: '/api/dmnhombenh?page={0}&limit={1}{2}',
  DANHMUC_NHOMBENH_ID: '/api/dmnhombenh/{0}',

  DANHMUC_CHUONGBENH: '/api/dmchuongbenh',
  DANHMUC_CHUONGBENH_QUERY: '/api/dmchuongbenh?page={0}&limit={1}{2}',
  DANHMUC_CHUONGBENH_ID: '/api/dmchuongbenh/{0}',

  DANHMUC_GOMBENH: '/api/dmgombenh',
  DANHMUC_GOMBENH_QUERY: '/api/dmgombenh?page={0}&limit={1}{2}',
  DANHMUC_GOMBENH_ID: '/api/dmgombenh/{0}',

  //Danh mục thuốc
  DANHMUC_HOATCHAT: '/api/dmhoatchat',
  DANHMUC_HOATCHAT_QUERY: '/api/dmhoatchat?page={0}&limit={1}{2}',
  DANHMUC_HOATCHAT_ID: '/api/dmhoatchat/{0}',

  DANHMUC_NHOMTHUOC: '/api/dmnhomthuoc',
  DANHMUC_NHOMTHUOC_QUERY: '/api/dmnhomthuoc?page={0}&limit={1}{2}',
  DANHMUC_NHOMTHUOC_ID: '/api/dmnhomthuoc/{0}',

  DANHMUC_DUONGDUNG: '/api/dmduongdung',
  DANHMUC_DUONGDUNG_QUERY: '/api/dmduongdung?page={0}&limit={1}{2}',
  DANHMUC_DUONGDUNG_ID: '/api/dmduongdung/{0}',

  DANHMUC_THUOCVAVATTU: '/api/dmthuocvattu',
  DANHMUC_THUOCVAVATTU_QUERY: '/api/dmthuocvattu?page={0}&limit={1}{2}',
  DANHMUC_THUOCVAVATTU_ID: '/api/dmthuocvattu/{0}',

  //Quản lý
  QL_BENHNHAN: '/api/benhnhan',
  QL_BENHNHAN_QUERY: '/api/benhnhan?page={0}&limit={1}{2}',
  QL_BENHNHAN_ID: '/api/benhnhan/{0}',
  KETQUACLS_ID: '/api/ketquacls/{0}',
  QL_BENHNHAN_HISTORY: '/api/benhnhan/{0}/dangky',
  QL_BENHNHAN_HENKHAM: '/api/benhnhan/{0}/henkham',
  QL_BENHNHAN_HISTORY_DONTHUOC: '/api/benhnhan/{0}/donthuoc',
  QL_BENHNHAN_HISTORY_KQCLS: '/api/benhnhan/{0}/ketquacls',

  GET_CDHA: '/api/chidinh/hinhanh?ID={0}&STT={1}',

  DONTHUOC_ID: '/api/donthuoc/{0}',
  GHICHU_DONTHUOC_ID: '/api/donthuoc/{0}/ghichu',


  QL_DANGKYKHAM: '/api/dangky',
  QL_DANGKYKHAM_QUERY: '/api/dangky?page={0}&limit={1}{2}',
  QL_DANGKYKHAM_ID: '/api/dangky/{0}',

  CHANDOAN_HINHANH_IMAGE: '/api/chan-doan-hinh-anh-image/benhan/{0}',

  //Hướng dẫn khám chữa bênh
  HUONGDANKCB: '/api/huongdankhambenh',
  HUONGDANKCB_QUERY: '/api/huongdankhambenh?page={0}&limit={1}{2}',
  HUONGDANKCB_ID: '/api/huongdankhambenh/{0}',

  DANHMUC_HUONGDANKCB: '/api/dm-huongdankhambenh',
  DANHMUC_HUONGDANKCB_QUERY: '/api/dm-huongdankhambenh?page={0}&limit={1}{2}',
  DANHMUC_HUONGDANKCB_ID: '/api/dm-huongdankhambenh/{0}',

  //Danh mục chỉ số
  DANHMUC_DANHGIA: '/api/dmdanhgia',
  DANHMUC_DANHGIA_QUERY: '/api/dmdanhgia?page={0}&limit={1}{2}',
  DANHMUC_DANHGIA_ID: '/api/dmdanhgia/{0}',

  //Thông tin ứng dụng
  THONG_TIN_UNG_DUNG: '/api/thong-tin-ung-dung',
  THONG_TIN_UNG_DUNG_ID: '/api/thong-tin-ung-dung/page={0}&limit={1}{2}',
  THONG_TIN_UNG_DUNG_QUERY: '/api/thong-tin-ung-dung?{0}',

  //Đánh giá dịch vụ
  DANH_GIA_DICH_VU: '/api/danh-gia-dich-vu',
  DANH_GIA_DICH_VU_ID: '/api/danh-gia-dich-vu/{0}',
  DANH_GIA_DICH_VU_QUERY: '/api/danh-gia-dich-vu?page={0}&limit={1}{2}',
  DG_LOAI_DICH_VU_QUERY: '/api/danh-gia-loai-dich-vu?page={0}&limit={1}{2}',

  DANH_GIA_DICH_VU_BENH_VIEN: '/api/danh-gia-dich-vu-benh-vien',
  DANH_GIA_DICH_VU_BENH_VIEN_ID: '/api/danh-gia-dich-vu-benh-vien/{0}',
  DANH_GIA_DICH_VU_BENH_VIEN_QUERY: '/api/danh-gia-dich-vu-benh-vien?page={0}&limit={1}{2}',

  DANH_GIA_DICH_VU_NV_QUERY: '/api/danh-gia-dich-vu/thong-ke?{0}',
  DANH_GIA_LOAI_DICH_VU_QUERY: '/api/danh-gia-loai-dich-vu/thong-ke?{0}',
  DANH_GIA_DICH_VU_BENH_VIEN_BV_QUERY: '/api/danh-gia-dich-vu-benh-vien/thong-ke?{0}',

  //Thông báo chung
  THONGBAOCHUNG: '/api/thong-bao-chung',
  THONGBAOCHUNG_QUERY: '/api/thong-bao-chung?{0}',
  THONGBAOCHUNG_ID: '/api/thong-bao-chung/{0}',

  //Lịch hẹn
  LICH_HEN: '/api/lich-hen',
  LICH_HEN_QUERY: '/api/lich-hen?page={0}&limit={1}{2}',
  LICH_HEN_ID: '/api/lich-hen/{0}',

  //Danh mục giá
  DMGIA: '/api/dmgiadichvu',
  DMGIA_QUERY: '/api/dmgiadichvu?page={0}&limit={1}{2}',
  DMGIA_ID: '/api/dmgiadichvu/{0}',

  DMGOIDICHVU: '/api/dmgoidichvu',
  DMGOIDICHVU_QUERY: '/api/dmgoidichvu?page={0}&limit={1}{2}',
  DMGOIDICHVU_ID: '/api/dmgoidichvu/{0}',

  //Goi dich vụ
  GOI_DICH_VU: '/api/goi-dich-vu',
  GOI_DICH_VU_QUERY: '/api/goi-dich-vu?page={0}&limit={1}{2}',
  GOI_DICH_VU_ID: '/api/goi-dich-vu/{0}',
  GOI_DICH_VU_ID_QUERY: '/api/goi-dich-vu/{0}?page={1}',
  DS_DICHVU_QUERY: '/api/goi-dich-vu/{0}/gia-dich-vu?page={1}&limit={2}{3}',
  DS_DICHVU_ID: '/api/goi-dich-vu/{0}/gia-dich-vu/{1}',
  DS_DICHVU: '/api/goi-dich-vu/{0}/gia-dich-vu',

  //Đăng ký gói dịch vụ
  DK_GOI_DICH_VU: '/api/dang-ky-goi-dich-vu',
  DK_GOI_DICH_VU_QUERY: '/api/dang-ky-goi-dich-vu?page={0}&limit={1}{2}',
  DK_GOI_DICH_VU_ID: '/api/dang-ky-goi-dich-vu/{0}',

  //Phân quyền vai trò
  PHAN_QUYEN_VAI_TRO: '/api/phan-quyen-vai-tro',
  PHAN_QUYEN_VAI_TRO_QUERY: '/api/phan-quyen-vai-tro?page={0}&limit={1}{2}',
  PHAN_QUYEN_VAI_TRO_ID: '/api/phan-quyen-vai-tro/{0}',
  VAI_TRO_TRANG_ID: 'api/phan-quyen-vai-tro/{0}/trang/{1}',
  VAI_TRO_TRANG: 'api/phan-quyen-vai-tro/{0}/trang',

  //Lịch sử hoạt động
  LICH_SU_HOAT_DONG_QUERY: '/api/lich-su-hoat-dong?page={0}&limit={1}{2}',

  // hssk
  DIUNG: '/api/di-ung?page={0}&limit={1}{2}',
  DIUNG_ADD: '/api/di-ung',
  DIUNG_ID: '/api/di-ung/{0}',
  KETQUAKHAMBENH: '/api/ket-qua-kham?page={0}&limit={1}{2}',
  KETQUAKHAMBENH_ADD: '/api/ket-qua-kham',
  KETQUAKHAMBENH_ID: '/api/ket-qua-kham/{0}',
  DANHBAKHANCAP: '/api/danh-ba-khan-cap?page={0}&limit={1}{2}',
  HOSONGUOITHAN: '/api/ho-so-nguoi-than?page={0}&limit={1}{2}',
  HOSONGUOITHAN_ADD: '/api/ho-so-nguoi-than',
  HOSONGUOITHAN_ID: '/api/ho-so-nguoi-than/{0}',
  PHAUTHUATCAYGHEP: '/api/phau-thuat-cay-ghep?page={0}&limit={1}{2}',
  PHAUTHUATCAYGHEP_ADD: '/api/phau-thuat-cay-ghep',
  PHAUTHUATCAYGHEP_ID: '/api/phau-thuat-cay-ghep/{0}',

  LICHKHAM: '/api/lichkham',
  LICHKHAM_QUERY: '/api/lichkham?page={0}&limit={1}{2}',
  LICHKHAM_ID: '/api/lichkham/{0}',

  LICHKHAMCT: '/api/lichkhamct',
  LICHKHAMCT_QUERY: '/api/lichkhamct?page={0}&limit={1}{2}',
  LICHKHAMCT_ID: '/api/lichkhamct/{0}',

  LICHPHAUTHUAT: '/api/lichphauthuat',
  LICHPHAUTHUAT_QUERY: '/api/lichphauthuat?page={0}&limit={1}{2}',
  LICHPHAUTHUAT_ID: '/api/lichphauthuat/{0}',

  LICHPHAUTHUATCT: '/api/lichphauthuatct',
  LICHPHAUTHUATCT_QUERY: '/api/lichphauthuatct?page={0}&limit={1}{2}',
  LICHPHAUTHUATCT_ID: '/api/lichphauthuatct/{0}',

  //Quản lý thời gian làm việc
  QL_THOI_GIAN: '/api/quan-ly-thoi-gian',
  QL_THOI_GIAN_QUERY: '/api/quan-ly-thoi-gian?page={0}&limit={1}{2}',
  QL_THOI_GIAN_ID: '/api/quan-ly-thoi-gian/{0}',
  //Quản lý đơn thuốc
  QL_DONTHUOC_QUERY: '/api/donthuoc?page={0}&limit={1}{2}',
  QL_DONTHUOC_ID: '/api/donthuoc/{0}/donthuocct',

  //Quản lý hẹn khám
  QL_HENKHAM_QUERY: '/api/henkham?page={0}&limit={1}{2}',

  //Thanh toán Chi tiết
  THANHTOAN_CT_QUERY: '/api/thanhtoanct?page={0}&limit={1}{2}',
  THANHTOAN_CT_CLS: '/api/thanhtoanct/{0}/cls',
  
  //Send sms
  SMS_EXCEL: '/api/sms/import',
  SEND_SMS: '/api/sms/sendsms',

  // Quản lý lịch làm việc của bác sĩ
  QL_LICH_LAM_VIEC: '/api/quan-ly-lich-lam-viec',
  QL_LICH_LAM_VIEC_QUERY: '/api/quan-ly-lich-lam-viec?page={0}&limit={1}{2}',
  QL_LICH_LAM_VIEC_ID: '/api/quan-ly-lich-lam-viec/{0}',

  // Lịch bác sĩ nghỉ
  LICH_BAC_SI_NGHI: '/api/lich-bac-si-nghi',
  LICH_BAC_SI_NGHI_QUERY: '/api/lich-bac-si-nghi?page={0}&limit={1}{2}',
  LICH_BAC_SI_NGHI_ID: '/api/lich-bac-si-nghi/{0}',

  //QUẢN LÝ FRONTEND
  QUAN_LY_FRONTEND: '/api/quan-ly-frontend',
  QUAN_LY_FRONTEND_ID: '/api/quan-ly-frontend/{0}',
  FE_SLIDE_ID: '/api/quan-ly-frontend/{0}/slide/{1}',
  FE_SLIDE: '/api/quan-ly-frontend/{0}/slide',

  //QUẢN LÝ LIÊN HỆ
  QL_LIEN_HE_QUERY: '/api/lien-he?page={0}&limit={1}{2}',
  QL_LIEN_HE_ID: '/api/lien-he/{0}',

  //Gửi hình ảnh cho bệnh nhân
  GUI_HINH_ANH: '/api/gui-hinh-anh',
  GUI_HINH_ANH_QUERY: '/api/gui-hinh-anh?page={0}&limit={1}{2}',
  GUI_HINH_ANH_ID: '/api/gui-hinh-anh/{0}',

  DASHBOARD_THONG_KE: '/api/dashboard/thongke',
  DASHBOARD_LICH_HEN: '/api/dashboard/lichhen',
  DASHBOARD_HOI_DAP: '/api/dashboard/hoidap',
  DASHBOARD_DICH_VU: '/api/dashboard/dichvu',
  DASHBOARD_NHAN_VIEN: '/api/dashboard/nhanvien',
  DASHBOARD_DANHGIA: '/api/dashboard/danhgia',
  DASHBOARD_DANGKY: '/api/dashboard/dangky',

  BANG_GIA_DICH_VU: '/api/bang-gia-dich-vu',
  BANG_GIA_DICH_VU_QUERY: '/api/bang-gia-dich-vu?page={0}&limit={1}{2}',
  BANG_GIA_DICH_VU_ID: '/api/bang-gia-dich-vu/{0}'
};

const PAGINATION_CONFIG_INIT = {
  showSizeChanger: true,
  showTotal: (total, range) => `${range[0]}-${range[1]} của ${total}`,
  size:"small",
};

export const CONSTANTS = {
  TIME_OUT: 60000,

  INPUT: 'INPUT',
  PASSWORD: 'PASSWORD',
  TEXT: 'TEXT',
  NUMBER: 'NUMBER',
  SELECT: 'SELECT',
  MULTI_SELECT: 'MULTI_SELECT',
  DATE: 'DATE',

  TEXT_AREA: 'TEXT_AREA',


  MALE: 'MALE',
  FEMALE: 'FEMALE',
  ALL: 'ALL',
  ADMIN: 'ADMIN',
  MANAGE: 'QUANLY',
  DOCTOR: 'BACSY',
  ADMINISTRATOR: 'ADMINISTRATOR',

  DOWNLOAD: 'DOWNLOAD',
  PRINT: 'PRINT',
  EXPORT: 'EXPORT',
};


export const RULE = {
  REQUIRED: { required: true, whitespace: true, message: 'Không được để trống' },
  NUMBER: {  pattern: '^[0-9]+$', message: 'Không phải là số' },
  PHONE: { pattern: '^[0-9]+$', len: 10, message: 'Số điện thoại không hợp lệ' },
  PHONE_BENHNHAN: { pattern: '^[0-9]+$', message: 'Số điện thoại không hợp lệ' },
  EMAIL: { type: 'email', message: 'Email không hợp lệ' },
  NUMBER_FLOAT: {
    pattern: new RegExp("^[- +]?[0-9]+[.]?[0-9]*([eE][-+]?[0-9]+)?$"),
    message: "Không phải là số"
  }
};
export const PAGINATION_CONFIG = Object.assign({}, PAGINATION_CONFIG_INIT)

export const GENDER_OPTIONS = [
  { value: CONSTANTS.MALE, label: 'Nam' },
  { value: CONSTANTS.FEMALE, label: 'Nữ' },
];

export const DISEASE_GENDER_OPTIONS = [
  { value: CONSTANTS.MALE, label: 'Nam' },
  { value: CONSTANTS.FEMALE, label: 'Nữ' },
  { value: CONSTANTS.ALL, label: 'Tất cả' },
];

export const ROLE_OPTIONS = [
  { value: CONSTANTS.ADMIN, label: 'Quản trị hệ thống' },
  { value: CONSTANTS.MANAGE, label: 'Quản lý' },
];

export const ROLE_PAGES = [
  { trang: 'all', tentrang: 'Chọn tất cả', quyen: ['xem', 'them', 'sua', 'xoa'], xem: false, them: false, sua: false, xoa: false },

  { trang: 'benhnhan', tentrang: 'Quản lý bệnh nhân', quyen: ['xem', 'them', 'sua', 'xoa'], xem: false, them: false, sua: false, xoa: false },
  { trang: 'dangky', tentrang: 'Đăng ký khám bệnh', quyen: ['xem'], xem: false },

  { trang: 'dang-ky-goi-dich-vu', tentrang: 'Đăng ký gói dịch vụ',quyen: ['xem', 'sua'], xem: false,  sua: false },
  { trang: 'lich-hen', tentrang: 'Lịch hẹn',quyen: ['xem', 'sua'], xem: false,  sua: false },

  { trang: 'quan-ly-dich-vu', tentrang: 'Quản lý dịch vụ', quyen: ['xem', 'them', 'sua', 'xoa'], xem: false, them: false, sua: false, xoa: false },
  { trang: 'danh-gia-dich-vu', tentrang: 'Đánh giá dịch vụ', quyen: ['xem', 'them', 'sua', 'xoa'], xem: false, them: false, sua: false, xoa: false },

  { trang: 'tai-khoan', tentrang: 'Tài khoản',quyen: ['xem', 'them', 'sua', 'xoa'], xem: false, them: false, sua: false, xoa: false },
  { trang: 'phan-quyen-vai-tro', tentrang: 'Phân quyền vai trò', quyen: ['xem', 'them', 'sua', 'xoa'], xem: false, them: false, sua: false, xoa: false },
  { trang: 'quan-ly-thoi-gian', tentrang: 'Quản lý lịch làm việc', quyen: ['xem', 'them', 'sua', 'xoa'], xem: false, them: false, sua: false, xoa: false },

  { trang: 'dmnhanvien', tentrang: 'Quản lý giáo viên',quyen: ['xem', 'them', 'sua', 'xoa'], xem: false,  sua: false },

  { trang: 'danhmuc-tintuc', tentrang: 'Danh mục tin tức', quyen: ['xem', 'them', 'sua', 'xoa'], xem: false, them: false, sua: false, xoa: false },
  { trang: 'tintuc', tentrang: 'Tin tức', quyen: ['xem', 'them', 'sua', 'xoa'], xem: false, them: false, sua: false, xoa: false },

  { trang: 'dm-huongdankhambenh', tentrang: 'Danh mục hướng dẫn', quyen: ['xem', 'them', 'sua', 'xoa'], xem: false, them: false, sua: false, xoa: false },
  { trang: 'huongdankhambenh', tentrang: 'Hướng dẫn', quyen: ['xem', 'them', 'sua', 'xoa'], xem: false, them: false, sua: false, xoa: false },

  { trang: 'dmhoidap', tentrang: 'Danh mục hỏi đáp', quyen: ['xem', 'them', 'sua', 'xoa'], xem: false, them: false, sua: false, xoa: false },
  { trang: 'hoidap', tentrang: 'Hỏi đáp-góp ý', quyen: ['xem', 'them', 'sua', 'xoa'], xem: false, them: false, sua: false, xoa: false },

  { trang: 'lich-su-hoat-dong', tentrang: 'Lịch sử hoạt động', quyen: ['xem'], xem: false },

  { trang: 'thong-tin-chung', tentrang: 'Cài đặt', quyen: ['xem', 'sua'], xem: false,  sua: false },

  { trang: 'danh-muc-chung', tentrang: 'Danh mục chung', quyen: ['xem'], xem: false },

  { trang: 'cau-hoi-thuong-gap', tentrang: 'Câu hỏi thường gặp',quyen: ['xem', 'them', 'sua', 'xoa'], xem: false, them: false, sua: false, xoa: false },

  { trang: 'donthuoc', tentrang: 'Đơn thuốc',quyen: ['xem', 'them', 'sua', 'xoa'], xem: false, them: false, sua: false, xoa: false },

  { trang: 'henkham', tentrang: 'Hẹn Khám',quyen: ['xem', 'them', 'sua', 'xoa'], xem: false, them: false, sua: false, xoa: false },

  { trang: 'thanhtoanct', tentrang: 'Thanh toán chi tiết',quyen: ['xem', 'them', 'sua', 'xoa'], xem: false, them: false, sua: false, xoa: false },

  { trang: 'dmquoctich', tentrang: 'Danh mục quốc tịch',quyen: ['xem', 'them', 'sua', 'xoa'], xem: false, them: false, sua: false, xoa: false },

  { trang: 'dashboard', tentrang: 'Dashboard', quyen: ['xem'], xem:false },

  { trang: 'sms-file-excel', tentrang: 'Gửi sms theo file',quyen: ['xem', 'them', 'sua', 'xoa'], xem: false, them: false, sua: false, xoa: false },

  { trang: 'sms-danh-sach-benh-nhan', tentrang: 'Gửi sms theo danh sách lọc',quyen: ['xem', 'them', 'sua', 'xoa'], xem: false, them: false, sua: false, xoa: false },

  { trang: 'quan-ly-frontend', tentrang: 'Quản lý Frontend', quyen: ['xem', 'sua'], xem: false,  sua: false },

  { trang: 'lien-he', tentrang: 'Quản lý liên hệ', quyen: ['xem', 'them', 'sua', 'xoa'], xem: false, them: false, sua: false, xoa: false },

];

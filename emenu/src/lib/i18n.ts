// Simple internationalization configuration
export type TranslationKeys =
  | 'common.loading'
  | 'common.save'
  | 'common.cancel'
  | 'common.delete'
  | 'common.edit'
  | 'common.view'
  | 'common.add'
  | 'common.search'
  | 'common.filter'
  | 'common.submit'
  | 'common.success'
  | 'common.error'
  | 'common.warning'
  | 'common.info'
  | 'common.close'
  | 'common.back'
  | 'common.next'
  | 'common.previous'
  | 'common.yes'
  | 'common.no'
  | 'common.ok'
  | 'common.retry'
  | 'navigation.dashboard'
  | 'navigation.menuManagement'
  | 'navigation.branchManagement'
  | 'navigation.tableLayouts'
  | 'navigation.qrCodes'
  | 'navigation.profile'
  | 'navigation.settings'
  | 'navigation.overview'
  | 'dashboard.welcome'
  | 'dashboard.subtitle'
  | 'dashboard.stats.branches'
  | 'dashboard.stats.menuItems'
  | 'dashboard.stats.staff'
  | 'dashboard.stats.revenue'
  | 'dashboard.quickActions'
  | 'dashboard.recentActivity'
  | 'dashboard.systemStatus'
  | 'branches.title'
  | 'branches.subtitle'
  | 'branches.searchPlaceholder'
  | 'branches.totalBranches'
  | 'branches.totalTables'
  | 'branches.activeLocations'
  | 'branches.addBranch'
  | 'menu.title'
  | 'menu.subtitle'
 | 'menu.totalItems'
  | 'menu.activeItems'
 | 'menu.categories'
 | 'menu.avgRating'
 | 'menu.allItems'
 | 'menu.createItem'
  | 'tableLayouts.title'
  | 'tableLayouts.subtitle'
  | 'tableLayouts.totalLayouts'
  | 'tableLayouts.activeLayouts'
 | 'tableLayouts.totalTables'
 | 'tableLayouts.generated'
 | 'qrCodes.title'
  | 'qrCodes.subtitle'
 | 'qrCodes.totalQRCodes'
 | 'qrCodes.activeTables'
 | 'qrCodes.download'
 | 'qrCodes.branchCoverage'
 | 'qrCodes.generateQRCodes'
  | 'qrCodes.configuration'
  | 'qrCodes.preview'
 | 'profile.title'
  | 'profile.subtitle'
  | 'profile.personalInfo'
 | 'profile.security'
 | 'profile.preferences'
 | 'profile.activity'
  | 'settings.title'
 | 'settings.subtitle'
  | 'errors.accessDenied'
  | 'errors.pageNotFound'
  | 'forms.required'
  | 'forms.invalidEmail'
 | 'forms.passwordMismatch'
  | 'auth.login'
  | 'auth.logout'
  | 'auth.loginRequired'
  | 'auth.credentialsInvalid';

// Translation dictionary
const translations: Record<string, Record<string, string>> = {
  en: {
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.submit': 'Submit',
    'common.success': 'Success',
    'common.error': 'Error',
    'common.warning': 'Warning',
    'common.info': 'Info',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.ok': 'OK',
    'common.retry': 'Retry',
    'navigation.dashboard': 'Overview',
    'navigation.menuManagement': 'Menu Management',
    'navigation.branchManagement': 'Branch Management',
    'navigation.tableLayouts': 'Table Layouts',
    'navigation.qrCodes': 'QR Codes',
    'navigation.profile': 'Profile',
    'navigation.settings': 'Settings',
    'navigation.overview': 'Overview',
    'dashboard.welcome': 'Welcome back, {name}!',
    'dashboard.subtitle': 'Here\'s what\'s happening across your restaurants today.',
    'dashboard.stats.branches': 'Active Branches',
    'dashboard.stats.menuItems': 'Total Menu Items',
    'dashboard.stats.staff': 'Staff Members',
    'dashboard.stats.revenue': 'Monthly Revenue',
    'dashboard.quickActions': 'Quick Actions',
    'dashboard.recentActivity': 'Recent Activity',
    'dashboard.systemStatus': 'System Status',
    'branches.title': 'Restaurant Branches',
    'branches.subtitle': 'View and manage all restaurant branches grouped by brand',
    'branches.searchPlaceholder': 'Search branches...',
    'branches.totalBranches': 'Total Branches',
    'branches.totalTables': 'Total Tables',
    'branches.activeLocations': 'Active locations',
    'branches.addBranch': 'Add Branch',
    'menu.title': 'Menu Management',
    'menu.subtitle': 'Manage menu items, categories, and pricing across all branches.',
    'menu.totalItems': 'Total Items',
    'menu.activeItems': 'Active Items',
    'menu.categories': 'Categories',
    'menu.avgRating': 'Avg Rating',
    'menu.allItems': 'All Items',
    'menu.createItem': 'Create Item',
    'tableLayouts.title': 'Table Layouts',
    'tableLayouts.subtitle': 'Configure and manage table layouts for restaurant branches.',
    'tableLayouts.totalLayouts': 'Total Layouts',
    'tableLayouts.activeLayouts': 'Active Layouts',
    'tableLayouts.totalTables': 'Total Tables',
    'tableLayouts.generated': 'Generated',
    'qrCodes.title': 'QR Code Management',
    'qrCodes.subtitle': 'Generate and manage QR codes for restaurant table access.',
    'qrCodes.totalQRCodes': 'Total QR Codes',
    'qrCodes.activeTables': 'Active Tables',
    'qrCodes.download': 'Downloads',
    'qrCodes.branchCoverage': 'Branch Coverage',
    'qrCodes.generateQRCodes': 'Generate QR Codes',
    'qrCodes.configuration': 'QR Code Configuration',
    'qrCodes.preview': 'Preview',
    'profile.title': 'User Profile',
    'profile.subtitle': 'Manage your account settings and preferences.',
    'profile.personalInfo': 'Personal Information',
    'profile.security': 'Security',
    'profile.preferences': 'Preferences',
    'profile.activity': 'Activity',
    'settings.title': 'System Settings',
    'settings.subtitle': 'Configure system-wide settings and preferences.',
    'errors.accessDenied': 'Access Denied',
    'errors.pageNotFound': 'Page Not Found',
    'forms.required': 'This field is required',
    'forms.invalidEmail': 'Please enter a valid email address',
    'forms.passwordMismatch': 'Passwords do not match',
    'auth.login': 'Login',
    'auth.logout': 'Logout',
    'auth.loginRequired': 'Login Required',
    'auth.credentialsInvalid': 'Invalid credentials'
  },
  vi: {
    'common.loading': 'Đang tải...',
    'common.save': 'Lưu',
    'common.cancel': 'Hủy',
    'common.delete': 'Xóa',
    'common.edit': 'Chỉnh sửa',
    'common.view': 'Xem',
    'common.add': 'Thêm',
    'common.search': 'Tìm kiếm',
    'common.filter': 'Bộ lọc',
    'common.submit': 'Gửi',
    'common.success': 'Thành công',
    'common.error': 'Lỗi',
    'common.warning': 'Cảnh báo',
    'common.info': 'Thông tin',
    'common.close': 'Đóng',
    'common.back': 'Quay lại',
    'common.next': 'Tiếp theo',
    'common.previous': 'Trước',
    'common.yes': 'Có',
    'common.no': 'Không',
    'common.ok': 'OK',
    'common.retry': 'Thử lý lại',
    'navigation.dashboard': 'Tổng quan',
    'navigation.menuManagement': 'Quản lý Menu',
    'navigation.branchManagement': 'Quản lý Chi nhánh',
    'navigation.tableLayouts': 'Bố trí Bàn',
    'navigation.qrCodes': 'Mã QR',
    'navigation.profile': 'Hồ sơ',
    'navigation.settings': 'Cài đặt',
    'navigation.overview': 'Tổng quan',
    'dashboard.welcome': 'Chào mừng trở lại, {name}!',
    'dashboard.subtitle': 'Đây là những gì đang xảy ra trong các nhà hàng của bạn hôm nay.',
    'dashboard.stats.branches': 'Chi nhánh hoạt động',
    'dashboard.stats.menuItems': 'Tổng số món ăn',
    'dashboard.stats.staff': 'Nhân viên',
    'dashboard.stats.revenue': 'Doanh thu hàng tháng',
    'dashboard.quickActions': 'Hành động nhanh',
    'dashboard.recentActivity': 'Hoạt động gần đây',
    'dashboard.systemStatus': 'Trạng thái hệ thống',
    'branches.title': 'Chi nhánh nhà hàng',
    'branches.subtitle': 'Xem và quản lý tất cả các chi nhánh được nhóm theo thương hiệu',
    'branches.searchPlaceholder': 'Tìm kiếm chi nhánh...',
    'branches.totalBranches': 'Tổng số chi nhánh',
    'branches.totalTables': 'Tổng số bàn',
    'branches.activeLocations': 'Địa điểm hoạt động',
    'branches.addBranch': 'Thêm Chi nhánh',
    'menu.title': 'Quản lý Menu',
    'menu.subtitle': 'Quản lý các món ăn, danh mục và giá trên tất cả các chi nhánh.',
    'menu.totalItems': 'Tổng số món ăn',
    'menu.activeItems': 'Món ăn hoạt động',
    'menu.categories': 'Danh mục',
    'menu.avgRating': 'Đánh giá trung bình',
    'menu.allItems': 'Tất cả các món ăn',
    'menu.createItem': 'Tạo Món ăn',
    'tableLayouts.title': 'Bố trí Bàn',
    'tableLayouts.subtitle': 'Cấu hình và quản lý bố trí bàn cho các chi nhánh nhà hàng.',
    'tableLayouts.totalLayouts': 'Tổng số bố trí',
    'tableLayouts.activeLayouts': 'Bố trí hoạt động',
    'tableLayouts.totalTables': 'Tổng số bàn',
    'tableLayouts.generated': 'Đã tạo',
    'qrCodes.title': 'Quản lý Mã QR',
    'qrCodes.subtitle': 'Tạo và quản lý mã QR để truy cập bàn nhà hàng.',
    'qrCodes.totalQRCodes': 'Tổng số mã QR',
    'qrCodes.activeTables': 'Bàn hoạt động',
    'qrCodes.download': 'Lượt tải',
    'qrCodes.branchCoverage': 'Phạm vi chi nhánh',
    'qrCodes.generateQRCodes': 'Tạo Mã QR',
    'qrCodes.configuration': 'Cấu hình Mã QR',
    'qrCodes.preview': 'Xem trước',
    'profile.title': 'Hồ sơ Người dùng',
    'profile.subtitle': 'Quản lý cài đặt và sở thích tài khoản của bạn.',
    'profile.personalInfo': 'Thông tin cá nhân',
    'profile.security': 'Bảo mật',
    'profile.preferences': 'Sở thích',
    'profile.activity': 'Hoạt động',
    'settings.title': 'Cài đặt Hệ thống',
    'settings.subtitle': 'Cấu hình cài đặt hệ thống và sở thích trên toàn hệ thống.',
    'errors.accessDenied': 'Truy cập bị từ chối',
    'errors.pageNotFound': 'Không tìm thấy trang',
    'forms.required': 'Trường này là bắt buộc',
    'forms.invalidEmail': 'Vui lòng nhập địa chỉ email hợp lệ',
    'forms.passwordMismatch': 'Mật khẩu không khớp',
    'auth.login': 'Đăng nhập',
    'auth.logout': 'Đăng xuất',
    'auth.loginRequired': 'Yêu cầu đăng nhập',
    'auth.credentialsInvalid': 'Thông tin đăng nhập không hợp lệ'
  }
};

export const t = (key: TranslationKeys, params?: Record<string, string | number>, locale: string = 'en'): string => {
  const lang = locale in translations ? locale : 'en';
  let translation = translations[lang][key];

  // Handle parameter interpolation
  if (params) {
    Object.keys(params).forEach(param => {
      translation = translation.replace(`{${param}}`, String(params[param]));
    });
  }

  return translation || key;
};

export default {
  t,
  translations
};
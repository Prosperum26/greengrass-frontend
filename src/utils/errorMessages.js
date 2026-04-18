// Centralized error messages for consistent error handling
export const ERROR_MESSAGES = {
  // Authentication
  AUTH_INVALID_CREDENTIALS: 'Email hoặc mật khẩu không chính xác',
  AUTH_EMAIL_EXISTS: 'Email này đã được đăng ký',
  AUTH_REGISTRATION_FAILED: 'Đăng ký thất bại. Vui lòng thử lại',
  AUTH_LOGIN_FAILED: 'Đăng nhập thất bại. Vui lòng thử lại',
  AUTH_LOGOUT_FAILED: 'Đăng xuất thất bại',
  AUTH_SESSION_EXPIRED: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại',
  
  // Authorization
  AUTH_FORBIDDEN: 'Bạn không có quyền truy cập',
  AUTH_UNAUTHORIZED: 'Vui lòng đăng nhập để tiếp tục',
  
  // Events
  EVENT_NOT_FOUND: 'Sự kiện không tìm thấy',
  EVENT_REGISTRATION_FAILED: 'Đăng ký sự kiện thất bại',
  EVENT_CANCEL_FAILED: 'Hủy đăng ký thất bại',
  EVENT_ALREADY_REGISTERED: 'Bạn đã đăng ký sự kiện này',
  EVENT_CREATE_FAILED: 'Tạo sự kiện thất bại',
  EVENT_UPDATE_FAILED: 'Cập nhật sự kiện thất bại',
  EVENT_DUPLICATE_REGISTRATION: 'Bạn đã đăng ký sự kiện này rồi',
  
  // Check-in
  CHECKIN_FAILED: 'Check-in thất bại',
  CHECKIN_INVALID_QR: 'Mã QR không hợp lệ',
  CHECKIN_OUTSIDE_LOCATION: 'Bạn ở quá xa địa điểm sự kiện',
  
  // User
  USER_NOT_FOUND: 'Người dùng không tìm thấy',
  USER_UPDATE_FAILED: 'Cập nhật thông tin thất bại',
  
  // File Upload
  FILE_TOO_LARGE: 'File quá lớn (tối đa 5MB)',
  FILE_INVALID_TYPE: 'Định dạng file không hợp lệ',
  FILE_UPLOAD_FAILED: 'Tải file lên thất bại',
  
  // Network/Server
  NETWORK_ERROR: 'Lỗi kết nối mạng. Vui lòng kiểm tra internet',
  SERVER_ERROR: 'Lỗi máy chủ. Vui lòng thử lại sau',
  REQUEST_TIMEOUT: 'Yêu cầu hết thời gian. Vui lòng thử lại',
  TOO_MANY_REQUESTS: 'Quá nhiều yêu cầu. Vui lòng chờ và thử lại',
  
  // Validation
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại',
  REQUIRED_FIELD: 'Trường này là bắt buộc',
  INVALID_EMAIL: 'Email không hợp lệ',
  PASSWORD_TOO_SHORT: 'Mật khẩu phải có ít nhất 8 ký tự',
  
  // Unknown
  UNKNOWN_ERROR: 'Có lỗi xảy ra. Vui lòng thử lại',
};

// Status code to error message mapping
export const mapErrorByStatus = (status) => {
  switch (status) {
    case 400:
      return ERROR_MESSAGES.VALIDATION_ERROR;
    case 401:
      return ERROR_MESSAGES.AUTH_SESSION_EXPIRED;
    case 403:
      return ERROR_MESSAGES.AUTH_FORBIDDEN;
    case 404:
      return ERROR_MESSAGES.USER_NOT_FOUND;
    case 409:
      return ERROR_MESSAGES.EVENT_DUPLICATE_REGISTRATION;
    case 429:
      return ERROR_MESSAGES.TOO_MANY_REQUESTS;
    case 500:
      return ERROR_MESSAGES.SERVER_ERROR;
    default:
      return ERROR_MESSAGES.UNKNOWN_ERROR;
  }
};

// Extract user-friendly message from API error
export const getErrorMessage = (error) => {
  if (!error) return ERROR_MESSAGES.UNKNOWN_ERROR;

  // Custom message from API
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Status code mapping
  if (error.response?.status) {
    return mapErrorByStatus(error.response.status);
  }

  // Network error
  if (error.message === 'Network Error' || !error.response) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  return ERROR_MESSAGES.UNKNOWN_ERROR;
};

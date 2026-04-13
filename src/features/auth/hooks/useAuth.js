// useAuth Hook
import { useState, useCallback, useEffect } from 'react';
import { authApi } from '../../../api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkUserStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Kéo thông tin user về từ server để đắp lại vào biến state
          const { data } = await authApi.getProfile();
          setUser(data);
        } catch {
          // Nếu token hết hạn hoặc lỗi, xóa luôn cho sạch
          localStorage.removeItem('token');
        }
      }
    };
    checkUserStatus();
  }, []); // [] Đảm bảo chỉ chạy 1 lần duy nhất khi web vừa load xong

  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      // const { data } = await authApi.login(credentials);
      // localStorage.setItem('token', data.token);
      // setUser(data.user);
      // return data;
      // Giả lập hệ thống đang suy nghĩ mất 1.5 giây
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Tự tạo một cục dữ liệu giả (fake data) y như BE trả về
      const fakeData = {
        token: "day-la-token-gia-de-test-thoi-nha",
        user: {
          email: credentials.email,
          name: "Thành viên GreenGrass"
        }
      };

      // Lưu vé thông hành giả vào hệ thống
      localStorage.setItem('token', fakeData.token);
      setUser(fakeData.user);

      return fakeData; // Trả về thành công!
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await authApi.register(userData);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, []);

  const googleAuth = useCallback(async (token) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await authApi.googleAuth(token);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Xác thực Google thất bại');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    googleAuth,
  };
};

export default useAuth;

// import { useState } from 'react';
// // Import cái API team bạn đã viết (bạn nhớ sửa lại đường dẫn cho đúng với thư mục nhé)
// import { authApi } from '../../../api/auth';

// export const useAuth = () => {
//   // Trạng thái chờ gọi API
//   const [isLoading, setIsLoading] = useState(false);
//   // Trạng thái lưu câu thông báo lỗi
//   const [error, setError] = useState(null);

//   const login = async (email, password) => {
//     // 1. Kiểm tra đầu vào (Validation)
//     if (!email || !password) {
//       setError("Vui lòng nhập đầy đủ Email và Password!");
//       return false; // Dừng lại, không chạy xuống dưới nữa
//     }

//     try {
//       // 2. Bắt đầu gọi API
//       setIsLoading(true);
//       setError(null); // Dọn dẹp lỗi cũ trước khi thử đăng nhập lại

//       // Gọi API `login` mà team bạn đã định nghĩa
//       const response = await authApi.login({ email, password });

//       // 3. Nếu thành công (API không quăng lỗi)
//       console.log("Dữ liệu Server trả về:", response.data);

//       // Thường ở đây sẽ lưu Token vào LocalStorage để đánh dấu là đã đăng nhập
//       // localStorage.setItem('accessToken', response.data.token);

//       return true; // Trả về true để báo cho giao diện biết là thành công

//     } catch (err) {
//       // 4. Bắt lỗi (Sai pass, email không tồn tại, hoặc sập server...)
//       console.error("Lỗi đăng nhập:", err);

//       // Lấy câu thông báo lỗi từ backend trả về (nếu có), nếu không có thì báo lỗi chung chung
//       const message = err.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại!";
//       setError(message);

//       return false;
//     } finally {
//       // Dù thành công hay thất bại thì cũng phải tắt vòng xoay loading
//       setIsLoading(false);
//     }
//   };

//   // Xuất đồ nghề ra cho giao diện xài
//   return { login, isLoading, error };
// };
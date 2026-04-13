import React, { useState } from 'react';
import googleLogo from '../../../assets/logo_google.png';
import { useAuth } from '../hooks/useAuth';
// import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
    // 1. Tạo biến để nhớ những gì người dùng gõ vào ô input
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formError, setFormError] = useState('');

    // 2. Lôi đồ nghề từ useAuth ra xài
    const { login, isLoading, error: apiError } = useAuth();
    // const navigate = useNavigate();

    // 3. Hàm kích hoạt khi bấm nút "Sign In"
    const handleLoginSubmit = async (e) => {
        e.preventDefault(); // Cực kỳ quan trọng: Ngăn trình duyệt tự tải lại trang
        setFormError(''); // Xóa lỗi cũ

        // 1. Validation nội bộ trước khi gọi Server
        if (!email || !password) {
            setFormError("Vui lòng nhập đầy đủ Email và Password");
            return;
        }
        // 2. Gọi API
        try {
            // Truyền đúng chuẩn object { email, password } như hook yêu cầu
            await login({ email, password });

            // Nếu chạy qua được dòng trên mà không bị văng lỗi (catch), nghĩa là thành công!
            alert("Đăng nhập thành công!");
            // navigate('/');

        } catch (err) {
            // Lỗi từ server đã được useAuth bắt và gán vào biến `apiError` rồi
            // Chỗ này chỉ để chặn code không chạy xuống hàm alert thôi
            console.log("Đã có lỗi xảy ra:", err);
        }
    };
    return (
        // Khung bao ngoài cùng: chiếm hết chiều cao màn hình (trừ đi phần Header nếu có), căn giữa mọi thứ
        <div className="flex flex-col items-center justify-center min-h-[80vh] py-12 bg-white">

            {/* Tiêu đề LOG IN */}
            <h1 className="text-[40px] font-medium mb-10 uppercase text-black tracking-wide">
                Log In
            </h1>

            {/* Khung Form Đăng nhập (Có viền mờ, bo góc) */}
            <div className="w-full max-w-[594px] p-8 bg-white border border-gray-200 rounded-lg">

                <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">

                    {/* Nhóm Email */}
                    <div className="flex flex-col gap-1 items-start">
                        <label className="text-[15px] text-gray-800 font-medium">Email</label>
                        <input
                            type="email"
                            placeholder="Nhập email của bạn"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-md outline-none focus:border-gray-500 transition-colors"
                        />
                    </div>

                    {/* Nhóm Password */}
                    <div className="flex flex-col gap-1 items-start">
                        <label className="text-[15px] text-gray-800 font-medium">Password</label>
                        <input
                            type="password"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-md outline-none focus:border-gray-500 transition-colors"
                        />
                    </div>

                    {/* Ưu tiên hiện lỗi nhập thiếu, nếu không có thì hiện lỗi API trả về */}
                    {(formError || apiError) && (
                        <p className="text-red-500 text-[14px] text-left">
                            {formError || apiError}
                        </p>
                    )}

                    {/* Khu vực Đăng nhập bằng Google */}
                    <div className="mt-2 flex flex-col items-start">
                        <p className="text-[15px] text-gray-800 mb-3">Đăng nhập bằng cách khác:</p>
                        <button
                            type="button"
                            className="w-[90px] h-[45px] flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            <img src={googleLogo} alt="Google" className="h-6 w-auto object-contain" />
                        </button>
                    </div>

                    {/* Nút Sign In Đen */}
                    <button
                        type="submit"
                        disabled={isLoading} // Khóa nút không cho bấm 2 lần liên tiếp
                        className={`w-full mt-4 py-3.5 text-white text-[15px] font-medium rounded-md transition-colors 
                        ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#222222] hover:bg-black'}`}
                    >
                        {isLoading ? 'Đang xử lý...' : 'Sign In'}
                    </button>
                </form>

                {/* Các liên kết bên dưới */}
                <div className="mt-2 flex flex-col items-start gap-2">
                    <a href="#" className="text-[14px] text-gray-600 hover:text-black underline underline-offset-4 decoration-1">
                        Forgot password?
                    </a>
                    {/* <Link to="/register" className="text-[14px] text-gray-600 hover:text-black underline underline-offset-4 decoration-1">
                        Bạn chưa có tài khoản?
                    </Link> */}
                </div>

            </div>
        </div>
    );
};

export default LoginPage;
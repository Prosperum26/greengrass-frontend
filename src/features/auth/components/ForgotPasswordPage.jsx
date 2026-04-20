import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const handleSendSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Xóa lỗi cũ trước khi kiểm tra lại
        // 1. KIỂM TRA BỎ TRỐNG
        if (!email) {
            setError("Vui lòng nhập email của bạn.");
            return;
        }

        // 2. KIỂM TRA ĐỊNH DẠNG EMAIL (Bắt buộc có @ và dấu .)
        // Giải thích Regex: 
        // ^[^\s@]+  : Phần đầu không được chứa khoảng trắng và @
        // @         : Bắt buộc có chữ @
        // [^\s@]+   : Tên miền (gmail, yahoo) không chứa khoảng trắng và @
        // \.        : Bắt buộc có dấu chấm
        // [^\s@]+$  : Đuôi tên miền (com, vn, edu) 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Email không đúng định dạng (VD: example@gmail.com, sinhvien@uit.edu.vn).");
            return;
        }

        // 3. GỌI API (GIẢ LẬP)
        try {
            setIsLoading(true);

            // Giả vờ hệ thống đang xử lý mất 1.5 giây
            await new Promise(resolve => setTimeout(resolve, 1500));

            // GIẢ LẬP CHECK BACKEND: 
            // Nếu bạn muốn test lỗi "Email không tồn tại", hãy gõ: error@uit.edu.vn
            if (email === 'error@uit.edu.vn') {
                setError("Email này chưa được đăng ký trong hệ thống GreenGrass.");
                return; // Dừng lại, không chạy tiếp xuống dưới
            }

            // NẾU THÀNH CÔNG: Hiện thông báo và chuyển hướng
            alert("Đã gửi mật khẩu mặc định mới vào email của bạn!");
            navigate('/login');

        } catch {
            setError("Đã có lỗi xảy ra từ máy chủ, vui lòng thử lại sau.");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] py-12 bg-[#fafafa]">

            {/* Tiêu đề */}
            <h1 className="text-[36px] font-bold mb-10 text-black tracking-wide text-center">
                Quên mật khẩu
            </h1>

            {/* Khung Form (Kích thước max-w-[500px] giống hệt form Login cho cân đối) */}
            <div className="w-full max-w-[500px] p-10 bg-white border border-gray-200 rounded-lg shadow-sm">

                <form onSubmit={handleSendSubmit} className="flex flex-col gap-5">

                    {/* Nhóm Email */}
                    <div className="flex flex-col gap-1 items-start">
                        <label className="text-[15px] text-gray-800 font-medium">Email</label>
                        <input
                            type="email"
                            placeholder="Nhập email bạn đã đăng ký"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-gray-500 transition-colors"
                        />
                    </div>

                    {/* Vùng hiển thị lỗi màu đỏ */}
                    {error && (
                        <p className="text-red-500 text-[14px] text-left font-medium">
                            {error}
                        </p>
                    )}

                    {/* Nút Send Đen */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full mt-2 py-3.5 text-white text-[15px] font-medium rounded-md transition-colors
                            ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#222222] hover:bg-black'}`}
                    >
                        {isLoading ? 'Đang gửi...' : 'Gửi'}
                    </button>
                </form>

                {/* Các liên kết bên dưới */}
                <div className="mt-6 flex flex-col items-start gap-3">
                        Đăng nhập
                    </a><a href="#" className="text-[14px] text-gray-600 hover:text-black underline underline-offset-4 decoration-1">
                        Bạn chưa có tài khoản?
                    </a> */}
                    <Link
                        to="/login"
                        className="text-[14px] text-gray-600 hover:text-black underline underline-offset-4 decoration-1"
                    >
                        Đăng nhập
                    </Link>
                    <Link
                        to="/register"
                        className="text-[14px] text-gray-600 hover:text-black underline underline-offset-4 decoration-1"
                    >
                        Bạn chưa có tài khoản?
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default ForgotPasswordPage;
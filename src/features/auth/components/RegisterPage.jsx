import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RegisterPage = () => {
    const universitiesList = [
        "Trường Đại học Công nghệ Thông tin (UIT)",
        "Trường Đại học Bách khoa (HCMUT)",
        "Trường Đại học Khoa học Tự nhiên (HCMUS)",
        "Trường Đại học Khoa học Xã hội và Nhân văn (USSH)",
        "Trường Đại học Kinh tế - Luật (UEL)",
        "Trường Đại học Quốc tế (IU)",
        "Trường Đại học Nông Lâm TP.HCM (NLU)",
        "Trường Đại học Thể dục Thể thao TP.HCM (US)",
        "Khác"
    ];

    // 1. TUYỆT CHIÊU GOM STATE: Quản lý 6 ô input trong 1 Object duy nhất
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        verifyCode: '',
        fullName: '',
        studentId: '',
        university: ''
    });

    const [formError, setFormError] = useState('');
    const [isSendingCode, setIsSendingCode] = useState(false); // Trạng thái loading của nút SEND

    // Mượn hàm register từ Hook (Giả sử bạn đã làm fake hàm register trong useAuth giống hệt login)
    const { register, isLoading, error: apiError } = useAuth();
    const navigate = useNavigate();

    // 2. HÀM CẬP NHẬT CHUNG CHO MỌI Ô INPUT
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // 3. LOGIC GỬI OTP GIẢ LẬP
    const handleSendCode = async () => {
        if (!formData.email) {
            setFormError("Vui lòng nhập Email trước khi nhận mã!");
            return;
        }
        setFormError('');
        setIsSendingCode(true);

        // Giả vờ gọi API mất 1.5s
        await new Promise(resolve => setTimeout(resolve, 1500));

        alert("HỆ THỐNG TEST: Đã gửi mã OTP ảo '123456' vào email của bạn!");
        setIsSendingCode(false);
    };

    // 4. LOGIC XỬ LÝ KHI BẤM NÚT REGISTER
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        // Lấy dữ liệu ra để check cho gọn
        const { email, password, verifyCode, fullName, studentId, university } = formData;

        // KIỂM TRA ĐẦU VÀO (VALIDATION)
        if (!email || !password || !verifyCode || !fullName || !studentId || !university) {
            setFormError("Vui lòng điền đầy đủ tất cả các thông tin!");
            return;
        }
        if (password.length < 8) {
            setFormError("Mật khẩu phải có ít nhất 8 ký tự!");
            return;
        }
        if (verifyCode !== '123456') { // Kiểm tra với mã OTP ảo
            setFormError("Mã Verify Code không chính xác (Mã test là 123456)!");
            return;
        }

        // GỌI API ĐĂNG KÝ
        try {
            await register(formData);
            alert("Đăng ký thành công! Chào mừng Tân binh GreenGrass!");
            navigate('/'); // Đá về trang chủ sau khi xong
        } catch (err) {
            console.log("Lỗi đăng ký:", err);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] py-12 bg-[#fafafa]">
            <h1 className="text-[40px] font-medium mb-10 text-black tracking-wide text-center">
                Welcome to GreenGrass
            </h1>

            <div className="w-full max-w-[1000px] p-10 bg-white border border-gray-200 rounded-lg shadow-sm">

                <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-5">

                    {/* Email */}
                    <div className="flex flex-col gap-1 items-start">
                        <label className="text-[15px] text-gray-800 font-medium">Email</label>
                        <input
                            type="email"
                            name="email" // BẮT BUỘC PHẢI CÓ NAME ĐỂ DÙNG handleChange
                            placeholder="Nhập email của bạn"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-gray-500 transition-colors"
                        />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-1 items-start">
                        <label className="text-[15px] text-gray-800 font-medium">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Tối thiểu 8 ký tự"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-gray-500 transition-colors"
                        />
                    </div>

                    {/* Verify code */}
                    <div className="flex flex-col gap-1 items-start w-full">
                        <label className="text-[15px] text-gray-800 font-medium">Verify code</label>
                        <div className="flex w-full gap-3">
                            <input
                                type="text"
                                name="verifyCode"
                                placeholder="Mã gồm 6 chữ số"
                                value={formData.verifyCode}
                                onChange={handleChange}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-gray-500 transition-colors"
                            />
                            <button
                                type="button"
                                onClick={handleSendCode}
                                disabled={isSendingCode}
                                className={`px-8 py-3 text-white font-bold rounded-md transition-colors uppercase tracking-wider
                                    ${isSendingCode ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#006A24] hover:bg-green-800'}`}
                            >
                                {isSendingCode ? 'Sending...' : 'Send'}
                            </button>
                        </div>
                    </div>

                    {/* Full Name */}
                    <div className="flex flex-col gap-1 items-start">
                        <label className="text-[15px] text-gray-800 font-medium">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="VD: Nguyễn Văn A"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-gray-500 transition-colors"
                        />
                    </div>

                    {/* Student ID */}
                    <div className="flex flex-col gap-1 items-start">
                        <label className="text-[15px] text-gray-800 font-medium">Student ID</label>
                        <input
                            type="text"
                            name="studentId"
                            placeholder="Mã số sinh viên"
                            value={formData.studentId}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-gray-500 transition-colors"
                        />
                    </div>

                    {/* University */}
                    <div className="flex flex-col gap-1 items-start">
                        <label className="text-[15px] text-gray-800 font-medium">University</label>
                        <select
                            name="university"
                            value={formData.university}
                            onChange={handleChange}
                            // Thêm bg-white để khi xổ xuống không bị lỗi màu nền trên một số trình duyệt
                            className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-gray-500 transition-colors bg-white cursor-pointer"
                        >
                            {/* Option mặc định ẩn đi khi đã chọn */}
                            <option value="" disabled>-- Chọn trường Đại học của bạn --</option>

                            {/* Dùng vòng lặp map để in danh sách trường ra */}
                            {universitiesList.map((uni, index) => (
                                <option key={index} value={uni}>
                                    {uni}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Vùng hiển thị lỗi */}
                    {(formError || apiError) && (
                        <p className="text-red-500 text-[14px] text-left font-medium">
                            {formError || apiError}
                        </p>
                    )}

                    {/* Nút Register */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full mt-4 py-3.5 text-white text-[15px] font-medium rounded-md transition-colors
                            ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#222222] hover:bg-black'}`}
                    >
                        {isLoading ? 'Đang xử lý...' : 'Register'}
                    </button>
                </form>

                <div className="mt-6 flex flex-col items-start gap-2">
                    {/* <a href="#" className="text-[14px] text-gray-600 hover:text-black underline underline-offset-4 decoration-1">
                        Already have an account?
                    </a> */}
                    <Link to="/login" className="text-[14px] text-gray-600 hover:text-black underline underline-offset-4 decoration-1">
                        Already have an account?
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default RegisterPage;
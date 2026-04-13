import React from 'react';
// import { Link } from 'react-router-dom';

const RegisterPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] py-12 bg-[#fafafa]">

            {/* Tiêu đề */}
            <h1 className="text-[40px] font-medium mb-10 text-black tracking-wide text-center">
                Welcome to GreenGrass
            </h1>

            {/* Khung Form Đăng ký (Nới rộng ra max-w-[700px] để cân đối với nhiều field) */}
            <div className="w-full max-w-[1000px] p-10 bg-white border border-gray-200 rounded-lg shadow-sm">

                <form className="flex flex-col gap-5">

                    {/* Email */}
                    <div className="flex flex-col gap-1 items-start">
                        <label className="text-[15px] text-gray-800 font-medium">Email</label>
                        <input
                            type="email"
                            placeholder="Nhập email của bạn"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-gray-500 transition-colors"
                        />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-1 items-start">
                        <label className="text-[15px] text-gray-800 font-medium">Password</label>
                        <input
                            type="password"
                            placeholder="Nhập mật khẩu"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-gray-500 transition-colors"
                        />
                    </div>

                    {/* Verify code - Gồm ô input và nút SEND nằm ngang */}
                    <div className="flex flex-col gap-1 items-start w-full">
                        <label className="text-[15px] text-gray-800 font-medium">Verify code</label>
                        <div className="flex w-full gap-3">
                            <input
                                type="text"
                                placeholder="Code"
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-gray-500 transition-colors"
                            />
                            <button
                                type="button"
                                className="px-8 py-3 bg-[#006A24] text-white font-bold rounded-md hover:bg-green-800 transition-colors uppercase tracking-wider"
                            >
                                Send
                            </button>
                        </div>
                    </div>

                    {/* Full Name */}
                    <div className="flex flex-col gap-1 items-start">
                        <label className="text-[15px] text-gray-800 font-medium">Full Name</label>
                        <input
                            type="text"
                            placeholder="Value"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-gray-500 transition-colors"
                        />
                    </div>

                    {/* Student ID */}
                    <div className="flex flex-col gap-1 items-start">
                        <label className="text-[15px] text-gray-800 font-medium">Student ID</label>
                        <input
                            type="text"
                            placeholder="Value"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-gray-500 transition-colors"
                        />
                    </div>

                    {/* University */}
                    <div className="flex flex-col gap-1 items-start">
                        <label className="text-[15px] text-gray-800 font-medium">University</label>
                        <input
                            type="text"
                            placeholder="VD: UIT"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-gray-500 transition-colors"
                        />
                    </div>

                    {/* Nút Register */}
                    <button
                        type="submit"
                        className="w-full mt-4 py-3.5 bg-[#222222] text-white text-[15px] font-medium rounded-md hover:bg-black transition-colors"
                    >
                        Register
                    </button>
                </form>

                {/* Link chuyển về trang Đăng nhập */}
                <div className="mt-6 flex flex-col items-start gap-2">
                    {/* <Link to="/login" className="text-[14px] text-gray-600 hover:text-black underline underline-offset-4 decoration-1 text-left">
            Already have an account?
          </Link> */}
                    <a href="#" className="text-[14px] text-gray-600 hover:text-black underline underline-offset-4 decoration-1">
                        Already have an account?
                    </a>
                </div>

            </div>
        </div>
    );
};

export default RegisterPage;
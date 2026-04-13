import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/hooks/useAuth'; // Cập nhật lại đường dẫn cho đúng

const HomePage = () => {
    const navigate = useNavigate();
    // Lấy hàm logout và thông tin user từ Hook
    const { logout, user } = useAuth();

    const handleLogout = async () => {
        await logout(); // Chạy hàm dọn dẹp token
        navigate('/login'); // Đá về lại trang đăng nhập
    };

    return (
        <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6">

            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full text-center border-t-4 border-green-500">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Chào mừng đến với GreenGrass! 🌱
                </h1>

                <p className="text-gray-600 mb-6">
                    Bạn đã đăng nhập thành công với email: <br />
                    <strong className="text-green-600">{user?.email || 'Chưa rõ'}</strong>
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <h3 className="font-bold text-lg text-gray-700">Điểm xanh</h3>
                        <p className="text-2xl text-green-500 font-black">150</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <h3 className="font-bold text-lg text-gray-700">Sự kiện</h3>
                        <p className="text-2xl text-green-500 font-black">3</p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="px-6 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
                >
                    Đăng xuất
                </button>
            </div>

        </div>
    );
};

export default HomePage;
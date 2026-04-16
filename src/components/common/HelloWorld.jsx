import React from 'react';

const HelloWorld = () => {
    return (
        // Đây là Tailwind CSS tạo ra một cái khung (border, padding, bo góc, màu nền)
        <div className="max-w-sm mx-auto my-8 p-6 bg-green-50 border-2 border-green-500 rounded-xl shadow-md text-center">
            <h1 className="text-2xl font-bold text-green-700">
                Hello World! 🌍
            </h1>
            <p className="text-green-600 mt-2">
                Đây là Component đầu tiên của tôi!
            </p>
        </div>
    );
};

export default HelloWorld;
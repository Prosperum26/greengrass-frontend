import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const mockUserData = {
    uid: "000001",
    name: "Nguyễn Văn Bảo",
    avatar: "https://i.pravatar.cc/440?img=11",
    point: 1250,
    ranking: 1,
    badges: [1, 2, 3, 4],
    streak: 15,
    university: "UIT",
    studentId: "2252XXXX",
    currentEvents: [
        { id: "ev01", title: "CHIẾN DỊCH LÀM SẠCH LÀNG ĐẠI HỌC", image: "https://picsum.photos/400/300?random=1" },
        { id: "ev02", title: "NGÀY HỘI ĐỔI RÁC LẤY CÂY XANH 2026", image: "https://picsum.photos/400/300?random=2" },
        { id: "ev03", title: "WORKSHOP SỐNG XANH KHÔNG KHÓ", image: "https://picsum.photos/400/300?random=3" }
    ],
    pastEvents: [
        { id: "ev05", title: "CUỘC THI TÁI CHẾ NHỰA KHOA KHMT", image: "https://picsum.photos/400/300?random=5" },
        { id: "ev06", title: "MÙA HÈ XANH BẾN TRE 2025", image: "https://picsum.photos/400/300?random=6" },
        { id: "ev07", title: "HỘI THẢO TIẾT KIỆM NĂNG LƯỢNG", image: "https://picsum.photos/400/300?random=7" }
    ]
};

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

// ================= CÁC ICON SVG DÙNG CHUNG =================
const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);
const SaveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
    </svg>
);
const EyeIcon = ({ isVisible }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-7 h-7 cursor-pointer transition-colors ${isVisible ? 'text-black' : 'text-gray-300'}`}>
        {isVisible ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
        )}
    </svg>
);
// ===========================================================

const UserProfilePage = () => {
    const { uid, name, avatar, point, ranking, badges, streak, university, studentId, currentEvents, pastEvents } = mockUserData;

    // 1. STATE QUẢN LÝ CHẾ ĐỘ CHỈNH SỬA
    const [isMe, setIsMe] = useState(true); // Đổi thành false để test góc nhìn của người khác
    const [isEditing, setIsEditing] = useState(false);

    // 2. STATE QUẢN LÝ ẨN/HIỆN (Quyền riêng tư)

    const [editData, setEditData] = useState({
        name: mockUserData.name,
        university: mockUserData.university,
        studentId: mockUserData.studentId
    });

    // Móc để điều khiển input file
    const fileInputRef = useRef(null);
    // Chứa link ảnh để hiện lên UI
    const [avatarPreview, setAvatarPreview] = useState(mockUserData.avatar);

    const [privacy, setPrivacy] = useState({
        point: true,
        ranking: true,
        badges: true,
        streak: true
    });

    // Hàm cập nhật chữ khi gõ
    const handleInputChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    // Hàm xử lý khi chọn ảnh từ máy tính
    const handleAvatarChange = (e) => {
        const file = e.target.files[0]; // Lấy file đầu tiên người dùng chọn
        if (file) {
            // Tạo một đường link URL ảo ngay trên trình duyệt để xem trước (Preview)
            const previewUrl = URL.createObjectURL(file);
            setAvatarPreview(previewUrl);

            // Nếu BE yêu cầu, bạn có thể lưu luôn biến 'file' này vào state 
            // để lúc bấm Save thì gửi nguyên cục file này lên Server nhé.
        }
    };

    const togglePrivacy = (field) => {
        if (!isEditing) return; // Chỉ cho bấm đổi mắt khi đang bật Edit
        setPrivacy(prev => ({ ...prev, [field]: !prev[field] }));
    };

    // Hàm bấm nút Save
    const handleSave = async () => {
        try {
            // BƯỚC 1: Xử lý Upload Ảnh (Tương lai)
            let finalAvatarUrl = avatarPreview;
            // Nếu người dùng có chọn file mới (cái móc có chứa file)
            if (fileInputRef.current && fileInputRef.current.files[0]) {
                const fileToUpload = fileInputRef.current.files[0];
                console.log("Đang upload file này lên server:", fileToUpload.name);

                // --- ĐOẠN NÀY ĐỂ DÀNH KHI CÓ API UPLOAD ---
                // const formData = new FormData();
                // formData.append('image', fileToUpload);
                // const uploadRes = await axios.post('/upload', formData);
                // finalAvatarUrl = uploadRes.data.url; 
                // ------------------------------------------
            }

            // BƯỚC 2: Gom data đúng chuẩn y hệt Swagger của BE
            const payload = {
                fullName: editData.name,         // Ép từ 'name' sang 'fullName'
                avatarUrl: finalAvatarUrl,       // Link ảnh đã upload thành công
                studentId: editData.studentId,
                university: editData.university
            };

            // BƯỚC 3: Gửi lên Backend
            console.log("Dữ liệu chuẩn bị gửi qua PUT /users/me :", payload);

            // --- ĐOẠN GỌI API THẬT (Mở comment khi ráp BE) ---
            // const token = localStorage.getItem('token');
            // await axios.put('http://localhost:3000/users/me', payload, {
            //     headers: { Authorization: `Bearer ${token}` }
            // });
            // -------------------------------------------------

            alert("Đã gửi dữ liệu! Bấm F12 mở tab Console để xem Data nhé.");
            setIsEditing(false);

        } catch (error) {
            console.error("Lỗi khi cập nhật profile:", error);
            alert("Có lỗi xảy ra, vui lòng thử lại!");
        }
    };

    // Phân trang
    const ITEMS_PER_PAGE = 3;
    const [pageCurrent, setPageCurrent] = useState(1);
    const [pagePast, setPagePast] = useState(1);
    const totalPagesCurrent = Math.ceil(currentEvents.length / ITEMS_PER_PAGE);
    const totalPagesPast = Math.ceil(pastEvents.length / ITEMS_PER_PAGE);
    const displayedCurrentEvents = currentEvents.slice((pageCurrent - 1) * ITEMS_PER_PAGE, pageCurrent * ITEMS_PER_PAGE);
    const displayedPastEvents = pastEvents.slice((pagePast - 1) * ITEMS_PER_PAGE, pagePast * ITEMS_PER_PAGE);

    return (
        <div className="w-full max-w-[1440px] mx-auto py-12 px-6 bg-white min-h-screen">

            {/* ======= PHẦN NỬA TRÊN: THÔNG TIN CÁ NHÂN ======= */}
            <div className="relative flex flex-col md:flex-row items-center md:items-start justify-center gap-10 md:gap-24 mb-16 pt-8">

                {/* NÚT EDIT / SAVE Ở GÓC PHẢI CÙNG */}
                {isMe && (
                    <button
                        onClick={isEditing ? handleSave : () => setIsEditing(true)}
                        className="absolute top-0 right-0 p-3 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        {isEditing ? <SaveIcon /> : <EditIcon />}
                    </button>
                )}

                {/* CỘT TRÁI */}
                <div className="flex flex-col items-center w-full md:w-auto">
                    {/* AVATAR */}
                    <div className="relative">
                        {/* ĐỔI src={avatar} THÀNH src={avatarPreview} */}
                        <img
                            src={avatarPreview}
                            alt="User Avatar"
                            className="w-[300px] h-[300px] md:w-[440px] md:h-[440px] rounded-full object-cover border-2 border-gray-200 shadow-sm"
                        />

                        {isEditing && (
                            <>
                                {/* NÚT BẤM HIỂN THỊ TRÊN UI */}
                                <div
                                    onClick={() => fileInputRef.current.click()} // Bấm nút này là gọi cái thẻ ẩn ở dưới
                                    className="absolute top-10 right-10 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100"
                                >
                                    <EditIcon />
                                </div>

                                {/* THẺ INPUT FILE BỊ GIẤU (TÀNG HÌNH) */}
                                <input
                                    type="file"
                                    accept="image/*" // Chỉ cho phép chọn file ảnh
                                    ref={fileInputRef}
                                    onChange={handleAvatarChange}
                                    className="hidden" // Dấu nhẹm đi
                                />
                            </>
                        )}
                    </div>

                    {/* TÊN */}
                    <div className="flex items-center justify-center gap-2 mt-4 w-full">
                        {isEditing && <EditIcon />}
                        {isEditing ? (
                            <input
                                type="text" name="name" value={editData.name} onChange={handleInputChange}
                                className="text-[32px] md:text-[40px] font-bold text-black uppercase text-center border-b-2 border-gray-400 outline-none bg-transparent px-2 w-[80%] max-w-[350px]"
                            />
                        ) : (
                            <p className="text-[32px] md:text-[40px] font-bold text-black uppercase text-center leading-tight">
                                {editData.name}
                            </p>
                        )}
                    </div>

                    {/* POINT */}
                    <div className="flex items-center gap-2 mt-1">
                        {isEditing && <div onClick={() => togglePrivacy('point')}><EyeIcon isVisible={privacy.point} /></div>}
                        <p className={`text-[20px] md:text-[24px] font-bold uppercase transition-opacity ${!privacy.point && isEditing ? 'opacity-30' : 'text-black'}`}>
                            POINT: {(!isMe && !privacy.point) ? '***' : mockUserData.point}
                        </p>
                    </div>
                    <p className="text-[14px] text-gray-500 font-medium uppercase mt-1">uid: {mockUserData.uid}</p>
                </div>

                {/* CỘT PHẢI */}
                <div className="flex flex-col items-start gap-4 md:mt-20 w-full md:w-auto">

                    {/* RANKING */}
                    <div className="flex items-center gap-2">
                        {isEditing && <div onClick={() => togglePrivacy('ranking')}><EyeIcon isVisible={privacy.ranking} /></div>}
                        <p className={`text-[28px] md:text-[36px] font-bold uppercase ${!privacy.ranking && isEditing ? 'opacity-30' : 'text-black'}`}>
                            RANKING: {(!isMe && !privacy.ranking) ? 'ĐÃ ẨN' : mockUserData.ranking}
                        </p>
                    </div>

                    {/* BADGES */}
                    <div className="flex flex-col items-start w-full">
                        <div className="flex items-center gap-2 mb-2">
                            {isEditing && (
                                <div onClick={() => togglePrivacy('badges')}><EyeIcon isVisible={privacy.badges} /></div>
                            )}
                            <p className={`text-[28px] md:text-[36px] font-bold uppercase ${!privacy.badges && isEditing ? 'opacity-30' : 'text-black'}`}>
                                BADGES:
                            </p>
                        </div>
                        <div className={`flex gap-4 ${!privacy.badges && isEditing ? 'opacity-30' : ''}`}>
                            {/* Nếu không phải mình và Badges bị ẩn thì in ra *** */}
                            {(!isMe && !privacy.badges) ? (
                                <p className="text-[20px] font-bold text-gray-500">***</p>
                            ) : (
                                badges.map((badge, index) => (
                                    <div key={index} className="w-[75px] h-[75px] md:w-[105px] md:h-[105px] rounded-full border-[1.5px] border-black flex items-center justify-center bg-transparent"></div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* STREAK */}
                    <div className="flex items-center gap-2">
                        {isEditing && <div onClick={() => togglePrivacy('streak')}><EyeIcon isVisible={privacy.streak} /></div>}
                        <p className={`text-[28px] md:text-[36px] font-bold uppercase ${!privacy.streak && isEditing ? 'opacity-30' : 'text-black'}`}>
                            STREAK: {(!isMe && !privacy.streak) ? '***' : mockUserData.streak}
                        </p>
                    </div>

                    {/* UNIVERSITY & STUDENT ID */}
                    <div className="mt-1 text-[16px] md:text-[18px] text-black font-bold leading-relaxed w-full text-left">
                        <div className="flex items-center gap-2 mb-2">
                            {isEditing && <EditIcon />}
                            <span>University: </span>
                            {isEditing ? (
                                <select
                                    name="university"
                                    value={editData.university}
                                    onChange={handleInputChange}
                                    className="border-b border-gray-400 outline-none bg-transparent px-1 w-[250px] cursor-pointer"
                                >
                                    {universitiesList.map((uni, index) => (
                                        <option key={index} value={uni} className="text-black bg-white">
                                            {uni}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <span>{editData.university}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {isEditing && <EditIcon />}
                            <span>Student ID: </span>
                            {isEditing ? (
                                <input type="text" name="studentId" value={editData.studentId} onChange={handleInputChange} className="border-b border-gray-400 outline-none bg-transparent px-1 w-[200px]" />
                            ) : <span>{editData.studentId}</span>}
                        </div>
                    </div>
                </div>
            </div>

            {/* ======= PHẦN NỬA DƯỚI: LƯỚI SỰ KIỆN (Giữ nguyên không đổi) ======= */}
            <div className="w-full mt-10 border-t-2 border-gray-200 pt-12">

                {/* 1. MỤC ĐANG THAM GIA */}
                <div className="mb-14">
                    <h2 className="text-[28px] md:text-[36px] font-bold text-black uppercase mb-6">SỰ KIỆN ĐANG THAM GIA</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10">
                        {displayedCurrentEvents.map((event) => (
                            <Link to={`/events/${event.id}`} key={event.id} className="group block cursor-pointer">
                                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden border border-gray-300 shadow-sm mb-4">
                                    <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                </div>
                                <p className="text-[20px] leading-[28px] h-[56px] font-bold text-black uppercase line-clamp-2 transition-colors duration-300 group-hover:text-[#006A24]">
                                    {event.title}
                                </p>
                            </Link>
                        ))}
                    </div>
                    {totalPagesCurrent > 1 && (
                        <div className="flex items-center justify-center gap-4 mt-8">
                            <button onClick={() => setPageCurrent(prev => prev - 1)} disabled={pageCurrent === 1} className="px-4 py-2 bg-gray-100 font-bold rounded-lg disabled:opacity-50 hover:bg-gray-200">&larr; Prev</button>
                            <span className="text-[18px] font-bold">{pageCurrent} / {totalPagesCurrent}</span>
                            <button onClick={() => setPageCurrent(prev => prev + 1)} disabled={pageCurrent === totalPagesCurrent} className="px-4 py-2 bg-gray-100 font-bold rounded-lg disabled:opacity-50 hover:bg-gray-200">Next &rarr;</button>
                        </div>
                    )}
                </div>

                {/* 2. MỤC ĐÃ THAM GIA */}
                <div>
                    <h2 className="text-[28px] md:text-[36px] font-bold text-black uppercase mb-6">SỰ KIỆN ĐÃ THAM GIA</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10">
                        {displayedPastEvents.map((event) => (
                            <Link to={`/events/${event.id}`} key={event.id} className="group block cursor-pointer">
                                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden border border-gray-300 shadow-sm mb-4">
                                    <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                </div>
                                <p className="text-[20px] leading-[28px] h-[56px] font-bold text-black uppercase line-clamp-2 transition-colors duration-300 group-hover:text-[#006A24]">
                                    {event.title}
                                </p>
                            </Link>
                        ))}
                    </div>
                    {totalPagesPast > 1 && (
                        <div className="flex items-center justify-center gap-4 mt-8">
                            <button onClick={() => setPagePast(prev => prev - 1)} disabled={pagePast === 1} className="px-4 py-2 bg-gray-100 font-bold rounded-lg disabled:opacity-50 hover:bg-gray-200">&larr; Prev</button>
                            <span className="text-[18px] font-bold">{pagePast} / {totalPagesPast}</span>
                            <button onClick={() => setPagePast(prev => prev + 1)} disabled={pagePast === totalPagesPast} className="px-4 py-2 bg-gray-100 font-bold rounded-lg disabled:opacity-50 hover:bg-gray-200">Next &rarr;</button>
                        </div>
                    )}
                </div>

            </div>

        </div>
    );
};

export default UserProfilePage;
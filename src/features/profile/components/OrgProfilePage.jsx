import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
// import axios from 'axios'; // Mở comment này khi bắt đầu gọi API thật

// Mảng danh sách trường (Dùng chung cho cả User và Tổ chức)
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

// ================= MOCK DATA CHO TỔ CHỨC =================
const mockOrgData = {
    id: "org_uit_green",
    name: "CÂU LẠC BỘ MÔI TRƯỜNG GREEN UIT",
    description: "Nơi ươm mầm những hạt giống xanh, bảo vệ môi trường và lan tỏa lối sống bền vững trong cộng đồng sinh viên Làng Đại học Quốc Gia TP.HCM.",
    university: "Trường Đại học Công nghệ Thông tin (UIT)",
    faculty: "Trực thuộc Đoàn Thanh niên - Hội Sinh viên",
    avatar: "https://picsum.photos/440/440?random=1",     // Size 440x440
    background: "https://picsum.photos/1440/720?random=2", // Size 1440x720

    // Đổi mảng này thành rỗng [] để test trạng thái "Đang nghỉ ngơi" nha
    currentEvents: [

    ],
    // { id: "ce1", title: "CHIẾN DỊCH GIỜ TRÁI ĐẤT 2026", desc: "Cùng nhau tắt đèn 1 giờ để gửi thông điệp yêu thương đến hành tinh xanh của chúng ta.", image: "https://picsum.photos/800/600?random=3" },
    // { id: "ce2", title: "NGÀY HỘI ĐỔI RÁC LẤY SEN ĐÁ", desc: "Mang giấy vụn, vỏ chai nhựa đến sảnh C để rinh về những chậu sen đá siêu xinh.", image: "https://picsum.photos/800/600?random=4" }

    pastEvents: [
        { id: "pe1", title: "MÙA HÈ XANH MẶT TRẬN BẾN TRE 2025", image: "https://picsum.photos/800/1000?random=5" }, // Thằng này sẽ bị ghim bên trái
        { id: "pe2", title: "HỘI THẢO: RÁC THẢI ĐIỆN TỬ VÀ TƯƠNG LAI", image: "https://picsum.photos/600/400?random=6" },
        { id: "pe3", title: "DỌN RÁC KHU ĐÔ THỊ ĐHQG ĐỢT 1", image: "https://picsum.photos/600/400?random=7" },
        { id: "pe4", title: "CUỘC THI SÁNG TẠO TỪ ĐỒ TÁI CHẾ", image: "https://picsum.photos/600/400?random=8" },
        { id: "pe5", title: "TRỒNG CÂY TẠI KHU NỘI TRÚ CỎ MAY", image: "https://picsum.photos/600/400?random=9" }
    ]
};

// ================= ICON NGHỈ NGƠI =================
const SleepingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24 text-gray-400 mb-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 8.25A2.25 2.25 0 1119.5 8.25" />
    </svg>
);

// ================= CÁC ICON SVG =================
const EditIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);
const SaveIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
    </svg>
);
const CameraIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
    </svg>
);

const OrgProfilePage = () => {
    // Lấy ID của tổ chức từ thanh địa chỉ URL (Ví dụ: /org/uit_green)
    // const { orgId } = useParams();

    const { currentEvents, pastEvents } = mockOrgData;

    // --- CÁC STATE QUẢN LÝ DỮ LIỆU ---
    const [isLoading, setIsLoading] = useState(true); // Trạng thái chờ load data
    const [orgData, setOrgData] = useState(null); // Data xịn từ BE sẽ nằm ở đây

    // 1. STATE PHÂN QUYỀN VÀ CHỈNH SỬA
    const [isMe, setIsMe] = useState(true); // Gắn thành true để test nút Edit
    const [isEditing, setIsEditing] = useState(false);

    // 2. STATE LƯU TRỮ TEXT
    const [editData, setEditData] = useState({
        name: mockOrgData.name,
        description: mockOrgData.description,
        university: mockOrgData.university,
        faculty: mockOrgData.faculty || "" // Khởi tạo rỗng nếu không có
    });

    // code STATE LƯU TRỮ TEXT khi đã kết nối với API và không sử dụng mock data
    // const [editData, setEditData] = useState({ name: "", description: "", university: "", faculty: "" });

    // 3. STATE VÀ REF CHO ẢNH (Avatar + Background)
    const avatarRef = useRef(null);
    const bgRef = useRef(null);
    const [avatarPreview, setAvatarPreview] = useState(mockOrgData.avatar);
    const [bgPreview, setBgPreview] = useState(mockOrgData.background);

    // code STATE VÀ REF CHO ẢNH (Avatar + Background) khi đã kết nối với API và không sử dụng mock data
    // const [avatarPreview, setAvatarPreview] = useState("");
    // const [bgPreview, setBgPreview] = useState("");

    // // =====================================================================
    // // 📍 API 1: LẤY DỮ LIỆU TỔ CHỨC VÀ SỰ KIỆN KHI MỞ TRANG (GET)
    // // =====================================================================
    // useEffect(() => {
    //     const fetchOrgProfile = async () => {
    //         try {
    //             setIsLoading(true);
    //             // 🟢 THỰC TẾ: const res = await axios.get(`/api/organizations/${orgId}`);
    //             // 🟢 BE TRẢ VỀ (Response): 
    //             // {
    //             //    id: "org123", name: "...", description: "...", university: "...", faculty: "...",
    //             //    avatarUrl: "https...", backgroundUrl: "https...",
    //             //    currentEvents: [ { id: "e1", title: "...", image: "..." } ],
    //             //    pastEvents: [ { id: "e2", title: "...", image: "..." } ],
    //             //    isOwner: true // BE có thể trả về cờ này để biết mình có phải admin tổ chức ko
    //             // }

    //             // MÔ PHỎNG: Dùng setTimeout để giả vờ đang gọi API mất 1 giây
    //             setTimeout(() => {
    //                 const data = mockOrgData; // Lấy tạm data giả
    //                 setOrgData(data);

    //                 // Nạp data vào form edit để sẵn sàng sửa
    //                 setEditData({
    //                     name: data.name, description: data.description, 
    //                     university: data.university, faculty: data.faculty || ""
    //                 });
    //                 setAvatarPreview(data.avatar);
    //                 setBgPreview(data.background);
    //                 setIsMe(true); // Giả vờ mình là chủ

    //                 setIsLoading(false);
    //             }, 1000);

    //         } catch (error) {
    //             console.error("Lỗi khi tải profile tổ chức:", error);
    //             setIsLoading(false);
    //         }
    //     };

    //     if (orgId) fetchOrgProfile(); // Chỉ gọi khi có ID
    // }, [orgId]);

    // // =====================================================================
    // // 📍 CÁC HÀM XỬ LÝ SỰ KIỆN GÕ & CHỌN ẢNH
    // // =====================================================================
    // const handleInputChange = (e) => setEditData({ ...editData, [e.target.name]: e.target.value });

    // const handleImageChange = (e, setPreview) => {
    //     const file = e.target.files[0];
    //     if (file) setPreview(URL.createObjectURL(file));
    // };

    // // =====================================================================
    // // 📍 API 2 & 3: LƯU THÔNG TIN (POST ẢNH + PUT DATA)
    // // =====================================================================
    // const handleSave = async () => {
    //     try {
    //         let finalAvatarUrl = avatarPreview;
    //         let finalBgUrl = bgPreview;

    //         // 📍 API 2: UPLOAD ẢNH (POST) - Nếu có chọn ảnh mới
    //         // --------------------------------------------------
    //         // 🟢 YÊU CẦU GỬI (Payload): FormData chứa file ảnh (multipart/form-data)
    //         // 🟢 BE TRẢ VỀ (Response): { url: "https://cloud.domain.com/anh-moi.jpg" }
    //         if (avatarRef.current && avatarRef.current.files[0]) {
    //             const avatarFile = avatarRef.current.files[0];
    //             console.log("Gọi API POST /api/upload để up Avatar:", avatarFile.name);
    //             // Thực tế: finalAvatarUrl = (await axios.post('/api/upload', formData)).data.url;
    //         }

    //         if (bgRef.current && bgRef.current.files[0]) {
    //             const bgFile = bgRef.current.files[0];
    //             console.log("Gọi API POST /api/upload để up Background:", bgFile.name);
    //             // Thực tế: finalBgUrl = (await axios.post('/api/upload', formData)).data.url;
    //         }

    //         // 📍 API 3: CẬP NHẬT PROFILE (PUT)
    //         // --------------------------------------------------
    //         const payload = {
    //             name: editData.name,
    //             description: editData.description,
    //             university: editData.university,
    //             faculty: editData.faculty,
    //             avatarUrl: finalAvatarUrl,
    //             backgroundUrl: finalBgUrl
    //         };

    //         // 🟢 YÊU CẦU GỬI (Payload): Cục object 'payload' ở trên (application/json)
    //         // 🟢 BE TRẢ VỀ (Response): 200 OK + { message: "Cập nhật thành công" }
    //         console.log("Gọi API PUT /api/organizations/me với data:", payload);
    //         // Thực tế: await axios.put('/api/organizations/me', payload, { headers: {...} });

    //         setIsEditing(false);
    //         alert("Đã lưu thành công!");

    //     } catch (error) {
    //         console.error("Lỗi khi lưu thông tin:", error);
    //         alert("Lưu thất bại, vui lòng thử lại!");
    //     }
    // };

    // // --- XỬ LÝ KHI ĐANG LOADING ---
    // if (isLoading || !orgData) {
    //     return <div className="w-full h-screen flex items-center justify-center text-2xl font-bold">Đang tải dữ liệu...</div>;
    // }

    // --- CÁC HÀM XỬ LÝ ---
    const handleInputChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e, setPreview) => {
        const file = e.target.files[0];
        if (file) setPreview(URL.createObjectURL(file));
    };

    const handleSave = () => {
        setIsEditing(false);
        console.log("Dữ liệu Tổ chức chuẩn bị gửi lên BE:", { ...editData, avatarPreview, bgPreview });
        alert("Đã lưu thông tin Tổ chức thành công!");
    };

    // --- LOGIC PHÂN TRANG CHO SỰ KIỆN CŨ ---
    const pinnedPastEvent = pastEvents[0]; // Rút cái mới nhất ra ghim
    const remainingPastEvents = pastEvents.slice(1); // Cắt mảng từ vị trí số 1 trở đi

    // // --- LOGIC PHÂN TRANG CHO SỰ KIỆN CŨ (Dùng orgData thực tế tức khi có API) ---
    // const validPastEvents = orgData.pastEvents.filter(event => event); 
    // const pinnedPastEvent = validPastEvents[0]; 
    // const remainingPastEvents = validPastEvents.slice(1);

    const ITEMS_PER_PAGE = 2; // Bạn chốt 2 ảnh nhỏ 1 trang
    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(remainingPastEvents.length / ITEMS_PER_PAGE);
    const displayedPastEvents = remainingPastEvents.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return (
        <div className="w-full bg-[#fafafa] min-h-screen pb-20">

            {/* ======= PHẦN 1: THÔNG TIN TỔ CHỨC (HEADER) ======= */}
            {/* Set chiều cao h-[600px] cho mobile và h-[720px] cho desktop */}
            <div className="relative w-full max-w-[1440px] mx-auto h-[600px] md:h-[720px] overflow-hidden">
                {/* 1. Ảnh Background */}
                <img src={bgPreview} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
                {/* Nút Đổi Background (Chỉ hiện khi Edit Mode) */}
                {isEditing && (
                    <div
                        onClick={() => bgRef.current.click()}
                        className="absolute top-6 left-6 z-30 p-3 bg-black/60 hover:bg-black/80 rounded-full cursor-pointer text-white border border-white/30 backdrop-blur-sm transition-all"
                        title="Đổi ảnh bìa"
                    >
                        <CameraIcon className="w-6 h-6" />
                    </div>
                )}
                {/* Thẻ input ẩn cho Background */}
                <input type="file" accept="image/*" ref={bgRef} onChange={(e) => handleImageChange(e, setBgPreview)} className="hidden" />
                {/* 2. Lớp màn đen Overlay (Độ mờ 60%) */}
                <div className="absolute inset-0 bg-black/60 z-10"></div>
                {/* Nút EDIT TỔNG nằm góc trên bên phải */}
                {isMe && (
                    <button
                        onClick={isEditing ? handleSave : () => setIsEditing(true)}
                        className="absolute top-6 right-6 z-30 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg text-white font-bold flex items-center gap-2 transition-colors border border-white/30"
                    >
                        {isEditing ? <SaveIcon className="w-5 h-5" /> : <EditIcon className="w-5 h-5" />}
                        <span className="hidden md:inline">{isEditing ? "LƯU THÔNG TIN" : "CHỈNH SỬA"}</span>
                    </button>
                )}

                {/* 3. Nội dung đè lên (Căn Avatar bên trái, Data bên phải) */}
                <div className="relative z-20 w-full h-full flex flex-col md:flex-row items-center md:items-end justify-start px-6 md:px-20 pb-10 md:pb-20 gap-6 md:gap-14">

                    {/* KHU VỰC AVATAR */}
                    <div className="relative mt-10 md:mt-0 shrink-0">
                        <img
                            src={avatarPreview}
                            alt="Org Avatar"
                            className="w-[250px] h-[250px] md:w-[440px] md:h-[440px] rounded-full object-cover border-4 border-white shadow-2xl"
                        />
                        {isEditing && (
                            <div
                                onClick={() => avatarRef.current.click()}
                                className="absolute bottom-6 right-6 md:bottom-10 md:right-10 bg-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-gray-200 border-2 border-gray-300"
                                title="Đổi ảnh đại diện"
                            >
                                <CameraIcon className="w-6 h-6 text-black" />
                            </div>
                        )}
                        {/* Thẻ input ẩn cho Avatar */}
                        <input type="file" accept="image/*" ref={avatarRef} onChange={(e) => handleImageChange(e, setAvatarPreview)} className="hidden" />
                    </div>

                    {/* KHU VỰC DATA */}
                    <div className="flex flex-col items-center md:items-start text-white text-center md:text-left mb-0 md:mb-10 w-full max-w-[700px]">

                        {/* TÊN TỔ CHỨC */}
                        {isEditing ? (
                            <input
                                type="text" name="name" value={editData.name} onChange={handleInputChange}
                                className="w-full text-[32px] md:text-[40px] font-bold uppercase leading-tight bg-black/40 border border-white/50 rounded-lg p-2 text-white outline-none focus:border-white focus:bg-black/60 transition-colors"
                            />
                        ) : (
                            <p className="text-[32px] md:text-[50px] text-white font-bold uppercase leading-tight drop-shadow-md">
                                {editData.name}
                            </p>
                        )}

                        {/* MÔ TẢ */}
                        {isEditing ? (
                            <textarea
                                name="description" value={editData.description} onChange={handleInputChange} rows={3}
                                className="w-full mt-4 text-[16px] md:text-[18px] leading-relaxed bg-black/40 border border-white/50 rounded-lg p-3 text-white outline-none focus:border-white focus:bg-black/60 resize-none transition-colors"
                            />
                        ) : (
                            <p className="mt-4 text-[16px] md:text-[20px] leading-relaxed opacity-90">
                                {editData.description}
                            </p>
                        )}

                        {/* TRƯỜNG & KHOA/CLB */}
                        <div className="mt-4 flex flex-col gap-2 text-[15px] md:text-[18px] font-medium w-full">
                            {isEditing ? (
                                <>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <span className="w-[100px] shrink-0 opacity-80">Trường:</span>
                                        <select
                                            name="university" value={editData.university} onChange={handleInputChange}
                                            className="bg-black/40 border border-white/50 rounded-lg p-2 text-white outline-none focus:border-white w-full max-w-[400px]"
                                        >
                                            {universitiesList.map((uni, idx) => (
                                                <option key={idx} value={uni} className="text-black bg-white">{uni}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <span className="w-[100px] shrink-0 opacity-80">Khoa/CLB:</span>
                                        <input
                                            type="text" name="faculty" value={editData.faculty} onChange={handleInputChange}
                                            placeholder="Tên Khoa/Đoàn/Hội (có thể để trống)"
                                            className="bg-black/40 border border-white/50 rounded-lg p-2 text-white outline-none focus:border-white w-full max-w-[400px]"
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="opacity-80 flex flex-col gap-1">
                                    <p>{editData.university}</p>
                                    {/* Nếu faculty rỗng thì không render dòng này ra UI */}
                                    {editData.faculty && <p>{editData.faculty}</p>}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            {/* Khung chứa các phần bên dưới, giới hạn width 1200px cho đẹp */}
            <div className="w-full max-w-[1200px] mx-auto px-6 mt-20">

                {/* ======= PHẦN 2: SỰ KIỆN ĐANG TỔ CHỨC (ZIG-ZAG) ======= */}
                <div className="mb-24">
                    <h2 className="text-[32px] md:text-[40px] font-bold text-black uppercase mb-10 text-center md:text-left border-b-4 border-[#006A24] inline-block pb-2">
                        SỰ KIỆN ĐANG DIỄN RA
                    </h2>

                    {currentEvents.length === 0 ? (
                        // TRẠNG THÁI RỖNG (EMPTY STATE)
                        <div className="w-full flex flex-col items-center justify-center p-16 bg-white border border-gray-200 rounded-2xl shadow-sm">
                            <SleepingIcon />
                            <p className="text-[20px] font-medium text-gray-500 text-center max-w-md">
                                Hiện tại tổ chức đang nghỉ ngơi dưỡng sức. Hãy quay lại sau để cập nhật những sự kiện mới nhất nhé!
                            </p>
                        </div>
                    ) : (
                        // CÓ SỰ KIỆN -> HIỂN THỊ ZIG-ZAG
                        <div className="flex flex-col gap-16 md:gap-20">
                            {currentEvents.map((event, index) => (
                                // Bí kíp lật ngược: Nếu index là số lẻ (1, 3) thì md:flex-row-reverse
                                <div key={event.id} className={`flex flex-col md:flex-row${index % 2 !== 0 ? '-reverse' : ''} gap-8 md:gap-14 items-center`}>

                                    {/* Cột Ảnh */}
                                    <Link to={`/events/${event.id}`} className="w-full md:w-1/2 overflow-hidden rounded-2xl shadow-lg group block">
                                        <div className="aspect-[4/3] w-full relative">
                                            <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                            {/* Lớp phủ mờ khi hover để chữ 'Xem Chi Tiết' hiện lên */}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <span className="text-white font-bold text-xl uppercase tracking-wider border-2 border-white px-6 py-2 rounded-full">Xem chi tiết</span>
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Cột Chữ */}
                                    <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left">
                                        <h3 className="text-[28px] md:text-[36px] font-bold text-black uppercase leading-tight mb-4 hover:text-[#006A24] transition-colors cursor-pointer">
                                            {event.title}
                                        </h3>
                                        <p className="text-[18px] text-gray-600 leading-relaxed">
                                            {event.desc}
                                        </p>
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ======= PHẦN 3: SỰ KIỆN ĐÃ TỔ CHỨC (BẤT ĐỐI XỨNG) ======= */}
                <div>
                    <h2 className="text-[32px] md:text-[40px] font-bold text-black uppercase mb-10 text-center md:text-left border-b-4 border-gray-800 inline-block pb-2">
                        HOẠT ĐỘNG ĐÃ QUA
                    </h2>

                    {/* Chia 2 cột: Trái (Ghim 1 ảnh to), Phải (2 ảnh nhỏ) */}
                    <div className="flex flex-col md:flex-row gap-8 items-stretch">

                        {/* BÊN TRÁI: GHIM SỰ KIỆN MỚI NHẤT */}
                        {pinnedPastEvent && (
                            <Link to={`/events/${pinnedPastEvent.id}`} className="w-full md:w-1/2 group block overflow-hidden rounded-2xl shadow-lg relative h-[400px] md:h-[600px]">
                                <img src={pinnedPastEvent.image} alt={pinnedPastEvent.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                {/* Gradient từ đen ở dưới bốc lên, để chữ trắng đọc rõ */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                                <div className="absolute bottom-6 left-6 right-6">
                                    <span className="bg-[#006A24] text-white text-xs font-bold px-3 py-1 rounded-full uppercase mb-3 inline-block">Sự kiện nổi bật</span>
                                    <h3 className="text-white text-[24px] md:text-[32px] font-bold uppercase leading-tight line-clamp-2">
                                        {pinnedPastEvent.title}
                                    </h3>
                                </div>
                            </Link>
                        )}

                        {/* BÊN PHẢI: DANH SÁCH CUỘN VÀ PHÂN TRANG */}
                        <div className="w-full md:w-1/2 flex flex-col justify-between gap-6">

                            <div className="flex flex-col gap-6">
                                {displayedPastEvents.map((event) => (
                                    <Link to={`/events/${event.id}`} key={event.id} className="group flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                        {/* Ảnh nhỏ */}
                                        <div className="w-full md:w-[200px] h-[200px] md:h-auto md:aspect-square overflow-hidden shrink-0">
                                            <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        </div>
                                        {/* Tên - Ép 1 dòng bằng line-clamp-1 */}
                                        <div className="p-5 flex items-center justify-start w-full">
                                            <h3 className="text-[20px] font-bold text-black uppercase line-clamp-1 group-hover:text-[#006A24] transition-colors">
                                                {event.title}
                                            </h3>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Nút phân trang (Chỉ điều khiển bên phải) */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-end gap-4 mt-4 bg-gray-50 p-4 rounded-xl">
                                    <button onClick={() => setPage(prev => prev - 1)} disabled={page === 1} className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg disabled:opacity-40 hover:bg-gray-100 transition-colors">
                                        &larr; Prev
                                    </button>
                                    <span className="text-[18px] font-bold text-gray-800">
                                        {page} / {totalPages}
                                    </span>
                                    <button onClick={() => setPage(prev => prev + 1)} disabled={page === totalPages} className="px-5 py-2.5 bg-black text-white font-bold rounded-lg disabled:opacity-40 hover:bg-gray-800 transition-colors">
                                        Next &rarr;
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default OrgProfilePage;
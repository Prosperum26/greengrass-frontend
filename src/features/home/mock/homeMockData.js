import img1 from '../../../assets/event_dummy1.png';
import img2 from '../../../assets/event_dummy2.png';
import img3 from '../../../assets/event_dummy3.png';

export const mockEvents = [
  { 
    id: 1,
    img: img1, 
    title: 'Hội Thảo Hành Động Xanh', 
    time: 'Thứ 7, 15/05/2026', 
    location: 'Hội trường A, ĐH Tôn Đức Thắng', 
    participants: 120 
  },
  { 
    id: 2,
    img: img2, 
    title: 'Quyên Góp Sách Đổi Cây', 
    time: 'Chủ Nhật, 16/05/2026', 
    location: 'Khu A Ký túc xá ĐHQG HCM', 
    participants: 350 
  },
  { 
    id: 3,
    img: img3, 
    title: 'Thu Gom Rác Hỗ Trợ Đảo Xa', 
    time: 'Thứ 5, 20/05/2026', 
    location: 'Khu vực bãi biển Cần Giờ', 
    participants: 45 
  }
];

export const mockLeaderboard = [
  { id: 1, name: 'Nguyễn Văn A', points: 1500, avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: 2, name: 'Trần Thị B', points: 1420, avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: 3, name: 'Lê Hoàng C', points: 1350, avatar: 'https://i.pravatar.cc/150?u=3' },
];

export const mockStats = {
  totalStudents: 1542,
  totalEvents: 34,
  totalGreenPoints: 45000,
  activeProjects: 12
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../../../components';
import { useEvents } from '../hooks/useEvents';

const CreateEventPage = () => {
  const navigate = useNavigate();
  const { createEvent, isLoading, error: apiError } = useEvents();

  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    latitude: '',
    longitude: '',
    startTime: '',
    endTime: '',
    points: 10,
    qrSecret: '',
  });

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setCoverImage(null);
      setCoverPreview(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('File quá lớn. Vui lòng chọn ảnh < 5MB', 'error');
      return;
    }
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Định dạng ảnh không hợp lệ.', 'error');
      return;
    }

    setCoverImage(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Tên sự kiện là bắt buộc';
    if (!formData.description) newErrors.description = 'Mô tả là bắt buộc';
    if (!formData.location) newErrors.location = 'Địa điểm là bắt buộc';
    
    if (formData.latitude === '' || formData.latitude < -90 || formData.latitude > 90) {
      newErrors.latitude = 'Vĩ độ phải từ -90 đến 90';
    }
    if (formData.longitude === '' || formData.longitude < -180 || formData.longitude > 180) {
      newErrors.longitude = 'Kinh độ phải từ -180 đến 180';
    }

    if (!formData.startTime) newErrors.startTime = 'Thời gian bắt đầu là bắt buộc';
    if (!formData.endTime) newErrors.endTime = 'Thời gian kết thúc là bắt buộc';
    
    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      if (end <= start) {
        newErrors.endTime = 'Thời gian kết thúc phải sau thời gian bắt đầu';
      }
    }

    if (formData.points === '' || formData.points <= 0) {
      newErrors.points = 'Điểm thưởng phải là số dương';
    }

    if (!formData.qrSecret) newErrors.qrSecret = 'Mã bí mật QR Check-in là bắt buộc';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      showToast('Trình duyệt của bạn không hỗ trợ Geolocation', 'error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        showToast('Lấy tọa độ thành công');
      },
      (error) => {
        showToast('Không thể lấy tọa độ: ' + error.message, 'error');
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('description', formData.description);
      payload.append('location', formData.location);
      payload.append('latitude', formData.latitude);
      payload.append('longitude', formData.longitude);
      payload.append('startTime', new Date(formData.startTime).toISOString());
      payload.append('endTime', new Date(formData.endTime).toISOString());
      payload.append('points', formData.points);
      payload.append('qrSecret', formData.qrSecret);
      
      if (coverImage) {
        payload.append('coverImage', coverImage);
      }

      const result = await createEvent(payload);
      showToast('Tạo sự kiện thành công!', 'success');
      
      // Navigate after success
      setTimeout(() => {
        if (result && result.id) {
          navigate(`/events/${result.id}`);
        } else {
          navigate('/organizer/profile');
        }
      }, 1500);
      
    } catch (err) {
      // Error is already handled/set in the hook, but we can show toast
      showToast(err.response?.data?.message || 'Có lỗi xảy ra khi tạo sự kiện', 'error');
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-6 relative">
      {/* Toast Notification */}
      {toast && (
        <div 
          className={`fixed top-20 right-6 z-50 px-6 py-3 rounded-xl shadow-lg transition-all duration-300 ${
            toast.type === 'success' ? 'bg-[#3A5E27] text-white' : 'bg-accent-hover text-white'
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="rounded-2xl bg-[#251E18] p-8 shadow-2xl text-white">
        <h1 className="mb-6 text-2xl font-bold text-[#E6F0E0]">Tạo Sự Kiện Mới</h1>
        
        {apiError && (
          <div className="mb-6 rounded-xl bg-accent-hover/20 p-4 text-accent-hover">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="w-full">
            <label className="block text-xs font-semibold tracking-wider text-white/70 mb-2 uppercase">Ảnh Bìa Sự Kiện (Tùy chọn)</label>
            <div className="relative rounded-2xl border-2 border-dashed border-[#3A5E27]/40 bg-[#3D362B]/50 hover:bg-[#3D362B] transition-colors p-4 flex flex-col items-center justify-center min-h-[200px] cursor-pointer" onClick={() => document.getElementById('cover-upload').click()}>
              <input 
                id="cover-upload" 
                type="file" 
                className="hidden" 
                accept="image/jpeg,image/png,image/webp" 
                onChange={handleImageSelect}
              />
              {coverPreview ? (
                <div className="w-full relative group">
                  <img src={coverPreview} alt="Cover Preview" className="w-full h-48 object-cover rounded-xl" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold">Thay đổi ảnh</span>
                  </div>
                </div>
              ) : (
                <div className="text-center text-white/60">
                  <span className="text-4xl mb-2 block">📸</span>
                  <p className="font-semibold">Nhấn để chọn ảnh</p>
                  <p className="text-xs mt-1">JPG, PNG, WEBP (Max 5MB)</p>
                </div>
              )}
            </div>
          </div>
          <Input
            label="Tên sự kiện *"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ví dụ: Ngày hội trồng cây 2025"
            error={errors.title}
          />

          <div className="w-full">
            <label className="block text-xs font-semibold tracking-wider text-white/70 mb-2 uppercase">
              Mô tả *
            </label>
            <div className={`rounded-xl bg-[#3D362B] px-4 py-3 transition focus-within:ring-2 focus-within:ring-[#3A5E27]/40 ${errors.description ? 'ring-2 ring-accent-hover/40' : ''}`}>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full bg-transparent text-white placeholder:text-white/40 outline-none resize-none"
                placeholder="Mô tả chi tiết về sự kiện..."
              />
              <div className={`mt-2 h-[2px] w-full rounded-full ${errors.description ? 'bg-accent-hover' : 'bg-[#3A5E27]/25'}`} />
            </div>
            {errors.description && <p className="mt-2 text-sm text-accent-hover">{errors.description}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <Input
                  label="Địa điểm *"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Công viên Lê Văn Tám, Quận 1"
                  error={errors.location}
                />
              </div>
              <Button type="button" variant="secondary" onClick={handleGetLocation} className="mb-2 whitespace-nowrap bg-[#3D362B] hover:bg-[#4D4539] text-white outline-none border-none">
                🔘 Lấy tọa độ
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Vĩ độ (Latitude) *"
              name="latitude"
              type="number"
              step="0.000001"
              value={formData.latitude}
              onChange={handleChange}
              error={errors.latitude}
            />
            <Input
              label="Kinh độ (Longitude) *"
              name="longitude"
              type="number"
              step="0.000001"
              value={formData.longitude}
              onChange={handleChange}
              error={errors.longitude}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Thời gian bắt đầu *"
              name="startTime"
              type="datetime-local"
              value={formData.startTime}
              onChange={handleChange}
              error={errors.startTime}
            />
            <Input
              label="Thời gian kết thúc *"
              name="endTime"
              type="datetime-local"
              value={formData.endTime}
              onChange={handleChange}
              error={errors.endTime}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Điểm thưởng tham gia *"
              name="points"
              type="number"
              min="0"
              value={formData.points}
              onChange={handleChange}
              error={errors.points}
            />
            <Input
              label="Mã bí mật QR Check-in *"
              name="qrSecret"
              value={formData.qrSecret}
              onChange={handleChange}
              placeholder="event-secret-code-123"
              error={errors.qrSecret}
            />
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/10">
            <Button type="button" variant="ghost" onClick={() => navigate(-1)} className="text-white hover:bg-white/10">
              ❌ Hủy
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-[#3A5E27] hover:bg-[#4E7F35] text-white">
              {isLoading ? 'Đang tạo...' : '✅ Tạo sự kiện'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventPage;

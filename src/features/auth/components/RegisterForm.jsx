// Register Form Component
import { useState } from 'react';
import { Button, Input } from '../../../components/ui';

export const RegisterForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    studentId: '',
    school: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Vui lòng nhập họ tên';
    if (!formData.email) newErrors.email = 'Vui lòng nhập email';
    if (!formData.studentId) newErrors.studentId = 'Vui lòng nhập MSSV';
    if (!formData.school) newErrors.school = 'Vui lòng chọn trường';
    if (!formData.password) newErrors.password = 'Vui lòng nhập mật khẩu';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    try {
      await onSubmit?.(formData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Họ và tên"
        placeholder="Nhập họ tên đầy đủ"
        value={formData.fullName}
        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        error={errors.fullName}
      />
      <Input
        type="email"
        label="Email"
        placeholder="email@student.hcmus.edu.vn"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        error={errors.email}
      />
      <Input
        label="Mã số sinh viên"
        placeholder="Nhập MSSV"
        value={formData.studentId}
        onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
        error={errors.studentId}
      />
      <Input
        label="Trường/Đơn vị"
        placeholder="Chọn trường"
        value={formData.school}
        onChange={(e) => setFormData({ ...formData, school: e.target.value })}
        error={errors.school}
      />
      <Input
        type="password"
        label="Mật khẩu"
        placeholder="Tối thiểu 8 ký tự"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        error={errors.password}
      />
      <Input
        type="password"
        label="Xác nhận mật khẩu"
        placeholder="Nhập lại mật khẩu"
        value={formData.confirmPassword}
        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        error={errors.confirmPassword}
      />
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
      </Button>
    </form>
  );
};

export default RegisterForm;

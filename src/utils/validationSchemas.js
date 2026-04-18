import { z } from 'zod';

// Reusable field schemas
export const emailSchema = z
  .string()
  .min(1, 'Email là bắt buộc')
  .email('Email không hợp lệ');

export const passwordSchema = z
  .string()
  .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
  .regex(/[A-Z]/, 'Mật khẩu phải chứa ít nhất một ký tự viết hoa')
  .regex(/[a-z]/, 'Mật khẩu phải chứa ít nhất một ký tự viết thường')
  .regex(/[0-9]/, 'Mật khẩu phải chứa ít nhất một chữ số');

export const fullNameSchema = z
  .string()
  .min(2, 'Tên phải có ít nhất 2 ký tự')
  .max(100, 'Tên không được vượt quá 100 ký tự');

// Login Form
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Mật khẩu là bắt buộc'),
});

// Register Form
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  passwordConfirm: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
  fullName: fullNameSchema,
  organizationName: z.string().optional(),
  description: z.string().optional(),
}).refine((data) => data.password === data.passwordConfirm, {
  message: 'Mật khẩu không khớp',
  path: ['passwordConfirm'],
});

// Forgot Password
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// Event Creation
export const eventCreateSchema = z.object({
  title: z.string().min(5, 'Tiêu đề phải có ít nhất 5 ký tự'),
  description: z.string().min(10, 'Mô tả phải có ít nhất 10 ký tự'),
  location: z.string().min(3, 'Địa điểm là bắt buộc'),
  startTime: z.string().min(1, 'Thời gian bắt đầu là bắt buộc'),
  endTime: z.string().min(1, 'Thời gian kết thúc là bắt buộc'),
  points: z.number().min(1, 'Điểm phải ít nhất là 1').max(1000, 'Điểm không được vượt quá 1000'),
  maxParticipants: z.number().optional(),
}).refine(
  (data) => new Date(data.endTime) > new Date(data.startTime),
  {
    message: 'Thời gian kết thúc phải sau thời gian bắt đầu',
    path: ['endTime'],
  }
);

// User Profile Update
export const profileUpdateSchema = z.object({
  fullName: fullNameSchema,
  bio: z.string().max(500, 'Tiểu sử không được vượt quá 500 ký tự').optional(),
  school: z.string().optional(),
});

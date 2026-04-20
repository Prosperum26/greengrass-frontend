import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { loginSchema } from '../../../utils/validationSchemas';

const LoginPage = () => {
    const { login, isLoading, error: apiError } = useAuthContext();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectUrl = searchParams.get('redirect');
    const [showPassword, setShowPassword] = useState(false);
    const fieldBaseClass = 'w-full rounded-xl border border-ink/10 bg-white/80 px-4 py-3 text-ink placeholder:text-ink/45 outline-none transition focus:ring-2';
    
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(loginSchema),
        mode: 'onBlur',
    });

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const onSubmit = async (data) => {
        try {
            await login(data);
            // Redirect to original page if redirect param exists, otherwise go home
            if (redirectUrl) {
                navigate(decodeURIComponent(redirectUrl));
            } else {
                navigate('/');
            }
        } catch (err) {
            console.log("Đã có lỗi xảy ra:", err);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-12">
            <div className="w-full max-w-[520px] rounded-2xl bg-surface-high p-8 shadow-[0_32px_80px_rgba(33,26,20,0.10)]">
            <h1 className="mb-8 text-center text-3xl font-semibold uppercase text-ink font-display tracking-tight">
                Đăng nhập
            </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1 items-start">
                        <label htmlFor="email" className="text-xs font-semibold tracking-widest text-ink/70 uppercase">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Nhập email của bạn"
                            {...register('email')}
                            className={`${fieldBaseClass} ${
                                errors.email ? 'ring-2 ring-accent' : 'focus:ring-primary/35'
                            }`}
                        />
                        {errors.email && (
                            <p className="text-sm text-accent-hover mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1 items-start">
                        <label htmlFor="password" className="text-xs font-semibold tracking-widest text-ink/70 uppercase">Mật khẩu</label>
                        <div className="relative w-full">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Nhập mật khẩu"
                                {...register('password')}
                                className={`${fieldBaseClass} pr-12 ${
                                    errors.password ? 'ring-2 ring-accent' : 'focus:ring-primary/35'
                                }`}
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-ink/5 transition-colors text-ink/50 hover:text-ink"
                                tabIndex={-1}
                            >
                                <span className="material-symbols-outlined text-xl">
                                    {showPassword ? 'visibility_off' : 'visibility'}
                                </span>
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-sm text-accent-hover mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    {apiError && (
                        <p className="text-left text-sm text-accent-hover font-medium">
                            {apiError}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || isSubmitting}
                        className={`mt-2 w-full rounded-xl py-3 text-sm font-medium text-white transition-colors ${isLoading || isSubmitting ? 'cursor-not-allowed bg-primary-light/60' : 'bg-primary hover:bg-primary-light'} shadow-[0_20px_50px_rgba(33,26,20,0.10)]`}
                    >
                        {isLoading || isSubmitting ? 'Đang xử lý...' : 'Sinh viên / Ban tổ chức Đăng nhập'}
                    </button>
                </form>

                <div className="mt-2 flex flex-col items-start gap-2">
                    <Link to="/forgot-password" className="text-sm text-ink/60 underline underline-offset-4 hover:text-ink">
                        Quên mật khẩu?
                    </Link>
                    <Link to="/register" className="text-sm text-ink/60 underline underline-offset-4 hover:text-ink">
                        Bạn chưa có tài khoản?
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
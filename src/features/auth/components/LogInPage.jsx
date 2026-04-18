import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { loginSchema } from '../../../utils/validationSchemas';

const LoginPage = () => {
    const { login, isLoading, error: apiError } = useAuthContext();
    const navigate = useNavigate();
    
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(loginSchema),
        mode: 'onBlur',
    });

    const onSubmit = async (data) => {
        try {
            await login(data);
            navigate('/');
        } catch (err) {
            console.log("Đã có lỗi xảy ra:", err);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-12">
            <div className="w-full max-w-[520px] rounded-2xl bg-surface-high p-8 shadow-[0_32px_80px_rgba(33,26,20,0.10)]">
            <h1 className="mb-8 text-center text-3xl font-semibold uppercase text-ink font-display tracking-tight">
                Log In
            </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1 items-start">
                        <label htmlFor="email" className="text-xs font-semibold tracking-widest text-ink/70 uppercase">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Nhập email của bạn"
                            {...register('email')}
                            className={`w-full rounded-xl bg-surface-highest px-4 py-3 text-ink outline-none focus:ring-2 ${
                                errors.email ? 'ring-2 ring-accent' : 'focus:ring-primary/35'
                            }`}
                        />
                        {errors.email && (
                            <p className="text-sm text-accent-hover mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1 items-start">
                        <label htmlFor="password" className="text-xs font-semibold tracking-widest text-ink/70 uppercase">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Nhập mật khẩu"
                            {...register('password')}
                            className={`w-full rounded-xl bg-surface-highest px-4 py-3 text-ink outline-none focus:ring-2 ${
                                errors.password ? 'ring-2 ring-accent' : 'focus:ring-primary/35'
                            }`}
                        />
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
                        {isLoading || isSubmitting ? 'Đang xử lý...' : 'Student / Organizer Sign In'}
                    </button>
                </form>

                <div className="mt-2 flex flex-col items-start gap-2">
                    <Link to="/forgot-password" className="text-sm text-ink/60 underline underline-offset-4 hover:text-ink">
                        Forgot password?
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
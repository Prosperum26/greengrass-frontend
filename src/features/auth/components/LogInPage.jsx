import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formError, setFormError] = useState('');

    const { login, isLoading, error: apiError } = useAuth();
    const navigate = useNavigate();

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!email || !password) {
            setFormError("Vui lòng nhập đầy đủ Email và Password");
            return;
        }
        try {
            await login({ email, password });
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

                <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1 items-start">
                        <label className="text-xs font-semibold tracking-widest text-ink/70 uppercase">Email</label>
                        <input
                            type="email"
                            placeholder="Nhập email của bạn"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-xl bg-surface-highest px-4 py-3 text-ink outline-none focus:ring-2 focus:ring-primary/35"
                        />
                    </div>

                    <div className="flex flex-col gap-1 items-start">
                        <label className="text-xs font-semibold tracking-widest text-ink/70 uppercase">Password</label>
                        <input
                            type="password"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-xl bg-surface-highest px-4 py-3 text-ink outline-none focus:ring-2 focus:ring-primary/35"
                        />
                    </div>

                    {(formError || apiError) && (
                        <p className="text-left text-sm text-accent-hover">
                            {formError || apiError}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`mt-2 w-full rounded-xl py-3 text-sm font-medium text-white transition-colors ${isLoading ? 'cursor-not-allowed bg-primary-light/60' : 'bg-primary hover:bg-primary-light'} shadow-[0_20px_50px_rgba(33,26,20,0.10)]`}
                    >
                        {isLoading ? 'Đang xử lý...' : 'Student / Organizer Sign In'}
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
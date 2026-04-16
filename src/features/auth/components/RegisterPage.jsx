import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RegisterPage = () => {
    const [accountType, setAccountType] = useState('STUDENT');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        organizationName: '',
        description: '',
    });

    const [formError, setFormError] = useState('');
    const { register, isLoading, error: apiError } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        const { email, password, fullName, organizationName } = formData;
        if (!email || !password || !fullName) {
            setFormError("Please fill required fields");
            return;
        }
        if (accountType === 'ORGANIZER' && !organizationName) {
            setFormError("Organization name is required");
            return;
        }
        try {
            await register({ ...formData, accountType });
            if (accountType === 'ORGANIZER') {
                alert('Organizer request submitted. Await approval.');
                navigate('/login');
            } else {
                navigate('/');
            }
        } catch (err) {
            console.log("Lỗi đăng ký:", err);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-12">
            <div className="w-full max-w-[720px] rounded-2xl bg-surface-high p-8 shadow-[0_32px_80px_rgba(33,26,20,0.10)]">
            <h1 className="mb-6 text-center text-3xl font-semibold text-ink font-display tracking-tight">Create account</h1>

            <div className="mb-6 flex items-center justify-center gap-3">
              <button type="button" onClick={() => setAccountType('STUDENT')} className={`rounded-xl px-4 py-2 text-sm font-medium ${accountType === 'STUDENT' ? 'bg-primary text-white' : 'bg-surface-highest text-ink/70'}`}>Register as User</button>
              <button type="button" onClick={() => setAccountType('ORGANIZER')} className={`rounded-xl px-4 py-2 text-sm font-medium ${accountType === 'ORGANIZER' ? 'bg-accent text-white' : 'bg-surface-highest text-ink/70'}`}>Are you an Organizer?</button>
            </div>

                <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1 items-start">
                        <label className="text-xs font-semibold tracking-widest text-ink/70 uppercase">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full rounded-xl bg-surface-highest px-4 py-3 text-ink outline-none focus:ring-2 focus:ring-primary/35"
                        />
                    </div>
                    <div className="flex flex-col gap-1 items-start">
                        <label className="text-xs font-semibold tracking-widest text-ink/70 uppercase">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full rounded-xl bg-surface-highest px-4 py-3 text-ink outline-none focus:ring-2 focus:ring-primary/35"
                        />
                    </div>
                    <div className="flex flex-col gap-1 items-start">
                        <label className="text-xs font-semibold tracking-widest text-ink/70 uppercase">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full rounded-xl bg-surface-highest px-4 py-3 text-ink outline-none focus:ring-2 focus:ring-primary/35"
                        />
                    </div>

                    {accountType === 'ORGANIZER' && (
                      <>
                        <div className="flex flex-col gap-1 items-start">
                          <label className="text-xs font-semibold tracking-widest text-ink/70 uppercase">Organization Name</label>
                          <input name="organizationName" value={formData.organizationName} onChange={handleChange} className="w-full rounded-xl bg-surface-highest px-4 py-3 text-ink outline-none focus:ring-2 focus:ring-primary/35" />
                        </div>
                        <div className="flex flex-col gap-1 items-start">
                          <label className="text-xs font-semibold tracking-widest text-ink/70 uppercase">Description</label>
                          <textarea name="description" value={formData.description} onChange={handleChange} className="w-full rounded-xl bg-surface-highest px-4 py-3 text-ink outline-none focus:ring-2 focus:ring-primary/35" />
                        </div>
                      </>
                    )}

                    {(formError || apiError) && (
                        <p className="text-left text-sm font-medium text-accent-hover">
                            {formError || apiError}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`mt-4 w-full rounded-xl py-3.5 text-sm font-medium text-white transition-colors ${isLoading ? 'cursor-not-allowed bg-primary-light/60' : 'bg-primary hover:bg-primary-light'} shadow-[0_20px_50px_rgba(33,26,20,0.10)]`}
                    >
                        {isLoading ? 'Đang xử lý...' : accountType === 'ORGANIZER' ? 'Submit organizer request' : 'Register'}
                    </button>
                </form>

                <div className="mt-6 flex flex-col items-start gap-2">
                    <Link to="/login" className="text-sm text-ink/60 underline underline-offset-4 hover:text-ink">
                        Already have an account?
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
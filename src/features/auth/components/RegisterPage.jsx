import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { registerSchema } from '../../../utils/validationSchemas';

const RegisterPage = () => {
    const [accountType, setAccountType] = useState('STUDENT');
    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(registerSchema),
        mode: 'onBlur',
    });
    const { register: registerUser, isLoading, error: apiError } = useAuthContext();
    const navigate = useNavigate();
    const fieldBaseClass = 'w-full rounded-xl border border-ink/10 bg-white/80 px-4 py-3 text-ink placeholder:text-ink/45 outline-none transition focus:ring-2';

    const onSubmit = async (data) => {
        if (accountType === 'ORGANIZER' && !data.organizationName) {
            alert('Organization name is required for organizers');
            return;
        }

        try {
            await registerUser({ ...data, accountType });
            if (accountType === 'ORGANIZER') {
                alert('Organizer request submitted. Awaiting admin approval.');
                navigate('/login');
            } else {
                navigate('/');
            }
        } catch (err) {
            console.log("Registration error:", err);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-12">
            <div className="w-full max-w-[720px] rounded-2xl bg-surface-high p-8 shadow-[0_32px_80px_rgba(33,26,20,0.10)]">
            <h1 className="mb-6 text-center text-3xl font-semibold text-ink font-display tracking-tight">Create account</h1>

            <div className="mb-6 flex items-center justify-center gap-3">
              <button 
                type="button" 
                onClick={() => setAccountType('STUDENT')} 
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${accountType === 'STUDENT' ? 'bg-primary text-white' : 'bg-surface-highest text-ink/70 hover:bg-surface-container-high'}`}
              >
                Register as User
              </button>
              <button 
                type="button" 
                onClick={() => setAccountType('ORGANIZER')} 
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${accountType === 'ORGANIZER' ? 'bg-accent text-white' : 'bg-surface-highest text-ink/70 hover:bg-surface-container-high'}`}
              >
                Are you an Organizer?
              </button>
            </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1 items-start">
                        <label htmlFor="email" className="text-xs font-semibold tracking-widest text-ink/70 uppercase">Email</label>
                        <input
                            id="email"
                            type="email"
                            {...register('email')}
                            className={`${fieldBaseClass} ${
                                errors.email ? 'ring-2 ring-accent' : 'focus:ring-primary/35'
                            }`}
                            placeholder="you@example.com"
                        />
                        {errors.email && <p className="text-sm text-accent-hover mt-1">{errors.email.message}</p>}
                    </div>

                    <div className="flex flex-col gap-1 items-start">
                        <label htmlFor="password" className="text-xs font-semibold tracking-widest text-ink/70 uppercase">Password</label>
                        <input
                            id="password"
                            type="password"
                            {...register('password')}
                            className={`${fieldBaseClass} ${
                                errors.password ? 'ring-2 ring-accent' : 'focus:ring-primary/35'
                            }`}
                            placeholder="Enter your password"
                        />
                        {errors.password && <p className="text-sm text-accent-hover mt-1">{errors.password.message}</p>}
                        {!errors.password && (
                          <p className="mt-1 text-xs text-ink/55">
                            At least 8 chars, gồm chữ hoa, chữ thường, số và ký tự đặc biệt (@$!%*?&).
                          </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1 items-start">
                        <label htmlFor="passwordConfirm" className="text-xs font-semibold tracking-widest text-ink/70 uppercase">Confirm Password</label>
                        <input
                            id="passwordConfirm"
                            type="password"
                            {...register('passwordConfirm')}
                            className={`${fieldBaseClass} ${
                                errors.passwordConfirm ? 'ring-2 ring-accent' : 'focus:ring-primary/35'
                            }`}
                            placeholder="Confirm your password"
                        />
                        {errors.passwordConfirm && <p className="text-sm text-accent-hover mt-1">{errors.passwordConfirm.message}</p>}
                    </div>

                    <div className="flex flex-col gap-1 items-start">
                        <label htmlFor="fullName" className="text-xs font-semibold tracking-widest text-ink/70 uppercase">Full Name</label>
                        <input
                            id="fullName"
                            type="text"
                            {...register('fullName')}
                            className={`${fieldBaseClass} ${
                                errors.fullName ? 'ring-2 ring-accent' : 'focus:ring-primary/35'
                            }`}
                            placeholder="Your full name"
                        />
                        {errors.fullName && <p className="text-sm text-accent-hover mt-1">{errors.fullName.message}</p>}
                    </div>

                    {accountType === 'ORGANIZER' && (
                      <>
                        <div className="flex flex-col gap-1 items-start">
                          <label htmlFor="organizationName" className="text-xs font-semibold tracking-widest text-ink/70 uppercase">Organization Name</label>
                          <input 
                            id="organizationName"
                            {...register('organizationName')} 
                            className={`${fieldBaseClass} ${
                                errors.organizationName ? 'ring-2 ring-accent' : 'focus:ring-primary/35'
                            }`}
                            placeholder="Organization name"
                          />
                          {errors.organizationName && <p className="text-sm text-accent-hover mt-1">{errors.organizationName.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1 items-start">
                          <label htmlFor="description" className="text-xs font-semibold tracking-widest text-ink/70 uppercase">Description</label>
                          <textarea 
                            id="description"
                            {...register('description')} 
                            className={`${fieldBaseClass} ${
                                errors.description ? 'ring-2 ring-accent' : 'focus:ring-primary/35'
                            }`}
                            rows="3"
                            placeholder="Tell us about your organization and activities"
                          />
                          {errors.description && <p className="text-sm text-accent-hover mt-1">{errors.description.message}</p>}
                        </div>
                      </>
                    )}

                    {apiError && (
                        <p className="text-left text-sm font-medium text-accent-hover">
                            {apiError}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || isSubmitting}
                        className={`mt-4 w-full rounded-xl py-3.5 text-sm font-medium text-white transition-colors ${isLoading || isSubmitting ? 'cursor-not-allowed bg-primary-light/60' : 'bg-primary hover:bg-primary-light'} shadow-[0_20px_50px_rgba(33,26,20,0.10)]`}
                    >
                        {isLoading || isSubmitting ? 'Đang xử lý...' : accountType === 'ORGANIZER' ? 'Submit organizer request' : 'Register'}
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
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import confetti from 'canvas-confetti';
import api from '../api/client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { registrationFormSchema, COURSE_EXAM_OPTIONS, ACADEMIC_YEAR_OPTIONS } from '../schemas/registrationSchema';
import {
  User,
  GraduationCap,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Award,
  AlertCircle,
  Loader2,
  Sparkles,
  RefreshCw,
  Calendar,
} from 'lucide-react';

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSettings() {
      try {
        setIsInitialLoading(true);
        const res = await api.get('/settings');
        if (res.data?.success) {
          setSettings(res.data.data);
        }
      } catch (err) {
        console.warn('Could not load dynamic settings, using fallback values.', err);
      } finally {
        setIsInitialLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    watch,
    formState: { errors, touchedFields },
  } = useForm({
    resolver: zodResolver(registrationFormSchema),
    mode: 'onTouched', // Instant inline validation without waiting for submission
    defaultValues: {
      studentName: '',
      parentName: '',
      mobileNumber: '',
      email: '',
      classCourse: '11th Entrance (Science / Commerce / Diploma)',
      academicYear: '2025-2026',
      exam: '11th Entrance (Science / Commerce / Diploma)',
      rank: '',
      schoolCollege: '',
      withParents: 'With Parents',
      numberOfGuests: 1,
      additionalInfo: '',
    },
  });

  const watchRank = watch('rank');
  const watchAcademicYear = watch('academicYear');
  const watchWithParents = watch('withParents');

  const steps = [
    { number: 1, title: 'Personal Details', shortTitle: 'Personal', icon: User },
    { number: 2, title: 'Academic Details', shortTitle: 'Academic', icon: GraduationCap },
    { number: 3, title: 'Parents Attendance', shortTitle: 'Parents', icon: Users },
    { number: 4, title: 'Confirmation', shortTitle: 'Confirm', icon: CheckCircle2 },
  ];

  const validateStep = async (step) => {
    setServerError('');
    if (step === 1) {
      return await trigger(['studentName', 'parentName', 'mobileNumber', 'email']);
    }
    if (step === 2) {
      return await trigger(['classCourse', 'academicYear', 'rank', 'schoolCollege']);
    }
    if (step === 3) {
      return await trigger(['withParents', 'additionalInfo']);
    }
    return true;
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const onSubmit = async (data) => {
    // Prevent double submission
    if (isSubmitting) return;

    if (settings && (settings.isRegistrationOpen === false || settings.registrationOpen === false)) {
      setServerError('Registrations for Rankers Meet 2026 are currently closed.');
      return;
    }

    setIsSubmitting(true);
    setServerError('');

    try {
      const isWithParents = data.withParents !== 'Without Parents';
      const submissionData = {
        ...data,
        exam: data.classCourse,
        withParents: isWithParents ? 'With Parents' : 'Without Parents',
        numberOfGuests: isWithParents ? 1 : 0,
        guestCount: isWithParents ? 1 : 0,
      };

      const res = await api.post('/registrations', submissionData);
      if (res.data?.success) {
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
          });
        } catch (e) {
          // ignore canvas-confetti failure if unsupported
        }

        const regId = res.data.registration?.registrationId;
        // Redirect to success page per PRD and docs/07-REGISTRATION-FRONTEND.md
        navigate(`/rankers-meet/success/${regId}`, {
          state: {
            isNewRegistration: true,
            registration: res.data.registration,
            qrCode: res.data.qrCode,
          },
        });
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'An error occurred while submitting your registration. Please verify your details.';
      setServerError(msg);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const values = getValues();

  // Initial Loading state
  if (isInitialLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-24 px-4">
          <div className="w-12 h-12 border-4 border-[#D91F2B] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-semibold text-slate-600">Preparing registration portal...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Registration Closed State
  if (settings && (settings.isRegistrationOpen === false || settings.registrationOpen === false)) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Navbar isRegistrationOpen={false} />
        <div className="flex-1 max-w-lg mx-auto px-4 py-24 text-center">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="font-heading font-black text-2xl text-slate-900 mb-3">
            Registrations Closed
          </h2>
          <p className="text-slate-600 text-sm mb-6">
            Online registrations for Rankers Meet 2026 are currently closed as maximum auditorium capacity has been reached. Please contact Yasir Ali Classes administrative desk for inquiries.
          </p>
          <Link
            to="/rankers-meet"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-[#D91F2B] hover:bg-[#B81724] text-white font-bold text-sm transition-colors"
          >
            Back to Event Details
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold px-3 py-1 rounded-full mb-3 shadow-xs">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            Rankers Meet 2026 &bull; Official Registration
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-4xl text-slate-900 tracking-tight">
            Reserve Your Digital Pass
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl mx-auto">
            Complete the form below to receive your personalized digital QR entrance ticket for Yasir Ali Classes Rankers Meet 2026.
          </p>
        </div>

        {/* Progress Indicator - Mobile-first responsive */}
        <div className="mb-6 sm:mb-8" aria-label="Registration Progress">
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {steps.map((step) => {
              const Icon = step.icon;
              const isPassed = currentStep > step.number;
              const isCurrent = currentStep === step.number;

              return (
                <div key={step.number} className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-200 ${
                      isPassed
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : isCurrent
                        ? 'bg-[#D91F2B] text-white ring-4 ring-[#F0D5D7] shadow-md scale-105'
                        : 'bg-white border border-slate-300 text-slate-400'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-4 h-4 sm:w-6 sm:h-6" /> : <Icon className="w-4 h-4 sm:w-6 sm:h-6" />}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-bold mt-1.5 sm:mt-2 text-center truncate w-full ${
                      isCurrent ? 'text-[#D91F2B]' : isPassed ? 'text-emerald-700' : 'text-slate-400'
                    }`}
                  >
                    <span className="hidden sm:inline">{step.title}</span>
                    <span className="sm:hidden">{step.shortTitle}</span>
                  </span>
                </div>
              );
            })}
          </div>

          {/* Accessible progress bar line */}
          <div
            className="w-full bg-slate-200 h-1.5 rounded-full mt-3 sm:mt-4 overflow-hidden"
            role="progressbar"
            aria-valuenow={currentStep}
            aria-valuemin={1}
            aria-valuemax={4}
          >
            <div
              className="bg-[#D91F2B] h-full transition-all duration-300 rounded-full"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1.5 font-medium sm:hidden">
            <span>Step {currentStep} of 4</span>
            <span className="font-bold text-[#D91F2B]">{steps[currentStep - 1].title}</span>
          </div>
        </div>

        {/* Friendly Server Error Alert with Retry */}
        {serverError && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm animate-in fade-in"
          >
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-rose-950">Registration Notice</p>
                <p className="text-xs sm:text-sm text-rose-800 mt-0.5">{serverError}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setServerError('');
                if (currentStep === 4) {
                  handleSubmit(onSubmit)();
                }
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 self-end sm:self-auto flex-shrink-0 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try Again
            </button>
          </div>
        )}

        {/* Multi-step Form Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-card p-5 sm:p-10">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* STEP 1: PERSONAL DETAILS */}
            {currentStep === 1 && (
              <div className="space-y-4 sm:space-y-5">
                <div className="border-b border-slate-100 pb-3 sm:pb-4 mb-4 sm:mb-6">
                  <h2 className="font-heading font-black text-lg sm:text-xl text-slate-900">
                    Step 1: Personal Details
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Provide the student and parent contact details for ticket dispatch and badge printing.
                  </p>
                </div>

                {/* Student Name */}
                <div>
                  <label htmlFor="studentName" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Student Full Name <span className="text-rose-500" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="studentName"
                    type="text"
                    {...register('studentName')}
                    placeholder="e.g. Ahmed Khan"
                    aria-invalid={errors.studentName ? 'true' : 'false'}
                    className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm transition-colors focus:outline-none focus:ring-2 ${
                      errors.studentName
                        ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/20'
                        : 'border-slate-300 focus:ring-blue-600'
                    }`}
                  />
                  {errors.studentName && (
                    <p className="text-xs text-rose-600 mt-1.5 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      {errors.studentName.message}
                    </p>
                  )}
                </div>

                {/* Parent Name */}
                <div>
                  <label htmlFor="parentName" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Parent / Guardian Name <span className="text-rose-500" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="parentName"
                    type="text"
                    {...register('parentName')}
                    placeholder="e.g. Tariq Khan"
                    aria-invalid={errors.parentName ? 'true' : 'false'}
                    className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm transition-colors focus:outline-none focus:ring-2 ${
                      errors.parentName
                        ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/20'
                        : 'border-slate-300 focus:ring-blue-600'
                    }`}
                  />
                  {errors.parentName && (
                    <p className="text-xs text-rose-600 mt-1.5 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      {errors.parentName.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Mobile Number */}
                  <div>
                    <label htmlFor="mobileNumber" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Mobile Number (WhatsApp) <span className="text-rose-500" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="mobileNumber"
                      type="tel"
                      {...register('mobileNumber')}
                      placeholder="e.g. 9876543210"
                      aria-invalid={errors.mobileNumber ? 'true' : 'false'}
                      className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm transition-colors focus:outline-none focus:ring-2 ${
                        errors.mobileNumber
                          ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/20'
                          : 'border-slate-300 focus:ring-blue-600'
                      }`}
                    />
                    {errors.mobileNumber && (
                      <p className="text-xs text-rose-600 mt-1.5 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        {errors.mobileNumber.message}
                      </p>
                    )}
                  </div>

                  {/* Email Address */}
                  <div>
                    <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address <span className="text-rose-500" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="e.g. ahmed@gmail.com"
                      aria-invalid={errors.email ? 'true' : 'false'}
                      className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm transition-colors focus:outline-none focus:ring-2 ${
                        errors.email
                          ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/20'
                          : 'border-slate-300 focus:ring-blue-600'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-xs text-rose-600 mt-1.5 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: ACADEMIC DETAILS */}
            {currentStep === 2 && (
              <div className="space-y-4 sm:space-y-5">
                <div className="border-b border-slate-100 pb-3 sm:pb-4 mb-4 sm:mb-6">
                  <h2 className="font-heading font-black text-lg sm:text-xl text-slate-900">
                    Step 2: Academic Details
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Details of your qualifying examination and rank for your felicitation trophy.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Merged Course & Entrance Exam */}
                  <div>
                    <label htmlFor="classCourse" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Course / Entrance Exam <span className="text-rose-500" aria-hidden="true">*</span>
                    </label>
                    <select
                      id="classCourse"
                      {...register('classCourse')}
                      className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm bg-white transition-colors focus:outline-none focus:ring-2 ${
                        errors.classCourse
                          ? 'border-rose-300 focus:ring-rose-500'
                          : 'border-slate-300 focus:ring-[#D91F2B]'
                      }`}
                    >
                      {COURSE_EXAM_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    {errors.classCourse && (
                      <p className="text-xs text-rose-600 mt-1.5 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        {errors.classCourse.message}
                      </p>
                    )}
                  </div>

                  {/* Academic / Batch Year Selection */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Academic / Batch Year <span className="text-rose-500" aria-hidden="true">*</span>
                      </label>
                      <span className="text-[11px] text-slate-400 font-medium">Rankers session batch</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {ACADEMIC_YEAR_OPTIONS.map((yr) => {
                        const isSelected = watchAcademicYear === yr;
                        return (
                          <button
                            key={yr}
                            type="button"
                            onClick={() => setValue('academicYear', yr, { shouldValidate: true, shouldDirty: true })}
                            className={`flex items-center justify-between p-3.5 rounded-xl border text-sm font-bold transition-all ${
                              isSelected
                                ? 'border-[#D91F2B] bg-[#FFF7F7] text-[#D91F2B] shadow-sm ring-2 ring-[#D91F2B]/20'
                                : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span
                                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                                  isSelected
                                    ? 'border-[#D91F2B] bg-[#D91F2B]'
                                    : 'border-slate-400 bg-white'
                                }`}
                              >
                                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </span>
                              <span>Session {yr}</span>
                            </div>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-[#D91F2B]" />}
                          </button>
                        );
                      })}
                    </div>
                    <input type="hidden" {...register('academicYear')} />
                    {errors.academicYear && (
                      <p className="text-xs text-rose-600 mt-1.5 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        {errors.academicYear.message}
                      </p>
                    )}
                  </div>

                  {/* Rank / Result Status with Quick Options */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="rank" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Rank / Result Status <span className="text-rose-500" aria-hidden="true">*</span>
                      </label>
                      <span className="text-[11px] text-slate-400 font-medium">Write rank or choose option</span>
                    </div>
                    <input
                      id="rank"
                      type="text"
                      {...register('rank')}
                      placeholder="e.g. Rank 1, General 15, Selected, or Guest"
                      aria-invalid={errors.rank ? 'true' : 'false'}
                      className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm transition-colors focus:outline-none focus:ring-2 ${
                        errors.rank
                          ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/20'
                          : 'border-slate-300 focus:ring-[#D91F2B]'
                      }`}
                    />

                    {/* Quick Selection Pills */}
                    <div className="flex flex-wrap items-center gap-2 mt-2.5">
                      <span className="text-[11px] font-semibold text-slate-500">Quick selection:</span>
                      <button
                        type="button"
                        onClick={() => setValue('rank', 'Selected', { shouldValidate: true, shouldDirty: true })}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                          watchRank === 'Selected'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        ✓ Selected / Qualified
                      </button>
                      <button
                        type="button"
                        onClick={() => setValue('rank', 'Waiting List Cleared', { shouldValidate: true, shouldDirty: true })}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                          watchRank === 'Waiting List Cleared'
                            ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                            : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        Waiting List Cleared
                      </button>
                      <button
                        type="button"
                        onClick={() => setValue('rank', 'Top 10 Ranker', { shouldValidate: true, shouldDirty: true })}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                          watchRank === 'Top 10 Ranker'
                            ? 'bg-[#D91F2B] text-white border-[#D91F2B]'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Top 10 Ranker
                      </button>
                      <button
                        type="button"
                        onClick={() => setValue('rank', 'Guest', { shouldValidate: true, shouldDirty: true })}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                          watchRank === 'Guest'
                            ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                            : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                        }`}
                      >
                        Guest
                      </button>
                    </div>

                    {errors.rank && (
                      <p className="text-xs text-rose-600 mt-1.5 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        {errors.rank.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* School / College */}
                <div>
                  <label htmlFor="schoolCollege" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    School / College Name <span className="text-rose-500" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="schoolCollege"
                    type="text"
                    {...register('schoolCollege')}
                    placeholder="e.g. Delhi Public School, Aligarh"
                    aria-invalid={errors.schoolCollege ? 'true' : 'false'}
                    className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm transition-colors focus:outline-none focus:ring-2 ${
                      errors.schoolCollege
                        ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/20'
                        : 'border-slate-300 focus:ring-blue-600'
                    }`}
                  />
                  {errors.schoolCollege && (
                    <p className="text-xs text-rose-600 mt-1.5 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      {errors.schoolCollege.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: GUEST DETAILS */}
            {currentStep === 3 && (
              <div className="space-y-4 sm:space-y-5">
                <div className="border-b border-slate-100 pb-3 sm:pb-4 mb-4 sm:mb-6">
                  <h2 className="font-heading font-black text-lg sm:text-xl text-slate-900">
                    Step 3: Parents Attendance
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Please indicate whether you will be attending with parents or alone.
                  </p>
                </div>

                {/* Parents Attendance Options */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Parents Attendance <span className="text-rose-500" aria-hidden="true">*</span>
                    </label>
                    <span className="text-[11px] text-slate-400 font-medium">Select attendance option</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setValue('withParents', 'With Parents', { shouldValidate: true, shouldDirty: true });
                        setValue('numberOfGuests', 1);
                      }}
                      className={`flex items-center justify-between p-4 rounded-xl border text-sm font-bold transition-all text-left ${
                        watchWithParents !== 'Without Parents'
                          ? 'border-[#D91F2B] bg-[#FFF7F7] text-[#D91F2B] shadow-sm ring-2 ring-[#D91F2B]/20'
                          : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                            watchWithParents !== 'Without Parents'
                              ? 'border-[#D91F2B] bg-[#D91F2B]'
                              : 'border-slate-400 bg-white'
                          }`}
                        >
                          {watchWithParents !== 'Without Parents' && <span className="w-2 h-2 rounded-full bg-white" />}
                        </span>
                        <div>
                          <p className="text-sm font-bold">With Parents</p>
                          <p className="text-xs font-normal text-slate-500 mt-0.5">Accompanying with parents</p>
                        </div>
                      </div>
                      {watchWithParents !== 'Without Parents' && <CheckCircle2 className="w-5 h-5 text-[#D91F2B] flex-shrink-0" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setValue('withParents', 'Without Parents', { shouldValidate: true, shouldDirty: true });
                        setValue('numberOfGuests', 0);
                      }}
                      className={`flex items-center justify-between p-4 rounded-xl border text-sm font-bold transition-all text-left ${
                        watchWithParents === 'Without Parents'
                          ? 'border-[#D91F2B] bg-[#FFF7F7] text-[#D91F2B] shadow-sm ring-2 ring-[#D91F2B]/20'
                          : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                            watchWithParents === 'Without Parents'
                              ? 'border-[#D91F2B] bg-[#D91F2B]'
                              : 'border-slate-400 bg-white'
                          }`}
                        >
                          {watchWithParents === 'Without Parents' && <span className="w-2 h-2 rounded-full bg-white" />}
                        </span>
                        <div>
                          <p className="text-sm font-bold">Without Parents</p>
                          <p className="text-xs font-normal text-slate-500 mt-0.5">Attending alone (Student only)</p>
                        </div>
                      </div>
                      {watchWithParents === 'Without Parents' && <CheckCircle2 className="w-5 h-5 text-[#D91F2B] flex-shrink-0" />}
                    </button>
                  </div>
                  <input type="hidden" {...register('withParents')} />
                  <input type="hidden" {...register('numberOfGuests')} />
                </div>

                {/* Additional Information */}
                <div>
                  <label htmlFor="additionalInfo" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Additional Information / Seating Requests (Optional)
                  </label>
                  <textarea
                    id="additionalInfo"
                    rows={3}
                    {...register('additionalInfo')}
                    placeholder="e.g. Elderly grandparent attending, wheelchair accessibility required"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-base sm:text-sm"
                  />
                </div>
              </div>
            )}

            {/* STEP 4: CONFIRMATION & REVIEW */}
            {currentStep === 4 && (
              <div className="space-y-4 sm:space-y-5">
                <div className="border-b border-slate-100 pb-3 sm:pb-4 mb-4 sm:mb-6">
                  <h2 className="font-heading font-black text-lg sm:text-xl text-slate-900">
                    Step 4: Review & Confirm
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Please verify your details before final submission to generate your official pass.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-2.5 text-xs sm:text-sm">
                  <div className="flex justify-between py-1 border-b border-slate-200/80">
                    <span className="text-slate-500 font-medium">Student Name</span>
                    <span className="font-bold text-slate-900 text-right">{values.studentName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/80">
                    <span className="text-slate-500 font-medium">Parent Name</span>
                    <span className="font-bold text-slate-900 text-right">{values.parentName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/80">
                    <span className="text-slate-500 font-medium">Mobile Number</span>
                    <span className="font-bold text-slate-900 text-right">{values.mobileNumber}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/80">
                    <span className="text-slate-500 font-medium">Email Address</span>
                    <span className="font-bold text-slate-900 text-right break-all">{values.email}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/80">
                    <span className="text-slate-500 font-medium">Course / Entrance Exam</span>
                    <span className="font-bold text-slate-900 text-right">{values.classCourse}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/80">
                    <span className="text-slate-500 font-medium">Academic / Batch Year</span>
                    <span className="font-bold text-[#D91F2B] text-right">{values.academicYear || '2025-2026'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/80">
                    <span className="text-slate-500 font-medium">Rank / Status</span>
                    <span className="font-bold text-[#D91F2B] text-right">{values.rank}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/80">
                    <span className="text-slate-500 font-medium">School / College</span>
                    <span className="font-bold text-slate-900 text-right">{values.schoolCollege}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500 font-medium">Parents Attendance</span>
                    <span className="font-bold text-slate-900 text-right">
                      {values.withParents === 'Without Parents' ? 'Without Parents (Student Only)' : 'With Parents'}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 bg-[#FFF7F7] border border-[#F0D5D7] rounded-xl flex items-start space-x-3 text-xs text-[#101522]">
                  <Sparkles className="w-5 h-5 text-[#D91F2B] flex-shrink-0 mt-0.5" />
                  <p>
                    By clicking <strong>Complete Registration</strong>, your official digital QR pass and Registration ID will be generated immediately on screen and dispatched to your email address.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-slate-100 flex items-center justify-between gap-3">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="inline-flex items-center px-4 sm:px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-50 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <ArrowLeft className="w-4 h-4 mr-1.5" />
                  Previous
                </button>
              ) : (
                <Link
                  to="/rankers-meet"
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </Link>
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center px-5 sm:px-7 py-3 rounded-xl bg-[#D91F2B] hover:bg-[#B81724] active:bg-[#8F1019] text-white font-black text-xs sm:text-sm shadow-md active:scale-95 transition-all"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md transition-all disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing Registration...
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4 mr-2 text-amber-300" />
                      Complete Registration
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

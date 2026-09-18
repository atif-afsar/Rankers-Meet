import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import confetti from 'canvas-confetti';
import api from '../api/client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { registrationFormSchema } from '../schemas/registrationSchema';
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
    formState: { errors, touchedFields },
  } = useForm({
    resolver: zodResolver(registrationFormSchema),
    mode: 'onTouched', // Instant inline validation without waiting for submission
    defaultValues: {
      studentName: '',
      parentName: '',
      mobileNumber: '',
      email: '',
      classCourse: 'Class 12th Commerce',
      exam: 'CA Foundation (ICAI)',
      rank: '',
      schoolCollege: '',
      numberOfGuests: 1,
      additionalInfo: '',
    },
  });

  const steps = [
    { number: 1, title: 'Personal Details', shortTitle: 'Personal', icon: User },
    { number: 2, title: 'Academic Details', shortTitle: 'Academic', icon: GraduationCap },
    { number: 3, title: 'Parent Attendance', shortTitle: 'Parent', icon: Users },
    { number: 4, title: 'Confirmation', shortTitle: 'Confirm', icon: CheckCircle2 },
  ];

  const validateStep = async (step) => {
    setServerError('');
    if (step === 1) {
      return await trigger(['studentName', 'parentName', 'mobileNumber', 'email']);
    }
    if (step === 2) {
      return await trigger(['classCourse', 'exam', 'rank', 'schoolCollege']);
    }
    if (step === 3) {
      return await trigger(['numberOfGuests', 'additionalInfo']);
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
      const res = await api.post('/registrations', data);
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Class / Course */}
                  <div>
                    <label htmlFor="classCourse" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Class / Course <span className="text-rose-500" aria-hidden="true">*</span>
                    </label>
                    <select
                      id="classCourse"
                      {...register('classCourse')}
                      className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm bg-white transition-colors focus:outline-none focus:ring-2 ${
                        errors.classCourse
                          ? 'border-rose-300 focus:ring-rose-500'
                          : 'border-slate-300 focus:ring-blue-600'
                      }`}
                    >
                      <option value="Class 12th Commerce">Class 12th Commerce</option>
                      <option value="Class 11th Commerce">Class 11th Commerce</option>
                      <option value="CA Foundation">CA Foundation</option>
                      <option value="CMA Foundation / CSEET">CMA Foundation / CSEET</option>
                      <option value="B.Com (Hons / General)">B.Com (Hons / General)</option>
                      <option value="CUET UG (Commerce)">CUET UG (Commerce)</option>
                      <option value="CUET PG / MBA / M.Com">CUET PG / MBA / M.Com</option>
                      <option value="Junior Wing (Class 9-10 Commerce Foundation)">Junior Wing (Class 9-10 Commerce Foundation)</option>
                      <option value="Other Commerce Course">Other Commerce Course</option>
                    </select>
                    {errors.classCourse && (
                      <p className="text-xs text-rose-600 mt-1.5 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        {errors.classCourse.message}
                      </p>
                    )}
                  </div>

                  {/* Exam Category */}
                  <div>
                    <label htmlFor="exam" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Exam Category <span className="text-rose-500" aria-hidden="true">*</span>
                    </label>
                    <select
                      id="exam"
                      {...register('exam')}
                      className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm bg-white transition-colors focus:outline-none focus:ring-2 ${
                        errors.exam
                          ? 'border-rose-300 focus:ring-rose-500'
                          : 'border-slate-300 focus:ring-blue-600'
                      }`}
                    >
                      <option value="CA Foundation (ICAI)">CA Foundation (ICAI)</option>
                      <option value="Class 12th Board (CBSE / ISC / State)">Class 12th Board (CBSE / ISC / State)</option>
                      <option value="Class 11th Board / Entrance">Class 11th Board / Entrance</option>
                      <option value="AMU Entrance (B.Com / BBA / MBA / 11th Commerce)">AMU Entrance (B.Com / BBA / MBA / 11th Commerce)</option>
                      <option value="CUET UG (Commerce / Accounts / Economics)">CUET UG (Commerce / Accounts / Economics)</option>
                      <option value="CUET PG / MBA Entrance">CUET PG / MBA Entrance</option>
                      <option value="CMA / CS Foundation">CMA / CS Foundation</option>
                      <option value="JMI Entrance (Commerce / Management)">JMI Entrance (Commerce / Management)</option>
                      <option value="Other Commerce Exam">Other Commerce Exam</option>
                    </select>
                    {errors.exam && (
                      <p className="text-xs text-rose-600 mt-1.5 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        {errors.exam.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Rank */}
                <div>
                  <label htmlFor="rank" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Rank / Percentile / Score <span className="text-rose-500" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="rank"
                    type="text"
                    {...register('rank')}
                    placeholder="e.g. AIR 142, or 99.4%ile, or 96.8% in CBSE"
                    aria-invalid={errors.rank ? 'true' : 'false'}
                    className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm transition-colors focus:outline-none focus:ring-2 ${
                      errors.rank
                        ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/20'
                        : 'border-slate-300 focus:ring-blue-600'
                    }`}
                  />
                  {errors.rank && (
                    <p className="text-xs text-rose-600 mt-1.5 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      {errors.rank.message}
                    </p>
                  )}
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
                    Step 3: Accompanying Parent
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Please indicate whether you will be attending alone or accompanied by 1 parent (mother or father).
                  </p>
                </div>

                {/* Accompanying Parent */}
                <div>
                  <label htmlFor="numberOfGuests" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Will you be accompanied by a parent? <span className="text-rose-500" aria-hidden="true">*</span>
                  </label>
                  <select
                    id="numberOfGuests"
                    {...register('numberOfGuests')}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-base sm:text-sm bg-white"
                  >
                    <option value={1}>Yes, with 1 Parent (Mother or Father)</option>
                    <option value={0}>No, Attending Alone (Student Only)</option>
                  </select>
                  <p className="text-xs text-slate-500 mt-1.5">
                    Note: To ensure seating capacity for all rankers, each student is permitted to bring a maximum of 1 parent (either mother or father).
                  </p>
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
                    <span className="text-slate-500 font-medium">Class / Course</span>
                    <span className="font-bold text-slate-900 text-right">{values.classCourse}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/80">
                    <span className="text-slate-500 font-medium">Exam & Rank</span>
                    <span className="font-bold text-[#D91F2B] text-right">{values.exam} &bull; {values.rank}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/80">
                    <span className="text-slate-500 font-medium">School / College</span>
                    <span className="font-bold text-slate-900 text-right">{values.schoolCollege}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500 font-medium">Accompanying Parent</span>
                    <span className="font-bold text-slate-900 text-right">
                      {Number(values.numberOfGuests) === 1 ? '1 Parent (Mother or Father)' : 'Attending Alone (Student Only)'}
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

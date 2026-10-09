import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { updateUserProfile } from '../services/userService';
import { 
  Bot, MapPin, IndianRupee, Briefcase, GraduationCap, ArrowRight, 
  Sparkles, ChevronLeft, Check, Sprout, Hammer, Building, Home, 
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export function Onboarding() {
  const { user, isOnboarded } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [simpleMode, setSimpleMode] = useState(false);
  const [simpleStep, setSimpleStep] = useState(0);

  const [formData, setFormData] = useState({
    displayName: '',
    state: '',
    district: '',
    ruralUrban: 'Rural',
    annualIncome: '',
    educationLevel: '',
    employmentStatus: '',
    landHoldingAcres: '',
    rationCardType: '',
    isWidowOrSenior: false,
    isPregnantOrLactating: false,
    numberOfChildren: '',
  });

  const [showRuralFields, setShowRuralFields] = useState(false);

  useEffect(() => {
    if (isOnboarded) {
      navigate('/dashboard');
    }
  }, [isOnboarded, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveProfile = async (dataToSave = formData) => {
    if (!user) return;
    setLoading(true);
    try {
      await updateUserProfile(user.uid, {
        displayName: dataToSave.displayName || user.displayName || 'Beneficiary',
        state: dataToSave.state,
        district: dataToSave.district || undefined,
        ruralUrban: dataToSave.ruralUrban || undefined,
        annualIncome: dataToSave.annualIncome,
        educationLevel: dataToSave.educationLevel,
        employmentStatus: dataToSave.employmentStatus,
        simpleMode,
        landHoldingAcres: dataToSave.landHoldingAcres ? parseFloat(dataToSave.landHoldingAcres) : undefined,
        rationCardType: dataToSave.rationCardType || undefined,
        isWidowOrSenior: dataToSave.isWidowOrSenior || undefined,
        isPregnantOrLactating: dataToSave.isPregnantOrLactating || undefined,
        numberOfChildren: dataToSave.numberOfChildren ? parseInt(dataToSave.numberOfChildren) : undefined,
      });
      window.location.href = '/dashboard';
    } catch {
      setError(t('onboarding.saveFailed', { defaultValue: 'Failed to save profile. Please try again.' }));
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSaveProfile();
  };

  // Simple mode choices
  const simpleWorkOptions = [
    { value: 'Farmer', label: 'Farmer / రైతు / किसान', icon: Sprout },
    { value: 'Daily Wage Worker', label: 'Daily Wage / కూలీ / मजदूर', icon: Hammer },
    { value: 'Student', label: 'Student / విద్యార్థి / छात्र', icon: GraduationCap },
    { value: 'Self-Employed', label: 'Small Business / వ్యాపారం / छोटा काम', icon: Building },
    { value: 'Homemaker', label: 'Homemaker / గృహిణి / गृहिणी', icon: Home },
    { value: 'Employed', label: 'Job / ఉద్యోగం / नौकरी', icon: Briefcase },
  ];

  const simpleStateOptions = [
    'Telangana',
    'Andhra Pradesh',
    'Maharashtra',
    'Uttar Pradesh',
    'Bihar',
    'Karnataka',
    'Tamil Nadu',
    'Madhya Pradesh',
    'Rajasthan',
    'West Bengal',
  ];

  const simpleEducationOptions = [
    { value: 'Illiterate', label: 'Not Studied / చదువుకోలేదు / अनपढ़' },
    { value: 'Primary', label: 'Primary (1st - 5th) / ప్రాథమిక' },
    { value: 'Middle', label: 'Middle (6th - 8th) / మిడిల్' },
    { value: '10th', label: '10th Pass / 10వ తరగతి / 10वीं पास' },
    { value: '12th', label: '12th Pass / ఇంటర్ / 12वीं' },
    { value: 'Graduate', label: 'College / డిగ్రీ / कॉलेज' },
  ];

  const simpleIncomeOptions = [
    { value: '0-250000', label: 'Under ₹2.5 Lakh / ₹2.5 లక్షల లోపు / 2.5 लाख से कम' },
    { value: '250001-500000', label: '₹2.5 - 5 Lakh / ₹2.5 - 5 లక్షలు / 2.5 - 5 लाख' },
    { value: '500001-800000', label: '₹5 - 8 Lakh / ₹5 - 8 లక్షలు / 5 - 8 लाख' },
    { value: '800001+', label: 'Above ₹8 Lakh / ₹8 లక్షల పైన / 8 लाख से ऊपर' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-mesh opacity-30" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-xl relative z-10"
      >
        <div className="bg-white dark:bg-slate-900 py-10 px-6 shadow-xl rounded-3xl border border-slate-200 dark:border-slate-800 sm:px-12">
          
          {/* Top Controls: Language + Simple Mode Switch */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => { setSimpleMode(!simpleMode); setSimpleStep(0); }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                simpleMode
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-500'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{simpleMode ? 'Simple Mode: ON' : 'Simple Mode'}</span>
            </button>
            <LanguageSwitcher variant="compact" />
          </div>

          <div className="flex flex-col items-center mb-6">
            <div className="bg-emerald-600 p-3 rounded-2xl shadow-lg dark:shadow-none shadow-emerald-500/20 mb-3">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white text-center tracking-tight">
              {t('onboarding.title', { defaultValue: 'Complete your profile' })}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 text-center max-w-sm">
              {simpleMode
                ? 'Answer simple questions to find government schemes you qualify for.'
                : t('onboarding.subtitle', { defaultValue: 'Your agent uses this data to calculate your eligibility for government schemes.' })}
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl text-center mb-4">
              {error}
            </div>
          )}

          {/* ── SIMPLE MODE FLOW (One question per screen, big touch cards) ── */}
          {simpleMode ? (
            <div className="space-y-6">
              {/* Step indicator */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>Question {simpleStep + 1} of 5</span>
                {simpleStep > 0 && (
                  <button
                    type="button"
                    onClick={() => setSimpleStep(simpleStep - 1)}
                    className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-500"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Back
                  </button>
                )}
              </div>

              {/* Question 1: What work do you do? */}
              {simpleStep === 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    What work do you do? / మీ పని ఏమిటి?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {simpleWorkOptions.map(opt => {
                      const Icon = opt.icon;
                      const isSelected = formData.employmentStatus === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, employmentStatus: opt.value }));
                            setSimpleStep(1);
                          }}
                          className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                            isSelected
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-emerald-400'
                          }`}
                        >
                          <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-sm font-semibold">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Question 2: Which state do you live in? */}
              {simpleStep === 1 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Which state do you live in? / మీ రాష్ట్రం ఏది?
                  </h3>
                  <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto p-1">
                    {simpleStateOptions.map(st => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, state: st }));
                          setSimpleStep(2);
                        }}
                        className={`p-3.5 rounded-xl border text-center text-sm font-semibold transition-all ${
                          formData.state === st
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-emerald-400'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Question 3: What is your education? */}
              {simpleStep === 2 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    What is your education? / చదువు ఎంతవరకు?
                  </h3>
                  <div className="space-y-2">
                    {simpleEducationOptions.map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, educationLevel: opt.value }));
                          setSimpleStep(3);
                        }}
                        className={`w-full p-3.5 rounded-xl border text-left text-sm font-semibold transition-all flex items-center justify-between ${
                          formData.educationLevel === opt.value
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-emerald-400'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {formData.educationLevel === opt.value && <Check className="w-4 h-4 text-emerald-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Question 4: Annual Family Income */}
              {simpleStep === 3 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Annual family income? / కుటుంబ వార్షిక ఆదాయం ఎంత?
                  </h3>
                  <div className="space-y-2.5">
                    {simpleIncomeOptions.map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, annualIncome: opt.value }));
                          setSimpleStep(4);
                        }}
                        className={`w-full p-4 rounded-2xl border text-left text-sm font-semibold transition-all flex items-center justify-between ${
                          formData.annualIncome === opt.value
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-emerald-400'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {formData.annualIncome === opt.value && <Check className="w-4 h-4 text-emerald-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Question 5: Name and Finish */}
              {simpleStep === 4 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Almost done! What is your name?
                  </h3>
                  <Input
                    label="Full Name / పూర్తి పేరు / पूरा नाम"
                    name="displayName"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.displayName}
                    onChange={handleChange}
                  />

                  {/* Optional Ration Card Type */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Ration Card Type (Optional) / రేషన్ కార్డ్
                    </label>
                    <select
                      name="rationCardType"
                      value={formData.rationCardType}
                      onChange={handleChange}
                      className="block w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 dark:text-white text-sm"
                    >
                      <option value="">Select if you have one</option>
                      <option value="BPL">White Card / BPL (Below Poverty Line)</option>
                      <option value="AAY">Antyodaya (AAY)</option>
                      <option value="General">Pink Card / General</option>
                    </select>
                  </div>

                  <Button
                    type="button"
                    onClick={() => handleSaveProfile()}
                    className="w-full py-6 text-base rounded-xl shadow-lg shadow-emerald-500/20 group"
                    isLoading={loading}
                  >
                    Finish & View Schemes <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            /* ── STANDARD FORM (Keeps original styling exactly as before) ── */
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input 
                label="Full Name" 
                name="displayName" 
                required 
                placeholder="e.g. Ramesh Kumar"
                value={formData.displayName} 
                onChange={handleChange}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">State / UT</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-4 w-4 text-slate-400" />
                    </div>
                    <select 
                      name="state" 
                      required 
                      value={formData.state} 
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 rounded-xl hover:border-emerald-400 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white dark:bg-slate-900 dark:text-white shadow-sm dark:shadow-none appearance-none transition-colors"
                    >
                      <option value="">Select State / UT</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                      <option value="Assam">Assam</option>
                      <option value="Bihar">Bihar</option>
                      <option value="Chhattisgarh">Chhattisgarh</option>
                      <option value="Goa">Goa</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Himachal Pradesh">Himachal Pradesh</option>
                      <option value="Jharkhand">Jharkhand</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Manipur">Manipur</option>
                      <option value="Meghalaya">Meghalaya</option>
                      <option value="Mizoram">Mizoram</option>
                      <option value="Nagaland">Nagaland</option>
                      <option value="Odisha">Odisha</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Sikkim">Sikkim</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Tripura">Tripura</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Uttarakhand">Uttarakhand</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Delhi">Delhi</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Annual Family Income</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IndianRupee className="h-4 w-4 text-slate-400" />
                    </div>
                    <select 
                      name="annualIncome" 
                      required 
                      value={formData.annualIncome} 
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 rounded-xl hover:border-emerald-400 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white dark:bg-slate-900 dark:text-white shadow-sm dark:shadow-none appearance-none transition-colors"
                    >
                      <option value="">Select Income Bracket</option>
                      <option value="0-250000">₹0 - ₹2,50,000</option>
                      <option value="250001-500000">₹2,50,001 - ₹5,00,000</option>
                      <option value="500001-800000">₹5,00,001 - ₹8,00,000</option>
                      <option value="800001+">Above ₹8,00,000</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Education Level</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <GraduationCap className="h-4 w-4 text-slate-400" />
                    </div>
                    <select 
                      name="educationLevel" 
                      required 
                      value={formData.educationLevel} 
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 rounded-xl hover:border-emerald-400 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white dark:bg-slate-900 dark:text-white shadow-sm dark:shadow-none appearance-none transition-colors"
                    >
                      <option value="">Select Education</option>
                      <option value="Illiterate">Illiterate (Not Studied)</option>
                      <option value="Primary">Primary Education (1st - 5th)</option>
                      <option value="Middle">Middle School (6th - 8th)</option>
                      <option value="9th">9th Pass</option>
                      <option value="10th">10th Pass (High School)</option>
                      <option value="11th">11th Pass</option>
                      <option value="12th">12th Pass (Intermediate)</option>
                      <option value="Undergraduate">Undergraduate Student</option>
                      <option value="Graduate">Graduate</option>
                      <option value="Postgraduate">Postgraduate / Above</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Employment Status</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase className="h-4 w-4 text-slate-400" />
                    </div>
                    <select 
                      name="employmentStatus" 
                      required 
                      value={formData.employmentStatus} 
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 rounded-xl hover:border-emerald-400 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white dark:bg-slate-900 dark:text-white shadow-sm dark:shadow-none appearance-none transition-colors"
                    >
                      <option value="">Select Status</option>
                      <option value="Student">Student</option>
                      <option value="Unemployed">Unemployed</option>
                      <option value="Employed">Employed</option>
                      <option value="Self-Employed">Self-Employed</option>
                      <option value="Farmer">Farmer</option>
                      <option value="Daily Wage Worker">Daily Wage Worker</option>
                      <option value="Homemaker">Homemaker</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Optional Rural Reality Accordion */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowRuralFields(!showRuralFields)}
                  className="w-full p-4 text-left flex items-center justify-between bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-600" />
                    Additional Household & Land Details (Optional)
                  </span>
                  <span className="text-emerald-600 text-xs">{showRuralFields ? 'Hide' : '+ Add'}</span>
                </button>
                <AnimatePresence>
                  {showRuralFields && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="p-4 space-y-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                            Area Type
                          </label>
                          <select
                            name="ruralUrban"
                            value={formData.ruralUrban}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-900 dark:text-white"
                          >
                            <option value="Rural">Rural (Village / గిరిజన / గ్రామీణ)</option>
                            <option value="Urban">Urban (Town / City)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                            Land Holding (Acres)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            name="landHoldingAcres"
                            placeholder="e.g. 2.5"
                            value={formData.landHoldingAcres}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                            Ration Card Type
                          </label>
                          <select
                            name="rationCardType"
                            value={formData.rationCardType}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-900 dark:text-white"
                          >
                            <option value="">None</option>
                            <option value="BPL">BPL / White Card</option>
                            <option value="AAY">Antyodaya Anna Yojana (AAY)</option>
                            <option value="General">General / Pink Card</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                            Number of Children
                          </label>
                          <input
                            type="number"
                            name="numberOfChildren"
                            placeholder="e.g. 2"
                            value={formData.numberOfChildren}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full py-6 text-base rounded-xl shadow-lg dark:shadow-none shadow-emerald-500/20 group" isLoading={loading}>
                  Complete Setup<ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <p className="text-xs text-center text-slate-400 mt-4">
                  You can change these details later or use Magic Autofill with your documents.</p>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

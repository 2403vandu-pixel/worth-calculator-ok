"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Github, FileText, History, Eye, Star, Wallet, Info } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from './LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { countryNames } from './LanguageContext';

const pppFactors: Record<string, number> = {
  'AF': 18.71,'AO': 167.66,'AL': 41.01,'AR': 28.67,'AM': 157.09,'AG': 2.06,'AU': 1.47,'AT': 0.76,'AZ': 0.50,'BI': 680.41,'BE': 0.75,'BJ': 211.97,'BF': 209.84,'BD': 32.81,'BG': 0.70,'BH': 0.18,'BS': 0.88,'BA': 0.66,'BY': 0.77,'BZ': 1.37,'BO': 2.60,'BR': 2.36,'BB': 2.24,'BN': 0.58,'BT': 20.11,'BW': 4.54,'CF': 280.19,'CA': 1.21,'CH': 1.14,'CL': 418.43,'CN': 4.19,'CI': 245.25,'CM': 228.75,'CD': 911.27,'CG': 312.04,'CO': 1352.79,'KM': 182.34,'CV': 46.51,'CR': 335.86,'CY': 0.61,'CZ': 12.66,'DE': 0.75,'DJ': 105.29,'DM': 1.69,'DK': 6.60,'DO': 22.90,'DZ': 37.24,'EC': 0.51,'EG': 4.51,'ES': 0.62,'EE': 0.53,'ET': 12.11,'FI': 0.84,'FJ': 0.91,'FR': 0.73,'GA': 265.46,'GB': 0.70,'GE': 0.90,'GH': 2.33,'GN': 4053.64,'GM': 17.79,'GW': 214.86,'GQ': 229.16,'GR': 0.54,'GD': 1.64,'GT': 4.01,'GY': 73.60,'HK': 6.07,'HN': 10.91,'HR': 3.21,'HT': 40.20,'HU': 148.01,'ID': 4673.65,'IN': 21.99,'IE': 0.78,'IR': 30007.63,'IQ': 507.58,'IS': 145.34,'IL': 3.59,'IT': 0.66,'JM': 72.03,'JO': 0.29,'JP': 102.84,'KZ': 139.91,'KE': 43.95,'KG': 18.28,'KH': 1400.09,'KI': 1.00,'KN': 1.92,'KR': 861.82,'LA': 2889.36,'LB': 1414.91,'LR': 0.41,'LY': 0.48,'LC': 1.93,'LK': 51.65,'LS': 5.90,'LT': 0.45,'LU': 0.86,'LV': 0.48,'MO': 5.18,'MA': 3.92,'MD': 6.06,'MG': 1178.10,'MV': 8.35,'MX': 9.52,'MK': 18.83,'ML': 211.41,'MT': 0.57,'MM': 417.35,'ME': 0.33,'MN': 931.67,'MZ': 24.05,'MR': 12.01,'MU': 16.52,'MW': 298.82,'MY': 1.57,'NA': 7.40,'NE': 257.60,'NG': 144.27,'NI': 11.75,'NL': 0.77,'NO': 10.03,'NP': 33.52,'NZ': 1.45,'PK': 38.74,'PA': 0.46,'PE': 1.80,'PH': 19.51,'PG': 2.11,'PL': 1.78,'PR': 0.92,'PT': 0.57,'PY': 2575.54,'PS': 0.57,'QA': 2.06,'RO': 1.71,'RU': 25.88,'RW': 339.88,'SA': 1.61,'SD': 21.85,'SN': 245.98,'SG': 0.84,'SB': 7.08,'SL': 2739.26,'SV': 0.45,'SO': 9107.78,'RS': 41.13,'ST': 10.94,'SR': 3.55,'SK': 0.53,'SI': 0.56,'SE': 8.77,'SZ': 6.36,'SC': 7.82,'TC': 1.07,'TD': 220.58,'TG': 236.83,'TH': 12.34,'TJ': 2.30,'TL': 0.41,'TT': 4.15,'TN': 0.91,'TR': 2.13,'TV': 1.29,'TW': 13.85,'TZ': 888.32,'UG': 1321.35,'UA': 7.69,'UY': 28.45,'US': 1.00,'UZ': 2297.17,'VC': 1.54,'VN': 7473.67,'VU': 110.17,'XK': 0.33,'ZA': 6.93,'ZM': 5.59,'ZW': 24.98
};

const currencySymbols: Record<string, string> = {
  'AU':'A$','AT':'€','BE':'€','BR':'R$','CA':'C$','CH':'CHF','CN':'¥','CZ':'Kč','DE':'€','DK':'kr','EG':'E£','ES':'€','FI':'€','FR':'€','GB':'£','GH':'₵','GR':'€','HK':'HK$','HU':'Ft','ID':'Rp','IN':'₹','IE':'€','IL':'₪','IT':'€','JP':'¥','KR':'₩','MX':'Mex$','MY':'RM','NL':'€','NO':'kr','NZ':'NZ$','PL':'zł','PT':'€','RU':'₽','SA':'ر.س','SE':'kr','SG':'S$','TH':'฿','TR':'₺','TW':'NT$','UA':'₴','US':'$','ZA':'R',
};

interface HistoryItem {
  id: string; timestamp: number; value: string; assessment: string; assessmentColor: string;
  salary: string; countryCode: string; countryName: string; cityFactor: string; workHours: string;
  commuteHours: string; restTime: string; dailySalary: string; workDaysPerYear: string;
  workDaysPerWeek: string; wfhDaysPerWeek: string; annualLeave: string; paidSickLeave: string;
  publicHolidays: string; workEnvironment: string; leadership: string; teamwork: string;
  degreeType: string; schoolType: string; education: string; homeTown: string; shuttle: string;
  canteen: string; workYears: string; jobStability: string; bachelorType: string;
  hasShuttle: boolean; hasCanteen: boolean;
}

interface FormData {
  salary: string; nonChinaSalary: boolean; workDaysPerWeek: string; wfhDaysPerWeek: string;
  annualLeave: string; paidSickLeave: string; publicHolidays: string; workHours: string;
  commuteHours: string; restTime: string; cityFactor: string; workEnvironment: string;
  leadership: string; teamwork: string; homeTown: string; degreeType: string; schoolType: string;
  bachelorType: string; workYears: string; shuttle: string; canteen: string; jobStability: string;
  education: string; hasShuttle: boolean; hasCanteen: boolean;
}

interface Result {
  value: number; workDaysPerYear: number; dailySalary: number; assessment: string; assessmentColor: string;
}

// ─── Tooltip component ───────────────────────────────────────────────────────
const Tooltip = ({ text }: { text: string }) => (
  <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 16, borderRadius: '50%', background: 'var(--surface-2)', border: '1px solid var(--border)', fontSize: 10, color: 'var(--text-tertiary)', cursor: 'default', marginLeft: 5, verticalAlign: 'middle' }}
    className="tooltip-trigger group">
    <Info size={9} />
    <span style={{ visibility: 'hidden', opacity: 0, position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)', background: 'var(--text-primary)', color: 'var(--surface)', fontSize: 11, lineHeight: 1.5, padding: '6px 10px', borderRadius: 6, width: 200, textAlign: 'center', pointerEvents: 'none', zIndex: 50, whiteSpace: 'normal', fontFamily: 'DM Sans, sans-serif', transition: 'opacity 0.15s' }}
      className="group-hover:!visible group-hover:!opacity-100 tooltip-text">
      {text}
    </span>
  </span>
);

// ─── Section header ───────────────────────────────────────────────────────────
const SectionTitle = ({ children, step }: { children: React.ReactNode; step?: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
    {step && (
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 26, borderRadius: '50%', background: 'var(--accent)', color: 'white', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
        {step}
      </span>
    )}
    <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{children}</span>
  </div>
);

// ─── Radio Group ──────────────────────────────────────────────────────────────
const ChipGroup = ({ label, name, value, onChange, options, tooltip }: {
  label: string; name: string; value: string;
  onChange: (name: string, value: string | boolean) => void;
  options: Array<{ label: string; value: string }>;
  tooltip?: string;
}) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8, display: 'flex', alignItems: 'center' }}>
      {label}
      {tooltip && <Tooltip text={tooltip} />}
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {options.map((opt) => (
        <button key={opt.value} type="button"
          onClick={() => onChange(name, opt.value)}
          style={{
            padding: '6px 13px', borderRadius: 8, fontSize: 13, fontWeight: value === opt.value ? 600 : 400,
            border: `1.5px solid ${value === opt.value ? 'var(--accent)' : 'var(--border)'}`,
            background: value === opt.value ? 'var(--accent-light)' : 'var(--surface)',
            color: value === opt.value ? 'var(--accent)' : 'var(--text-secondary)',
            cursor: 'pointer', transition: 'all 0.12s', userSelect: 'none',
          }}>
          {opt.label}
        </button>
      ))}
    </div>
  </div>
);

// ─── Field Input ──────────────────────────────────────────────────────────────
const FieldInput = ({ label, tooltip, children }: { label: string; tooltip?: string; children: React.ReactNode }) => (
  <div>
    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'flex', alignItems: 'center' }}>
      {label}
      {tooltip && <Tooltip text={tooltip} />}
    </label>
    {children}
  </div>
);

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'var(--surface)', border: '1.5px solid var(--border)',
  borderRadius: 8, padding: '9px 13px', fontFamily: "'DM Mono', monospace", fontSize: 14,
  color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.15s',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'none' as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239e9890' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: 36,
  cursor: 'pointer',
};

// ─── Score display ────────────────────────────────────────────────────────────
const getRatingInfo = (value: number, hasSalary: boolean, t: (k: string) => string) => {
  if (!hasSalary) return { text: t('rating_enter_salary'), color: '#9e9890', bg: 'var(--surface-2)', barColor: '#9e9890', pct: 0 };
  if (value < 0.6) return { text: t('rating_terrible'), color: '#be185d', bg: '#fdf2f8', barColor: '#ec4899', pct: Math.min(value / 5 * 100, 100) };
  if (value < 1.0) return { text: t('rating_poor'), color: '#dc2626', bg: '#fef2f2', barColor: '#ef4444', pct: Math.min(value / 5 * 100, 100) };
  if (value <= 1.8) return { text: t('rating_average'), color: '#d97706', bg: '#fffbeb', barColor: '#f59e0b', pct: Math.min(value / 5 * 100, 100) };
  if (value <= 2.5) return { text: t('rating_good'), color: '#2563eb', bg: '#eff6ff', barColor: '#3b82f6', pct: Math.min(value / 5 * 100, 100) };
  if (value <= 3.2) return { text: t('rating_great'), color: '#16a34a', bg: '#f0fdf4', barColor: '#22c55e', pct: Math.min(value / 5 * 100, 100) };
  if (value <= 4.0) return { text: t('rating_excellent'), color: '#7c3aed', bg: '#f5f3ff', barColor: '#8b5cf6', pct: Math.min(value / 5 * 100, 100) };
  return { text: t('rating_perfect'), color: '#b45309', bg: '#fffbeb', barColor: '#f59e0b', pct: 100 };
};

const getValueAssessmentKey = (value: number, hasSalary: boolean) => {
  if (!hasSalary) return 'rating_enter_salary';
  if (value < 0.6) return 'rating_terrible';
  if (value < 1.0) return 'rating_poor';
  if (value <= 1.8) return 'rating_average';
  if (value <= 2.5) return 'rating_good';
  if (value <= 3.2) return 'rating_great';
  if (value <= 4.0) return 'rating_excellent';
  return 'rating_perfect';
};

// ─── Main Component ───────────────────────────────────────────────────────────
const SalaryCalculator = () => {
  const { t, language } = useLanguage();
  const [isBrowser, setIsBrowser] = useState(false);
  const scrollPositionRef = useRef(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
  
    }
  }, []);

  const shareResultsRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<FormData>({
    salary: '', nonChinaSalary: false, workDaysPerWeek: '5', wfhDaysPerWeek: '0',
    annualLeave: '5', paidSickLeave: '3', publicHolidays: '13', workHours: '10',
    commuteHours: '2', restTime: '2', cityFactor: '1.0', workEnvironment: '1.0',
    leadership: '1.0', teamwork: '1.0', homeTown: 'no', degreeType: 'bachelor',
    schoolType: 'firstTier', bachelorType: 'firstTier', workYears: '0', shuttle: '1.0',
    canteen: '1.0', jobStability: 'private', education: '1.0', hasShuttle: false, hasCanteen: false,
  });

  const [selectedCountry, setSelectedCountry] = useState<string>('CN');
  const [visitorVisible, setVisitorVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selectedCountry');
      if (saved) setSelectedCountry(saved);
    }
  }, []);

  const handleCountryChange = (code: string) => {
    setSelectedCountry(code);
    if (typeof window !== 'undefined') localStorage.setItem('selectedCountry', code);
  };

  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('jobValueHistory');
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Partial<HistoryItem>[];
          const normalized: HistoryItem[] = parsed.map((item) => ({
            id: item.id || Date.now().toString(), timestamp: item.timestamp || Date.now(),
            value: item.value || '0', assessment: item.assessment || 'rating_enter_salary',
            assessmentColor: item.assessmentColor || 'text-gray-500', salary: item.salary || '',
            countryCode: item.countryCode || 'CN', countryName: item.countryName || '中国',
            cityFactor: item.cityFactor || formData.cityFactor, workHours: item.workHours || formData.workHours,
            commuteHours: item.commuteHours || formData.commuteHours, restTime: item.restTime || formData.restTime,
            dailySalary: item.dailySalary || '0', workDaysPerYear: item.workDaysPerYear || '250',
            workDaysPerWeek: item.workDaysPerWeek || formData.workDaysPerWeek, wfhDaysPerWeek: item.wfhDaysPerWeek || formData.wfhDaysPerWeek,
            annualLeave: item.annualLeave || formData.annualLeave, paidSickLeave: item.paidSickLeave || formData.paidSickLeave,
            publicHolidays: item.publicHolidays || formData.publicHolidays, workEnvironment: item.workEnvironment || formData.workEnvironment,
            leadership: item.leadership || formData.leadership, teamwork: item.teamwork || formData.teamwork,
            degreeType: item.degreeType || formData.degreeType, schoolType: item.schoolType || formData.schoolType,
            education: item.education || formData.education, homeTown: item.homeTown || formData.homeTown,
            shuttle: item.shuttle || formData.shuttle, canteen: item.canteen || formData.canteen,
            workYears: item.workYears || formData.workYears, jobStability: item.jobStability || formData.jobStability,
            bachelorType: item.bachelorType || formData.bachelorType,
            hasShuttle: typeof item.hasShuttle === 'boolean' ? item.hasShuttle : false,
            hasCanteen: typeof item.hasCanteen === 'boolean' ? item.hasCanteen : false,
          }));
          setHistory(normalized);
        } catch (e) { console.error(e); }
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const pv = document.getElementById('busuanzi_value_site_pv');
      const uv = document.getElementById('busuanzi_value_site_uv');
      if (pv && pv.innerText !== '') {
        pv.innerText = ((parseInt(pv.innerText, 10) || 0) + 1700000).toString();
        if (uv && uv.innerText !== '') uv.innerText = ((parseInt(uv.innerText, 10) || 0) + 250000).toString();
        setVisitorVisible(true);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const calculateWorkingDays = useCallback(() => {
    const weeksPerYear = 52;
    const totalWorkDays = weeksPerYear * Number(formData.workDaysPerWeek);
    const totalLeaves = Number(formData.annualLeave) + Number(formData.publicHolidays) + Number(formData.paidSickLeave) * 0.6;
    return Math.max(totalWorkDays - totalLeaves, 0);
  }, [formData.workDaysPerWeek, formData.annualLeave, formData.publicHolidays, formData.paidSickLeave]);

  const calculateDailySalary = useCallback(() => {
    if (!formData.salary) return 0;
    const workingDays = calculateWorkingDays();
    const pppFactor = selectedCountry !== 'CN' ? (pppFactors[selectedCountry] || 4.19) : 4.19;
    const standardizedSalary = Number(formData.salary) * (4.19 / pppFactor);
    return standardizedSalary / workingDays;
  }, [formData.salary, selectedCountry, calculateWorkingDays]);

  const getDisplaySalary = useCallback(() => {
    const daily = calculateDailySalary();
    if (selectedCountry !== 'CN') {
      const pppFactor = pppFactors[selectedCountry] || 4.19;
      return (daily * pppFactor / 4.19).toFixed(2);
    }
    return daily.toFixed(2);
  }, [calculateDailySalary, selectedCountry]);

  const handleInputChange = useCallback((name: string, value: string | boolean) => {
    if (typeof window !== 'undefined') scrollPositionRef.current = window.scrollY;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTimeout(() => {
      if (typeof window !== 'undefined') window.scrollTo(0, scrollPositionRef.current);
    }, 0);
  }, []);

  const calculateValue = () => {
    if (!formData.salary) return 0;
    const dailySalary = calculateDailySalary();
    const workHours = Number(formData.workHours);
    const commuteHours = Number(formData.commuteHours);
    const restTime = Number(formData.restTime);
    const workDaysPerWeek = parseFloat(formData.workDaysPerWeek) || 5;
    const wfhInput = formData.wfhDaysPerWeek.trim();
    const wfhDaysPerWeek = wfhInput === '' ? 0 : Math.min(parseFloat(wfhInput) || 0, workDaysPerWeek);
    const officeDaysRatio = workDaysPerWeek > 0 ? (workDaysPerWeek - wfhDaysPerWeek) / workDaysPerWeek : 0;
    const shuttleFactor = formData.hasShuttle ? Number(formData.shuttle) : 1.0;
    const effectiveCommuteHours = commuteHours * officeDaysRatio * shuttleFactor;
    const canteenFactor = formData.hasCanteen ? Number(formData.canteen) : 1.0;
    const environmentFactor = Number(formData.workEnvironment) * Number(formData.leadership) * Number(formData.teamwork) * Number(formData.cityFactor) * canteenFactor;
    const workYears = Number(formData.workYears);
    let experienceSalaryMultiplier = 1.0;
    if (workYears === 0) {
      const m: Record<string, number> = { government: 0.8, state: 0.9, foreign: 0.95, private: 1.0, dispatch: 1.1, freelance: 1.1 };
      experienceSalaryMultiplier = m[formData.jobStability] || 1.0;
    } else {
      let baseSalaryMultiplier = 1.0;
      if (workYears === 1) baseSalaryMultiplier = 1.5;
      else if (workYears <= 3) baseSalaryMultiplier = 2.2;
      else if (workYears <= 5) baseSalaryMultiplier = 2.7;
      else if (workYears <= 8) baseSalaryMultiplier = 3.2;
      else if (workYears <= 10) baseSalaryMultiplier = 3.6;
      else baseSalaryMultiplier = 3.9;
      const gf: Record<string, number> = { foreign: 0.8, state: 0.4, government: 0.2, dispatch: 1.2, freelance: 1.2, private: 1.0 };
      const salaryGrowthFactor = gf[formData.jobStability] || 1.0;
      experienceSalaryMultiplier = 1 + (baseSalaryMultiplier - 1) * salaryGrowthFactor;
    }
    return (dailySalary * environmentFactor) / (35 * (workHours + effectiveCommuteHours - 0.5 * restTime) * Number(formData.education) * experienceSalaryMultiplier);
  };

  const value = calculateValue();

  const calculateEducationFactor = useCallback(() => {
    const { degreeType, schoolType, bachelorType } = formData;
    let factor = 1.0;
    if (degreeType === 'belowBachelor') factor = 0.8;
    else if (degreeType === 'bachelor') {
      if (schoolType === 'secondTier') factor = 0.9;
      else if (schoolType === 'firstTier') factor = 1.0;
      else if (schoolType === 'elite') factor = 1.2;
    } else if (degreeType === 'masters') {
      let base = 0;
      if (bachelorType === 'secondTier') base = 0.9;
      else if (bachelorType === 'firstTier') base = 1.0;
      else if (bachelorType === 'elite') base = 1.2;
      let bonus = 0;
      if (schoolType === 'secondTier') bonus = 0.4;
      else if (schoolType === 'firstTier') bonus = 0.5;
      else if (schoolType === 'elite') bonus = 0.6;
      factor = base + bonus;
    } else if (degreeType === 'phd') {
      if (schoolType === 'secondTier') factor = 1.6;
      else if (schoolType === 'firstTier') factor = 1.8;
      else if (schoolType === 'elite') factor = 2.0;
    }
    if (formData.education !== String(factor)) setFormData(prev => ({ ...prev, education: String(factor) }));
    return factor;
  }, [formData.degreeType, formData.schoolType, formData.bachelorType, formData.education]);

  useEffect(() => { calculateEducationFactor(); }, [formData.degreeType, formData.schoolType, calculateEducationFactor]);

  const getCountryName = useCallback((code: string) => {
    if (language === 'en') return countryNames.en[code] || code;
    if (language === 'ja') return countryNames.ja[code] || code;
    return countryNames.zh[code] || code;
  }, [language]);

  const getCurrencySymbol = useCallback((code: string) => currencySymbols[code] || '$', []);

  const getValueAssessment = useCallback(() => getRatingInfo(value, !!formData.salary, t), [formData.salary, value, t]);

  const saveToHistory = useCallback(() => {
    if (!formData.salary || typeof window === 'undefined') return;
    const item: HistoryItem = {
      id: Date.now().toString(), timestamp: Date.now(), value: value.toFixed(2),
      assessment: getValueAssessmentKey(value, !!formData.salary),
      assessmentColor: getValueAssessment().color, salary: formData.salary,
      countryCode: selectedCountry, countryName: getCountryName(selectedCountry),
      cityFactor: formData.cityFactor, workHours: formData.workHours, commuteHours: formData.commuteHours,
      restTime: formData.restTime, dailySalary: getDisplaySalary(), workDaysPerYear: calculateWorkingDays().toString(),
      workDaysPerWeek: formData.workDaysPerWeek, wfhDaysPerWeek: formData.wfhDaysPerWeek,
      annualLeave: formData.annualLeave, paidSickLeave: formData.paidSickLeave, publicHolidays: formData.publicHolidays,
      workEnvironment: formData.workEnvironment, leadership: formData.leadership, teamwork: formData.teamwork,
      degreeType: formData.degreeType, schoolType: formData.schoolType, education: formData.education,
      homeTown: formData.homeTown, shuttle: formData.hasShuttle ? formData.shuttle : '1.0',
      canteen: formData.hasCanteen ? formData.canteen : '1.0', workYears: formData.workYears,
      jobStability: formData.jobStability, bachelorType: formData.bachelorType,
      hasShuttle: formData.hasShuttle, hasCanteen: formData.hasCanteen,
    };
    try {
      const updated = [item, ...history.slice(0, 9)];
      setHistory(updated);
      localStorage.setItem('jobValueHistory', JSON.stringify(updated));
    } catch (e) { console.error(e); }
    return item;
  }, [formData, value, selectedCountry, history, getCountryName, calculateWorkingDays, getDisplaySalary, getValueAssessment]);

  const deleteHistoryItem = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation(); e.preventDefault();
    const updated = history.filter(i => i.id !== id);
    setHistory(updated);
    localStorage.setItem('jobValueHistory', JSON.stringify(updated));
  }, [history]);

  const clearAllHistory = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); e.preventDefault();
    setHistory([]);
    localStorage.removeItem('jobValueHistory');
  }, []);

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')} ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
  };

  const rating = getValueAssessment();
  const barPct = Math.min((value / 5) * 100, 100);

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 16px 48px' }}>

      {/* ── Header ── */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ marginBottom: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
            v6.2.1
          </span>
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)', margin: '0 0 8px', lineHeight: 1.15 }}>
          {t('title')}
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-tertiary)', margin: '0 0 16px' }}>
          {t('description') || 'Calculate the actual worth of your job beyond salary'}
        </p>

        {/* Nav row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 12 }}>
          
          <span style={{ width: 1, height: 12, background: 'var(--border-strong)' }} />
          <a href="https://github.com/zippland/worth-calculator" target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text-tertiary)', textDecoration: 'none' }}
            className="hover:!text-blue-500">
            <Github size={13} />
            GitHub
          </a>
          <span style={{ width: 1, height: 12, background: 'var(--border-strong)' }} />
          {isBrowser && (
            <button onClick={() => setShowHistory(!showHistory)}
              style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              className="hover:!text-blue-500">
              <History size={13} />
              {t('history')}
            </button>
          )}
          <LanguageSwitcher />
        </div>

        {/* Visitor stats */}
        {isBrowser && (
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', display: 'flex', justifyContent: 'center', gap: 16, opacity: visitorVisible ? 1 : 0, transition: 'opacity 0.3s' }}>
            <span id="busuanzi_container_site_pv">{t('visits')}: <span id="busuanzi_value_site_pv" /></span>
            <span id="busuanzi_container_site_uv">{t('visitors')}: <span id="busuanzi_value_site_uv" /></span>
          </div>
        )}

        {/* History dropdown */}
        {isBrowser && showHistory && (
          <div style={{ position: 'relative', zIndex: 10, marginTop: 8 }}>
            <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: 360, background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 12, boxShadow: 'var(--shadow-lg)', maxHeight: 320, overflowY: 'auto' }} className="animate-fadeIn">
              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <History size={13} /> {t('history')}
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  {history.length > 0 && (
                    <button onClick={clearAllHistory} style={{ fontSize: 12, color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', padding: '3px 8px', borderRadius: 6 }} className="hover:!text-red-500 hover:bg-red-50">
                      {t('clear_all')}
                    </button>
                  )}
                  <button onClick={() => setShowHistory(false)} style={{ fontSize: 16, color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', width: 24, height: 24, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                </div>
              </div>
              <div style={{ padding: 12 }}>
                {history.length > 0 ? (
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {history.map(item => (
                      <li key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 8, background: 'var(--bg)', border: '1px solid var(--border)' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 15, fontWeight: 600, color: item.assessmentColor }}>{item.value}</span>
                            <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 20, background: 'var(--surface-2)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                              {item.countryCode !== 'CN' ? '$' : '¥'}{item.salary}
                            </span>
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{formatDate(item.timestamp)}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button onClick={(e) => { e.stopPropagation(); e.preventDefault(); setFormData({ ...formData, salary: item.salary, cityFactor: item.cityFactor, workHours: item.workHours, commuteHours: item.commuteHours, restTime: item.restTime, workDaysPerWeek: item.workDaysPerWeek, wfhDaysPerWeek: item.wfhDaysPerWeek, annualLeave: item.annualLeave, paidSickLeave: item.paidSickLeave, publicHolidays: item.publicHolidays, workEnvironment: item.workEnvironment, leadership: item.leadership, teamwork: item.teamwork, degreeType: item.degreeType, schoolType: item.schoolType, education: item.education, homeTown: item.homeTown, shuttle: item.shuttle, canteen: item.canteen, workYears: item.workYears, jobStability: item.jobStability, bachelorType: item.bachelorType, hasShuttle: typeof item.hasShuttle === 'boolean' ? item.hasShuttle : false, hasCanteen: typeof item.hasCanteen === 'boolean' ? item.hasCanteen : false }); handleCountryChange(item.countryCode); setShowHistory(false); }}
                            style={{ padding: 6, borderRadius: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)' }} title={t('restore_history')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                          </button>
                          <Link href={{ pathname: '/share', query: { value: item.value, assessment: item.assessment, assessmentColor: item.assessmentColor, cityFactor: item.cityFactor, workHours: item.workHours, commuteHours: item.commuteHours, restTime: item.restTime, dailySalary: item.dailySalary, isYuan: item.countryCode !== 'CN' ? 'false' : 'true', workDaysPerYear: item.workDaysPerYear, workDaysPerWeek: item.workDaysPerWeek, wfhDaysPerWeek: item.wfhDaysPerWeek, annualLeave: item.annualLeave, paidSickLeave: item.paidSickLeave, publicHolidays: item.publicHolidays, workEnvironment: item.workEnvironment, leadership: item.leadership, teamwork: item.teamwork, degreeType: item.degreeType, schoolType: item.schoolType, education: item.education, homeTown: item.homeTown, shuttle: item.shuttle, canteen: item.canteen, workYears: item.workYears, jobStability: item.jobStability, bachelorType: item.bachelorType, countryCode: item.countryCode, countryName: getCountryName(item.countryCode), hasShuttle: item.hasShuttle, hasCanteen: item.hasCanteen } }}
                            style={{ padding: 6, borderRadius: 6, color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Eye size={14} />
                          </Link>
                          <button onClick={(e) => deleteHistoryItem(item.id, e)}
                            style={{ padding: 6, borderRadius: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }} className="hover:!text-red-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-tertiary)', fontSize: 13 }}>
                    <History size={28} style={{ margin: '0 auto 8px', opacity: 0.3 }} />
                    <p style={{ margin: 0 }}>{t('no_history')}</p>
                    <p style={{ margin: '4px 0 0', fontSize: 11 }}>{t('history_notice')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Section 1: Salary ── */}
      <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 16, padding: 24, marginBottom: 12, boxShadow: 'var(--shadow-sm)' }} className="animate-slideUp">
        <SectionTitle step={1}>{t('annual_salary') || '薪资 & 工作制度'}</SectionTitle>

        <div style={{ marginBottom: 16 }}>
          <FieldInput label={selectedCountry !== 'CN' ? `${t('annual_salary')} (${getCurrencySymbol(selectedCountry)})` : t('annual_salary_cny')}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }}>
                <Wallet size={15} />
              </span>
              <input type="number" value={formData.salary}
                onChange={e => handleInputChange('salary', e.target.value)}
                placeholder={selectedCountry !== 'CN' ? `${t('salary_placeholder')} ${getCurrencySymbol(selectedCountry)}` : t('salary_placeholder_cny')}
                style={{ ...inputStyle, paddingLeft: 36 }}
                onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            </div>
          </FieldInput>
        </div>

        <div style={{ marginBottom: 16 }}>
          <FieldInput label={t('country_selection')} tooltip={t('ppp_tooltip')}>
            <select value={selectedCountry} onChange={e => handleCountryChange(e.target.value)} style={selectStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}>
              {Object.keys(pppFactors).sort((a, b) => {
                if (a === 'CN') return -1; if (b === 'CN') return 1;
                return new Intl.Collator(['zh','ja','en']).compare(getCountryName(a), getCountryName(b));
              }).map(code => <option key={code} value={code}>{getCountryName(code)} ({pppFactors[code].toFixed(2)})</option>)}
            </select>
            <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 5, marginBottom: 0 }}>{t('selected_ppp')}: {(pppFactors[selectedCountry] || 4.19).toFixed(2)}</p>
          </FieldInput>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <FieldInput label={t('work_days_per_week')}>
            <input type="number" value={formData.workDaysPerWeek} onChange={e => handleInputChange('workDaysPerWeek', e.target.value)} style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </FieldInput>
          <FieldInput label={t('wfh_days_per_week')} tooltip={t('wfh_tooltip')}>
            <input type="number" min="0" max={formData.workDaysPerWeek} value={formData.wfhDaysPerWeek} onChange={e => handleInputChange('wfhDaysPerWeek', e.target.value)} style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </FieldInput>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
          {[
            { label: t('annual_leave'), key: 'annualLeave' },
            { label: t('public_holidays'), key: 'publicHolidays' },
            { label: t('paid_sick_leave'), key: 'paidSickLeave' },
          ].map(({ label, key }) => (
            <FieldInput key={key} label={label}>
              <input type="number" value={(formData as any)[key]} onChange={e => handleInputChange(key, e.target.value)} style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'var(--accent)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            </FieldInput>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <FieldInput label={t('work_hours')} tooltip={t('work_hours_tooltip')}>
            <input type="number" value={formData.workHours} onChange={e => handleInputChange('workHours', e.target.value)} style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </FieldInput>
          <FieldInput label={t('commute_hours')} tooltip={t('commute_tooltip')}>
            <input type="number" value={formData.commuteHours} onChange={e => handleInputChange('commuteHours', e.target.value)} style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </FieldInput>
          <FieldInput label={t('rest_time')}>
            <input type="number" value={formData.restTime} onChange={e => handleInputChange('restTime', e.target.value)} style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </FieldInput>
        </div>
      </div>

      {/* ── Section 2: Background ── */}
      <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 16, padding: 24, marginBottom: 12, boxShadow: 'var(--shadow-sm)' }}>
        <SectionTitle step={2}>{t('education_level') || '学历 & 工作年限'}</SectionTitle>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <FieldInput label={t('degree_type')}>
            <select value={formData.degreeType} onChange={e => handleInputChange('degreeType', e.target.value)} style={selectStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')}>
              <option value="belowBachelor">{t('below_bachelor')}</option>
              <option value="bachelor">{t('bachelor')}</option>
              <option value="masters">{t('masters')}</option>
              <option value="phd">{t('phd')}</option>
            </select>
          </FieldInput>
          <FieldInput label={t('school_type')}>
            <select value={formData.schoolType} onChange={e => handleInputChange('schoolType', e.target.value)} style={selectStyle} disabled={formData.degreeType === 'belowBachelor'}
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')}>
              <option value="secondTier">{t('school_second_tier')}</option>
              {formData.degreeType === 'bachelor' ? (
                <><option value="firstTier">{t('school_first_tier_bachelor')}</option><option value="elite">{t('school_elite_bachelor')}</option></>
              ) : (
                <><option value="firstTier">{t('school_first_tier_higher')}</option><option value="elite">{t('school_elite_higher')}</option></>
              )}
            </select>
          </FieldInput>
        </div>

        {formData.degreeType === 'masters' && (
          <div style={{ marginBottom: 16 }}>
            <FieldInput label={t('bachelor_background')}>
              <select value={formData.bachelorType} onChange={e => handleInputChange('bachelorType', e.target.value)} style={selectStyle}
                onFocus={e => (e.target.style.borderColor = 'var(--accent)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')}>
                <option value="secondTier">{t('school_second_tier')}</option>
                <option value="firstTier">{t('school_first_tier_bachelor')}</option>
                <option value="elite">{t('school_elite_bachelor')}</option>
              </select>
            </FieldInput>
          </div>
        )}

        <FieldInput label={t('work_years')}>
          <select value={formData.workYears} onChange={e => handleInputChange('workYears', e.target.value)} style={selectStyle}
            onFocus={e => (e.target.style.borderColor = 'var(--accent)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')}>
            <option value="0">{t('fresh_graduate')}</option>
            <option value="1">{t('years_1_3')}</option>
            <option value="2">{t('years_3_5')}</option>
            <option value="4">{t('years_5_8')}</option>
            <option value="6">{t('years_8_10')}</option>
            <option value="10">{t('years_10_12')}</option>
            <option value="15">{t('years_above_12')}</option>
          </select>
        </FieldInput>
      </div>

      {/* ── Section 3: Work Environment ── */}
      <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 16, padding: 24, marginBottom: 12, boxShadow: 'var(--shadow-sm)' }}>
        <SectionTitle step={3}>{t('work_environment') || '工作环境'}</SectionTitle>

        <ChipGroup label={t('job_stability')} name="jobStability" value={formData.jobStability} onChange={handleInputChange}
          options={[
            { label: t('job_government'), value: 'government' }, { label: t('job_state'), value: 'state' },
            { label: t('job_foreign'), value: 'foreign' }, { label: t('job_private'), value: 'private' },
            { label: t('job_dispatch'), value: 'dispatch' }, { label: t('job_freelance'), value: 'freelance' },
          ]} />

        <ChipGroup label={t('work_environment')} name="workEnvironment" value={formData.workEnvironment} onChange={handleInputChange}
          options={[
            { label: t('env_remote'), value: '0.8' }, { label: t('env_factory'), value: '0.9' },
            { label: t('env_normal'), value: '1.0' }, { label: t('env_cbd'), value: '1.1' },
          ]} />

        <ChipGroup label={t('city_factor')} name="cityFactor" value={formData.cityFactor} onChange={handleInputChange}
          options={[
            { label: t('city_tier1'), value: '0.70' }, { label: t('city_newtier1'), value: '0.80' },
            { label: t('city_tier2'), value: '1.0' }, { label: t('city_tier3'), value: '1.10' },
            { label: t('city_tier4'), value: '1.25' }, { label: t('city_county'), value: '1.40' },
            { label: t('city_town'), value: '1.50' },
          ]} />

        <ChipGroup label={t('hometown')} name="homeTown" value={formData.homeTown} onChange={handleInputChange}
          options={[{ label: t('not_hometown'), value: 'no' }, { label: t('is_hometown'), value: 'yes' }]} />

        <ChipGroup label={t('leadership')} name="leadership" value={formData.leadership} onChange={handleInputChange}
          options={[
            { label: t('leader_bad'), value: '0.7' }, { label: t('leader_strict'), value: '0.9' },
            { label: t('leader_normal'), value: '1.0' }, { label: t('leader_good'), value: '1.1' },
            { label: t('leader_favorite'), value: '1.3' },
          ]} />

        <ChipGroup label={t('teamwork')} name="teamwork" value={formData.teamwork} onChange={handleInputChange}
          options={[
            { label: t('team_bad'), value: '0.9' }, { label: t('team_normal'), value: '1.0' },
            { label: t('team_good'), value: '1.1' }, { label: t('team_excellent'), value: '1.2' },
          ]} />

        {/* Shuttle */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none' }}>
            <input type="checkbox" checked={formData.hasShuttle === true} onChange={e => handleInputChange('hasShuttle', e.target.checked)}
              style={{ width: 16, height: 16, accentColor: 'var(--accent)', cursor: 'pointer' }} />
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>{t('shuttle')}</span>
          </label>
          {formData.hasShuttle && (
            <div style={{ marginTop: 10 }}>
              <ChipGroup label="" name="shuttle" value={formData.shuttle} onChange={handleInputChange}
                options={[
                  { label: t('shuttle_none'), value: '1.0' }, { label: t('shuttle_inconvenient'), value: '0.9' },
                  { label: t('shuttle_convenient'), value: '0.7' }, { label: t('shuttle_direct'), value: '0.5' },
                ]} />
            </div>
          )}
        </div>

        {/* Canteen */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none' }}>
            <input type="checkbox" checked={formData.hasCanteen === true} onChange={e => handleInputChange('hasCanteen', e.target.checked)}
              style={{ width: 16, height: 16, accentColor: 'var(--accent)', cursor: 'pointer' }} />
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>{t('canteen')}</span>
          </label>
          {formData.hasCanteen && (
            <div style={{ marginTop: 10 }}>
              <ChipGroup label="" name="canteen" value={formData.canteen} onChange={handleInputChange}
                options={[
                  { label: t('canteen_none'), value: '1.0' }, { label: t('canteen_average'), value: '1.05' },
                  { label: t('canteen_good'), value: '1.1' }, { label: t('canteen_excellent'), value: '1.15' },
                ]} />
            </div>
          )}
        </div>
      </div>

      {/* ── Result Card ── */}
      <div ref={shareResultsRef} style={{ background: 'var(--surface)', border: `2px solid ${formData.salary ? rating.color : 'var(--border)'}`, borderRadius: 16, padding: 24, boxShadow: formData.salary ? `0 0 0 4px ${rating.barColor}18` : 'none', transition: 'border-color 0.3s, box-shadow 0.3s' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
          {[
            { label: t('working_days_per_year'), value: `${calculateWorkingDays()}${t('days_unit')}` },
            { label: t('average_daily_salary'), value: `${getCurrencySymbol(selectedCountry)}${getDisplaySalary()}` },
          ].map(({ label, value: v }) => (
            <div key={label}>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 6 }}>{label}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 18, fontWeight: 500, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{v}</div>
            </div>
          ))}
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 6 }}>{t('job_value')}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, fontWeight: 600, color: rating.color, letterSpacing: '-0.03em', lineHeight: 1 }}>
              {value.toFixed(2)}
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: rating.color, marginTop: 4 }}>{rating.text}</div>
          </div>
        </div>

        {/* Score bar */}
        <div style={{ height: 6, background: 'var(--surface-2)', borderRadius: 3, overflow: 'hidden', marginBottom: 16, border: '1px solid var(--border)' }}>
          <div style={{ height: '100%', width: `${formData.salary ? barPct : 0}%`, background: rating.barColor, borderRadius: 3, transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Link
            href={{ pathname: '/share', query: { value: value.toFixed(2), assessment: getValueAssessmentKey(value, !!formData.salary), assessmentColor: rating.color, cityFactor: formData.cityFactor, workHours: formData.workHours, commuteHours: formData.commuteHours, restTime: formData.restTime, dailySalary: getDisplaySalary(), isYuan: selectedCountry !== 'CN' ? 'false' : 'true', workDaysPerYear: calculateWorkingDays().toString(), workDaysPerWeek: formData.workDaysPerWeek, wfhDaysPerWeek: formData.wfhDaysPerWeek, annualLeave: formData.annualLeave, paidSickLeave: formData.paidSickLeave, publicHolidays: formData.publicHolidays, workEnvironment: formData.workEnvironment, leadership: formData.leadership, teamwork: formData.teamwork, degreeType: formData.degreeType, schoolType: formData.schoolType, education: formData.education, homeTown: formData.homeTown, shuttle: formData.hasShuttle ? formData.shuttle : '1.0', canteen: formData.hasCanteen ? formData.canteen : '1.0', workYears: formData.workYears, jobStability: formData.jobStability, bachelorType: formData.bachelorType, countryCode: selectedCountry, countryName: getCountryName(selectedCountry), currencySymbol: getCurrencySymbol(selectedCountry), hasShuttle: formData.hasShuttle, hasCanteen: formData.hasCanteen } }}
            onClick={() => formData.salary ? saveToHistory() : null}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: 'all 0.12s', background: formData.salary ? 'var(--accent)' : 'var(--surface-2)', color: formData.salary ? 'white' : 'var(--text-tertiary)', cursor: formData.salary ? 'pointer' : 'not-allowed' }}>
            <FileText size={14} />
            {t('view_report')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SalaryCalculator;

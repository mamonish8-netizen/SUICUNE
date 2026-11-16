import { useState } from 'react';
import { ASSETS, ToastHandler } from '../types';
import { ResilientImage } from './ResilientImage';

interface AlertsViewProps {
  valveOpen: boolean;
  onToggleValve: () => void;
  onShowToast: ToastHandler;
}

interface ChecklistItem {
  id: string;
  title: string;
  subtitle: string;
  checked: boolean;
}

interface DispatchModalInfo {
  type: 'Municipal Tech' | 'Community Plumber';
  provider: string;
  time: string;
  coverage: string;
}

export function AlertsView({ valveOpen, onToggleValve, onShowToast }: AlertsViewProps) {
  const [acknowledged, setAcknowledged] = useState(false);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: 'flapper',
      title: 'Check toilet flapper valve',
      subtitle: 'Master & Guest bathrooms cistern seal test',
      checked: true,
    },
    {
      id: 'spigots',
      title: 'Inspect outdoor spigots',
      subtitle: 'Check hose bibb threads and drip connectors',
      checked: false,
    },
    {
      id: 'heater',
      title: 'Water heater relief valve',
      subtitle: 'Look for damp soil near exterior T&P discharge pipe',
      checked: false,
    },
    {
      id: 'kitchen',
      title: 'Kitchen cabinet seepage',
      subtitle: 'Inspect under-sink P-trap and dishwasher coupling',
      checked: false,
    },
  ]);

  const [pendingDispatch, setPendingDispatch] = useState<DispatchModalInfo | null>(null);
  const [confirmedDispatch, setConfirmedDispatch] = useState<DispatchModalInfo | null>(null);

  const checkedCount = checklist.filter((item) => item.checked).length;

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleConfirmDispatch = () => {
    if (!pendingDispatch) return;
    setConfirmedDispatch(pendingDispatch);
    onShowToast(`${pendingDispatch.type} booked for ${pendingDispatch.time}`, 'task_alt');
    setPendingDispatch(null);
  };

  return (
    <div className="flex flex-col w-full px-4 pt-3 pb-8 gap-4">
      {/* 1. ALERT STATUS SUMMARY BANNER */}
      <section className="w-full bg-surface-clean rounded-xl p-4 shadow-sm relative overflow-hidden border border-aquatic-subtle">
        <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-aquatic-tint/60 pointer-events-none blur-2xl" />
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-hazard-alert" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-hazard-alert" />
            </span>
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
              Telemetry Anomaly
            </span>
          </div>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-amber-900 bg-amber-100 border border-amber-300 font-semibold shadow-xs">
            <span className="material-symbols-outlined text-[15px] text-amber-700">report_problem</span>
            <span className="font-label-sm text-[11px]">Attention Required · Medium</span>
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <div className="font-headline-sm text-[18px] text-text-primary font-bold">
            1 Active Potential Leak
          </div>
          <span className="font-label-md text-xs text-aquatic-primary font-semibold flex items-center gap-0.5">
            <span className="material-symbols-outlined text-[14px]">my_location</span> Zone 2 Focus
          </span>
        </div>
        <p className="font-body-sm text-xs text-text-secondary mt-1">
          Telemetry sensors flagged silent unmetered drift across domestic branch manifold.
        </p>
      </section>

      {/* 2. PRIMARY ACTIVE ANOMALY CARD */}
      <section className="w-full bg-surface-clean rounded-xl p-4 relative shadow-sm overflow-hidden border border-aquatic-subtle">
        <div className="flex items-start justify-between gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-aquatic-tint text-aquatic-primary border border-aquatic-subtle">
            <span className="material-symbols-outlined text-[24px]">water_damage</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-rose-50 text-hazard-alert border border-rose-200">
                Active Anomaly
              </span>
              <span className="font-label-sm text-[11px] text-text-muted flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live feed
              </span>
            </div>
            <h2 className="font-headline-sm text-[18px] text-text-primary mt-1 font-bold truncate">
              Continuous Micro-Flow
            </h2>
            <div className="flex items-center gap-1.5 text-text-secondary mt-0.5">
              <span className="material-symbols-outlined text-[15px] text-ocean-mid">schedule</span>
              <span className="font-label-md text-xs">Today, 03:15 AM - 05:40 AM (2h 25m)</span>
            </div>
          </div>
        </div>

        {/* Acoustic telemetry visual sensor line */}
        <div className="mt-4 pt-3 bg-canvas-base rounded-lg p-3 border border-aquatic-subtle">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-aquatic-primary">
                graphic_eq
              </span>
              <span className="font-label-sm text-[11px] text-text-primary font-medium">
                Micro-flow Signature
              </span>
            </div>
            <span className="font-label-sm text-[11px] font-semibold text-ocean-mid px-2 py-0.5 rounded bg-aquatic-tint tabular-nums">
              {valveOpen ? '0.06 L/min steady' : '0.00 L/min isolated'}
            </span>
          </div>
          <div className="w-full h-11 flex items-center">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 320 40">
              <defs>
                <linearGradient id="aquaticSparkGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#f0f9ff" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 30 Q 15 29, 30 31 T 60 29 T 90 30 T 110 28 L 130 18 Q 145 14, 160 16 T 190 14 T 220 15 T 250 14 T 280 15 T 310 13 L 320 14 L 320 40 L 0 40 Z"
                fill="url(#aquaticSparkGrad)"
              />
              <path
                d="M 0 30 Q 15 29, 30 31 T 60 29 T 90 30 T 110 28 L 130 18 Q 145 14, 160 16 T 190 14 T 220 15 T 250 14 T 280 15 T 310 13 L 320 14"
                fill="none"
                stroke="#0284c7"
                strokeLinecap="round"
                strokeWidth="2.5"
              />
              <circle cx="310" cy="13" fill="#e11d48" r="4" />
              <circle cx="310" cy="13" fill="#e11d48" opacity="0.35" r="8" />
            </svg>
          </div>
        </div>

        {/* Telemetry Metric Grid */}
        <div className="grid grid-cols-2 gap-2.5 mt-3">
          <div className="bg-surface-clean p-2.5 rounded-lg flex flex-col justify-between border border-aquatic-subtle">
            <span className="font-label-sm text-[11px] text-text-secondary flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-aquatic-primary">opacity</span> Loss
              Velocity
            </span>
            <div className="mt-1">
              <div className="font-title-md text-base text-text-primary font-bold tabular-nums">
                ~3.8 L/hr
              </div>
              <span className="font-body-sm text-xs font-semibold text-hazard-alert tabular-nums">
                18.2 L total wasted
              </span>
            </div>
          </div>
          <div className="bg-surface-clean p-2.5 rounded-lg flex flex-col justify-between border border-aquatic-subtle">
            <span className="font-label-sm text-[11px] text-text-secondary flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-aquatic-primary">
                location_on
              </span>{' '}
              Detected Line
            </span>
            <div className="mt-1">
              <div className="font-title-md text-base text-text-primary font-bold truncate">
                Cistern Branch
              </div>
              <span className="font-body-sm text-xs text-text-secondary truncate block">
                Guest Bathroom #2
              </span>
            </div>
          </div>
        </div>

        {/* Live acoustic inspection snapshot */}
        <div className="mt-3 flex items-center gap-2.5 bg-aquatic-tint/40 p-2.5 rounded-lg border border-aquatic-subtle">
          <ResilientImage
            src={ASSETS.plumbingFixture}
            alt="Plumbing fixture"
            className="w-12 h-12 rounded-lg object-cover shrink-0 border border-aquatic-subtle"
            fallbackIcon="plumbing"
          />
          <div className="min-w-0 flex-1">
            <div className="font-label-sm text-xs font-semibold text-text-primary truncate">
              Node Cistern-B2 Sensor Active
            </div>
            <div className="font-body-sm text-xs text-text-secondary truncate">
              Consistent baseline pressure drop of 0.4 bar
            </div>
          </div>
          <span className="material-symbols-outlined text-aquatic-primary text-[20px] shrink-0">
            sensors
          </span>
        </div>
      </section>

      {/* 3. INTERACTIVE IMMEDIATE REMEDIATION BAR */}
      <section className="w-full flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="font-label-sm text-[11px] text-text-secondary uppercase tracking-wider font-semibold">
            Immediate Containment
          </div>
          <span
            className={`font-label-sm text-[11px] px-2 py-0.5 rounded-full font-semibold border ${
              !valveOpen
                ? 'bg-sky-100 text-ocean-mid border-aquatic-subtle'
                : 'bg-rose-50 text-hazard-alert border-rose-200'
            }`}
          >
            {!valveOpen ? 'Valve Isolated' : 'Manual Action Needed'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onToggleValve}
            className={`w-full py-3 px-3 rounded-xl flex items-center justify-center gap-2 text-white font-title-md text-sm font-semibold shadow-sm active:scale-95 transition-all text-center cursor-pointer border ${
              !valveOpen
                ? 'bg-slate-700 hover:bg-slate-800 border-slate-600'
                : 'bg-hazard-alert hover:bg-rose-700 border-rose-400'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {!valveOpen ? 'lock' : 'valve'}
            </span>
            <span>{!valveOpen ? 'Valve Closed' : 'Remote Shutoff'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAcknowledged(true);
              onShowToast('Telemetry alarm snoozed for 60 minutes.', 'notifications_paused');
            }}
            className={`w-full py-3 px-3 rounded-xl flex items-center justify-center gap-2 bg-aquatic-tint text-ocean-mid font-title-md text-sm font-semibold active:scale-95 hover:bg-sky-200 transition-all cursor-pointer border border-aquatic-subtle ${
              acknowledged ? 'opacity-70' : ''
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            <span>{acknowledged ? 'Acknowledged' : 'Acknowledge'}</span>
          </button>
        </div>

        {/* Valve status banner */}
        {!valveOpen && (
          <div className="w-full p-3 rounded-xl flex items-center justify-between transition-all bg-sky-50 border border-aquatic-subtle text-ocean-mid shadow-sm">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="material-symbols-outlined text-[22px] text-aquatic-primary shrink-0">
                verified
              </span>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-xs font-semibold text-ocean-deep">
                  Motorized Line Valve Closed
                </span>
                <span className="font-body-sm text-xs text-text-secondary truncate">
                  Cistern branch flow halted · Zero pressure loss confirmed
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleValve}
              className="font-label-sm text-xs underline font-semibold cursor-pointer text-aquatic-primary hover:text-ocean-deep shrink-0 ml-2"
            >
              Reopen
            </button>
          </div>
        )}

        {/* Acknowledge status banner */}
        {acknowledged && (
          <div className="w-full p-2.5 rounded-xl flex items-center justify-between transition-all bg-sky-50 border border-aquatic-subtle text-ocean-mid shadow-sm">
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-[18px] text-aquatic-primary shrink-0">
                notifications_paused
              </span>
              <span className="font-label-sm text-xs text-ocean-deep truncate">
                Telemetry alarm snoozed for 60 mins. Monitoring background pressure.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setAcknowledged(false)}
              className="text-xs text-text-secondary hover:text-aquatic-primary underline shrink-0 ml-2 cursor-pointer"
            >
              Undo
            </button>
          </div>
        )}
      </section>

      {/* 4. CHECKLIST */}
      <section className="w-full bg-surface-clean rounded-xl p-4 shadow-sm flex flex-col gap-3 border border-aquatic-subtle">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-aquatic-tint text-aquatic-primary flex items-center justify-center border border-aquatic-subtle">
              <span className="material-symbols-outlined text-[18px]">checklist</span>
            </div>
            <h3 className="font-title-md text-base text-text-primary font-bold">
              Inspection Walkthrough
            </h3>
          </div>
          <span className="font-label-sm text-[11px] px-2.5 py-0.5 rounded-full bg-aquatic-tint text-ocean-mid font-semibold border border-aquatic-subtle tabular-nums">
            {checkedCount} of {checklist.length} verified
          </span>
        </div>
        <p className="font-body-sm text-xs text-text-secondary">
          Perform these rapid visual tests before booking high-cost line excavations.
        </p>

        <div className="flex flex-col gap-2 mt-1">
          {checklist.map((item) => (
            <label
              key={item.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-canvas-base border border-aquatic-subtle transition-all cursor-pointer select-none hover:bg-aquatic-tint/30"
            >
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleChecklistItem(item.id)}
                className="mt-0.5 w-4 h-4 rounded text-aquatic-primary accent-aquatic-primary cursor-pointer shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div
                  className={`font-title-md text-sm font-semibold ${
                    item.checked ? 'text-text-secondary line-through' : 'text-text-primary'
                  }`}
                >
                  {item.title}
                </div>
                <div
                  className={`font-body-sm text-xs ${
                    item.checked ? 'text-text-muted' : 'text-text-secondary'
                  }`}
                >
                  {item.subtitle}
                </div>
              </div>
              <span
                className={`material-symbols-outlined text-[18px] shrink-0 ${
                  item.checked ? 'text-aquatic-primary' : 'text-text-muted/40'
                }`}
              >
                {item.checked ? 'check_circle' : 'radio_button_unchecked'}
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* 5. DISPATCH FIELD ASSISTANCE */}
      <section className="w-full bg-surface-clean rounded-xl p-4 shadow-sm relative overflow-hidden border border-aquatic-subtle">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-label-sm text-[11px] text-aquatic-primary font-semibold uppercase tracking-wider">
              Expert Remediation
            </span>
            <h3 className="font-headline-sm text-[18px] text-text-primary font-bold mt-0.5">
              Need on-site dispatch?
            </h3>
          </div>
          <div className="w-9 h-9 rounded-xl bg-aquatic-tint flex items-center justify-center text-aquatic-primary border border-aquatic-subtle">
            <span className="material-symbols-outlined text-[20px]">engineering</span>
          </div>
        </div>

        <div className="bg-canvas-base p-3 rounded-lg flex items-center gap-3 border border-aquatic-subtle">
          <ResilientImage
            src={ASSETS.techResponder}
            alt="Tech responder"
            className="w-12 h-12 rounded-full object-cover shrink-0 border border-aquatic-subtle"
            fallbackIcon="engineering"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-title-md text-sm text-text-primary font-bold truncate">
                Ward 7 Response Squad
              </span>
              <span className="font-label-sm text-[11px] px-2 py-0.5 rounded-full bg-aquatic-tint text-ocean-mid font-semibold border border-aquatic-subtle">
                Tier 1
              </span>
            </div>
            <div className="flex items-center gap-1 mt-0.5 text-text-secondary">
              <span className="material-symbols-outlined text-[14px] text-aquatic-primary">
                schedule
              </span>
              <span className="font-label-sm text-[11px]">Earliest window: Today, 2:00 PM</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <button
            type="button"
            onClick={() =>
              setPendingDispatch({
                type: 'Municipal Tech',
                provider: 'Ward 7 Official Unit #14',
                time: 'Today, 2:00 PM',
                coverage: 'Included under Municipal Water Plan',
              })
            }
            className={`py-2.5 px-3 rounded-lg bg-aquatic-primary text-white font-label-lg text-xs font-semibold active:scale-95 hover:bg-sky-700 transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 shadow-sm ${
              confirmedDispatch?.type === 'Municipal Tech' ? 'opacity-80' : ''
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">badge</span>
            <span>
              {confirmedDispatch?.type === 'Municipal Tech' ? 'Requested' : 'Municipal Tech'}
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              setPendingDispatch({
                type: 'Community Plumber',
                provider: 'Rapid-Flow Services (Ward Certified)',
                time: 'Today, 3:30 PM',
                coverage: 'Standard Service: $45 copay waived',
              })
            }
            className={`py-2.5 px-3 rounded-lg bg-aquatic-tint text-ocean-mid font-label-lg text-xs font-semibold active:scale-95 hover:bg-sky-200 transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 border border-aquatic-subtle ${
              confirmedDispatch?.type === 'Community Plumber' ? 'opacity-80' : ''
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">plumbing</span>
            <span>
              {confirmedDispatch?.type === 'Community Plumber' ? 'Notified' : 'Community Plumber'}
            </span>
          </button>
        </div>

        {confirmedDispatch && (
          <div className="mt-3 p-3 rounded-xl bg-sky-50 border border-aquatic-subtle text-ocean-mid font-label-sm text-xs flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="material-symbols-outlined text-[22px] text-aquatic-primary shrink-0">
                task_alt
              </span>
              <div className="min-w-0">
                <div className="font-bold text-ocean-deep">{confirmedDispatch.type} Dispatched</div>
                <div className="text-xs text-text-secondary truncate">
                  {confirmedDispatch.provider} · ETA {confirmedDispatch.time}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setConfirmedDispatch(null)}
              className="text-xs underline text-text-secondary hover:text-aquatic-primary cursor-pointer shrink-0 ml-2"
            >
              Cancel
            </button>
          </div>
        )}
      </section>

      {/* 6. REMEDIATION HISTORY */}
      <section className="w-full bg-surface-clean rounded-xl p-4 shadow-sm flex flex-col gap-3 border border-aquatic-subtle">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-aquatic-primary text-[20px]">
              history_edu
            </span>
            <h3 className="font-title-md text-base text-text-primary font-bold">
              Remediation History
            </h3>
          </div>
          <span className="font-label-sm text-[11px] text-text-muted font-medium">Last 60 Days</span>
        </div>

        <div className="flex flex-col gap-2 mt-1">
          <div className="p-3 rounded-lg bg-canvas-base border border-aquatic-subtle flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-aquatic-tint text-aquatic-primary flex items-center justify-center shrink-0 mt-0.5 border border-aquatic-subtle">
              <span className="material-symbols-outlined text-[18px]">water</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-title-md text-sm text-text-primary font-semibold truncate">
                  Kitchen Faucet Slow Drip
                </span>
                <span className="font-label-sm text-[11px] font-semibold text-ocean-mid px-2 py-0.5 rounded bg-aquatic-tint border border-aquatic-subtle shrink-0 tabular-nums">
                  Saved 42 L/d
                </span>
              </div>
              <div className="font-body-sm text-xs text-text-secondary mt-0.5">
                Fixed Oct 14 · Replaced ceramic cartridge seal
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-canvas-base border border-aquatic-subtle flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-aquatic-tint text-aquatic-primary flex items-center justify-center shrink-0 mt-0.5 border border-aquatic-subtle">
              <span className="material-symbols-outlined text-[18px]">yard</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-title-md text-sm text-text-primary font-semibold truncate">
                  Garden Irrigation Mismatch
                </span>
                <span className="font-label-sm text-[11px] font-semibold text-ocean-mid px-2 py-0.5 rounded bg-aquatic-tint border border-aquatic-subtle shrink-0 tabular-nums">
                  Saved 120 L/wk
                </span>
              </div>
              <div className="font-body-sm text-xs text-text-secondary mt-0.5">
                Fixed Sep 28 · Adjusted solenoid timer interval
              </div>
            </div>
          </div>
        </div>

        <div className="mt-1 p-3 rounded-lg flex items-center justify-between text-text-secondary bg-sky-50 border border-aquatic-subtle">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-aquatic-primary">
              water_drop
            </span>
            <span className="font-label-sm text-xs text-text-primary">
              Household Eco-Efficiency:{' '}
              <strong className="text-ocean-mid font-semibold">94% Optimum</strong>
            </span>
          </div>
          <span className="font-label-sm text-xs font-bold text-aquatic-primary bg-aquatic-tint px-2 py-0.5 rounded border border-aquatic-subtle tabular-nums">
            +180 pts
          </span>
        </div>
      </section>

      {/* MODAL FOR DISPATCH */}
      {pendingDispatch && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ocean-deep/60 backdrop-blur-xs p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPendingDispatch(null);
          }}
        >
          <div className="w-full max-w-sm bg-surface-clean rounded-2xl p-5 shadow-2xl border border-aquatic-subtle flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-aquatic-tint text-aquatic-primary flex items-center justify-center border border-aquatic-subtle">
                  <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                </div>
                <h4 className="font-headline-sm text-base font-bold text-text-primary">
                  Book {pendingDispatch.type}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setPendingDispatch(null)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-aquatic-tint/50 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="p-3 rounded-xl bg-canvas-base border border-aquatic-subtle space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary">Assigned Unit</span>
                <span className="font-semibold text-text-primary">{pendingDispatch.provider}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary">Arrival Window</span>
                <span className="font-semibold text-aquatic-primary">{pendingDispatch.time}</span>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-aquatic-subtle pt-2">
                <span className="text-text-secondary">Coverage</span>
                <span className="font-semibold text-ocean-mid">{pendingDispatch.coverage}</span>
              </div>
            </div>

            <p className="text-xs text-text-muted leading-relaxed">
              A certified technician will test pressure gradients at domestic node Cistern-B2 and
              assist with shutoff valve calibration.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setPendingDispatch(null)}
                className="py-2.5 px-3 rounded-lg border border-aquatic-subtle text-text-secondary hover:bg-aquatic-tint/40 font-label-md text-xs font-semibold cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleConfirmDispatch}
                className="py-2.5 px-3 rounded-lg bg-aquatic-primary text-white hover:bg-sky-700 font-label-md text-xs font-semibold shadow-sm cursor-pointer"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { TabRoute, ToastHandler } from '../types';

interface HomeViewProps {
  ecoPoints: number;
  valveOpen: boolean;
  onToggleValve: () => void;
  onNavigate: (tab: TabRoute) => void;
  onShowToast: ToastHandler;
}

const FLOW_PULSE_BARS = [
  { label: '12a', height: '6%', type: 'low', delay: undefined },
  { label: '2a', height: '4%', type: 'low', delay: undefined },
  { label: '4a', height: '8%', type: 'low', delay: undefined },
  { label: '6a', height: '38%', type: 'mid', delay: '0.1s' },
  { label: '8a', height: '86%', type: 'peak', delay: '0.25s', peakLabel: '78L PEAK' },
  { label: '10a', height: '24%', type: 'soft', delay: '0.4s' },
  { label: '12p', height: '20%', type: 'soft', delay: '0.55s' },
  { label: '2p', height: '14%', type: 'active', delay: '0.7s' },
  { label: '4p', height: '28%', type: 'forecast', delay: undefined },
  { label: '6p', height: '60%', type: 'forecast', delay: undefined },
  { label: '8p', height: '44%', type: 'forecast', delay: undefined },
] as const;

export function HomeView({
  ecoPoints,
  valveOpen,
  onToggleValve,
  onNavigate,
  onShowToast,
}: HomeViewProps) {
  const [soilHold, setSoilHold] = useState(false);

  const handleToggleSoilHold = () => {
    const next = !soilHold;
    setSoilHold(next);
    if (next) {
      onShowToast('Garden sprinkler schedule delayed 24 hours.', 'done');
    } else {
      onShowToast('Auto-irrigation schedule resumed.', 'play_arrow');
    }
  };

  return (
    <div className="flex flex-col w-full px-4 py-3 space-y-4">
      {/* Household Welcome & Meter Status Banner */}
      <section className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-aquatic-subtle">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container border border-aquatic-subtle">
              <span className="w-2 h-2 rounded-full bg-primary water-pulse-dot" />
              <span className="text-xs font-semibold tracking-wide">
                Meter #AG-7429 · {valveOpen ? 'Flow Normal' : 'Valve Isolated'}
              </span>
            </div>
            <h1 className="font-headline-lg-mobile text-[24px] leading-tight text-on-surface tracking-tight font-extrabold pt-0.5">
              Good morning, Elena
            </h1>
            <p className="text-xs text-on-surface-variant flex items-center gap-1.5 pt-0.5">
              <span className="material-symbols-outlined text-[16px] text-primary">group</span>
              <span>
                4 Residents · Baseline Target: <strong className="text-on-surface">420 L/day</strong>
              </span>
            </p>
          </div>
          <div className="flex flex-col items-end">
            <button
              type="button"
              aria-label="Water Eco Efficiency"
              onClick={() => onShowToast('Eco score: Grade A+ (Top 5% in Ward 7)', 'eco')}
              className="w-10 h-10 rounded-xl bg-secondary-container border border-aquatic-subtle flex items-center justify-center text-primary hover:bg-aquatic-tint transition cursor-pointer active:scale-95 shadow-xs"
            >
              <span className="material-symbols-outlined text-[22px]">energy_savings_leaf</span>
            </button>
          </div>
        </div>
      </section>

      {/* Water Consumption Central Gauge Card */}
      <section className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm relative overflow-hidden border border-aquatic-subtle">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">
            Today&apos;s Total Consumption
          </span>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container border border-aquatic-subtle text-primary">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold">
              {valveOpen ? '0.0 L/min (Standby)' : '0.0 L/min (Shutoff)'}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center my-3 relative">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
              <defs>
                <linearGradient id="aquaticFlowGrad" x1="0%" x2="100%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="50%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#bae6fd" />
                </linearGradient>
                <filter id="aquaticGlow" height="140%" width="140%" x="-20%" y="-20%">
                  <feDropShadow dx="0" dy="0" floodColor="#38bdf8" floodOpacity="0.5" stdDeviation="3" />
                </filter>
              </defs>
              <circle cx="80" cy="80" fill="transparent" r="66" stroke="#213145" strokeWidth="12" />
              <circle
                className="water-gauge-flow"
                cx="80"
                cy="80"
                fill="transparent"
                filter="url(#aquaticGlow)"
                r="66"
                stroke="url(#aquaticFlowGrad)"
                strokeLinecap="round"
                strokeWidth="12"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <div className="flex items-baseline justify-center">
                <span className="font-display-lg-mobile text-[36px] font-extrabold text-on-surface tracking-tight tabular-nums">
                  264
                </span>
                <span className="text-xl font-bold text-primary ml-0.5">L</span>
              </div>
              <span className="text-xs text-on-surface-variant font-medium">of 420 L Target</span>
              <div className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container border border-aquatic-subtle text-primary">
                <span className="material-symbols-outlined text-[14px]">eco</span>
                <span className="text-xs font-semibold">62.8% used</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 pt-2 grid grid-cols-2 gap-2.5 border-t border-aquatic-subtle/50">
          <div className="bg-surface-container-low p-2.5 rounded-xl flex items-center gap-2.5 border border-aquatic-subtle/70">
            <div className="w-8 h-8 rounded-lg bg-secondary-container border border-aquatic-subtle flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
            <div>
              <span className="text-xs text-on-surface-variant block font-medium">Per Person</span>
              <span className="text-base text-on-surface font-bold leading-tight tabular-nums">66 L</span>
              <span className="text-[10px] text-primary font-semibold block">Benchmark: 105 L</span>
            </div>
          </div>
          <div className="bg-surface-container-low p-2.5 rounded-xl flex items-center gap-2.5 border border-aquatic-subtle/70">
            <div className="w-8 h-8 rounded-lg bg-secondary-container border border-aquatic-subtle flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[18px]">trending_down</span>
            </div>
            <div>
              <span className="text-xs text-on-surface-variant block font-medium">Neighborhood</span>
              <span className="text-base text-primary font-bold leading-tight tabular-nums">+18%</span>
              <span className="text-[10px] text-primary font-semibold block">More efficient</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Grid (2x2) */}
      <section className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() =>
            onShowToast('Average Daily baseline is tracking 14% below neighborhood average.', 'calendar_month')
          }
          className="bg-surface-container-lowest rounded-2xl p-3.5 shadow-sm flex flex-col justify-between text-left border border-aquatic-subtle hover:border-primary transition cursor-pointer active:scale-[0.98]"
        >
          <div className="flex items-center justify-between text-on-surface-variant w-full">
            <span className="text-xs font-semibold">Average Daily</span>
            <span className="material-symbols-outlined text-[20px] text-primary">calendar_month</span>
          </div>
          <div className="mt-2">
            <div className="text-[22px] leading-tight text-on-surface font-bold tabular-nums">310 L</div>
            <p className="text-xs text-primary font-medium flex items-center gap-0.5 mt-0.5">
              <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
              <span>-14% this week</span>
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onShowToast('54 Liters conserved vs historical baseline today!', 'water_drop')}
          className="bg-surface-container-lowest rounded-2xl p-3.5 shadow-sm flex flex-col justify-between text-left border border-aquatic-subtle hover:border-primary transition cursor-pointer active:scale-[0.98]"
        >
          <div className="flex items-center justify-between text-on-surface-variant w-full">
            <span className="text-xs font-semibold">Water Saved</span>
            <span className="material-symbols-outlined text-[20px] text-primary">water_drop</span>
          </div>
          <div className="mt-2">
            <div className="text-[22px] leading-tight text-on-surface font-bold tabular-nums">54 L</div>
            <p className="text-xs text-on-surface-variant mt-0.5 font-medium">Above standard baseline</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('rewards')}
          className="bg-surface-container-lowest rounded-2xl p-3.5 shadow-sm flex flex-col justify-between text-left border border-aquatic-subtle hover:border-primary transition cursor-pointer active:scale-[0.98]"
        >
          <div className="flex items-center justify-between text-on-surface-variant w-full">
            <span className="text-xs font-semibold">Eco Points</span>
            <span className="material-symbols-outlined text-[20px] text-primary">workspace_premium</span>
          </div>
          <div className="mt-2">
            <div className="text-[22px] leading-tight text-on-surface font-bold tabular-nums">
              {ecoPoints.toLocaleString()}
            </div>
            <p className="text-xs text-primary font-semibold flex items-center gap-0.5 mt-0.5">
              <span className="material-symbols-outlined text-[14px]">add</span>
              <span>45 earned today</span>
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('alerts')}
          className="bg-surface-container-lowest rounded-2xl p-3.5 shadow-sm flex flex-col justify-between text-left border border-aquatic-subtle hover:border-primary transition cursor-pointer active:scale-[0.98]"
        >
          <div className="flex items-center justify-between text-on-surface-variant w-full">
            <span className="text-xs font-semibold">System Health</span>
            <span className="material-symbols-outlined text-[20px] text-primary">verified_user</span>
          </div>
          <div className="mt-2">
            <div className="text-[22px] leading-tight text-primary font-bold">Optimal</div>
            <p className="text-xs text-on-surface-variant mt-0.5 font-medium">0 detected leaks</p>
          </div>
        </button>
      </section>

      {/* Flow Pulse Histogram */}
      <section className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-aquatic-subtle">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="font-title-md text-base text-on-surface font-bold">Today&apos;s Flow Pulse</h2>
            <span className="text-xs text-on-surface-variant">
              Hourly aggregate · Morning peak detected
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('analytics')}
            className="text-xs px-2.5 py-1 rounded-full bg-secondary-container border border-aquatic-subtle text-primary font-semibold cursor-pointer active:scale-95 hover:bg-aquatic-tint transition"
          >
            24h Cycle
          </button>
        </div>

        <div className="pt-4 pb-1">
          <div className="h-28 flex items-end justify-between gap-1.5 px-1">
            {FLOW_PULSE_BARS.map((bar) => {
              let barClass = 'w-full bg-secondary-container/50 rounded-t-sm border border-aquatic-subtle/50';
              if (bar.type === 'mid') {
                barClass = 'w-full bg-sky-400 rounded-t-sm border border-sky-300 water-bar-pulse';
              } else if (bar.type === 'peak') {
                barClass = 'w-full bg-primary rounded-t-sm relative group border border-sky-600 water-bar-pulse';
              } else if (bar.type === 'soft') {
                barClass = 'w-full bg-secondary-container rounded-t-sm border border-aquatic-subtle water-bar-pulse';
              } else if (bar.type === 'active') {
                barClass = 'w-full bg-primary rounded-t-sm border border-sky-600 water-bar-pulse';
              } else if (bar.type === 'forecast') {
                barClass = 'w-full bg-slate-300 rounded-t-sm border border-slate-300';
              }

              return (
                <div
                  key={bar.label}
                  className={`flex-1 flex flex-col items-center gap-1.5 h-full justify-end ${
                    bar.type === 'forecast' ? 'opacity-45' : ''
                  }`}
                >
                  <div
                    className={barClass}
                    style={{
                      height: bar.height,
                      animationDelay: bar.delay,
                    }}
                  >
                    {'peakLabel' in bar && bar.peakLabel && (
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-warning-tint text-warning-amber border border-amber-300 text-[8px] font-bold whitespace-nowrap shadow-xs">
                        {bar.peakLabel}
                      </div>
                    )}
                  </div>
                  <span
                    className={`text-[10px] ${
                      bar.type === 'peak' || bar.type === 'active'
                        ? 'text-primary font-bold'
                        : 'text-on-surface-variant'
                    }`}
                  >
                    {bar.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-on-surface-variant pt-2 border-t border-aquatic-subtle/50">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-primary" />
            <span>Measured Flow</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-300" />
            <span>Forecast Projection</span>
          </div>
        </div>
      </section>

      {/* Utility Shortcuts */}
      <section className="space-y-1.5">
        <span className="text-xs uppercase tracking-wider text-on-surface-variant px-1 font-bold block">
          Utility Shortcuts
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            aria-label="Toggle Main Water Valve"
            onClick={onToggleValve}
            className="bg-surface-container-lowest active:scale-95 transition p-3 rounded-2xl shadow-sm flex flex-col items-center text-center gap-1 border border-aquatic-subtle cursor-pointer hover:bg-surface-container-low group"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors border ${
                valveOpen
                  ? 'bg-secondary-container border-aquatic-subtle text-primary'
                  : 'bg-hazard-tint border-red-300 text-hazard-alert'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">
                {valveOpen ? 'autorenew' : 'lock'}
              </span>
            </div>
            <span className="text-xs text-on-surface font-bold leading-tight mt-0.5">Main Valve</span>
            <span
              className={`text-[10px] font-bold ${
                valveOpen ? 'text-primary font-semibold' : 'text-hazard-alert'
              }`}
            >
              {valveOpen ? 'Open · Active' : 'Closed · Safety Shutoff'}
            </span>
          </button>

          <button
            type="button"
            aria-label="Report Water Alert or Leak"
            onClick={() => {
              onNavigate('alerts');
              onShowToast('Opening Leak Diagnostic Wizard...', 'build');
            }}
            className="bg-surface-container-lowest active:scale-95 transition p-3 rounded-2xl shadow-sm flex flex-col items-center text-center gap-1 border border-aquatic-subtle cursor-pointer hover:bg-surface-container-low group"
          >
            <div className="w-10 h-10 rounded-xl bg-hazard-tint border border-red-200 text-hazard-alert flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined text-[22px]">notification_important</span>
            </div>
            <span className="text-xs text-on-surface font-bold leading-tight mt-0.5">Report Alert</span>
            <span className="text-[10px] text-hazard-alert font-bold">Diagnostics</span>
          </button>

          <button
            type="button"
            aria-label="Go to Rainwater Harvesting"
            onClick={() => {
              onNavigate('rainwater');
              onShowToast('Harvest Cistern: +80 L filtered & stored.', 'cloud_sync');
            }}
            className="bg-surface-container-lowest active:scale-95 transition p-3 rounded-2xl shadow-sm flex flex-col items-center text-center gap-1 border border-aquatic-subtle cursor-pointer hover:bg-surface-container-low group"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary-container border border-aquatic-subtle text-primary flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined text-[22px]">cloud_sync</span>
            </div>
            <span className="text-xs text-on-surface font-bold leading-tight mt-0.5">Harvest Cistern</span>
            <span className="text-[10px] text-primary font-bold">+80 L Logged</span>
          </button>
        </div>
      </section>

      {/* Recent Activity Feed */}
      <section className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm space-y-3 border border-aquatic-subtle">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">history_toggle_off</span>
            <h2 className="font-title-md text-base text-on-surface font-bold">Activity Log</h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('analytics')}
            className="text-xs text-primary font-bold hover:underline cursor-pointer active:scale-95"
          >
            View All
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-surface-container-low border border-aquatic-subtle/80 hover:bg-secondary-container/40 transition">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-secondary-container border border-aquatic-subtle text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[19px]">shower</span>
              </div>
              <div>
                <h3 className="text-xs font-bold text-on-surface">Morning shower cycle</h3>
                <p className="text-[11px] text-on-surface-variant">Primary bathroom · 7:42 AM</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-sm font-extrabold text-on-surface tabular-nums">48 L</span>
              <span className="block text-[10px] text-on-surface-variant font-medium">7.2 min</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-surface-container-low border border-aquatic-subtle/80 hover:bg-secondary-container/40 transition">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-secondary-container border border-aquatic-subtle text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[19px]">yard</span>
              </div>
              <div>
                <h3 className="text-xs font-bold text-on-surface">Drip irrigation cycle</h3>
                <p className="text-[11px] text-on-surface-variant">North garden beds · 6:15 AM</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-sm font-extrabold text-on-surface tabular-nums">22 L</span>
              <span className="block text-[10px] text-primary font-bold">Eco-Scheduled</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-secondary-container/40 border border-aquatic-subtle hover:bg-secondary-container/70 transition">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-secondary-container border border-aquatic-subtle text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[19px]">water</span>
              </div>
              <div>
                <h3 className="text-xs font-bold text-on-secondary-container">Cistern replenished</h3>
                <p className="text-[11px] text-on-surface-variant">Rooftop rainfall capture · 03:10 AM</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-sm font-extrabold text-primary tabular-nums">+80 L</span>
              <span className="block text-[10px] text-primary font-bold">100% Free Rain</span>
            </div>
          </div>
        </div>
      </section>

      {/* Soil Moisture Card */}
      <section className="bg-secondary-container/30 p-3.5 rounded-2xl flex items-center justify-between gap-3 border border-aquatic-subtle">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary-container border border-aquatic-subtle text-primary flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[20px]">local_florist</span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface">Soil Moisture: 68%</p>
            <p className="text-[11px] text-on-surface-variant">
              Rain expected tomorrow. Delay garden sprinkler.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleToggleSoilHold}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs active:scale-95 transition cursor-pointer shrink-0 border ${
            soilHold
              ? 'bg-primary text-white border-primary'
              : 'bg-surface-container-lowest border-aquatic-subtle text-primary hover:bg-secondary-container'
          }`}
        >
          {soilHold ? 'Holding (24h)' : 'Hold'}
        </button>
      </section>
    </div>
  );
}

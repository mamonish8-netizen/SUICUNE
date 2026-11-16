import { useState } from 'react';
import { ASSETS, TabRoute, ToastHandler } from '../types';
import { ResilientImage } from './ResilientImage';

interface AnalyticsViewProps {
  onNavigate: (tab: TabRoute) => void;
  onShowToast: ToastHandler;
}

type PeriodKey = 'Day' | 'Week' | 'Month' | 'Year';

interface BarItem {
  val: string;
  lbl: string;
  height: string;
  isSpike: boolean;
  spikeRatio?: string;
}

interface PeriodData {
  label: string;
  total: string;
  variance: string;
  varianceUp: boolean;
  savedHighlight: string;
  savedSuffix: string;
  dailyVal: string;
  personVal: string;
  chartHeading: string;
  chartSub: string;
  baselineText: string;
  bars: BarItem[];
  alertTitle: string;
  alertVal: string;
}

const DATA_BY_PERIOD: Record<PeriodKey, PeriodData> = {
  Day: {
    label: 'Total Daily Consumption',
    total: '285',
    variance: '-4.2%',
    varianceUp: false,
    savedHighlight: '12 L',
    savedSuffix: 'compared to yesterday',
    dailyVal: '285',
    personVal: '71.2',
    chartHeading: "Today's Hourly Trend",
    chartSub: 'Hourly volume with 20 L/hr baseline marker',
    baselineText: 'Baseline 20L/h',
    bars: [
      { val: '12L', lbl: '00-04', height: '30%', isSpike: false },
      { val: '48L', lbl: '04-08', height: '80%', isSpike: false },
      { val: '62L', lbl: '08-12', height: '95%', isSpike: true, spikeRatio: '25%' },
      { val: '38L', lbl: '12-16', height: '60%', isSpike: false },
      { val: '55L', lbl: '16-20', height: '88%', isSpike: false },
      { val: '42L', lbl: '20-22', height: '68%', isSpike: false },
      { val: '28L', lbl: '22-24', height: '45%', isSpike: false },
    ],
    alertTitle: 'Morning Peak Alert (9:30 AM)',
    alertVal: '+18 L over hourly baseline',
  },
  Week: {
    label: 'Total Weekly Consumption',
    total: '2,180',
    variance: '-12.4%',
    varianceUp: false,
    savedHighlight: '310 L',
    savedSuffix: 'compared to previous week',
    dailyVal: '311',
    personVal: '77.8',
    chartHeading: 'Weekly Trend',
    chartSub: 'Daily volume with 420 L baseline marker',
    baselineText: 'Baseline 420L',
    bars: [
      { val: '290L', lbl: 'M', height: '58%', isSpike: false },
      { val: '310L', lbl: 'T', height: '62%', isSpike: false },
      { val: '275L', lbl: 'W', height: '55%', isSpike: false },
      { val: '330L', lbl: 'T', height: '66%', isSpike: false },
      { val: '305L', lbl: 'F', height: '61%', isSpike: false },
      { val: '505L', lbl: 'S', height: '96%', isSpike: true, spikeRatio: '25%' },
      { val: '165L', lbl: 'S', height: '35%', isSpike: false },
    ],
    alertTitle: 'Saturday Laundry Spike Alert',
    alertVal: '+85 L over baseline',
  },
  Month: {
    label: 'Total Monthly Consumption',
    total: '9,240',
    variance: '-8.6%',
    varianceUp: false,
    savedHighlight: '870 L',
    savedSuffix: 'compared to last month',
    dailyVal: '308',
    personVal: '77.0',
    chartHeading: 'Monthly Trend (4 Weeks)',
    chartSub: 'Weekly totals with 2,500 L target baseline',
    baselineText: 'Baseline 2,500L',
    bars: [
      { val: '2.3kL', lbl: 'W1', height: '68%', isSpike: false },
      { val: '2.4kL', lbl: 'W2', height: '72%', isSpike: false },
      { val: '2.8kL', lbl: 'W3', height: '88%', isSpike: true, spikeRatio: '20%' },
      { val: '2.1kL', lbl: 'W4', height: '64%', isSpike: false },
      { val: '1.9kL', lbl: 'W5*', height: '55%', isSpike: false },
      { val: '--', lbl: 'Avg', height: '70%', isSpike: false },
      { val: 'Max', lbl: 'Peak', height: '88%', isSpike: true, spikeRatio: '20%' },
    ],
    alertTitle: 'Week 3 Lawn Irrigation Excess',
    alertVal: '+300 L over weekly target',
  },
  Year: {
    label: 'Total Annual Consumption',
    total: '112,400',
    variance: '+2.1%',
    varianceUp: true,
    savedHighlight: '2,300 L higher',
    savedSuffix: 'due to summer heat wave',
    dailyVal: '307',
    personVal: '76.9',
    chartHeading: 'Annual Trend (Bi-Monthly)',
    chartSub: 'Bimonthly totals with 20k L optimal tier',
    baselineText: 'Target 19kL',
    bars: [
      { val: '17kL', lbl: 'J-F', height: '60%', isSpike: false },
      { val: '18kL', lbl: 'M-A', height: '65%', isSpike: false },
      { val: '24kL', lbl: 'M-J', height: '92%', isSpike: true, spikeRatio: '30%' },
      { val: '22kL', lbl: 'J-A', height: '82%', isSpike: false },
      { val: '16kL', lbl: 'S-O', height: '58%', isSpike: false },
      { val: '15kL', lbl: 'N-D', height: '52%', isSpike: false },
      { val: 'Avg', lbl: 'Tier', height: '68%', isSpike: false },
    ],
    alertTitle: 'Summer Thermal Spike Alert',
    alertVal: '+4,000 L seasonal surge',
  },
};

export function AnalyticsView({ onNavigate, onShowToast }: AnalyticsViewProps) {
  const [period, setPeriod] = useState<PeriodKey>('Week');
  const [ecoModalOpen, setEcoModalOpen] = useState(false);
  const [cisternModalOpen, setCisternModalOpen] = useState(false);
  const [staggerWash, setStaggerWash] = useState(true);
  const [peakAlert, setPeakAlert] = useState(true);

  const d = DATA_BY_PERIOD[period];

  return (
    <div className="px-4 py-5 space-y-6">
      {/* Section 1: Time Period Selector */}
      <section>
        <div className="flex h-11 items-center justify-center rounded-xl bg-surface-container-low p-1 shadow-inner border border-outline-variant/60">
          {(['Day', 'Week', 'Month', 'Year'] as PeriodKey[]).map((p) => {
            const active = period === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`flex-1 h-full flex items-center justify-center rounded-lg px-2 text-xs transition-all duration-200 active:scale-95 cursor-pointer ${
                  active
                    ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                    : 'text-on-surface-variant font-medium hover:text-primary'
                }`}
              >
                <span>{p}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Section 2: Key Comparison Overview Card */}
      <section className="rounded-2xl bg-surface-container-lowest border border-outline-variant/60 p-5 shadow-sm relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-36 h-36 rounded-full bg-secondary-container/60 blur-2xl pointer-events-none" />
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
              {d.label}
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold text-on-surface tabular-nums">{d.total}</span>
              <span className="text-lg font-semibold text-primary">Litres</span>
            </div>
          </div>
          <div
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full font-bold text-xs border ${
              d.varianceUp
                ? 'bg-warning-tint text-warning-amber border-warning-amber/40'
                : 'bg-secondary-container text-primary border-outline-variant'
            }`}
          >
            <span className="material-symbols-outlined text-sm font-bold">
              {d.varianceUp ? 'trending_up' : 'trending_down'}
            </span>
            <span className="tabular-nums">{d.variance}</span>
          </div>
        </div>

        <p className="text-xs text-on-surface-variant mb-4">
          {d.varianceUp ? (
            <>
              <span className="text-warning-amber font-semibold">{d.savedHighlight}</span> {d.savedSuffix}
            </>
          ) : (
            <>
              Saved <span className="font-semibold text-primary">{d.savedHighlight}</span> {d.savedSuffix}
            </>
          )}
        </p>

        <div className="border-t border-outline-variant/50 my-4" />

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/50">
            <div className="flex items-center gap-1.5 text-on-surface-variant mb-1">
              <span className="material-symbols-outlined text-base text-primary">water_drop</span>
              <span className="text-xs">Daily Average</span>
            </div>
            <div className="text-lg font-bold text-on-surface tabular-nums">
              {d.dailyVal} <span className="text-xs font-normal text-on-surface-variant">L/day</span>
            </div>
            <div className="text-[11px] text-primary mt-1 flex items-center gap-1 font-medium">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
              Target Baseline: 420 L
            </div>
          </div>

          <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/50">
            <div className="flex items-center gap-1.5 text-on-surface-variant mb-1">
              <span className="material-symbols-outlined text-base text-primary">group</span>
              <span className="text-xs">Per-Person</span>
            </div>
            <div className="text-lg font-bold text-on-surface tabular-nums">
              {d.personVal} <span className="text-xs font-normal text-on-surface-variant">L/day</span>
            </div>
            <div className="text-[11px] text-primary mt-1 flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-xs text-primary">check_circle</span>
              Within optimal tier
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Interactive Consumption Trend Chart */}
      <section className="rounded-2xl bg-surface-container-lowest border border-outline-variant/60 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-on-surface">{d.chartHeading}</h2>
            <p className="text-xs text-on-surface-variant">{d.chartSub}</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-primary" />
              <span className="text-on-surface-variant font-medium">Optimal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-warning-amber" />
              <span className="text-on-surface-variant font-medium">Spike</span>
            </div>
          </div>
        </div>

        <div className="w-full relative pt-2">
          <div className="absolute top-[28%] left-0 right-0 flex items-center z-10 pointer-events-none">
            <div className="w-full border-t border-dashed border-primary/50" />
            <span className="bg-secondary-container text-primary text-[10px] font-bold px-1.5 py-0.5 rounded border border-outline-variant ml-1 whitespace-nowrap">
              {d.baselineText}
            </span>
          </div>

          <div className="h-44 w-full flex items-end justify-between gap-2 pt-6 pb-2 px-1">
            {d.bars.map((bar, idx) => (
              <div
                key={`${period}-${idx}`}
                onClick={() => onShowToast(`${bar.lbl}: ${bar.val} recorded`, 'bar_chart')}
                className={`flex flex-col items-center flex-1 h-full justify-end group cursor-pointer ${
                  bar.isSpike ? 'relative' : ''
                }`}
              >
                <span
                  className={`text-[10px] mb-1 tabular-nums ${
                    bar.isSpike
                      ? 'font-bold text-warning-amber'
                      : 'text-on-surface-variant group-hover:text-primary font-medium'
                  }`}
                >
                  {bar.val}
                </span>
                <div
                  className={`w-full bg-surface-container-low rounded-t-md h-full flex items-end overflow-hidden max-w-[28px] ${
                    bar.isSpike ? 'ring-2 ring-warning-amber/50 ring-offset-1' : ''
                  }`}
                >
                  {bar.isSpike ? (
                    <div
                      className="w-full flex flex-col justify-end bar-transition"
                      style={{ height: bar.height }}
                    >
                      <div
                        className="w-full bg-warning-amber rounded-t-md"
                        style={{ height: bar.spikeRatio || '25%' }}
                      />
                      <div
                        className="w-full bg-primary"
                        style={{ height: `calc(100% - ${bar.spikeRatio || '25%'})` }}
                      />
                    </div>
                  ) : (
                    <div
                      className="w-full bg-primary rounded-t-md group-hover:opacity-90 bar-transition"
                      style={{ height: bar.height }}
                    />
                  )}
                </div>
                <span
                  className={`text-xs mt-2 ${
                    bar.isSpike ? 'text-warning-amber font-bold' : 'text-on-surface font-medium'
                  }`}
                >
                  {bar.lbl}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 p-2.5 rounded-lg bg-surface-container-low flex items-center justify-between text-xs text-on-surface-variant border border-outline-variant/50">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-warning-amber" />
            <span className="font-medium">{d.alertTitle}</span>
          </div>
          <span className="font-bold text-warning-amber">{d.alertVal}</span>
        </div>
      </section>

      {/* Section 4: AI Conservation Insight */}
      <section className="rounded-2xl bg-aquatic-tint border border-outline-variant p-4 shadow-sm relative overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-xl">lightbulb</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-primary">AI Conservation Insight</h3>
              <span className="text-[10px] bg-primary text-on-primary px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider">
                Active
              </span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Saturday laundry runs caused an{' '}
              <strong className="text-warning-amber font-semibold">85 L spike</strong>. Running full
              eco-loads can save up to <strong className="text-on-surface font-semibold">25 L per cycle</strong>.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setEcoModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline active:scale-95 transition-transform cursor-pointer"
              >
                <span>Configure Eco Schedule</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Time-of-Day Consumption Breakdown */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-on-surface">Time-of-Day Dynamics</h2>
            <p className="text-xs text-on-surface-variant">Diurnal usage distribution pattern</p>
          </div>
          <span className="text-xs font-semibold text-primary bg-secondary-container px-2.5 py-1 rounded-full border border-outline-variant">
            24h Cycle
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {[
            {
              title: 'Morning',
              sub: '6:00 AM – 12:00 PM • Showers, cooking',
              vol: '840 L',
              pct: '38%',
              icon: 'wb_twilight',
              iconColor: 'text-primary',
              barColor: 'bg-primary',
              pctColor: 'text-primary',
            },
            {
              title: 'Afternoon',
              sub: '12:00 PM – 5:00 PM • Dishwasher, general',
              vol: '320 L',
              pct: '15%',
              icon: 'light_mode',
              iconColor: 'text-sky-400',
              barColor: 'bg-sky-400',
              pctColor: 'text-sky-500',
            },
            {
              title: 'Evening',
              sub: '5:00 PM – 10:00 PM • Cooking, laundry, garden',
              vol: '880 L',
              pct: '40%',
              icon: 'wb_twilight',
              iconColor: 'text-ocean-mid',
              barColor: 'bg-ocean-mid',
              pctColor: 'text-ocean-mid',
            },
            {
              title: 'Night',
              sub: '10:00 PM – 6:00 AM • Normal baseline / standby',
              vol: '140 L',
              pct: '7%',
              icon: 'bedtime',
              iconColor: 'text-slate-400',
              barColor: 'bg-slate-400',
              pctColor: 'text-slate-400',
            },
          ].map((slot) => (
            <div
              key={slot.title}
              onClick={() => onShowToast(`${slot.title} consumption: ${slot.vol} (${slot.pct})`, slot.icon)}
              className="bg-surface-container-lowest rounded-xl p-3.5 border border-outline-variant/60 hover:border-primary/50 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center ${slot.iconColor}`}
                  >
                    <span className="material-symbols-outlined text-lg">{slot.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-on-surface">{slot.title}</h4>
                    <span className="text-[11px] text-on-surface-variant">{slot.sub}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-on-surface tabular-nums">{slot.vol}</span>
                  <span className={`block text-xs font-semibold tabular-nums ${slot.pctColor}`}>
                    {slot.pct}
                  </span>
                </div>
              </div>
              <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
                <div className={`${slot.barColor} h-full rounded-full`} style={{ width: slot.pct }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 6: Fixture-level Water Distribution */}
      <section className="rounded-2xl bg-surface-container-lowest border border-outline-variant/60 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-on-surface">Fixture-Level Breakdown</h2>
            <p className="text-xs text-on-surface-variant">Monitored endpoint consumption</p>
          </div>
          <span className="text-xs text-primary font-semibold px-2 py-0.5 rounded-full bg-secondary-container">
            4 Zones
          </span>
        </div>

        <div className="h-3.5 w-full bg-surface-container-low rounded-full overflow-hidden flex gap-0.5 p-0.5 border border-outline-variant/60">
          <div className="bg-[#0284c7] h-full rounded-l-full" style={{ width: '42%' }} title="Bathroom: 42%" />
          <div className="bg-[#38bdf8] h-full" style={{ width: '24%' }} title="Kitchen: 24%" />
          <div className="bg-[#7dd3fc] h-full" style={{ width: '18%' }} title="Laundry: 18%" />
          <div className="bg-[#bae6fd] h-full rounded-r-full" style={{ width: '16%' }} title="Garden: 16%" />
        </div>

        <div className="space-y-3 pt-1">
          {[
            { color: 'bg-[#0284c7]', name: 'Bathroom & Showers', vol: '915 L', pct: '42%' },
            { color: 'bg-[#38bdf8]', name: 'Kitchen & Drinking', vol: '523 L', pct: '24%' },
            { color: 'bg-[#7dd3fc]', name: 'Laundry & Cleaning', vol: '392 L', pct: '18%' },
            {
              color: 'bg-[#bae6fd]',
              name: 'Garden & Outdoor',
              sub: 'partially offset by rainwater',
              vol: '350 L',
              pct: '16%',
            },
          ].map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className={`w-3 h-3 rounded-full ${item.color} shrink-0`} />
                <div>
                  <span className="text-on-surface font-medium">{item.name}</span>
                  {item.sub && (
                    <span className="block text-[11px] text-primary italic">{item.sub}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 tabular-nums">
                <span className="text-on-surface-variant">{item.vol}</span>
                <span className="font-bold text-on-surface w-10 text-right">{item.pct}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 7: Rainwater Harvesting Summary Widget */}
      <button
        type="button"
        onClick={() => setCisternModalOpen(true)}
        className="w-full text-left rounded-2xl bg-surface-container-low border border-outline-variant/60 p-4 flex items-center gap-4 shadow-sm hover:border-primary/50 transition-all cursor-pointer group active:scale-[0.98]"
      >
        <div className="w-14 h-14 rounded-xl bg-surface-container-lowest shrink-0 overflow-hidden relative border border-outline-variant">
          <ResilientImage
            src={ASSETS.rainwaterPlant}
            alt="Rainwater harvesting cistern and indoor botanical plant"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            fallbackIcon="water_drop"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">
                Rainwater Harvesting Active
              </h4>
              <span className="text-[10px] font-bold text-primary bg-secondary-container px-1.5 py-0.5 rounded">
                84%
              </span>
            </div>
            <span className="material-symbols-outlined text-primary text-base group-hover:translate-x-0.5 transition-transform">
              chevron_right
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Cistern is currently at 84% capacity. Estimated 190 L available for upcoming garden cycles.
          </p>
        </div>
      </button>

      {/* Eco Schedule Modal */}
      {ecoModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-ocean-deep/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEcoModalOpen(false);
          }}
        >
          <div className="bg-surface rounded-t-2xl sm:rounded-2xl max-w-md w-full p-5 border-t sm:border border-outline-variant/60 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/40">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-secondary-container text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">nest_eco_leaf</span>
                </div>
                <h3 className="text-base font-bold text-on-surface">Configure Eco Schedule</h3>
              </div>
              <button
                type="button"
                onClick={() => setEcoModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Automatically stagger laundry cycles during off-peak hours and utilize harvested cistern
              reserves to eliminate usage spikes.
            </p>
            <div className="space-y-2.5 pt-1">
              <label className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/60 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-primary text-xl">
                    local_laundry_service
                  </span>
                  <div>
                    <div className="text-xs font-semibold text-on-surface">Smart Eco-Wash Staggering</div>
                    <div className="text-[11px] text-on-surface-variant">
                      Limit to 2 full loads per weekend morning
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={staggerWash}
                  onChange={(e) => setStaggerWash(e.target.checked)}
                  className="w-4 h-4 text-primary accent-primary rounded border-outline-variant"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/60 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-primary text-xl">
                    notifications_active
                  </span>
                  <div>
                    <div className="text-xs font-semibold text-on-surface">Peak Consumption Alert</div>
                    <div className="text-[11px] text-on-surface-variant">
                      Alert phone when approaching 350 L daily
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={peakAlert}
                  onChange={(e) => setPeakAlert(e.target.checked)}
                  className="w-4 h-4 text-primary accent-primary rounded border-outline-variant"
                />
              </label>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEcoModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-outline-variant text-xs font-semibold text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={() => {
                  setEcoModalOpen(false);
                  onShowToast('Eco Schedule applied to Saturday cycle!', 'check_circle');
                }}
                className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-ocean-mid transition-colors shadow-sm cursor-pointer"
              >
                Apply Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rainwater Cistern Modal */}
      {cisternModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-ocean-deep/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) setCisternModalOpen(false);
          }}
        >
          <div className="bg-surface rounded-t-2xl sm:rounded-2xl max-w-md w-full p-5 border-t sm:border border-outline-variant/60 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/40">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-secondary-container text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">water_drop</span>
                </div>
                <h3 className="text-base font-bold text-on-surface">Rainwater Cistern Status</h3>
              </div>
              <button
                type="button"
                onClick={() => setCisternModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="bg-aquatic-tint rounded-xl p-4 border border-outline-variant text-center space-y-2">
              <div className="text-2xl font-bold text-primary">84% Capacity</div>
              <div className="text-xs text-on-surface-variant">
                Current reserve: <strong>1,260 Litres</strong> of 1,500 L total
              </div>
              <div className="w-full bg-surface-container-lowest h-3 rounded-full overflow-hidden p-0.5 border border-outline-variant">
                <div className="bg-primary h-full rounded-full" style={{ width: '84%' }} />
              </div>
            </div>

            <div className="text-xs text-on-surface-variant space-y-2">
              <div className="flex justify-between py-1 border-b border-outline-variant/40">
                <span>Target Garden Offsets:</span>
                <span className="font-semibold text-on-surface">190 L / cycle</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/40">
                <span>Inflow Filtration Purity:</span>
                <span className="font-semibold text-primary">99.2% Optimal</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Next Forecast Precipitation:</span>
                <span className="font-semibold text-on-surface">Tomorrow 4:00 PM (+220 L)</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setCisternModalOpen(false);
                  onNavigate('rainwater');
                }}
                className="flex-1 py-2.5 rounded-xl border border-outline-variant bg-secondary-container text-primary text-xs font-semibold hover:bg-aquatic-subtle/60 transition-colors cursor-pointer"
              >
                Open Tracker
              </button>
              <button
                type="button"
                onClick={() => setCisternModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-ocean-mid transition-colors shadow-sm cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

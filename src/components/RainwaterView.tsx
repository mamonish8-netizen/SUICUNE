import { useState } from 'react';
import { ToastHandler } from '../types';

interface RainwaterViewProps {
  onShowToast: ToastHandler;
}

export function RainwaterView({ onShowToast }: RainwaterViewProps) {
  const [flushState, setFlushState] = useState<'idle' | 'flushing' | 'done'>('idle');
  const [tankPct, setTankPct] = useState(74);
  const [tankVolume, setTankVolume] = useState(1850);
  const [adviceApplied, setAdviceApplied] = useState(false);
  const [telemetryModalOpen, setTelemetryModalOpen] = useState(false);

  const handleFlushDiverter = () => {
    if (flushState !== 'idle') return;
    setFlushState('flushing');

    setTimeout(() => {
      setFlushState('done');
      setTankPct(76);
      setTankVolume(1900);
      onShowToast('First-flush chamber successfully purged & calibrated.', 'check_circle');

      setTimeout(() => {
        setFlushState('idle');
      }, 3000);
    }, 1600);
  };

  const handleToggleAdvice = () => {
    const next = !adviceApplied;
    setAdviceApplied(next);
    if (next) {
      onShowToast('Applied · Pre-irrigation set for Wednesday evening', 'verified');
    } else {
      onShowToast('Predictive action scheduling cleared', 'info');
    }
  };

  const bufferRemaining = 2500 - tankVolume;

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Non-Potable Segregation Notice Card */}
      <section className="rounded-xl p-3.5 bg-[#eff4ff] border border-[#bae6fd] shadow-xs relative overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#e0f2fe] text-[#0284c7] border border-[#bae6fd] flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[22px]">verified_user</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-label-sm font-bold text-[#0284c7] tracking-wider uppercase text-[11px]">
                Dedicated Secondary Line
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e0f2fe] text-[#0284c7] border border-[#bae6fd]">
                Segregated
              </span>
            </div>
            <h2 className="text-title-md text-[#0b1c30] font-bold mt-0.5">
              Harvested Rainwater (Non-Potable)
            </h2>
            <p className="text-body-sm text-text-secondary mt-1 leading-relaxed text-xs">
              Reserved for garden landscaping, toilet flushing, and subterranean recharge. Cleanly
              isolated from municipal drinking supply and sewer lines via backflow air gaps.
            </p>
          </div>
        </div>
      </section>

      {/* Rainwater System Overview Card */}
      <section className="bg-surface-container-lowest rounded-xl border border-[#bae6fd] p-4 shadow-sm relative">
        <div className="flex items-center justify-between pb-3 border-b border-[#eff4ff]">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#0284c7] animate-pulse" />
            <span className="text-label-md font-bold text-[#0284c7] uppercase tracking-wider text-[12px]">
              Collecting · Filtration Active
            </span>
          </div>
          <span className="text-label-sm text-[#0284c7] bg-[#e0f2fe] border border-[#bae6fd] px-2 py-0.5 rounded-md font-semibold text-[11px]">
            Sensor calibrated
          </span>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
          {/* Cistern Cutaway Graphic */}
          <div className="relative w-36 h-48 bg-[#eff4ff] rounded-xl border-2 border-[#bae6fd] flex flex-col justify-end p-1.5 overflow-hidden shrink-0 shadow-inner">
            <div className="absolute inset-y-2 left-2 flex flex-col justify-between text-[9px] font-bold text-[#0369a1] pointer-events-none z-10 select-none opacity-80">
              {['2,500L', '2,000L', '1,500L', '1,000L', '500L'].map((tick) => (
                <span
                  key={tick}
                  className="bg-white/80 px-1 py-0.5 rounded border border-[#bae6fd]/40"
                >
                  {tick}
                </span>
              ))}
            </div>

            <div className="absolute top-2 right-2 flex items-center gap-0.5 text-[#0284c7] text-[10px] font-bold z-10 bg-white/90 px-1.5 py-0.5 rounded border border-[#bae6fd]">
              <span className="material-symbols-outlined text-[13px] animate-bounce">
                arrow_downward
              </span>
              <span>Inflow</span>
            </div>

            <div
              className="w-full bg-[#0369a1] rounded-lg relative overflow-hidden transition-all duration-700 shadow-sm water-container-float"
              style={{ height: `${tankPct}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#0284c7] via-[#0369a1] to-[#38bdf8] opacity-95" />
              <div className="absolute -top-3 left-0 w-[200%] h-6 bg-[#7dd3fc]/40 rounded-full water-surface-wave" />
              <div className="absolute top-0 inset-x-0 h-1 bg-white/80 shadow-xs" />
              <div
                className="absolute bottom-2 left-1/4 w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce"
                style={{ animationDuration: '2.2s' }}
              />
              <div
                className="absolute bottom-6 right-1/3 w-2 h-2 rounded-full bg-white/50 animate-bounce"
                style={{ animationDuration: '3.1s' }}
              />
            </div>

            <div className="absolute inset-x-0 bottom-3 text-center z-10 pointer-events-none">
              <span className="text-lg font-extrabold text-white drop-shadow-md font-headline-md tabular-nums">
                {tankPct}%
              </span>
              <p className="text-[10px] text-white/95 font-semibold leading-none drop-shadow-xs tabular-nums">
                {tankVolume.toLocaleString()} L
              </p>
            </div>
          </div>

          {/* Tank Status Detail */}
          <div className="flex-1 w-full space-y-3">
            <div>
              <p className="text-[11px] text-text-secondary uppercase font-bold tracking-wider">
                Primary Cistern
              </p>
              <h3 className="text-[22px] text-[#0b1c30] font-headline-md font-bold tabular-nums">
                {tankVolume.toLocaleString()}{' '}
                <span className="text-base font-normal text-text-secondary">/ 2,500 L</span>
              </h3>
              <p className="text-body-sm text-xs text-text-secondary mt-0.5">
                {bufferRemaining} Litres buffer remaining before rooftop overflow redirection
                engages.
              </p>
            </div>

            <div className="space-y-1">
              <div className="h-2.5 w-full bg-[#e0f2fe] rounded-full overflow-hidden border border-[#bae6fd]/50">
                <div
                  className="h-full bg-[#0284c7] rounded-full transition-all duration-500"
                  style={{ width: `${tankPct}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-semibold text-text-secondary">
                <span>0 L</span>
                <span className="font-bold text-[#0284c7] tabular-nums">{tankPct}% Capacity</span>
                <span>2,500 L</span>
              </div>
            </div>

            <div className="pt-1 flex gap-2">
              <button
                type="button"
                disabled={flushState === 'flushing'}
                onClick={handleFlushDiverter}
                className={`flex-1 py-2.5 px-3 rounded-lg active:scale-[0.98] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer ${
                  flushState === 'flushing'
                    ? 'bg-[#0284c7] opacity-85'
                    : flushState === 'done'
                      ? 'bg-[#0369a1]'
                      : 'bg-[#0284c7] hover:bg-[#0369a1]'
                }`}
              >
                {flushState === 'flushing' ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                    <span>Flushing Debris Chamber...</span>
                  </>
                ) : flushState === 'done' ? (
                  <>
                    <span className="material-symbols-outlined text-[18px]">done_all</span>
                    <span>Clean &amp; Ready</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">tune</span>
                    <span>Flush Diverter</span>
                  </>
                )}
              </button>

              <button
                type="button"
                title="View Telemetry History"
                onClick={() => setTelemetryModalOpen(true)}
                className="py-2.5 px-3 rounded-lg bg-[#e0f2fe] hover:bg-[#bae6fd] text-[#0284c7] border border-[#bae6fd] text-xs font-semibold transition-colors flex items-center justify-center active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">history</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics Grid */}
      <section className="space-y-2.5">
        <h3 className="text-title-md text-base text-[#0b1c30] font-bold flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#0284c7] text-[20px]">grid_view</span>
          <span>Hydrologic Harvest Metrics</span>
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-surface-container-lowest rounded-xl p-3 border border-[#bae6fd] hover:border-[#0284c7] transition-colors shadow-xs">
            <div className="flex items-center justify-between text-text-secondary mb-1">
              <span className="text-label-sm font-semibold text-[11px] uppercase tracking-wider">
                Catchment Roof
              </span>
              <span className="material-symbols-outlined text-[#0284c7] text-[18px]">roofing</span>
            </div>
            <div className="text-lg font-headline-md font-bold text-[#0b1c30] tabular-nums">
              120 m²
            </div>
            <p className="text-[11px] text-text-secondary mt-0.5">Precision coated ceramic</p>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-3 border border-[#bae6fd] hover:border-[#0284c7] transition-colors shadow-xs">
            <div className="flex items-center justify-between text-text-secondary mb-1">
              <span className="text-label-sm font-semibold text-[11px] uppercase tracking-wider">
                Rainfall Depth
              </span>
              <span className="material-symbols-outlined text-[#0284c7] text-[18px]">rainy</span>
            </div>
            <div className="text-lg font-headline-md font-bold text-[#0284c7] tabular-nums">
              34 mm
            </div>
            <p className="text-[11px] text-[#0369a1] font-semibold mt-0.5">Past 48 Hours logged</p>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-3 border border-[#bae6fd] hover:border-[#0284c7] transition-colors shadow-xs">
            <div className="flex items-center justify-between text-text-secondary mb-1">
              <span className="text-label-sm font-semibold text-[11px] uppercase tracking-wider">
                Harvested Inflow
              </span>
              <span className="material-symbols-outlined text-[#0284c7] text-[18px]">
                water_loss
              </span>
            </div>
            <div className="text-lg font-headline-md font-bold text-[#0284c7] tabular-nums">
              +1,420 L
            </div>
            <p className="text-[11px] text-text-secondary mt-0.5">Added to storage today</p>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-3 border border-[#bae6fd] hover:border-[#0284c7] transition-colors shadow-xs">
            <div className="flex items-center justify-between text-text-secondary mb-1">
              <span className="text-label-sm font-semibold text-[11px] uppercase tracking-wider">
                Percolation Recharge
              </span>
              <span className="material-symbols-outlined text-[#0369a1] text-[18px]">waves</span>
            </div>
            <div className="text-lg font-headline-md font-bold text-[#0369a1] tabular-nums">
              850 L
            </div>
            <p className="text-[11px] text-text-secondary mt-0.5">Direct to percolation pit</p>
          </div>
        </div>
      </section>

      {/* Filtration & Sensor Health Status */}
      <section className="bg-surface-container-lowest rounded-xl border border-[#bae6fd] p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-title-md text-base text-[#0b1c30] font-bold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#0284c7] text-[20px]">
              health_and_safety
            </span>
            <span>Filtration &amp; Sensor Health</span>
          </h3>
          <span className="text-[11px] font-bold text-[#0284c7] px-2.5 py-0.5 rounded-full bg-[#e0f2fe] border border-[#bae6fd]">
            3/3 Optimal
          </span>
        </div>

        <div className="divide-y divide-[#eff4ff]">
          <div className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#e0f2fe] text-[#0284c7] border border-[#bae6fd] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0b1c30]">First-Flush Diverter</h4>
                <p className="text-body-sm text-text-secondary text-[12px]">
                  {flushState === 'flushing'
                    ? 'Sluice valve open · Discharging sediment slurry...'
                    : 'Debris chamber evacuated automatically'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span
                className={`inline-flex items-center text-label-sm font-bold px-2 py-0.5 rounded text-[11px] border ${
                  flushState === 'flushing'
                    ? 'text-[#0369a1] bg-[#e0f2fe] border-[#0284c7] animate-pulse'
                    : 'text-[#0284c7] bg-[#e0f2fe] border-[#bae6fd]'
                }`}
              >
                {flushState === 'flushing' ? 'Purging Chamber' : 'Clean / Ready'}
              </span>
            </div>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#eff4ff] text-[#0284c7] border border-[#bae6fd]/60 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">filter_alt</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0b1c30]">Dual Sediment Filter</h4>
                <p className="text-body-sm text-text-secondary text-[12px]">
                  Replaced 18 days ago · Differential 0.1 bar
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-[#0b1c30] block tabular-nums">82%</span>
              <span className="text-[10px] text-text-secondary font-medium">life left</span>
            </div>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#eff4ff] text-[#0369a1] border border-[#bae6fd]/60 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">bolt</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0b1c30]">Clarifier Circulation Pump</h4>
                <p className="text-body-sm text-text-secondary text-[12px]">
                  Low power mode · Micro-bubble aerator
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center text-label-sm font-bold text-[#0369a1] bg-[#e0f2fe] border border-[#bae6fd] px-2 py-0.5 rounded text-[11px] tabular-nums">
                0.4 kWh used
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Rain & Harvesting Forecast with Action Card */}
      <section className="bg-gradient-to-br from-[#e0f2fe] to-[#eff4ff] rounded-xl p-4 border border-[#bae6fd] shadow-xs space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#0284c7] text-white shadow-xs">
              <span className="material-symbols-outlined text-[20px]">thunderstorm</span>
            </div>
            <div>
              <span className="text-label-sm font-bold uppercase tracking-wider text-[#0284c7] text-[11px]">
                Precipitation Radar AI
              </span>
              <h3 className="text-base text-[#0b1c30] font-bold">Upcoming Inflow Alert</h3>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#0284c7] text-white">
            Thursday
          </span>
        </div>

        <p className="text-body-md text-text-secondary leading-relaxed text-[13px]">
          Forecast: <strong className="text-[#0b1c30]">18mm rain</strong> expected Thursday
          afternoon. Estimated harvest potential:{' '}
          <strong className="text-[#0284c7]">~750 Litres</strong>. With current levels, cistern will
          reach <strong className="text-[#0369a1]">98% capacity</strong>.
        </p>

        <div className="p-3 bg-white rounded-lg border border-[#bae6fd] flex items-start gap-2.5 shadow-xs">
          <span className="material-symbols-outlined text-[#0284c7] text-[20px] shrink-0 mt-0.5">
            tips_and_updates
          </span>
          <div className="flex-1">
            <p className="text-xs font-bold text-[#0b1c30]">AquaGuard Predictive Advice</p>
            <p className="text-body-sm text-text-secondary mt-0.5 text-[12px]">
              Pre-irrigate garden on Wednesday evening to optimize storage room and prevent catchment
              diversion to overflow lines.
            </p>
          </div>
          <button
            type="button"
            onClick={handleToggleAdvice}
            className={`shrink-0 self-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer flex items-center gap-1 ${
              adviceApplied
                ? 'bg-[#e0f2fe] text-[#0284c7] border border-[#0284c7]'
                : 'bg-[#0284c7] text-white hover:bg-[#0369a1]'
            }`}
          >
            {adviceApplied ? (
              <>
                <span className="material-symbols-outlined text-[16px] text-[#0284c7]">check</span>
                <span>Applied</span>
              </>
            ) : (
              <span>Apply</span>
            )}
          </button>
        </div>
      </section>

      {/* Cumulative Environmental Contribution */}
      <section className="bg-surface-container-lowest rounded-xl border border-[#bae6fd] p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-base text-[#0b1c30] font-bold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#0284c7] text-[20px]">public</span>
            <span>2024 Cumulative Impact</span>
          </h3>
          <span className="text-label-sm text-[#0369a1] bg-[#e0f2fe] border border-[#bae6fd] px-2 py-0.5 rounded text-[11px] font-semibold">
            Eco-Offset Verified
          </span>
        </div>

        <div className="bg-[#e0f2fe] rounded-xl p-3.5 flex items-center justify-between border border-[#bae6fd]">
          <div>
            <span className="text-label-sm text-[#0369a1] font-semibold uppercase tracking-wider text-[11px]">
              Total Rainwater Harvested
            </span>
            <div className="text-[32px] text-[#0284c7] font-display-lg font-bold leading-tight mt-0.5 tabular-nums">
              14,800 <span className="text-lg font-bold text-[#0369a1]">L</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#0284c7] text-white flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-[26px]">water_full</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="p-2.5 rounded-lg bg-[#eff4ff] border border-[#bae6fd]/60 flex items-start gap-2">
            <span className="material-symbols-outlined text-[#0284c7] text-[20px]">
              local_shipping
            </span>
            <div>
              <p className="text-base font-headline-md font-bold text-[#0b1c30]">35 Tankers</p>
              <p className="text-[11px] text-text-secondary">Deliveries avoided</p>
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-[#eff4ff] border border-[#bae6fd]/60 flex items-start gap-2">
            <span className="material-symbols-outlined text-[#0369a1] text-[20px]">
              water_damage
            </span>
            <div>
              <p className="text-base font-headline-md font-bold text-[#0369a1] tabular-nums">
                -42% Runoff
              </p>
              <p className="text-[11px] text-text-secondary">Storm surge mitigated</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hydraulic Flow Topology */}
      <section className="bg-surface-container-lowest rounded-xl border border-[#bae6fd] p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-base text-[#0b1c30] font-bold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#0284c7] text-[20px]">schema</span>
            <span>Hydraulic Flow Topology</span>
          </h3>
          <span className="text-[11px] font-semibold text-[#0284c7]">Real-time telemetry</span>
        </div>

        <div className="flex items-center justify-between px-1 text-center relative py-1">
          <div className="flex flex-col items-center gap-1 z-10">
            <div className="w-10 h-10 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#0b1c30] border border-[#bae6fd]">
              <span className="material-symbols-outlined text-[18px]">roofing</span>
            </div>
            <span className="text-[11px] font-bold text-[#0b1c30]">Roof Gutter</span>
            <span className="text-[9px] text-[#0284c7] font-semibold">34 mm flow</span>
          </div>

          <span className="material-symbols-outlined text-[#bae6fd] text-[18px]">arrow_forward</span>

          <div className="flex flex-col items-center gap-1 z-10">
            <div className="w-10 h-10 rounded-full bg-[#e0f2fe] flex items-center justify-center text-[#0284c7] border border-[#0284c7]">
              <span className="material-symbols-outlined text-[18px]">filter_alt</span>
            </div>
            <span className="text-[11px] font-bold text-[#0284c7]">Diverter</span>
            <span className="text-[9px] text-[#0284c7] font-semibold">100% Active</span>
          </div>

          <span className="material-symbols-outlined text-[#bae6fd] text-[18px]">arrow_forward</span>

          <div className="flex flex-col items-center gap-1 z-10">
            <div className="w-10 h-10 rounded-full bg-[#0284c7] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[18px]">water_loss</span>
            </div>
            <span className="text-[11px] font-bold text-[#0b1c30]">Cistern</span>
            <span className="text-[9px] text-[#0284c7] font-semibold tabular-nums">
              {tankVolume.toLocaleString()} L stored
            </span>
          </div>

          <span className="material-symbols-outlined text-[#bae6fd] text-[18px]">arrow_forward</span>

          <div className="flex flex-col items-center gap-1 z-10">
            <div className="w-10 h-10 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#0369a1] border border-[#bae6fd]">
              <span className="material-symbols-outlined text-[18px]">waves</span>
            </div>
            <span className="text-[11px] font-bold text-[#0b1c30]">Recharge Pit</span>
            <span className="text-[9px] text-[#0369a1] font-semibold">850 L infused</span>
          </div>
        </div>
      </section>

      {/* Cistern Telemetry Logs Modal */}
      {telemetryModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#0f172a]/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setTelemetryModalOpen(false);
          }}
        >
          <div className="bg-white border border-[#bae6fd] rounded-2xl w-full max-w-sm shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#eff4ff]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#e0f2fe] text-[#0284c7] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">insights</span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#0b1c30]">Cistern Telemetry</h4>
                  <span className="text-[10px] text-text-secondary uppercase">Last 48 Hours Log</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTelemetryModalOpen(false)}
                className="text-text-secondary hover:text-[#0b1c30] p-1 rounded-full cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto text-body-sm text-[12px] pr-1">
              <div className="p-2.5 rounded-lg bg-[#eff4ff] border border-[#bae6fd]/50 flex justify-between items-center">
                <div>
                  <div className="font-bold text-[#0b1c30]">Auto-Flush Cycle #41</div>
                  <div className="text-[10px] text-text-secondary">Today 14:10 · Diverter purge</div>
                </div>
                <span className="font-semibold text-[#0284c7]">Success</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#eff4ff] border border-[#bae6fd]/50 flex justify-between items-center">
                <div>
                  <div className="font-bold text-[#0b1c30]">Peak Inflow Surge</div>
                  <div className="text-[10px] text-text-secondary">Today 09:22 · +320 L/hr</div>
                </div>
                <span className="font-semibold text-[#0284c7]">+1,420 L Total</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#eff4ff] border border-[#bae6fd]/50 flex justify-between items-center">
                <div>
                  <div className="font-bold text-[#0b1c30]">Recharge Valve Modulate</div>
                  <div className="text-[10px] text-text-secondary">Yesterday 23:40 · Level safe</div>
                </div>
                <span className="font-semibold text-[#0369a1]">850 L infused</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setTelemetryModalOpen(false);
                onShowToast('Full telemetry export sent to your verified device.', 'download_done');
              }}
              className="w-full py-2.5 bg-[#0284c7] text-white rounded-xl font-bold text-xs hover:bg-[#0369a1] transition-colors cursor-pointer shadow-sm"
            >
              Export Detailed CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

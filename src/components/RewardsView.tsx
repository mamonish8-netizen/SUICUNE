import { useState } from 'react';
import { ToastHandler } from '../types';

interface RewardsViewProps {
  ecoPoints: number;
  onUpdateEcoPoints: (delta: number) => void;
  onShowToast: ToastHandler;
}

type LeaderboardTab = 'ward' | 'street' | 'tier';

interface HouseholdBreakdown {
  name: string;
  rank: number;
  baseline: string;
  desc: string;
  tier: string;
}

interface RedeemedVoucher {
  title: string;
  code: string;
  newBalance: number;
}

const LEADERBOARD_DATA: Record<
  LeaderboardTab,
  {
    rankLabel: string;
    rows: {
      name: string;
      display: string;
      rank: number;
      baseline: string;
      desc: string;
      tier: string;
      badgeBg: string;
    }[];
  }
> = {
  ward: {
    rankLabel: 'Rank #3 of 48',
    rows: [
      {
        name: 'Verma Residence',
        display: 'Verma Residence (3 res)',
        rank: 1,
        baseline: '-24%',
        desc: '3 residents · 82 L/capita/day',
        tier: 'Ward 7 Gold Conserver',
        badgeBg: 'bg-warning-tint text-warning-amber font-bold',
      },
      {
        name: 'Oak Lane 14B',
        display: 'Oak Lane 14B (2 res)',
        rank: 2,
        baseline: '-21%',
        desc: '2 residents · 88 L/capita/day',
        tier: 'High-Efficiency Fixtures',
        badgeBg: 'bg-aquatic-tint text-aquatic-primary font-semibold',
      },
      {
        name: 'Maple Court 8',
        display: 'Maple Court 8 (4 res)',
        rank: 4,
        baseline: '-15%',
        desc: '4 residents · 101 L/capita/day',
        tier: 'Greywater Diverter',
        badgeBg: 'bg-slate-100 text-text-muted font-semibold',
      },
    ],
  },
  street: {
    rankLabel: 'Rank #2 of 14',
    rows: [
      {
        name: 'Riverbend 22',
        display: 'Riverbend 22 (2 res)',
        rank: 1,
        baseline: '-22%',
        desc: '2 residents · 85 L/capita/day',
        tier: 'Smart Cistern Cluster',
        badgeBg: 'bg-warning-tint text-warning-amber font-bold',
      },
      {
        name: 'Riverbend 18A',
        display: 'Riverbend 18A (4 res)',
        rank: 3,
        baseline: '-16%',
        desc: '4 residents · 98 L/capita/day',
        tier: 'Low-Flow Retrofit',
        badgeBg: 'bg-aquatic-tint text-aquatic-primary font-semibold',
      },
      {
        name: 'Riverbend 09',
        display: 'Riverbend 09 (3 res)',
        rank: 4,
        baseline: '-12%',
        desc: '3 residents · 104 L/capita/day',
        tier: 'Eco-Wash Adopter',
        badgeBg: 'bg-slate-100 text-text-muted font-semibold',
      },
    ],
  },
  tier: {
    rankLabel: 'Top 6% Tier',
    rows: [
      {
        name: 'Verma Residence',
        display: 'Verma Residence (3 res)',
        rank: 1,
        baseline: '-24%',
        desc: '3 residents · 82 L/capita/day',
        tier: 'Aqua Guardian · Level 5',
        badgeBg: 'bg-warning-tint text-warning-amber font-bold',
      },
      {
        name: 'Pinecrest Villa',
        display: 'Pinecrest Villa (5 res)',
        rank: 2,
        baseline: '-20%',
        desc: '5 residents · 90 L/capita/day',
        tier: 'Aqua Guardian · Level 4',
        badgeBg: 'bg-aquatic-tint text-aquatic-primary font-semibold',
      },
      {
        name: 'Cedar Gate 4',
        display: 'Cedar Gate 4 (3 res)',
        rank: 4,
        baseline: '-17%',
        desc: '3 residents · 96 L/capita/day',
        tier: 'Aqua Guardian · Level 4',
        badgeBg: 'bg-slate-100 text-text-muted font-semibold',
      },
    ],
  },
};

export function RewardsView({ ecoPoints, onUpdateEcoPoints, onShowToast }: RewardsViewProps) {
  const [leaderboardTab, setLeaderboardTab] = useState<LeaderboardTab>('ward');
  const [popKey, setPopKey] = useState(0);
  const [quests, setQuests] = useState<{ [key: number]: boolean }>({
    1: false,
    2: true,
    3: false,
  });
  const [redeemedRewards, setRedeemedRewards] = useState<{ [key: string]: boolean }>({});
  const [voucherModal, setVoucherModal] = useState<RedeemedVoucher | null>(null);
  const [breakdownModal, setBreakdownModal] = useState<HouseholdBreakdown | null>(null);

  const completedCount = Object.values(quests).filter(Boolean).length;
  const activeCount = 3 - completedCount;

  const triggerPop = () => setPopKey((k) => k + 1);

  const handleTabSwitch = (tab: LeaderboardTab) => {
    setLeaderboardTab(tab);
    if (tab === 'street') {
      onShowToast('Switched to Riverbend Way local cluster.', 'info');
    } else if (tab === 'tier') {
      onShowToast('Switched to Aqua Guardian category benchmark.', 'info');
    } else {
      onShowToast('Switched to Ward 7 overview.', 'info');
    }
  };

  const toggleQuest = (id: number, pts: number) => {
    const isCurrentlyCompleted = quests[id];
    setQuests((prev) => ({ ...prev, [id]: !isCurrentlyCompleted }));
    if (!isCurrentlyCompleted) {
      onUpdateEcoPoints(pts);
      triggerPop();
      onShowToast(`Quest completed! +${pts} EcoPts added.`, 'celebration');
    } else {
      onUpdateEcoPoints(-pts);
      triggerPop();
      onShowToast(`Quest marked active. -${pts} EcoPts.`, 'info');
    }
  };

  const handleRedeem = (id: string, title: string, cost: number) => {
    if (redeemedRewards[id]) {
      onShowToast('This reward voucher has already been redeemed.', 'info');
      return;
    }
    if (ecoPoints < cost) {
      onShowToast(`Insufficient balance! You need ${cost - ecoPoints} more EcoPts.`, 'warning');
      return;
    }

    const newBalance = ecoPoints - cost;
    onUpdateEcoPoints(-cost);
    triggerPop();
    setRedeemedRewards((prev) => ({ ...prev, [id]: true }));
    const code = `SUI-W7-${Math.floor(1000 + Math.random() * 9000)}-AQ`;
    setVoucherModal({ title, code, newBalance });
  };

  const currentBoard = LEADERBOARD_DATA[leaderboardTab];
  const sensorPtsLeft = Math.max(0, 1500 - ecoPoints);

  return (
    <div className="flex flex-col w-full px-4 space-y-5 pb-8 pt-3">
      {/* Overview Card */}
      <section className="relative overflow-hidden rounded-2xl p-4 shadow-sm border border-aquatic-subtle bg-gradient-to-br from-[#f0f9ff] via-[#eaf6ff] to-[#e0f2fe]">
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full blur-2xl pointer-events-none bg-aquatic-subtle/60" />
        <div className="absolute -left-12 -bottom-10 w-36 h-36 rounded-full blur-xl pointer-events-none bg-aquatic-primary/15" />

        <div className="relative z-10 flex flex-col space-y-3.5">
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-aquatic-tint border border-aquatic-subtle text-aquatic-primary">
              <span className="material-symbols-outlined text-[16px] fill-1">shield</span>
              <span className="font-label-sm text-[11px] tracking-wide uppercase font-bold">
                Level 4: Aqua Guardian
              </span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/80 border border-aquatic-subtle/80 text-text-secondary font-label-sm text-[11px] shadow-xs">
              <span className="material-symbols-outlined text-[15px] text-aquatic-primary">
                verified
              </span>
              <span>Ward 7 Validated</span>
            </div>
          </div>

          <div className="flex flex-col pt-0.5">
            <span className="font-label-md text-xs text-text-muted uppercase tracking-wider font-semibold">
              Total Accumulated Eco-Points
            </span>
            <div className="flex items-baseline gap-2 mt-0.5 flex-wrap">
              <h1
                key={popKey}
                className="font-headline-lg-mobile text-[34px] font-extrabold tracking-tight text-aquatic-primary transition-all duration-300 tabular-nums eco-pop"
              >
                {ecoPoints.toLocaleString()}
              </h1>
              <span className="font-title-md text-base text-text-primary font-bold">EcoPts</span>
              <span className="font-label-sm text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white text-aquatic-primary border border-aquatic-subtle shadow-xs">
                +45 earned this week
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl border border-aquatic-subtle bg-white/90 backdrop-blur-sm shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-aquatic-tint text-aquatic-primary border border-aquatic-subtle/60">
                <span className="material-symbols-outlined text-[24px]">water_drop</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-[11px] text-text-muted font-medium">
                  Monthly Water Conserved
                </span>
                <span className="font-title-md text-[15px] text-text-primary font-bold">
                  580 Litres Saved
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-label-sm text-xs font-bold flex items-center gap-0.5 justify-end text-aquatic-primary tabular-nums">
                <span className="material-symbols-outlined text-[16px]">trending_down</span> -18%
              </span>
              <span className="font-body-sm text-[11px] text-text-muted">vs. Locality Baseline</span>
            </div>
          </div>
        </div>
      </section>

      {/* Community Leaderboard */}
      <section className="rounded-2xl p-4 shadow-sm border border-aquatic-subtle bg-white space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px] text-aquatic-primary">
                leaderboard
              </span>
              <h2 className="font-headline-sm text-[18px] text-text-primary font-bold">
                Community Conservation
              </h2>
            </div>
            <span className="font-body-sm text-xs text-text-muted">
              Ward 7 Locality Benchmarking
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-full font-label-sm text-[11px] font-bold bg-aquatic-tint border border-aquatic-subtle text-aquatic-primary">
            {currentBoard.rankLabel}
          </span>
        </div>

        {/* Leaderboard Category Filter Tabs */}
        <div className="flex gap-1.5 p-1 rounded-xl bg-surface-container-low border border-aquatic-subtle/50 text-xs">
          {(
            [
              { id: 'ward', label: 'Ward 7' },
              { id: 'street', label: 'Riverbend Way' },
              { id: 'tier', label: 'Guardian Tier' },
            ] as { id: LeaderboardTab; label: string }[]
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => handleTabSwitch(t.id)}
              className={`flex-1 py-1.5 text-center rounded-lg transition-all cursor-pointer ${
                leaderboardTab === t.id
                  ? 'font-semibold bg-white text-aquatic-primary shadow-xs'
                  : 'font-medium text-text-muted hover:text-text-primary'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Active User Rank Card */}
        <div
          onClick={() =>
            setBreakdownModal({
              name: 'Your Household',
              rank: 3,
              baseline: '-18%',
              desc: '4 residents · 94 L/capita/day',
              tier: 'Aqua Guardian Tier',
            })
          }
          className="flex items-center justify-between p-3.5 rounded-xl border border-aquatic-primary/40 bg-gradient-to-r from-aquatic-tint/80 to-[#f0f9ff] cursor-pointer hover:border-aquatic-primary transition-all active:scale-[0.99] shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-label-md text-xs font-bold text-white shadow-xs bg-aquatic-primary">
              3
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-title-md text-sm text-text-primary font-bold">
                  Your Household
                </span>
                <span className="px-1.5 py-0.5 rounded-full font-label-sm text-[10px] font-bold text-white bg-aquatic-primary">
                  Top 6%
                </span>
              </div>
              <span className="font-body-sm text-[12px] text-text-muted">
                4 residents · 94 L/capita/day · Tap for breakdown
              </span>
            </div>
          </div>
          <div className="text-right flex items-center gap-1.5">
            <div className="text-right">
              <span className="font-title-md text-sm font-extrabold text-aquatic-primary tabular-nums">
                -18%
              </span>
              <span className="font-label-sm text-[11px] text-text-muted block">
                below baseline
              </span>
            </div>
            <span className="material-symbols-outlined text-[18px] text-aquatic-primary/70">
              chevron_right
            </span>
          </div>
        </div>

        {/* Other Ranks */}
        <div className="flex flex-col space-y-2">
          {currentBoard.rows.map((row) => (
            <div
              key={`${leaderboardTab}-${row.name}`}
              onClick={() =>
                setBreakdownModal({
                  name: row.name,
                  rank: row.rank,
                  baseline: row.baseline,
                  desc: row.desc,
                  tier: row.tier,
                })
              }
              className="flex items-center justify-between p-2.5 rounded-xl border border-border-subtle bg-canvas-base hover:bg-aquatic-tint/30 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-label-sm text-[11px] ${row.badgeBg}`}
                >
                  {row.rank}
                </span>
                <span className="font-body-md text-sm font-semibold text-text-primary">
                  {row.display}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-label-sm text-xs font-bold text-aquatic-primary tabular-nums">
                  {row.baseline} below
                </span>
                <span className="material-symbols-outlined text-[16px] text-text-muted">info</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Active Quests & Challenges */}
      <section className="rounded-2xl p-4 shadow-sm border border-aquatic-subtle bg-white space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px] text-aquatic-primary">
                task_alt
              </span>
              <h2 className="font-headline-sm text-[18px] text-text-primary font-bold">
                Active Quests &amp; Challenges
              </h2>
            </div>
            <span className="font-body-sm text-xs text-text-muted">
              Weekly water conservation tasks
            </span>
          </div>
          <span className="font-label-sm text-[11px] font-bold px-2 py-0.5 rounded-full bg-aquatic-tint text-aquatic-primary tabular-nums">
            {activeCount} Active · {completedCount} Done
          </span>
        </div>

        <div className="space-y-3">
          {/* Quest 1: Low-Flow Shower Streak */}
          <div
            className={`p-3.5 rounded-xl border space-y-2.5 transition-all ${
              quests[1]
                ? 'border-aquatic-subtle bg-aquatic-tint/30'
                : 'border-aquatic-subtle bg-[#f0f9ff]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full flex items-center justify-center bg-aquatic-tint text-aquatic-primary border border-aquatic-subtle/80 shrink-0">
                  <span className="material-symbols-outlined text-[20px]">shower</span>
                </div>
                <div>
                  <span className="font-title-md text-[14px] text-text-primary font-bold block">
                    Low-Flow Shower Streak
                  </span>
                  <span className="font-body-sm text-[12px] text-text-muted block">
                    &lt;5 min showers 5 days in a row
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-label-sm text-[11px] font-bold px-2 py-0.5 rounded-full bg-aquatic-tint text-aquatic-primary border border-aquatic-subtle">
                  {quests[1] ? 'Claimed +50' : '+50 pts'}
                </span>
                <button
                  type="button"
                  title="Toggle completion"
                  onClick={() => toggleQuest(1, 50)}
                  className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center active:scale-95 transition-all cursor-pointer ${
                    quests[1]
                      ? 'border-aquatic-primary bg-aquatic-primary text-white'
                      : 'border-aquatic-primary/40 bg-white text-transparent hover:border-aquatic-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px] font-bold">check</span>
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between font-label-sm text-[11px] text-text-secondary">
                <span>
                  {quests[1] ? 'Progress: 5/5 days completed!' : 'Progress: 4/5 days logged'}
                </span>
                <span className="font-bold text-aquatic-primary tabular-nums">
                  {quests[1] ? '100%' : '80%'}
                </span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden bg-aquatic-tint">
                <div
                  className="h-full rounded-full transition-all duration-300 bg-aquatic-primary"
                  style={{ width: quests[1] ? '100%' : '80%' }}
                />
              </div>
            </div>
          </div>

          {/* Quest 2: Rainwater Irrigation Bonus */}
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
              quests[2]
                ? 'border-aquatic-subtle bg-aquatic-tint/40'
                : 'border-border-subtle bg-canvas-base'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full flex items-center justify-center bg-aquatic-tint text-aquatic-primary border border-aquatic-subtle/80 shrink-0">
                <span className="material-symbols-outlined text-[20px] fill-1">rainy</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-title-md text-[14px] text-text-primary font-bold">
                    Rainwater Irrigation Bonus
                  </span>
                  {quests[2] && (
                    <span className="material-symbols-outlined text-[16px] text-aquatic-primary fill-1">
                      check_circle
                    </span>
                  )}
                </div>
                <span className="block font-body-sm text-[12px] text-text-muted">
                  Used &gt;100 L rain reserve on garden
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-label-sm text-[11px] font-bold px-2 py-0.5 rounded-full bg-aquatic-tint text-aquatic-primary border border-aquatic-subtle">
                {quests[2] ? 'Verified +100' : '+100 pts'}
              </span>
              <button
                type="button"
                title="Completed"
                onClick={() => toggleQuest(2, 100)}
                className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center active:scale-95 transition-all cursor-pointer ${
                  quests[2]
                    ? 'border-aquatic-primary bg-aquatic-primary text-white'
                    : 'border-aquatic-subtle bg-white text-transparent hover:border-aquatic-primary'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] font-bold">check</span>
              </button>
            </div>
          </div>

          {/* Quest 3: Off-Peak Washing Machine Run */}
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
              quests[3]
                ? 'border-aquatic-subtle bg-aquatic-tint/30'
                : 'border-border-subtle bg-canvas-base'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full flex items-center justify-center bg-surface-container-low text-text-secondary border border-border-subtle shrink-0">
                <span className="material-symbols-outlined text-[20px]">
                  local_laundry_service
                </span>
              </div>
              <div>
                <span className="font-title-md text-[14px] text-text-primary font-semibold block">
                  Off-Peak Washing Machine Run
                </span>
                <span className="block font-body-sm text-[12px] text-text-muted">
                  Cycle scheduled after 9:00 PM
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`font-label-sm text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                  quests[3]
                    ? 'bg-aquatic-tint text-aquatic-primary border-aquatic-subtle'
                    : 'bg-surface-container-high text-text-secondary border-border-subtle'
                }`}
              >
                {quests[3] ? 'Claimed +25' : '+25 pts'}
              </span>
              <button
                type="button"
                title="Toggle completion"
                onClick={() => toggleQuest(3, 25)}
                className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center active:scale-95 transition-all cursor-pointer ${
                  quests[3]
                    ? 'border-aquatic-primary bg-aquatic-primary text-white'
                    : 'border-aquatic-subtle bg-white text-transparent hover:border-aquatic-primary'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] font-bold">check</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Municipal Utility Rewards */}
      <section className="rounded-2xl p-4 shadow-sm border border-aquatic-subtle bg-white space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px] text-aquatic-primary">
                redeem
              </span>
              <h2 className="font-headline-sm text-[18px] text-text-primary font-bold">
                Municipal Utility Rewards
              </h2>
            </div>
            <span className="font-body-sm text-xs text-text-muted">
              Redeem EcoPts directly on water bills &amp; hardware
            </span>
          </div>
          <span className="font-label-sm text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-aquatic-tint text-aquatic-primary border border-aquatic-subtle shrink-0">
            District 7 Board
          </span>
        </div>

        <div className="space-y-3">
          {/* Reward 1: $15 Water Bill Credit */}
          <div className="p-3.5 rounded-xl shadow-xs flex items-center justify-between border border-aquatic-subtle bg-gradient-to-r from-white to-[#f0f9ff]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-aquatic-tint text-aquatic-primary border border-aquatic-subtle">
                <span className="material-symbols-outlined text-[24px]">payments</span>
              </div>
              <div>
                <span className="font-title-md text-[14px] text-text-primary font-bold block">
                  $15 Water Bill Credit
                </span>
                <span className="font-body-sm text-[12px] text-text-muted">
                  Ward 7 auto-deduction · 1,000 pts
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleRedeem('bill-15', '$15 Water Bill Credit', 1000)}
              className={`px-3.5 py-1.5 rounded-lg text-white font-label-md text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                redeemedRewards['bill-15']
                  ? 'bg-status-optimal'
                  : 'bg-aquatic-primary hover:bg-[#0369a1]'
              }`}
            >
              {redeemedRewards['bill-15'] ? (
                <>
                  <span className="material-symbols-outlined text-[16px]">check</span> Redeemed
                </>
              ) : (
                'Redeem'
              )}
            </button>
          </div>

          {/* Reward 2: Drip Emitter Hardware Kit */}
          <div className="p-3.5 rounded-xl shadow-xs flex items-center justify-between border border-aquatic-subtle bg-gradient-to-r from-white to-[#f0f9ff]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-aquatic-tint text-aquatic-primary border border-aquatic-subtle">
                <span className="material-symbols-outlined text-[24px]">valve</span>
              </div>
              <div>
                <span className="font-title-md text-[14px] text-text-primary font-bold block">
                  Drip Emitter Hardware Kit
                </span>
                <span className="font-body-sm text-[12px] text-text-muted">
                  Municipal center pickup · 800 pts
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleRedeem('drip-kit', 'Drip Emitter Hardware Kit', 800)}
              className={`px-3.5 py-1.5 rounded-lg text-white font-label-md text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                redeemedRewards['drip-kit']
                  ? 'bg-status-optimal'
                  : 'bg-aquatic-primary hover:bg-[#0369a1]'
              }`}
            >
              {redeemedRewards['drip-kit'] ? (
                <>
                  <span className="material-symbols-outlined text-[16px]">check</span> Redeemed
                </>
              ) : (
                'Redeem'
              )}
            </button>
          </div>

          {/* Reward 3: Smart Soil Moisture Sensor Rebate */}
          <div className="p-3.5 rounded-xl shadow-xs flex items-center justify-between border border-border-subtle bg-canvas-base">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-surface-container text-text-secondary border border-border-subtle">
                <span className="material-symbols-outlined text-[24px]">sensors</span>
              </div>
              <div>
                <span className="font-title-md text-[14px] text-text-primary font-bold block">
                  Smart Soil Moisture Sensor Rebate
                </span>
                <span className="font-body-sm text-[12px] text-text-muted">
                  50% hardware voucher · 1,500 pts
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                handleRedeem('sensor-rebate', 'Smart Soil Moisture Sensor Rebate', 1500)
              }
              className={`px-3 py-1.5 rounded-lg font-label-md text-[11px] font-bold shrink-0 cursor-pointer transition-all active:scale-95 ${
                redeemedRewards['sensor-rebate']
                  ? 'bg-status-optimal text-white flex items-center gap-1'
                  : ecoPoints >= 1500
                    ? 'bg-aquatic-primary text-white hover:bg-[#0369a1]'
                    : 'bg-surface-container text-text-muted border border-border-subtle'
              }`}
            >
              {redeemedRewards['sensor-rebate'] ? (
                <>
                  <span className="material-symbols-outlined text-[16px]">check</span> Redeemed
                </>
              ) : ecoPoints >= 1500 ? (
                'Redeem'
              ) : (
                `${sensorPtsLeft} pts left`
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Voucher Redemption Modal */}
      {voucherModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ocean-deep/60 backdrop-blur-sm px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setVoucherModal(null);
          }}
        >
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm border border-aquatic-subtle shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-aquatic-subtle/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-aquatic-tint flex items-center justify-center text-aquatic-primary">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                </div>
                <h3 className="font-headline-sm text-[16px] text-text-primary font-bold">
                  Reward Redeemed!
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setVoucherModal(null)}
                className="text-text-muted hover:text-text-primary cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="space-y-2 text-center py-2">
              <p className="font-title-md text-[15px] font-bold text-text-primary">
                {voucherModal.title}
              </p>
              <p className="font-body-sm text-[13px] text-text-muted">
                Voucher has been provisioned and linked to your Ward 7 Utility Account.
              </p>
              <div className="p-3 bg-aquatic-tint/50 rounded-xl border border-dashed border-aquatic-primary/50 my-2">
                <span className="font-label-sm text-[10px] text-text-muted uppercase tracking-wider block">
                  Municipal Voucher Code
                </span>
                <span className="font-mono text-[16px] font-bold text-aquatic-primary tracking-widest">
                  {voucherModal.code}
                </span>
              </div>
              <p className="font-body-sm text-[12px] text-aquatic-primary font-semibold">
                New Balance: {voucherModal.newBalance.toLocaleString()} EcoPts
              </p>
            </div>
            <button
              type="button"
              onClick={() => setVoucherModal(null)}
              className="w-full py-2.5 rounded-xl bg-aquatic-primary hover:bg-[#0369a1] text-white font-label-md font-bold shadow-sm transition-all active:scale-[0.98] cursor-pointer"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      )}

      {/* Interactive Household Breakdown Sheet Modal */}
      {breakdownModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ocean-deep/50 backdrop-blur-xs px-0 sm:px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setBreakdownModal(null);
          }}
        >
          <div className="bg-white rounded-t-2xl sm:rounded-2xl p-5 w-full max-w-sm border border-aquatic-subtle shadow-xl space-y-4 pb-8 sm:pb-5">
            <div className="flex items-center justify-between pb-2 border-b border-aquatic-subtle/40">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-aquatic-primary text-[22px]">
                  insights
                </span>
                <h3 className="font-headline-sm text-[16px] text-text-primary font-bold">
                  {breakdownModal.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setBreakdownModal(null)}
                className="text-text-muted hover:text-text-primary cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="space-y-2.5 text-left">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-aquatic-tint/40 border border-aquatic-subtle">
                <span className="font-label-sm text-xs text-text-muted">Ward 7 Rank</span>
                <span className="font-title-md text-sm font-bold text-aquatic-primary">
                  #{breakdownModal.rank} in Ward 7
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-canvas-base border border-border-subtle">
                <span className="font-label-sm text-xs text-text-muted">Efficiency Baseline</span>
                <span className="font-title-md text-sm font-bold text-aquatic-primary">
                  {breakdownModal.baseline} below avg
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-canvas-base border border-border-subtle">
                <span className="font-label-sm text-xs text-text-muted block">Profile Details</span>
                <span className="font-body-sm text-xs font-semibold text-text-primary block mt-0.5">
                  {breakdownModal.desc}
                </span>
                <span className="font-body-sm text-[11px] text-text-muted block mt-0.5">
                  {breakdownModal.tier}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setBreakdownModal(null)}
              className="w-full py-2.5 rounded-xl bg-aquatic-tint border border-aquatic-subtle text-aquatic-primary font-label-md font-bold transition-all active:scale-[0.98] cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

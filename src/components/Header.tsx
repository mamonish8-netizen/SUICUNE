import { ASSETS, TabRoute, ToastHandler } from '../types';
import { ResilientImage } from './ResilientImage';

interface HeaderProps {
  activeTab: TabRoute;
  onOpenNotifications: () => void;
  onShowToast: ToastHandler;
}

const BADGE_BY_TAB: Record<TabRoute, string> = {
  home: 'WATER',
  analytics: 'WATER',
  alerts: 'WATER',
  rewards: 'AQUA INTEL',
  rainwater: 'AQUA',
};

export function Header({ activeTab, onOpenNotifications, onShowToast }: HeaderProps) {
  const badgeText = BADGE_BY_TAB[activeTab];
  const avatarUrl = activeTab === 'home' ? ASSETS.profileElena : ASSETS.profileAlt;

  return (
    <header className="fixed top-0 w-full max-w-md z-40 pt-safe bg-surface/90 backdrop-blur-xl border-b border-aquatic-subtle/60 shadow-[0_1px_8px_rgba(2,132,199,0.06)]">
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-secondary-container border border-aquatic-subtle overflow-hidden p-0.5 shrink-0 shadow-xs">
            <ResilientImage
              src={ASSETS.logo}
              alt="Suicune Logo"
              className="w-8 h-8 rounded-lg object-cover shrink-0"
              fallbackIcon="water_drop"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-title-md text-[17px] text-aquatic-primary font-extrabold tracking-tight">
                Suicune
              </span>
              <span className="font-label-sm text-[10px] px-2 py-0.5 rounded-full bg-aquatic-tint text-ocean-mid font-bold tracking-wider uppercase border border-aquatic-subtle/80">
                {badgeText}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-aquatic-primary water-pulse-dot" />
              <span className="font-label-sm text-[11px] text-text-secondary font-medium">
                Ward 7 · Grid Normal
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Alerts and Notifications"
            onClick={onOpenNotifications}
            className="relative w-10 h-10 flex items-center justify-center rounded-full text-text-secondary hover:text-aquatic-primary hover:bg-aquatic-tint/60 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px] text-ocean-mid">notifications</span>
            <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-hazard-alert ring-2 ring-surface shadow-xs animate-ping" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-hazard-alert ring-2 ring-surface shadow-xs" />
          </button>

          <button
            type="button"
            aria-label="Open profile"
            onClick={() =>
              onShowToast(
                activeTab === 'rewards'
                  ? 'Citizen ID: W7-9482 · Level 4 Guardian'
                  : activeTab === 'rainwater'
                    ? 'Profile: Residential Meter ID #AG-7402'
                    : 'Elena Vance · Account AG-7429 Verified',
                'verified'
              )
            }
            className="w-10 h-10 flex items-center justify-center rounded-full hover:ring-2 hover:ring-aquatic-primary/40 active:scale-95 transition-all cursor-pointer ml-0.5"
          >
            <ResilientImage
              src={avatarUrl}
              alt="Elena Vance Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-aquatic-subtle"
              fallbackIcon="person"
            />
          </button>
        </div>
      </div>
    </header>
  );
}

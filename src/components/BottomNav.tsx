import { TabRoute } from '../types';

interface BottomNavProps {
  activeTab: TabRoute;
  onSelectTab: (tab: TabRoute) => void;
}

const NAV_ITEMS: { id: TabRoute; label: string; icon: string; title: string }[] = [
  { id: 'home', label: 'Home', icon: 'home', title: 'Household Dashboard' },
  { id: 'analytics', label: 'Analytics', icon: 'bar_chart', title: 'Usage Analytics' },
  { id: 'alerts', label: 'Alerts', icon: 'warning', title: 'Leakage Alerts' },
  { id: 'rewards', label: 'Rewards', icon: 'workspace_premium', title: 'Conservation Rewards' },
  { id: 'rainwater', label: 'Rainwater', icon: 'water_drop', title: 'Rainwater Harvesting' },
];

export function BottomNav({ activeTab, onSelectTab }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto w-full z-40 pb-safe bg-surface-clean/95 backdrop-blur-xl border-t border-aquatic-subtle shadow-[0_-2px_12px_rgba(2,132,199,0.08)]">
      <div className="h-16 px-2 flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              title={item.title}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 w-14 h-12 transition-all cursor-pointer active:scale-95 relative select-none ${
                isActive ? 'text-aquatic-primary font-bold' : 'text-text-secondary hover:text-aquatic-primary'
              }`}
            >
              <div className="relative flex flex-col items-center">
                <span
                  className={`material-symbols-outlined text-[22px] shrink-0 ${
                    isActive ? 'text-aquatic-primary fill-1' : ''
                  }`}
                >
                  {item.icon}
                </span>
                <span
                  className={`font-label-sm text-[11px] leading-none mt-0.5 ${
                    isActive ? 'text-aquatic-primary font-bold' : 'font-medium'
                  }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute -bottom-1.5 w-5 h-0.5 rounded-full bg-aquatic-primary shadow-[0_0_8px_rgba(2,132,199,0.9)]" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

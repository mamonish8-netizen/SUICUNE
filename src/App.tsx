import { useCallback, useEffect, useRef, useState } from 'react';
import { AlertsView } from './components/AlertsView';
import { AnalyticsView } from './components/AnalyticsView';
import { BottomNav } from './components/BottomNav';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { RainwaterView } from './components/RainwaterView';
import { RewardsView } from './components/RewardsView';
import { TabRoute } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabRoute>('home');
  const [ecoPoints, setEcoPoints] = useState(1420);
  const [valveOpen, setValveOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; icon: string; visible: boolean }>({
    message: '',
    icon: 'info',
    visible: false,
  });

  const toastTimerRef = useRef<number | null>(null);

  const showToast = useCallback((message: string, icon = 'info') => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    setToast({ message, icon, visible: true });
    toastTimerRef.current = window.setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const handleSelectTab = (tab: TabRoute) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleValve = () => {
    setValveOpen((prev) => {
      const next = !prev;
      if (!next) {
        showToast('Main Valve Closed! Supply line isolated.', 'lock');
      } else {
        showToast('Main Valve Re-opened. Nominal pressure restored.', 'check_circle');
      }
      return next;
    });
  };

  const handleUpdateEcoPoints = (delta: number) => {
    setEcoPoints((prev) => Math.max(0, prev + delta));
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex justify-center">
      <div className="w-full max-w-md bg-surface flex flex-col min-h-screen shadow-2xl relative border-x border-outline-variant/40">
        <Header
          activeTab={activeTab}
          onOpenNotifications={() => setNotifOpen(true)}
          onShowToast={showToast}
        />

        {/* Interactive Toast Notification */}
        <div
          className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl shadow-lg bg-ocean-deep text-white text-xs font-medium flex items-center gap-2.5 transition-all duration-300 border border-slate-700/60 max-w-[90%] ${
            toast.visible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 pointer-events-none -translate-y-4'
          }`}
        >
          <span className="material-symbols-outlined text-[18px] text-aquatic-subtle shrink-0">
            {toast.icon}
          </span>
          <span>{toast.message}</span>
        </div>

        {/* Notification Drawer / Modal Dialog */}
        {notifOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-center"
            onClick={(e) => {
              if (e.target === e.currentTarget) setNotifOpen(false);
            }}
          >
            <div className="relative w-full max-w-md h-full pointer-events-none">
              <div className="pointer-events-auto absolute right-3 top-16 w-80 bg-surface-container-lowest rounded-2xl shadow-2xl border border-aquatic-subtle p-4">
                <div className="flex items-center justify-between pb-3 border-b border-aquatic-subtle">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[20px]">
                      notifications_active
                    </span>
                    <h3 className="font-title-md text-sm font-bold text-on-surface">
                      Telemetry Alerts
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotifOpen(false)}
                    className="w-7 h-7 rounded-full hover:bg-secondary-container text-on-surface-variant flex items-center justify-center cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>

                <div className="space-y-2.5 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setNotifOpen(false);
                      handleSelectTab('home');
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-secondary-container/40 border border-aquatic-subtle flex gap-2.5 hover:bg-secondary-container/70 transition cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">
                      water_drop
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-on-surface">
                        Daily conservation target reached
                      </p>
                      <p className="text-[11px] text-on-surface-variant">
                        420 L baseline safe. Current pace 62.8%.
                      </p>
                      <span className="text-[9px] text-primary font-bold">12m ago</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNotifOpen(false);
                      handleSelectTab('alerts');
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-hazard-tint border border-red-200 flex gap-2.5 hover:bg-rose-100/80 transition cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-hazard-alert text-[18px] shrink-0 mt-0.5">
                      warning
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-on-surface">
                        Continuous Micro-Flow Flagged
                      </p>
                      <p className="text-[11px] text-on-surface-variant">
                        Cistern branch drift 0.06 L/min · Tap to inspect.
                      </p>
                      <span className="text-[9px] text-hazard-alert font-bold">1h ago</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Scrollable Area */}
        <main className="flex-1 flex flex-col relative w-full pt-16 pb-24 bg-surface">
          {activeTab === 'home' && (
            <HomeView
              ecoPoints={ecoPoints}
              valveOpen={valveOpen}
              onToggleValve={handleToggleValve}
              onNavigate={handleSelectTab}
              onShowToast={showToast}
            />
          )}
          {activeTab === 'analytics' && (
            <AnalyticsView onNavigate={handleSelectTab} onShowToast={showToast} />
          )}
          {activeTab === 'alerts' && (
            <AlertsView
              valveOpen={valveOpen}
              onToggleValve={handleToggleValve}
              onShowToast={showToast}
            />
          )}
          {activeTab === 'rewards' && (
            <RewardsView
              ecoPoints={ecoPoints}
              onUpdateEcoPoints={handleUpdateEcoPoints}
              onShowToast={showToast}
            />
          )}
          {activeTab === 'rainwater' && <RainwaterView onShowToast={showToast} />}
        </main>

        <BottomNav activeTab={activeTab} onSelectTab={handleSelectTab} />
      </div>
    </div>
  );
}


import React, { useState, useEffect, createContext } from 'react';
import { NAV_ITEMS } from './constants';
import ScheduleView from './features/ScheduleView';
import BookingsView from './features/BookingsView';
import ExpenseView from './features/ExpenseView';
import PlanningView from './features/PlanningView';
import MetroMapView from './features/MetroMapView';
import MembersView from './features/MembersView';
import { Lock, Unlock, Cloud, CloudOff } from 'lucide-react';
import { subscribeToAuthChanges } from './services/firebase';
import type { User } from 'firebase/auth';

// 建立全域 Context
export const AppContext = createContext({
  isEditMode: false,
  toggleEditMode: () => { },
  user: null as User | null,
  isSynced: false
});

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('schedule');
  const [isEditMode, setIsEditMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const handleToggleEdit = () => {
    setIsEditMode(!isEditMode);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'schedule': return <ScheduleView />;
      case 'metro': return <MetroMapView />;
      case 'bookings': return <BookingsView />;
      case 'expense': return <ExpenseView />;
      case 'planning': return <PlanningView />;
      case 'members': return <MembersView />; // 確保成員頁面可以被切換
      default: return <ScheduleView />;
    }
  };

  return (
    <AppContext.Provider value={{ isEditMode, toggleEditMode: handleToggleEdit, user, isSynced: !!user }}>
      <div className="flex flex-col h-screen max-h-screen overflow-hidden text-[#5D5443]">
        {/* Header */}
        <header className="pt-8 pb-3 px-6 flex justify-between items-center bg-transparent z-10">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tighter text-[#5D5443] flex items-center gap-2 drop-shadow-sm">
              <span className="text-3xl">🇹🇭</span> Changsis 泰國之旅
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-[10px] font-bold text-[#8BAE8E] bg-white px-2 rounded-full border border-[#E0E5D5] shadow-sm">
                曼谷大冒險 ✨
              </p>
              {user ? (
                <div className="flex items-center gap-1 text-[8px] font-black text-[#8BAE8E] animate-pulse">
                  <Cloud size={10} /> 雲端同步中
                </div>
              ) : (
                <div className="flex items-center gap-1 text-[8px] font-black text-gray-300">
                  <CloudOff size={10} /> 本地儲存
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {/* 快速切換到成員頁面 (登入入口) */}
            <button
              onClick={() => setActiveTab('members')}
              className={`w-12 h-12 rounded-2xl border-2 mori-shadow flex items-center justify-center transition-all active:scale-90 bg-white border-[#E0E5D5] overflow-hidden ${activeTab === 'members' ? 'ring-2 ring-[#8BAE8E]' : ''}`}
            >
              {user ? (
                <img src={user.photoURL || ''} alt="User" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl">🦊</span>
              )}
            </button>
            <button
              onClick={handleToggleEdit}
              className={`w-12 h-12 rounded-2xl border-2 mori-shadow flex items-center justify-center transition-all active:scale-90 ${isEditMode ? 'bg-[#8BAE8E] border-[#8BAE8E] text-white rotate-0' : 'bg-white border-[#E0E5D5] text-gray-300 rotate-3'
                }`}
            >
              {isEditMode ? <Unlock size={24} /> : <Lock size={24} />}
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-4 pb-24 pt-2 custom-scrollbar">
          {isEditMode && (
            <div className="mb-4 bg-[#F2F7F2] border-2 border-dashed border-[#8BAE8E] rounded-2xl p-3 text-center animate-pulse">
              <p className="text-[10px] font-black text-[#8BAE8E] uppercase tracking-widest">✨ 編輯模式已開啟 ✨</p>
            </div>
          )}
          {renderContent()}
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t-4 border-[#FDF9F0] pb-safe pt-2 px-2 z-50 rounded-t-[2.5rem] shadow-[0_-10px_20px_rgba(224,229,213,0.3)]">
          <div className="max-w-md mx-auto flex justify-around items-center h-16">
            {[...NAV_ITEMS, { id: 'members', label: '成員', icon: <span>👥</span> }].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center flex-1 transition-all duration-300 active:scale-75 ${activeTab === item.id ? 'text-[#8BAE8E] -translate-y-2' : 'text-gray-300'
                  }`}
              >
                <div className={`p-2 rounded-2xl transition-all ${activeTab === item.id ? 'bg-[#F0F7F0] scale-110 rotate-6 mori-shadow border-2 border-[#E0E5D5]' : ''}`}>
                  {item.icon}
                </div>
                <span className={`text-[10px] font-black mt-1 ${activeTab === item.id ? 'opacity-100' : 'opacity-0'}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </AppContext.Provider>
  );
};

export default App;

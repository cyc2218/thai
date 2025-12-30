
import React, { useContext } from 'react';
import { UserPlus, Settings, QrCode, Sparkles, Github, Cloud, LogOut } from 'lucide-react';
import { AppContext } from '../App';
import { loginWithGithub, logout } from '../services/firebase';

const MembersView: React.FC = () => {
  const { user } = useContext(AppContext);
  
  const members = [
    { id: 1, name: 'Alex 🦊', role: 'Planner', avatar: 'https://picsum.photos/seed/alex/100' },
    { id: 2, name: 'Jamie 🐼', role: 'Accountant', avatar: 'https://picsum.photos/seed/jamie/100' },
    { id: 3, name: 'Taylor 🐨', role: 'Driver', avatar: 'https://picsum.photos/seed/taylor/100' },
    { id: 4, name: 'chang sis thia 🌸', role: 'Owner', avatar: 'https://picsum.photos/seed/thia/100' },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* 個人檔案與雲端連結 */}
      <div className="mori-card p-8 mori-shadow text-center bg-white border-4 relative overflow-hidden">
        <div className="washi-tape washi-tape-pink"></div>
        <div className="absolute top-2 right-2 text-xl opacity-20"><Sparkles /></div>
        
        <div className="w-28 h-28 rounded-[2.5rem] mx-auto mb-4 border-4 border-[#FDF9F0] mori-shadow overflow-hidden rotate-6 bg-[#FDF9F0] relative">
          <img 
            src={user?.photoURL || "https://picsum.photos/seed/thia/200"} 
            alt="Me" 
            className="w-full h-full object-cover" 
          />
          {user && (
            <div className="absolute bottom-0 right-0 bg-[#8BAE8E] p-1.5 rounded-full border-2 border-white text-white shadow-sm">
              <Cloud size={12} />
            </div>
          )}
        </div>
        
        <h2 className="text-3xl font-black text-[#5D5443] tracking-tighter">
          {user?.displayName || "Guest Explorer"}
        </h2>
        <p className="text-[10px] text-[#8BAE8E] font-black bg-[#F0F7F0] w-fit mx-auto px-3 py-1 rounded-full mt-2 border border-[#E0E5D5]">
          {user ? 'Cloud Member ✨' : 'Local Traveller 📍'}
        </p>

        {/* Firebase & GitHub 連結按鈕 */}
        <div className="mt-8 space-y-3">
          {!user ? (
            <button 
              onClick={loginWithGithub}
              className="w-full bg-[#333] text-white py-3 rounded-2xl text-sm font-black flex items-center justify-center gap-3 mori-shadow active:scale-95 transition-transform border-4 border-white"
            >
              <Github size={20} /> 連結 GitHub 帳號同步
            </button>
          ) : (
            <button 
              onClick={logout}
              className="w-full bg-white text-red-400 py-3 rounded-2xl text-sm font-black flex items-center justify-center gap-3 mori-shadow active:scale-95 transition-transform border-4 border-red-50"
            >
              <LogOut size={20} /> 登出並中斷雲端連結
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t-2 border-dashed border-[#E0E5D5]">
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#8BAE8E] transition-colors">
            <div className="bg-[#FDF9F0] p-3 rounded-2xl mori-shadow mb-1 border-2 border-[#E0E5D5]">
              <QrCode size={24} />
            </div>
            <span className="text-[10px] font-black uppercase">My QR</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#8BAE8E] transition-colors">
            <div className="bg-[#FDF9F0] p-3 rounded-2xl mori-shadow mb-1 border-2 border-[#E0E5D5]">
              <Settings size={24} />
            </div>
            <span className="text-[10px] font-black uppercase">Settings</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-4">
          <h3 className="font-black text-lg flex items-center gap-2 text-[#5D5443]">
            Group Members <span className="bg-[#8BAE8E] text-white text-[10px] px-3 py-1 rounded-full mori-shadow">{members.length}</span>
          </h3>
          <button className="text-[#8BAE8E] text-sm font-black flex items-center gap-1 bg-white px-3 py-1 rounded-full border-2 border-[#E0E5D5] mori-shadow active:scale-90 transition-transform">
            <UserPlus size={16} /> Invite
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {members.map(m => (
            <div key={m.id} className="mori-card p-5 mori-shadow border-4 flex flex-col items-center text-center space-y-3 active:scale-95 transition-transform bg-white">
              <div className="relative">
                <img src={m.avatar} className="w-16 h-16 rounded-[1.5rem] object-cover border-2 border-[#E0E5D5]" alt={m.name} />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-300 border-4 border-white rounded-full"></div>
              </div>
              <div className="w-full">
                <p className="font-black text-xs text-[#5D5443] truncate">{m.name}</p>
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">{m.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {user && (
        <div className="mori-card p-4 mori-shadow bg-[#F2F7F2] border-4 border-[#8BAE8E] text-center">
          <p className="text-[10px] font-black text-[#8BAE8E] uppercase tracking-widest">
            ✅ GitHub Project Connected via Firebase
          </p>
        </div>
      )}
    </div>
  );
};

export default MembersView;

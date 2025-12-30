
import React, { useState, useContext } from 'react';
import { Plane, Home, Car, FileText, Lock, MapPin, Edit3 } from 'lucide-react';
// Fix: Use AppContext instead of EditModeContext
import { AppContext } from '../App';

const BookingsView: React.FC = () => {
  // Fix: Use AppContext
  const { isEditMode } = useContext(AppContext);
  const [pinRequired, setPinRequired] = useState(true);
  const [pin, setPin] = useState('');

  const unlocked = isEditMode || !pinRequired;

  if (!unlocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="mori-card p-8 mori-shadow text-center space-y-4 max-w-xs w-full">
          <div className="bg-[#F2E5D1] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={32} className="text-[#C6A664]" />
          </div>
          <h2 className="text-xl font-black">隱私保護</h2>
          <p className="text-sm text-gray-500 italic">請輸入 PIN 碼查看憑證資料</p>
          <input
            type="password"
            placeholder="****"
            className="w-full p-3 border-4 border-[#E0E5D5] rounded-xl text-center text-2xl tracking-widest focus:ring-2 focus:ring-[#8BAE8E] outline-none"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              if (e.target.value === '8589') setPinRequired(false);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Flight JX745 */}
      <div className="mori-card overflow-hidden mori-shadow border-4 border-[#E0E5D5]">
        <div className="bg-[#8BAE8E] p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Plane size={20} />
            <span className="font-black tracking-widest uppercase">STARLUX JX745</span>
          </div>
          <span className="text-xs bg-white/20 px-2 py-1 rounded font-bold">JAN 07</span>
        </div>
        <div className="p-6 bg-white relative">
          <div className="flex justify-between items-center mb-6">
            <div className="text-center">
              <p className="text-3xl font-black">TPE</p>
              <p className="text-[10px] text-gray-400 font-bold">Taipei (T2)</p>
            </div>
            <div className="flex-1 px-4 flex flex-col items-center">
              <div className="w-full border-t-4 border-dashed border-[#E0E5D5] relative">
                <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#8BAE8E]" size={20} />
              </div>
              <p className="text-[10px] text-gray-400 mt-4 font-black">13:25 - 16:30</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black">BKK</p>
              <p className="text-[10px] text-gray-400 font-bold">Bangkok</p>
            </div>
          </div>
        </div>
      </div>

      {/* Flight JX746 */}
      <div className="mori-card overflow-hidden mori-shadow border-4 border-[#E0E5D5]">
        <div className="bg-[#C6A664] p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Plane size={20} />
            <span className="font-black tracking-widest uppercase">STARLUX JX746</span>
          </div>
          <span className="text-xs bg-white/20 px-2 py-1 rounded font-bold">JAN 13</span>
        </div>
        <div className="p-6 bg-white relative">
          <div className="flex justify-between items-center mb-6">
            <div className="text-center">
              <p className="text-3xl font-black">BKK</p>
              <p className="text-[10px] text-gray-400 font-bold">Bangkok</p>
            </div>
            <div className="flex-1 px-4 flex flex-col items-center">
              <div className="w-full border-t-4 border-dashed border-[#E0E5D5] relative">
                <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#C6A664]" size={20} />
              </div>
              <p className="text-[10px] text-gray-400 mt-4 font-black">17:40 - 22:30</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black">TPE</p>
              <p className="text-[10px] text-gray-400 font-bold">Taipei (T2)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hotel */}
      <div className="mori-card overflow-hidden mori-shadow border-4">
        <div className="p-4">
          <h3 className="text-lg font-black text-[#5D5443]">Ibis Bangkok Siam</h3>
          <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-1 font-bold">
            <MapPin size={12} className="text-[#8BAE8E]" /> BTS National Stadium 1 號出口旁
          </p>
          <div className="grid grid-cols-2 gap-4 mt-4 border-t-2 border-dashed border-[#FDF9F0] pt-4">
            <div>
              <p className="text-[8px] text-gray-400 uppercase font-black">Check-in</p>
              <p className="text-xs font-black">2026/01/07</p>
            </div>
            <div>
              <p className="text-[8px] text-gray-400 uppercase font-black">Check-out</p>
              <p className="text-xs font-black">2026/01/13</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingsView;

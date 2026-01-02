import React, { useState, useContext, useMemo } from 'react';
import { MapPin, Info, Heart, CalendarDays, ChevronRight, Car, Edit3, X, Save, Clock, Type, AlignLeft, Sun, Cloud, CloudRain, Thermometer, CloudLightning, CloudSun } from 'lucide-react';
import { CATEGORY_COLORS } from '../constants.tsx';
import { AppContext } from '../App';

const INITIAL_BANGKOK_DATA = {
  tripSummary: [
    { day: 1, date: '1/7 (三)', title: '素萬那普機場 (BKK) · MBK Center · 朱拉隆功美食街 · Lotus 蓮花超市', icon: '🛫', color: 'bg-orange-100' },
    { day: 2, date: '1/8 (四)', title: '水門市場 · 紅大哥海南雞 · Pratunam Market · December\'s · Tofu Skin · Siam商圈 · Big C', icon: '🛍️', color: 'bg-blue-100' },
    { day: 3, date: '1/9 (五)', title: '榮泰米粉湯 · BENKOFF 咖啡廳 · EmSphere · Phed Mark · Terminal 21 · Yum²', icon: '🍜', color: 'bg-green-100' },
    { day: 4, date: '1/10 (六)', title: '勝利紀念碑船麵 · 泰北咖哩麵 · 洽圖洽週末市集 · 喬德夜市 · 輝煌夜市', icon: '🎋', color: 'bg-yellow-100' },
    { day: 5, date: '1/11 (日)', title: 'Mr. Joe 脆皮豬 · 嵩越路 · 唐人街 · TumLubThai · 鄭王廟 · 大皇宮 · 臥佛寺 · 河濱夜市', icon: '🏯', color: 'bg-red-100' },
    { day: 6, date: '1/12 (一)', title: '邢泰記 · 60 年烤肉 · 班蘭蛋捲 · ICONSIAM · Kodtalay · Dusit Central Park', icon: '💎', color: 'bg-purple-100' },
    { day: 7, date: '1/13 (二)', title: '飯店週邊 (Ibis Bangkok Siam) · Lotus 超市 · 素萬那普機場 (BKK)', icon: '✈️', color: 'bg-gray-100' },
  ],
  itinerary: {
    0: {
      fullTitle: 'Day 1 | 1/7 (三) 入境與朱拉隆功美食探索',
      items: [
        { id: '1-1', time: '16:30', title: '抵達素萬那普機場 (BKK) 🛫', location: 'BKK Airport', transport: '機場快線 (ARL) → Phaya Thai 轉 BTS', category: 'Transport', note: '辦理入境手續、領取行李並準備換錢或領取網卡。' },
        { id: '1-2', time: '19:00', title: 'MBK Center 購物與伴手禮 🛍️', location: '飯店對面', transport: '步行即達', category: 'Shopping', note: '老牌商場，適合採買藥妝、泰國特色零食與平價服飾。' },
        { id: '1-3', time: '20:30', title: '朱拉隆功美食街、60 年烤肉 🍖', location: 'Banthat Thong Road', transport: '步行 10-15 分鐘', category: 'Food', note: '曼谷最紅美食戰區，聚集許多米其林必比登推薦名店與 60 年歷史傳統烤肉。' },
        { id: '1-4', time: '22:00', title: 'Lotus 蓮花超市 補貨 🛒', location: '飯店西側', transport: '步行 5 分鐘', category: 'Shopping', note: '大型連鎖超市，適合最後補足大包裝伴手禮、飲料 or 水果。' },
      ],
      dayTransport: "機場至飯店：搭乘 ARL 至終點 Phaya Thai 站，轉 BTS (綠線) 至 Siam 轉一站 (Silom 線) 到 National Stadium (W1)。\n飯店至行程地點：全程步行。MBK 在飯店對面；美食街沿 Rama 1 路走 10-15 分鐘；Lotus 在飯店西側走 5 分鐘。"
    },
    1: {
      fullTitle: 'Day 2 | 1/8 (四) 水門市場批發與 Siam 商圈購物',
      items: [
        { id: '2-1', time: '10:00', title: '水門市場 Platinum 👗', location: 'Platinum Fashion Mall', transport: 'Skywalk 步行', category: 'Shopping', note: '泰國最大的服飾批發中心，有冷氣吹非常舒適。' },
        { id: '2-2', time: '12:00', title: '紅大哥海南雞飯 🍛', location: '水門市場旁', transport: '步行', category: 'Food', note: '必吃米其林推薦的紅大哥海南雞飯。' },
        { id: '2-3', time: '13:00', title: 'Pratunam Market、December\'s', location: '水門市場巷弄', transport: '步行', category: 'Shopping', note: '深入巷弄探索在地品牌。' },
        { id: '2-4', time: '15:30', title: 'Central World、Siam 商圈 🏢', location: 'Siam 區', transport: 'Skywalk', category: 'Shopping', note: '全球知名購物地標。' },
      ],
      dayTransport: "建議利用 Skywalk (空中步道) 步行，避開塞車與豔陽。"
    }
  }
};

// 產生 07:00 - 23:00 的逐時天氣數據
const generateHourlyWeather = (dayIndex: number) => {
  const hours = [];
  const baseTemp = dayIndex % 2 === 0 ? 30 : 28;
  const isRainyDay = dayIndex === 1 || dayIndex === 4;

  for (let h = 7; h <= 23; h++) {
    const timeStr = `${h.toString().padStart(2, '0')}:00`;
    // 溫度模擬：14-16點最高
    const tempVar = Math.sin((h - 7) * Math.PI / 16) * 6;
    const temp = Math.round(baseTemp + tempVar);
    
    let icon = <Sun size={14} />;
    if (isRainyDay && h >= 14 && h <= 19) {
      icon = h % 3 === 0 ? <CloudLightning size={14} className="text-purple-400" /> : <CloudRain size={14} className="text-blue-400" />;
    } else if (h > 17) {
      icon = <Cloud size={14} className="text-gray-400" />;
    } else if (h > 10) {
      icon = <CloudSun size={14} className="text-orange-300" />;
    }

    hours.push({ time: timeStr, temp, icon });
  }
  return hours;
};

const MOCK_WEATHER: Record<number, any> = {
  0: { 
    hourly: generateHourlyWeather(0), 
    tip: '今天整天都是大太陽！7:00-11:00 氣溫適中，但中午過後體感會飆破 36 度，記得多補充水分。☀️' 
  },
  1: { 
    hourly: generateHourlyWeather(1), 
    tip: '注意！14:00 後有午後雷陣雨機率。建議早上先去戶外景點，傍晚待在商場內吹冷氣躲雨。☔' 
  },
  2: { hourly: generateHourlyWeather(2), tip: '氣候穩定，是逛街的好日子。傍晚微風徐徐，非常適合去河濱看夕陽。🌇' },
  3: { hourly: generateHourlyWeather(3), tip: '紫外線預報為強烈等級，請務必攜帶遮陽帽或墨鏡。🕶️' },
  4: { hourly: generateHourlyWeather(4), tip: '局部地區有陣雨，建議穿防水涼拖鞋，方便在曼谷街頭移動。🩴' },
  5: { hourly: generateHourlyWeather(5), tip: '多雲轉晴，早晚溫差較小，穿著輕便服飾即可。👕' },
  6: { hourly: generateHourlyWeather(6), tip: '最後一天行程，天氣晴朗。去機場路上可能會塞車，記得提早出發！✈️' },
};

const ScheduleView: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(0);
  const [showFullOverview, setShowFullOverview] = useState(false);
  const [itineraryData, setItineraryData] = useState(INITIAL_BANGKOK_DATA.itinerary);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const dates = ['1/7', '1/8', '1/9', '1/10', '1/11', '1/12', '1/13'];
  const { isEditMode } = useContext(AppContext);

  const currentDayData = itineraryData[selectedDate as keyof typeof itineraryData] || itineraryData[0];
  const weatherData = MOCK_WEATHER[selectedDate] || MOCK_WEATHER[0];

  const handleEditItem = (item: any) => {
    if (!isEditMode) return;
    setEditingItem({ ...item });
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;
    const updatedItinerary = { ...itineraryData };
    const dayItems = [...updatedItinerary[selectedDate as keyof typeof itineraryData].items];
    const itemIndex = dayItems.findIndex(i => i.id === editingItem.id);
    if (itemIndex !== -1) {
      dayItems[itemIndex] = editingItem;
      updatedItinerary[selectedDate as keyof typeof itineraryData].items = dayItems;
      setItineraryData(updatedItinerary);
    }
    setEditingItem(null);
  };

  return (
    <div className="space-y-6 pb-4">
      {/* 總覽封面 */}
      <div className="mori-card p-5 mori-shadow border-4 bg-white relative overflow-hidden">
        <div className="washi-tape washi-tape-pink opacity-60"></div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="text-[#C6A664]" size={20} />
            <h3 className="font-black text-sm uppercase tracking-widest text-[#5D5443]">Trip Overview</h3>
          </div>
          <button 
            onClick={() => setShowFullOverview(!showFullOverview)}
            className="text-[10px] font-black bg-[#FDF9F0] px-3 py-1 rounded-full border-2 border-[#E0E5D5] active:scale-95 transition-transform"
          >
            {showFullOverview ? '收合' : '展開全行程'}
          </button>
        </div>
        
        {showFullOverview && (
          <div className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-top-4">
            {INITIAL_BANGKOK_DATA.tripSummary.map((d) => (
              <div 
                key={d.day}
                onClick={() => {
                  setSelectedDate(d.day - 1);
                  setShowFullOverview(false);
                }}
                className={`flex items-start gap-3 p-3 rounded-2xl border-2 transition-all active:scale-95 cursor-pointer ${
                  selectedDate === d.day - 1 ? 'bg-[#F0F7F0] border-[#8BAE8E]' : 'bg-white border-[#FDF9F0] hover:border-[#E0E5D5]'
                }`}
              >
                <div className={`w-10 h-10 rounded-2xl ${d.color} flex items-center justify-center text-xl shrink-0 border-2 border-white shadow-sm mt-0.5`}>
                  {d.icon}
                </div>
                <div className="flex-1 overflow-hidden">
                  <span className="text-[9px] font-black text-[#8BAE8E] uppercase tracking-tighter">Day {d.day} · {d.date}</span>
                  <p className="text-[11px] font-bold text-[#5D5443] leading-relaxed mt-0.5">
                    {d.title}
                  </p>
                </div>
                <ChevronRight size={14} className="text-gray-300 mt-2 shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 氣象觀測站 */}
      <div className="px-2">
        <div className="mori-card p-4 border-4 border-[#8BAE8E] bg-white mori-shadow overflow-hidden">
          <div className="flex justify-between items-center mb-3">
             <div className="flex items-center gap-2">
               <div className="bg-[#F0F7F0] p-1.5 rounded-lg">
                 <Thermometer size={16} className="text-[#8BAE8E]" />
               </div>
               <h4 className="text-[10px] font-black text-[#5D5443] uppercase tracking-widest">Hourly Forecast (07-23)</h4>
             </div>
             <div className="text-[10px] font-black text-[#8BAE8E] bg-[#F0F7F0] px-2 py-0.5 rounded-full border border-[#E0E5D5]">
               Bangkok, TH
             </div>
          </div>

          {/* 07:00 - 23:00 逐時預報橫向捲動 */}
          <div className="flex gap-4 overflow-x-auto py-3 custom-scrollbar -mx-2 px-2 scroll-smooth">
            {weatherData.hourly.map((h: any, i: number) => (
              <div key={i} className="flex flex-col items-center shrink-0 min-w-[55px] space-y-1 group transition-all">
                <span className="text-[8px] font-black text-gray-400 group-hover:text-[#8BAE8E]">{h.time}</span>
                <div className="w-11 h-11 rounded-2xl bg-[#FDF9F0] border-2 border-[#E0E5D5] flex items-center justify-center text-[#C6A664] group-hover:border-[#C6A664] transition-colors shadow-inner">
                  {h.icon}
                </div>
                <span className="text-[11px] font-black text-[#5D5443]">{h.temp}°</span>
              </div>
            ))}
          </div>

          {/* AI 天氣小貼士 */}
          <div className="mt-4 flex items-start gap-3 bg-[#FDF9F0] p-4 rounded-2xl border-2 border-dashed border-[#8BAE8E]/30 relative">
             <div className="absolute -top-3 -left-1 bg-white border-2 border-[#8BAE8E] rounded-lg px-2 py-0.5 text-[8px] font-black text-[#8BAE8E] uppercase tracking-widest shadow-sm">
                Memo
             </div>
            <div className="bg-white p-2 rounded-xl shadow-sm border border-[#E0E5D5] text-lg mt-1">💡</div>
            <p className="text-[11px] font-bold text-[#5D5443] leading-relaxed">
              {weatherData.tip}
            </p>
          </div>
        </div>
      </div>

      {/* 每日標題 */}
      <div className="px-2 mt-2">
        <h2 className="text-xl font-black text-[#5D5443] tracking-tighter border-l-8 border-[#C6A664] pl-3 py-1">
          {currentDayData?.fullTitle || `Day ${selectedDate + 1} | ${dates[selectedDate]} 行程`}
        </h2>
      </div>

      {/* 日期選擇 */}
      <div className="flex gap-4 overflow-x-auto py-2 custom-scrollbar -mx-4 px-4">
        {dates.map((date, idx) => (
          <button
            key={date}
            onClick={() => setSelectedDate(idx)}
            className={`flex-shrink-0 w-16 h-24 rounded-[2rem] flex flex-col items-center justify-center border-4 transition-all mori-shadow active:scale-90 ${
              selectedDate === idx 
                ? 'bg-[#8BAE8E] border-[#8BAE8E] text-white -translate-y-2' 
                : 'bg-white border-[#E0E5D5] text-[#5D5443]'
            }`}
          >
            <span className="text-[10px] font-black uppercase">D{idx + 1}</span>
            <span className="text-lg font-black">{date}</span>
          </button>
        ))}
      </div>

      {/* 行程清單 */}
      <div className="space-y-6 relative pt-4">
        <div className="absolute left-[2.25rem] top-0 bottom-0 w-1 bg-[#E0E5D5] z-0 rounded-full"></div>
        {currentDayData?.items.map((item: any) => (
          <div key={item.id} className="flex gap-4 z-10 relative group">
            <div className="flex flex-col items-center shrink-0">
              <div className="bg-white border-4 border-[#E0E5D5] rounded-full p-2.5 mori-shadow group-hover:scale-110 transition-transform">
                <div className={`w-3 h-3 rounded-full ${CATEGORY_COLORS[item.category] || 'bg-gray-200'}`}></div>
              </div>
              <span className="text-[10px] font-black mt-2 text-[#C6A664] bg-white px-2 py-0.5 rounded-full border border-[#E0E5D5]">{item.time}</span>
            </div>
            <div 
              onClick={() => handleEditItem(item)}
              className={`flex-1 mori-card p-5 mori-shadow border-4 bg-white transition-all hover:translate-x-1 ${isEditMode ? 'cursor-pointer border-dashed border-[#8BAE8E] hover:bg-[#F0F7F0]' : 'border-[#E0E5D5]'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-lg leading-tight">{item.title}</h3>
                  {isEditMode && <Edit3 size={14} className="text-[#8BAE8E] animate-pulse" />}
                </div>
                <Heart className="text-pink-100 fill-pink-100" size={16} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-gray-700 gap-1.5 font-bold">
                  <MapPin size={14} className="text-red-400" />
                  <span>{item.location}</span>
                </div>
                <div className="flex items-start text-[10px] text-[#8BAE8E] gap-1.5 bg-[#F0F7F0] p-2 rounded-xl border border-[#E0E5D5] font-bold">
                  <Car size={12} className="shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item.transport}</span>
                </div>
              </div>
              {item.note && (
                <div className="mt-3 text-[10px] font-bold text-[#5D5443] bg-[#FDF9F0] p-3 rounded-2xl border-2 border-dashed border-[#C6A664]/30 leading-relaxed">
                  📝 {item.note}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* 交通詳細說明 */}
      <div className="mori-card p-5 bg-[#F2E5D1]/30 border-4 border-[#C6A664] mori-shadow relative overflow-hidden">
        <div className="washi-tape opacity-30 transform -rotate-12"></div>
        <div className="flex items-center gap-2 mb-3 text-[#C6A664]">
          <Info size={16} />
          <h4 className="font-black text-xs uppercase tracking-widest">🚗 交通詳細說明</h4>
        </div>
        <div className="text-[11px] leading-relaxed font-black text-[#5D5443] whitespace-pre-wrap">
          {currentDayData?.dayTransport}
        </div>
      </div>

      {/* 編輯 Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="mori-card w-full max-w-md bg-[#FDF9F0] border-4 border-[#8BAE8E] p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b-2 border-dashed border-[#E0E5D5] pb-3">
              <h3 className="text-lg font-black text-[#5D5443] flex items-center gap-2">
                <Edit3 size={20} className="text-[#8BAE8E]" /> 編輯行程
              </h3>
              <button onClick={() => setEditingItem(null)} className="text-gray-400 p-1 hover:text-red-400 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#8BAE8E] uppercase flex items-center gap-1.5">
                  <Clock size={12} /> 時間
                </label>
                <input 
                  type="text" 
                  value={editingItem.time}
                  onChange={(e) => setEditingItem({...editingItem, time: e.target.value})}
                  className="w-full bg-white border-2 border-[#E0E5D5] rounded-xl px-4 py-2.5 text-sm font-bold focus:border-[#8BAE8E] outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#8BAE8E] uppercase flex items-center gap-1.5">
                  <Type size={12} /> 行程標題
                </label>
                <input 
                  type="text" 
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                  className="w-full bg-white border-2 border-[#E0E5D5] rounded-xl px-4 py-2.5 text-sm font-bold focus:border-[#8BAE8E] outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#8BAE8E] uppercase flex items-center gap-1.5">
                  <MapPin size={12} /> 地點
                </label>
                <input 
                  type="text" 
                  value={editingItem.location}
                  onChange={(e) => setEditingItem({...editingItem, location: e.target.value})}
                  className="w-full bg-white border-2 border-[#E0E5D5] rounded-xl px-4 py-2.5 text-sm font-bold focus:border-[#8BAE8E] outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#8BAE8E] uppercase flex items-center gap-1.5">
                  <AlignLeft size={12} /> 備註內容
                </label>
                <textarea 
                  value={editingItem.note}
                  onChange={(e) => setEditingItem({...editingItem, note: e.target.value})}
                  className="w-full bg-white border-2 border-[#E0E5D5] rounded-xl px-4 py-2.5 text-sm font-bold focus:border-[#8BAE8E] outline-none transition-all min-h-[100px] resize-none"
                />
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button 
                onClick={() => setEditingItem(null)}
                className="flex-1 py-3 rounded-2xl border-2 border-[#E0E5D5] text-gray-400 font-black text-sm bg-white"
              >
                取消
              </button>
              <button 
                onClick={handleSaveEdit}
                className="flex-1 py-3 rounded-2xl bg-[#8BAE8E] text-white font-black text-sm mori-shadow border-2 border-[#8BAE8E]"
              >
                儲存變更
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleView;
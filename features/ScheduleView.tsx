
import React, { useState, useContext } from 'react';
import { MapPin, Info, Heart, CalendarDays, ChevronRight, Car, Edit3, X, Clock, Type, AlignLeft } from 'lucide-react';
import { CATEGORY_COLORS } from '../constants.tsx';
import { AppContext } from '../App';

const INITIAL_BANGKOK_DATA = {
  tripSummary: [
    { day: 1, date: '1/7 (三)', title: '素萬那普機場 (BKK) · MBK Center · 朱拉隆功美食街 (Banthat Thong Road) · Lotus 蓮花超市', icon: '🛫', color: 'bg-orange-100' },
    { day: 2, date: '1/8 (四)', title: '水門市場 Platinum · 紅大哥海南雞飯 · Pratunam Market · December\'s · Tofu Skin · Siam商圈 (Central World、Siam Discovery、Siam Center、Siam Paragon) · Big C Supercenter', icon: '🛍️', color: 'bg-blue-100' },
    { day: 3, date: '1/9 (五)', title: '榮泰米粉湯 (Rung Rueang) · BENKOFF 咖啡廳 · EmSphere · Phed Mark (打拋豬名店) · Terminal 21 Asok · Yum² (After Yum)', icon: '🍜', color: 'bg-green-100' },
    { day: 4, date: '1/10 (六)', title: '勝利紀念碑船麵 · 泰北咖哩麵 (Khao Soi) · 洽圖洽週末市集 (Chatuchak Market) · 喬德夜市 (Jodd Fairs) · 光輝燈夜市 (輝煌夜市)', icon: '🎋', color: 'bg-yellow-100' },
    { day: 5, date: '1/11 (日)', title: 'Kuay Jab Mr. Joe 脆皮豬肉粿汁 · 嵩越路 (Song Wat) · 唐人街 · TumLubThai · 鄭王廟 (Wat Arun) · 大皇宮/玉佛寺 · 臥佛寺 · 河濱夜市 (Asiatique)', icon: '🏯', color: 'bg-red-100' },
    { day: 6, date: '1/12 (一)', title: '邢泰記 · 60 年烤肉 · 班蘭蛋捲 · ICONSIAM 暹羅天地 · Kodtalay 海鮮餐廳 · Central Park Bangkok (Dusit Central Park)', icon: '💎', color: 'bg-purple-100' },
    { day: 7, date: '1/13 (二)', title: '飯店週邊 (Ibis Bangkok Siam) · Lotus 超市 · 素萬那普機場 (BKK)', icon: '✈️', color: 'bg-gray-100' },
  ],
  itinerary: {
    0: {
      fullTitle: 'Day 1 | 1/7 (三) 入境與美食探索',
      items: [
        { id: '1-1', time: '16:30', title: '抵達素萬那普機場 (BKK) 🛫', location: 'BKK Airport', transport: 'ARL → Phaya Thai 轉 BTS', category: 'Transport', note: '領取行李與網卡，開啟曼谷之旅。' },
        { id: '1-2', time: '19:00', title: 'MBK Center 購物與伴手禮 🛍️', location: '飯店對面', transport: '步行即達', category: 'Shopping', note: '採買藥妝、零食與平價服飾。' },
        { id: '1-3', time: '20:30', title: '朱拉隆功美食街、60 年烤肉 🍖', location: 'Banthat Thong Road', transport: '步行 10-15 分鐘', category: 'Food', note: '米其林必比登戰區，必吃傳統烤肉。' },
        { id: '1-4', time: '22:00', title: 'Lotus 蓮花超市 補貨 🛒', location: '飯店西側', transport: '步行 5 分鐘', category: 'Shopping', note: '大型超市，補足生活用品與零食。' },
      ],
      dayTransport: "機場至飯店：ARL 至 Phaya Thai 轉 BTS 至 National Stadium。\n市中心移動：全程步行即可抵達各大商圈。"
    },
    1: {
      fullTitle: 'Day 2 | 1/8 (四) 水門市場與 Siam 購物',
      items: [
        { id: '2-1', time: '10:00', title: '水門市場 Platinum 👗', location: 'Platinum Fashion Mall', transport: 'Skywalk 步行', category: 'Shopping', note: '泰國最大服飾批發中心，有冷氣吹非常舒適。' },
        { id: '2-2', time: '12:00', title: '紅大哥海南雞飯 🍛', location: '水門市場旁', transport: '步行', category: 'Food', note: '必吃米其林推薦名店。' },
        { id: '2-3', time: '13:00', title: 'December\'s & Tofu Skin 🛍️', location: '水門市場巷弄', transport: '步行', category: 'Shopping', note: '探索在地品牌 December\'s 與高評價選物店。' },
        { id: '2-4', time: '15:30', title: 'Siam 商圈百貨巡禮 🏢', location: 'Siam 區', transport: 'Skywalk', category: 'Shopping', note: '包含 Siam Discovery、Center 與 Paragon。' },
        { id: '2-5', time: '20:00', title: 'Big C Supercenter 🛒', location: 'Chit Lom', transport: '步行/Skywalk', category: 'Shopping', note: '全曼谷最知名的 Big C，泰式泡麵、燕窩一次買齊。' },
      ],
      dayTransport: "推薦方式：利用空中步道 (Skywalk) 避開塞車，串聯 Siam 百貨至水門空橋。"
    },
    2: {
      fullTitle: 'Day 3 | 1/9 (五) 素坤逸現代曼谷巡禮',
      items: [
        { id: '3-1', time: '09:00', title: '榮泰米粉湯 (Rung Rueang) 🍜', location: 'BTS Phrom Phong', transport: 'BTS 綠線', category: 'Food', note: '連年米其林必比登推薦，湯頭鮮美。' },
        { id: '3-2', time: '10:00', title: 'EmSphere 百貨探索 🛍️', location: 'BTS Phrom Phong', transport: '步行即達', category: 'Shopping', note: '曼谷最新開幕百貨，設計感十足。' },
        { id: '3-3', time: '11:00', title: 'BENKOFF 咖啡廳 ☕', location: 'Thong Lor 區', transport: 'Grab/BTS 轉步行', category: 'Food', note: '超紅臘腸狗店長 Bobby & Billy 在這裡喔！' },
        { id: '3-4', time: '11:30', title: 'Mae Varee 芒果糯米飯 🥭', location: 'Thong Lor 站旁', transport: '步行', category: 'Food', note: '曼谷最知名的芒果糯米飯老店之一。' },
        { id: '3-5', time: '13:00', title: 'Phed Mark 打拋豬名店 🌶️', location: 'BTS Ekkamai', transport: 'BTS 綠線', category: 'Food', note: '部落客 Mark Wiens 創立，挑戰超辛辣打拋豬。' },
        { id: '3-6', time: '15:30', title: 'Terminal 21 Asok 🌍', location: 'Asok 站', transport: 'BTS 綠線', category: 'Shopping', note: '以環遊世界為主題，美食街物美價廉。' },
        { id: '3-7', time: '19:00', title: 'Yum² (After Yum) 🥗', location: 'BTS Ekkamai', transport: 'BTS 綠線', category: 'Food', note: '超人氣涼拌菜，口味酸辣帶勁。' },
      ],
      dayTransport: "主要工具：BTS 綠線 (Sukhumvit Line)。景點皆位於站點附近。"
    },
    3: {
      fullTitle: 'Day 4 | 1/10 (六) 洽圖洽與夜市雙響炮',
      items: [
        { id: '4-1', time: '08:30', title: '勝利紀念碑船麵/泰北咖哩麵 🍜', location: 'Victory Monument', transport: 'BTS 綠線', category: 'Food', note: '體驗一碗 10-20 元的船麵與濃郁 Khao Soi。' },
        { id: '4-2', time: '10:00', title: '洽圖洽週末市集 🎋', location: 'BTS Mo Chit', transport: 'BTS 綠線', category: 'Shopping', note: '全球最大戶外市集，僅週末開放，上萬攤位。' },
        { id: '4-3', time: '18:30', title: '喬德夜市 (Jodd Fairs) 🍖', location: 'MRT Phra Ram 9', transport: 'MRT 藍線', category: 'Food', note: '曼谷最紅夜市，必吃火山排骨。' },
        { id: '4-4', time: '21:00', title: '輝煌夜市宵夜場 🍢', location: 'MRT Huai Khwang', transport: 'MRT 藍線', category: 'Food', note: '具在地生活氣息，體驗曼谷人日常宵夜。' },
      ],
      dayTransport: "BTS 與 MRT 轉乘：從洽圖洽 (Mo Chit) 轉搭 MRT 藍線往喬德與輝煌夜市。"
    },
    4: {
      fullTitle: 'Day 5 | 1/11 (日) 舊城古蹟與落日航行',
      items: [
        { id: '5-1', time: '07:30', title: 'Mr. Joe 脆皮豬肉粿汁 🥣', location: 'Chan Road', transport: 'BTS → Grab', category: 'Food', note: '傳奇脆皮豬肉，湯頭胡椒味濃郁。' },
        { id: '5-2', time: '10:30', title: '唐人街 & 嵩越路老街 🏮', location: 'MRT Wat Mangkon', transport: 'MRT 藍線', category: 'Sightseeing', note: '感受老屋新生文青感，吃 TumLubThai 椰奶點心。' },
        { id: '5-3', time: '13:30', title: '鄭王廟 & 大皇宮古蹟群 🏯', location: '河岸區', transport: '接駁船', category: 'Sightseeing', note: '曼谷精華古蹟，必買鄭王廟造型煎餅。' },
        { id: '5-4', time: '17:30', title: '落日航行 (藍旗觀光船) 🌇', location: '昭披耶河', transport: '觀光船', category: 'Sightseeing', note: '夕陽餘暉中欣賞河岸絕美夜間燈光。' },
        { id: '5-5', time: '21:00', title: '河濱夜市 Asiatique 🎡', location: 'Sathorn Pier', transport: '免費接駁船', category: 'Shopping', note: '倉庫風格商場，有摩天輪與美麗河景。' },
      ],
      dayTransport: "河運指南：17:30 於 Tha Tien 碼頭搭「藍旗觀光船」最具CP值。"
    },
    5: {
      fullTitle: 'Day 6 | 1/12 (一) 老派浪漫與新地標',
      items: [
        { id: '6-1', time: '09:00', title: '邢泰記 & 60 年烤肉 ☕', location: 'Giant Swing 附近', transport: 'Grab', category: 'Food', note: '泰式老派早茶館，必吃班蘭蛋捲。' },
        { id: '6-2', time: '13:00', title: 'ICONSIAM 暹羅天地 💎', location: '河岸', transport: '接駁船', category: 'Shopping', note: '曼谷最強百貨，地下一樓水上市場超豐富。' },
        { id: '6-3', time: '17:00', title: 'Kodtalay 海鮮餐廳 🦀', location: '市區', transport: 'Grab', category: 'Food', note: '最後一晚大餐，食材鮮美種類齊全。' },
        { id: '6-4', time: '20:00', title: 'Central Park (新地標) 🏢', location: 'Silom 區', transport: 'BTS Sala Daeng', category: 'Sightseeing', note: '漫步欣賞城市夜色與現代建築美學。' },
      ],
      dayTransport: "多元移動：舊城區叫 Grab，往 ICONSIAM 搭接駁船，晚上搭 BTS。"
    },
    6: {
      fullTitle: 'Day 7 | 1/13 (二) 完美賦歸',
      items: [
        { id: '7-1', time: '10:00', title: '飯店週邊最後採買 🧸', location: 'National Stadium', transport: '步行', category: 'Shopping', note: '最後衝刺 Lotus 超市或飯店休息。' },
        { id: '7-2', time: '13:30', title: '出發前往機場 ✈️', location: 'BKK Airport', transport: 'BTS → ARL', category: 'Transport', note: '建議 14:40 前抵達機場完成報到。' },
        { id: '7-3', time: '17:40', title: '星宇 JX746 起飛 🛫', location: 'BKK Airport', transport: 'Flight', category: 'Transport', note: '再見曼谷！帶著滿滿回憶回家。' },
      ],
      dayTransport: "返程交通：BTS National Stadium -> Siam -> Phaya Thai 轉 ARL。"
    }
  }
};

const ScheduleView: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(0);
  const [showFullOverview, setShowFullOverview] = useState(false);
  const [itineraryData, setItineraryData] = useState(INITIAL_BANGKOK_DATA.itinerary);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const dates = ['1/7', '1/8', '1/9', '1/10', '1/11', '1/12', '1/13'];
  const { isEditMode } = useContext(AppContext);

  const currentDayData = itineraryData[selectedDate as keyof typeof itineraryData] || itineraryData[0];

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
            {INITIAL_BANGKOK_DATA.tripSummary.map((d, i) => (
              <div 
                key={i}
                onClick={() => {
                  setSelectedDate(i);
                  setShowFullOverview(false);
                }}
                className={`flex items-start gap-3 p-3 rounded-2xl border-2 transition-all active:scale-95 cursor-pointer ${
                  selectedDate === i ? 'bg-[#F0F7F0] border-[#8BAE8E]' : 'bg-white border-[#FDF9F0] hover:border-[#E0E5D5]'
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

      {/* 每日標題 */}
      <div className="px-2 mt-2">
        <h2 className="text-xl font-black text-[#5D5443] tracking-tighter border-l-8 border-[#C6A664] pl-3 py-1">
          {currentDayData?.fullTitle}
        </h2>
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

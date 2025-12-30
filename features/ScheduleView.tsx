
import React, { useState, useContext } from 'react';
import { MapPin, Info, Heart, CalendarDays, ChevronRight, Car } from 'lucide-react';
import { CATEGORY_COLORS } from '../constants.tsx';
// Fix: Use AppContext instead of EditModeContext
import { AppContext } from '../App';

const BANGKOK_DATA = {
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
        { id: '2-3', time: '13:00', title: 'Pratunam Market、December\'s、Tofu Skin 🛍️', location: '水門市場巷弄', transport: '步行', category: 'Shopping', note: '深入巷弄探索在地品牌與高評價選物店。' },
        { id: '2-4', time: '15:30', title: 'Central World、Siam 商圈 🏢', location: 'Siam 區', transport: 'Skywalk', category: 'Shopping', note: '全球知名購物地標，包含 Siam Discovery, Center, Paragon。' },
        { id: '2-5', time: '20:00', title: 'Big C Supercenter 🛒', location: 'Central World 對面', transport: '步行', category: 'Shopping', note: '全曼谷最知名分店，零食泡麵伴手禮一次買齊。' },
      ],
      dayTransport: "建議利用 Skywalk (空中步道) 步行，避開塞車與豔陽。"
    },
    2: {
      fullTitle: 'Day 3 | 1/9 (五) Sukhumvit 素坤逸 現代曼谷巡禮',
      items: [
        { id: '3-1', time: '09:00', title: '榮泰米粉湯 (Rung Rueang) 🍜', location: 'BTS Phrom Phong', transport: 'BTS 綠線', category: 'Food', note: '連續多年米其林必比登推薦，其豬肉米粉湯頭與鮮美魚丸是曼谷經典。' },
        { id: '3-2', time: '10:00', title: 'EmSphere 購物 ✨', location: 'BTS Phrom Phong', transport: '步行', category: 'Shopping', note: '曼谷最新開幕的百貨，設計感十足。' },
        { id: '3-3', time: '11:00', title: 'BENKOFF 咖啡廳 🐶', location: 'Thong Lor', transport: 'Grab 或 BTS 轉步行', category: 'Food', note: '兩隻臘腸狗店長 Bobby 與 Billy 而在社群上爆紅。' },
        { id: '3-4', time: '11:30', title: '芒果糯米飯 (Mae Varee) 🥭', location: 'Thong Lor 站旁', transport: '步行', category: 'Food', note: 'Thong Lor 區知名老店。' },
        { id: '3-5', time: '13:00', title: '午餐：Phed Mark (打拋豬名店) 🌶️', location: 'BTS Ekkamai', transport: 'BTS 續搭', category: 'Food', note: 'Mark Wiens 創立，以超辛辣挑戰聞名。' },
        { id: '3-6', time: '15:30', title: 'Terminal 21 Asok 🌍', location: 'BTS Asok', transport: 'BTS 續搭', category: 'Shopping', note: '「環遊世界」主題百貨，每一層樓都是不同國家裝潢。' },
        { id: '3-7', time: '19:00', title: '晚餐：Yum² (After Yum) 🥗', location: 'BTS Ekkamai', transport: 'BTS 續搭', category: 'Food', note: '超人氣涼拌菜品牌，口味酸辣帶勁。' },
      ],
      dayTransport: "主要利用 BTS 綠線移動，快速且便捷。"
    },
    3: {
      fullTitle: 'Day 4 | 1/10 (六) 洽圖洽週末市集與夜市雙響炮',
      items: [
        { id: '4-1', time: '08:30', title: '勝利紀念碑船麵、泰北咖哩麵 🥣', location: 'Victory Monument', transport: 'BTS', category: 'Food', note: '到勝利紀念碑體驗一碗僅 10-20 元的船麵。' },
        { id: '4-2', time: '09:30', title: '泰北咖哩麵 (Khao Soi) 🥘', location: 'Ari', transport: 'BTS', category: 'Food', note: '泰北必吃的濃郁風味。' },
        { id: '4-3', time: '10:00', title: '洽圖洽週末市集 (Chatuchak Market) 🎋', location: 'Mo Chit 站', transport: 'BTS', category: 'Shopping', note: '全球最大戶外市集，僅在週末開放，擁有上萬個攤位。' },
        { id: '4-4', time: '18:30', title: '喬德夜市 (Jodd Fairs) 🌉', location: 'Phra Ram 9', transport: 'MRT 藍線', category: 'Food', note: '曼谷人氣最高夜市，火山排骨與街頭小吃非常出名。' },
        { id: '4-5', time: '21:00', title: '光輝燈夜市 (輝煌夜市) 🏮', location: 'Huai Khwang 站', transport: 'MRT 續搭', category: 'Food', note: '具在地生活氣息的夜市，適合體驗曼谷人的日常宵夜生活。' },
      ],
      dayTransport: "利用 BTS 與 MRT 交會點移動，避免曼谷週末的地面塞車。"
    },
    4: {
      fullTitle: 'Day 5 | 1/11 (日) 舊城古蹟與落日河岸航行',
      items: [
        { id: '5-1', time: '07:30', title: 'Kuay Jab Mr. Joe 脆皮豬肉粿汁 🥣', location: 'Saphan Taksin 區', transport: 'BTS + Grab', category: 'Food', note: '傳奇脆皮豬肉店，粿汁湯頭胡椒味濃郁，脆皮酥脆不油膩。' },
        { id: '5-2', time: '10:30', title: '唐人街、嵩越路、TumLubThai 🏮', location: 'Song Wat Road', transport: 'MRT Wat Mangkon', category: 'Sightseeing', note: '走訪百年老街，品嚐 TumLubThai 椰奶小點心 (Khanom Krok)。' },
        { id: '5-3', time: '13:30', title: '鄭王廟、大皇宮、玉佛寺、臥佛寺 🏯', location: 'Old City', transport: '渡輪', category: 'Sightseeing', note: '曼谷精華古蹟群。鄭王廟必買造型煎餅。' },
        { id: '5-4', time: '17:30', title: '傍晚落日航行 ⛴️', location: '河岸', transport: '藍旗觀光船', category: 'Sightseeing', note: '在夕陽餘暉中搭船，觀賞鄭王廟、大皇宮絕美夜間燈光。' },
        { id: '5-5', time: '21:00', title: '河濱夜市 (Asiatique) 🎡', location: 'Charoen Krung', transport: '接駁船', category: 'Shopping', note: '融合碼頭倉庫風格的商場，有摩天輪與美麗河岸風光。' },
      ],
      dayTransport: "舊城區建議使用水路交通或 Grab 叫車，體驗曼谷多元的交通方式。"
    },
    5: {
      fullTitle: 'Day 6 | 1/12 (一) 老派浪漫與曼谷地標',
      items: [
        { id: '6-1', time: '09:00', title: '邢泰記、60 年烤肉、班蘭蛋捲 ☕', location: 'Giant Swing 區', transport: 'Grab', category: 'Food', note: '具有悠久歷史的泰式早茶館。班蘭蛋捲則是經典街頭甜點。' },
        { id: '6-2', time: '13:00', title: 'ICONSIAM 暹羅天地 💎', location: '河畔', transport: '接駁船', category: 'Shopping', note: '曼谷最強百貨，地下一樓 SookSiam 集結全泰國美食。' },
        { id: '6-3', time: '17:00', title: 'Kodtalay 海鮮餐廳 (晚餐) 🦀', location: '海鮮餐廳', transport: 'Grab', category: 'Food', note: '食材新鮮種類豐富，適合享用曼谷最後一晚大餐。' },
        { id: '6-4', time: '20:00', title: 'Central Park Bangkok (新地標) 🌃', location: 'Silom 區', transport: 'BTS Sala Daeng', category: 'Sightseeing', note: 'Silom 區新地標，漫步欣賞城市夜色與充滿現代感建築群。' },
      ],
      dayTransport: "最後一晚推薦直接使用 Grab 叫車往返景點，方便且快速。"
    },
    6: {
      fullTitle: 'Day 7 | 1/13 (二) 完美賦歸',
      items: [
        { id: '7-1', time: '10:00', title: '飯店週邊最後採買或休息 🧸', location: 'Ibis Bangkok Siam', transport: '步行', category: 'Shopping', note: '享受飯店設施或在飯店後的 Lotus 超市進行最後補貨。' },
        { id: '7-2', time: '13:30', title: '出發前往機場 🚙', location: 'BKK Airport', transport: 'ARL', category: 'Transport', note: '搭乘 BTS 轉 ARL 機場快線，建議 14:40 前抵達。' },
        { id: '7-3', time: '17:40', title: '星宇航空 JX746 起飛 ✈️', location: 'BKK Airport', transport: '飛航', category: 'Transport', note: '起飛回台灣，結束愉快的曼谷旅程。' },
      ],
      dayTransport: "預留足夠的時間前往機場，以免被下午的高峰期交通耽誤。"
    }
  }
};

const ScheduleView: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(0);
  const [showFullOverview, setShowFullOverview] = useState(false);
  const dates = ['1/7', '1/8', '1/9', '1/10', '1/11', '1/12', '1/13'];
  // Fix: Use AppContext
  const { isEditMode } = useContext(AppContext);

  const currentDayData = BANGKOK_DATA.itinerary[selectedDate as keyof typeof BANGKOK_DATA.itinerary] || BANGKOK_DATA.itinerary[0];

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
            {BANGKOK_DATA.tripSummary.map((d) => (
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

      {/* 每日標題 */}
      <div className="px-2">
        <h2 className="text-xl font-black text-[#5D5443] tracking-tighter border-l-8 border-[#C6A664] pl-3 py-1">
          {currentDayData.fullTitle || `Day ${selectedDate + 1} | ${dates[selectedDate]} 行程`}
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
        {currentDayData.items.map((item) => (
          <div key={item.id} className="flex gap-4 z-10 relative group">
            <div className="flex flex-col items-center shrink-0">
              <div className="bg-white border-4 border-[#E0E5D5] rounded-full p-2.5 mori-shadow group-hover:scale-110 transition-transform">
                <div className={`w-3 h-3 rounded-full ${CATEGORY_COLORS[item.category] || 'bg-gray-200'}`}></div>
              </div>
              <span className="text-[10px] font-black mt-2 text-[#C6A664] bg-white px-2 py-0.5 rounded-full border border-[#E0E5D5]">{item.time}</span>
            </div>
            <div className="flex-1 mori-card p-5 mori-shadow border-4 bg-white transition-all hover:translate-x-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-black text-lg leading-tight">{item.title}</h3>
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
          {currentDayData.dayTransport}
        </div>
      </div>
    </div>
  );
};

export default ScheduleView;

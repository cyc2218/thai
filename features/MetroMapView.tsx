import React, { useState, useEffect } from 'react';
import { Download, Info, Camera, Trash2, RefreshCw, Link } from 'lucide-react';
import { db } from '../services/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

const MetroMapView: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [inputUrl, setInputUrl] = useState('');
  const [showInput, setShowInput] = useState(false);
  const docId = 'trip_metro_map_v1';

  // 監聽 Firebase 資料
  useEffect(() => {
    if (!db) return;
    const unsub = onSnapshot(doc(db, 'trips', docId), (docSnap) => {
      if (docSnap.exists()) {
        setImage(docSnap.data().imageUrl);
      }
    });
    return () => unsub();
  }, []);

  const handleSaveUrl = async () => {
    if (!inputUrl.trim() || !db) return;
    try {
      await setDoc(doc(db, 'trips', docId), { imageUrl: inputUrl.trim() }, { merge: true });
      setShowInput(false);
      setInputUrl('');
    } catch (error) {
      console.error("Save URL failed:", error);
      alert("儲存連結失敗，請稍後再試 🐛");
    }
  };

  const removeImage = async () => {
    if (confirm('確定要移除這張照片嗎？🧸') && db) {
      await setDoc(doc(db, 'trips', docId), { imageUrl: null }, { merge: true });
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="px-2">
        <h2 className="text-xl font-black text-[#5D5443] tracking-tighter border-l-8 border-[#8BAE8E] pl-3 py-1">
          重要圖資與地圖 🗺️
        </h2>
      </div>

      {/* 照片顯示/上傳容器 */}
      <div className="mori-card overflow-hidden mori-shadow border-4 bg-white relative group p-2">
        <div className="washi-tape washi-tape-pink opacity-80 z-20"></div>

        {/* 工具列 */}
        {image && (
          <div className="absolute top-8 right-6 z-20 flex flex-col gap-2">
            <button
              onClick={() => {
                setShowInput(true);
                setImage(null);
              }}
              className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl border-2 border-[#E0E5D5] shadow-sm active:scale-75 transition-transform"
              title="更換照片"
            >
              <RefreshCw size={20} className="text-[#8BAE8E]" />
            </button>
            <button
              onClick={removeImage}
              className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl border-2 border-[#E0E5D5] shadow-sm active:scale-75 transition-transform"
              title="刪除照片"
            >
              <Trash2 size={20} className="text-red-400" />
            </button>
          </div>
        )}

        <div className="bg-[#FDF9F0] min-h-[350px] flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#E0E5D5] rounded-[1.5rem] relative">
          {image ? (
            <div className="bg-white p-3 shadow-xl rotate-1 border border-gray-100 w-full animate-in fade-in zoom-in-95 duration-300">
              <img
                src={image}
                alt="Uploaded Content"
                className="w-full h-auto rounded-sm object-contain max-h-[600px]"
              />
              <div className="mt-4 border-t border-gray-100 pt-2 text-center">
                <p className="text-[10px] font-black text-gray-400 italic">" 已保存至本地手帳 " 🍭</p>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-sm">
              {!showInput ? (
                <button
                  onClick={() => setShowInput(true)}
                  className="flex flex-col items-center gap-4 group active:scale-95 transition-transform w-full"
                >
                  <div className="w-24 h-24 rounded-[2.5rem] bg-white border-4 border-[#E0E5D5] flex items-center justify-center text-[#E0E5D5] group-hover:text-[#8BAE8E] group-hover:border-[#8BAE8E] transition-colors mori-shadow">
                    <Camera size={40} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-black text-[#5D5443]">點擊設定地圖</p>
                    <p className="text-[10px] text-gray-400 font-bold mt-1">貼上圖片連結，全團同步 ✨</p>
                  </div>
                </button>
              ) : (
                <div className="animate-in zoom-in-95 duration-200 bg-white p-4 rounded-3xl border-4 border-[#8BAE8E] mori-shadow space-y-3">
                  <div className="flex items-center gap-2 text-[#8BAE8E] mb-1">
                    <Link size={16} />
                    <span className="text-xs font-black">貼上圖片連結</span>
                  </div>
                  <input
                    autoFocus
                    type="text"
                    placeholder="https://imgur.com/..."
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    className="w-full bg-[#FDF9F0] border-2 border-[#E0E5D5] rounded-xl px-3 py-2 text-xs font-bold text-[#5D5443] outline-none focus:border-[#8BAE8E]"
                  />
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setShowInput(false)}
                      className="flex-1 py-2 rounded-xl text-gray-400 text-xs font-black hover:bg-gray-50 transition-colors"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleSaveUrl}
                      className="flex-1 py-2 rounded-xl bg-[#8BAE8E] text-white text-xs font-black mori-shadow active:scale-95 transition-transform"
                    >
                      儲存連結
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="absolute bottom-4 left-4 right-4 flex justify-center">
            <div className="bg-[#8BAE8E] text-white text-[8px] font-black px-4 py-1 rounded-full mori-shadow border-2 border-white">
              TRAVEL MEMO STORAGE
            </div>
          </div>
        </div>

        {/* 底部說明 */}
        <div className="p-4 bg-white border-t-4 border-[#FDF9F0] flex justify-between items-center">
          <div className="flex flex-col">
            <p className="text-[10px] font-black text-[#5D5443]">自由上傳區域</p>
            <p className="text-[8px] text-gray-400 font-bold italic">適合放置地圖、預約確認、或清單照片 🖍️</p>
          </div>
          {image && (
            <a
              href={image}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#8BAE8E] text-white px-4 py-2 rounded-2xl text-[10px] font-black flex items-center gap-2 active:scale-90 transition-transform mori-shadow"
            >
              <Download size={14} /> 開啟原圖
            </a>
          )}
        </div>
      </div>

      {/* 乘車指南 - 始終保留作為參考 */}
      <div className="mori-card p-6 border-4 bg-[#F0F7F0] mori-shadow relative">
        <div className="flex items-center gap-2 mb-4 text-[#8BAE8E]">
          <Info size={18} />
          <h4 className="font-black text-sm uppercase tracking-widest">地鐵乘車小撇步</h4>
        </div>
        <ul className="space-y-3">
          {[
            { tag: 'BTS', text: '綠色與藍綠色線，屬於高架輕軌，可用 Rabbit 卡。', color: 'text-green-600' },
            { tag: 'MRT', text: '藍色與紫色線，屬於地下鐵，卡片與 BTS 不通用。', color: 'text-blue-600' },
            { tag: '支付', text: '多數站點可使用 Visa/Master 感應刷卡進站。', color: 'text-orange-600' },
            { tag: '工具', text: '建議上傳最新地鐵全線圖或票價表以便查閱。', color: 'text-purple-600' }
          ].map((item, idx) => (
            <li key={idx} className="flex gap-3 items-start">
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border border-current shrink-0 mt-0.5 ${item.color}`}>
                {item.tag}
              </span>
              <p className="text-[11px] font-bold text-[#5D5443] leading-relaxed">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MetroMapView;

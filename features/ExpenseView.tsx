import React, { useState, useContext, useMemo } from 'react';
import { Plus, TrendingUp, Trash2, Check, X, Calculator, Calendar, AlertCircle, AlertTriangle, Clock } from 'lucide-react';
// 使用 AppContext 取得編輯狀態
import { AppContext } from '../App';

interface ExpenseItem {
  id: number;
  title: string;
  amount: number;
  cat: string;
  user: string;
  emoji: string;
  date: string;
}

const CATEGORIES = [
  { id: 'All', label: '全部', emoji: '🌈' },
  { id: 'Food', label: '美食', emoji: '🍱' },
  { id: 'Transport', label: '交通', emoji: '🚆' },
  { id: 'Shopping', label: '購物', emoji: '🛍️' },
];

const TRIP_DATES = [
  { date: '2026-01-07', label: '1/7 (D1)' },
  { date: '2026-01-08', label: '1/8 (D2)' },
  { date: '2026-01-09', label: '1/9 (D3)' },
  { date: '2026-01-10', label: '1/10 (D4)' },
  { date: '2026-01-11', label: '1/11 (D5)' },
  { date: '2026-01-12', label: '1/12 (D6)' },
  { date: '2026-01-13', label: '1/13 (D7)' },
];

const ExpenseView: React.FC = () => {
  const { isEditMode } = useContext(AppContext);
  const [activeFilter, setActiveFilter] = useState('All');
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    { id: 1, title: '朱拉隆功烤肉宵夜', amount: 450, cat: 'Food', user: 'Alex', emoji: '🍱', date: '2026-01-07' },
    { id: 2, title: 'BTS 儲值卡加值', amount: 300, cat: 'Transport', user: 'Me', emoji: '🚆', date: '2026-01-07' },
    { id: 3, title: 'Big C 伴手禮', amount: 2800, cat: 'Shopping', user: 'Jamie', emoji: '🛍️', date: '2026-01-08' },
    { id: 4, title: '紅大哥海南雞飯', amount: 120, cat: 'Food', user: 'Me', emoji: '🍱', date: '2026-01-08' },
  ]);

  const exchangeRate = 0.95;
  const [showAdd, setShowAdd] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [inputAmount, setInputAmount] = useState('0');
  const [inputTitle, setInputTitle] = useState('');
  const [selectedCat, setSelectedCat] = useState(CATEGORIES[1]);
  const [selectedDate, setSelectedDate] = useState('2026-01-07');

  // 過濾後的支出項目
  const filteredExpenses = useMemo(() => 
    activeFilter === 'All' ? expenses : expenses.filter(e => e.cat === activeFilter)
  , [expenses, activeFilter]);

  // 計算總額
  const categoryTotal = useMemo(() => 
    filteredExpenses.reduce((sum, item) => sum + item.amount, 0)
  , [filteredExpenses]);

  // 每日統計資料
  const dailyStats = useMemo(() => {
    const stats: Record<string, number> = {};
    TRIP_DATES.forEach(d => stats[d.date] = 0);
    expenses.forEach(e => {
      if (stats[e.date] !== undefined) stats[e.date] += e.amount;
    });
    return TRIP_DATES.map(d => ({ date: d.date.split('-').slice(1).join('/'), total: stats[d.date] }));
  }, [expenses]);

  // 觸發刪除流程
  const askDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDeleteId(id);
  };

  // 執行刪除
  const executeDelete = () => {
    if (confirmDeleteId !== null) {
      setExpenses(prev => prev.filter(item => item.id !== confirmDeleteId));
      setConfirmDeleteId(null);
    }
  };

  const handleKeyPress = (key: string | number) => {
    if (key === 'C') setInputAmount('0');
    else if (key === '✓') saveExpense();
    else if (typeof key === 'string' && ['🍱', '🚆', '🛍️'].includes(key)) {
      const found = CATEGORIES.find(c => c.emoji === key);
      if (found) setSelectedCat(found);
    } else {
      setInputAmount(prev => {
        if (prev === '0' && key !== '.') return String(key);
        if (prev.includes('.') && key === '.') return prev;
        return prev.length > 8 ? prev : prev + key;
      });
    }
  };

  const saveExpense = () => {
    const amt = parseFloat(inputAmount);
    if (isNaN(amt) || amt <= 0) return alert('請輸入有效金額 🥟');
    const newEntry: ExpenseItem = {
      id: Date.now(),
      title: inputTitle || `${selectedCat.label}支出`,
      amount: amt,
      cat: selectedCat.id,
      user: 'Me',
      emoji: selectedCat.emoji,
      date: selectedDate,
    };
    setExpenses([newEntry, ...expenses]);
    setShowAdd(false);
    setInputAmount('0');
    setInputTitle('');
    // 不重置日期，方便連續記帳同一天的花費
  };

  return (
    <div className="space-y-6 pb-32">
      {/* 總額卡片 */}
      <div className="mori-card bg-[#8BAE8E] text-white p-6 mori-shadow border-4 border-[#E0E5D5] relative overflow-hidden transition-all">
        <div className="washi-tape washi-tape-pink opacity-40"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80">
              {activeFilter === 'All' ? 'Total Expenses' : `${selectedCat.label} Total`}
            </p>
            <TrendingUp size={20} className="opacity-80" />
          </div>
          <p className="text-4xl font-black my-2">฿ {categoryTotal.toLocaleString()}</p>
          <div className="flex items-center gap-2 mt-4">
            <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black border border-white/30">
              ≈ NT$ {Math.round(categoryTotal * exchangeRate).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 每日統計圖表 */}
      <div className="mori-card p-5 mori-shadow border-4 bg-white relative">
        <div className="flex items-center gap-2 mb-4 border-b-2 border-dashed border-[#FDF9F0] pb-2 text-[#C6A664]">
          <Calendar size={18} />
          <h3 className="font-black text-[10px] uppercase tracking-widest">Daily Summary (THB)</h3>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {dailyStats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-[8px] font-bold text-gray-400 mb-1">{stat.date}</span>
              <div className="w-full bg-[#FDF9F0] rounded-full h-16 relative overflow-hidden border border-[#E0E5D5]">
                <div 
                  className="absolute bottom-0 w-full bg-[#8BAE8E] transition-all duration-700" 
                  style={{ height: `${Math.min(100, (stat.total / 4000) * 100)}%` }}
                ></div>
              </div>
              <span className="text-[8px] font-black mt-1 text-[#5D5443]">฿{stat.total || '-'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 分類篩選 */}
      <div className="flex gap-2 overflow-x-auto py-2 custom-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveFilter(cat.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-[10px] font-black border-2 transition-all active:scale-95 ${
              activeFilter === cat.id ? 'bg-[#C6A664] border-[#C6A664] text-white shadow-md' : 'bg-white border-[#E0E5D5] text-gray-400'
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* 支出清單 */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-2">
           <h3 className="font-black text-[10px] text-gray-400 uppercase tracking-widest flex items-center gap-2 flex-1">
            Activity Log <div className="h-[1px] flex-1 bg-[#E0E5D5]"></div>
          </h3>
          {isEditMode && (
             <span className="text-[9px] font-black text-red-400 bg-red-50 px-2 py-0.5 rounded-full border border-red-100 animate-pulse ml-2">
               解鎖編輯中
             </span>
          )}
        </div>

        {filteredExpenses.map((item) => (
          <div key={item.id} className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className={`mori-card p-4 mori-shadow border-4 bg-white flex justify-between items-center transition-all ${isEditMode ? 'border-red-100 shadow-[6px_6px_0px_#FEE2E2]' : 'border-[#E0E5D5]'}`}>
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-12 h-12 rounded-2xl bg-[#FDF9F0] border-2 border-[#E0E5D5] flex items-center justify-center text-2xl shadow-inner shrink-0">
                  {item.emoji}
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-black text-sm text-[#5D5443] truncate">{item.title}</h4>
                  <p className="text-[10px] font-bold text-gray-400 mt-0.5">{item.date.split('-').slice(1).join('/')} · {item.user}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 ml-2 shrink-0">
                <div className="text-right">
                  <p className="font-black text-sm text-[#5D5443]">฿ {item.amount.toLocaleString()}</p>
                  <p className="text-[9px] font-black text-[#8BAE8E] uppercase tracking-tighter">shared</p>
                </div>
                
                {isEditMode && (
                  <button 
                    onClick={(e) => askDelete(item.id, e)}
                    className="bg-red-50 text-red-400 p-3 rounded-2xl border-2 border-red-100 shadow-sm active:scale-75 transition-all animate-in zoom-in-50 cursor-pointer hover:bg-red-100"
                    title="刪除此筆記錄"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {filteredExpenses.length === 0 && (
          <div className="text-center py-20 opacity-30 flex flex-col items-center gap-2">
            <AlertCircle size={32} />
            <p className="text-xs font-black italic">尚無支出記錄 🧸</p>
          </div>
        )}
      </div>

      {/* 新增按鈕 */}
      <button 
        onClick={() => setShowAdd(true)} 
        className="fixed bottom-28 right-6 w-16 h-16 bg-[#C6A664] rounded-full mori-shadow border-4 border-white flex items-center justify-center text-white active:scale-90 transition-transform z-40"
      >
        <Plus size={32} />
      </button>

      {/* 刪除確認彈窗 */}
      {confirmDeleteId !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
          <div className="mori-card w-full max-w-xs bg-white border-4 border-red-200 p-6 space-y-6 animate-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-400">
              <AlertTriangle size={32} />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#5D5443]">要刪除這筆帳嗎？</h3>
              <p className="text-xs text-gray-400 mt-2 font-bold leading-relaxed">
                這項操作無法復原喔，<br/>確定要讓它消失在小手帳裡嗎？🧸
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 py-3 rounded-2xl border-2 border-[#E0E5D5] text-gray-400 font-black text-xs active:scale-95 transition-all bg-white"
              >
                先不要 🙅
              </button>
              <button 
                onClick={executeDelete}
                className="flex-1 py-3 rounded-2xl bg-red-400 text-white font-black text-xs mori-shadow active:scale-95 transition-all border-2 border-red-400 shadow-[4px_4px_0px_#FCA5A5]"
              >
                狠心刪除 🗑️
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 新增記帳 Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-end p-0">
          <div className="w-full bg-[#FDF9F0] rounded-t-[2.5rem] p-6 space-y-4 animate-in slide-in-from-bottom-full border-t-8 border-[#C6A664] max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-xl font-black text-[#5D5443]">記一筆支出 🧸</h3>
              <button onClick={() => setShowAdd(false)} className="bg-white p-2 rounded-full border-2 border-[#E0E5D5] shadow-sm"><X size={20}/></button>
            </div>
            
            {/* 日期選擇區 */}
            <div className="space-y-2 px-2">
              <p className="text-[10px] font-black text-[#C6A664] uppercase tracking-widest flex items-center gap-1.5">
                <Calendar size={12} /> 選擇日期
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {TRIP_DATES.map((d) => (
                  <button
                    key={d.date}
                    onClick={() => setSelectedDate(d.date)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-[10px] font-black border-2 transition-all ${
                      selectedDate === d.date 
                        ? 'bg-[#8BAE8E] border-[#8BAE8E] text-white shadow-sm' 
                        : 'bg-white border-[#E0E5D5] text-gray-400'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mori-card p-6 border-4 bg-white text-center space-y-3">
              <input 
                type="text" 
                placeholder="項目名稱..." 
                className="w-full text-center font-black outline-none text-lg text-[#5D5443] placeholder:text-gray-200" 
                value={inputTitle}
                onChange={e => setInputTitle(e.target.value)}
              />
              <div className="pt-2 border-t-2 border-dashed border-[#FDF9F0]">
                <p className="text-5xl font-black text-[#5D5443]">฿ {inputAmount}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, '🍱', 4, 5, 6, '🚆', 7, 8, 9, '🛍️', 'C', 0, '.', '✓'].map(k => (
                <button 
                  key={k} 
                  onClick={() => handleKeyPress(k)}
                  className={`mori-card p-4 mori-shadow border-2 text-lg font-black active:scale-90 transition-all ${
                    k === '✓' ? 'bg-[#8BAE8E] text-white border-[#8BAE8E]' : (['🍱', '🚆', '🛍️'].includes(k as string) && selectedCat.emoji === k ? 'bg-orange-50 border-[#C6A664]' : 'bg-white')
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseView;
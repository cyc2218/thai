
import React, { useState, useContext, useMemo } from 'react';
import { Plus, TrendingUp, Trash2, Check, X, Calculator, Calendar } from 'lucide-react';
// Fix: Use AppContext instead of EditModeContext
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

const ExpenseView: React.FC = () => {
  // Fix: Use AppContext
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
  const [inputAmount, setInputAmount] = useState('0');
  const [inputTitle, setInputTitle] = useState('');
  const [selectedCat, setSelectedCat] = useState(CATEGORIES[1]);
  const [selectedDate, setSelectedDate] = useState('2026-01-07');

  // 自動重算總金額
  const filteredExpenses = useMemo(() => 
    activeFilter === 'All' ? expenses : expenses.filter(e => e.cat === activeFilter)
  , [expenses, activeFilter]);

  const categoryTotal = useMemo(() => 
    filteredExpenses.reduce((sum, item) => sum + item.amount, 0)
  , [filteredExpenses]);

  // 自動重算每日統計圖
  const dailyStats = useMemo(() => {
    const stats: Record<string, number> = {};
    const tripDates = ['2026-01-07', '2026-01-08', '2026-01-09', '2026-01-10', '2026-01-11', '2026-01-12', '2026-01-13'];
    tripDates.forEach(d => stats[d] = 0);
    expenses.forEach(e => {
      if (stats[e.date] !== undefined) stats[e.date] += e.amount;
    });
    return tripDates.map(d => ({ date: d.split('-').slice(1).join('/'), total: stats[d] }));
  }, [expenses]);

  const handleDelete = (id: number) => {
    // 實際刪除邏輯：過濾掉該 id 的項目
    if (confirm('確定要刪除這筆支出嗎？🧸')) {
      setExpenses(prev => prev.filter(e => e.id !== id));
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

      {/* 支出清單 - 向左滑動刪除 */}
      <div className="space-y-3">
        <h3 className="px-2 font-black text-[10px] text-gray-400 uppercase tracking-widest flex items-center gap-2">
          Swipe Left to Delete <div className="h-[1px] flex-1 bg-[#E0E5D5]"></div>
        </h3>
        {filteredExpenses.map((item) => (
          <div key={item.id} className="relative group overflow-hidden rounded-[2.25rem]">
            {/* 底層刪除按鈕 */}
            <div className="absolute inset-0 bg-red-400 flex items-center justify-end px-6">
              <button 
                onClick={() => handleDelete(item.id)}
                className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-white active:scale-75 transition-transform"
              >
                <Trash2 size={24} />
              </button>
            </div>

            {/* 滑動內容層 */}
            <div className="relative z-10 overflow-x-auto snap-x snap-mandatory scroll-smooth custom-scrollbar">
              <div className="flex w-[125%]">
                <div className="w-[80%] snap-start shrink-0">
                  <div className="mori-card p-4 mori-shadow border-4 bg-white flex justify-between items-center transition-all group-active:scale-[0.98]">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-12 h-12 rounded-2xl bg-[#FDF9F0] border-2 border-[#E0E5D5] flex items-center justify-center text-2xl shadow-inner shrink-0">
                        {item.emoji}
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="font-black text-sm text-[#5D5443] truncate">{item.title}</h4>
                        <p className="text-[10px] font-bold text-gray-400 mt-0.5">{item.date} · {item.user}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <p className="font-black text-sm text-[#5D5443]">฿ {item.amount.toLocaleString()}</p>
                      <p className="text-[9px] font-black text-[#8BAE8E] uppercase tracking-tighter">shared</p>
                    </div>
                  </div>
                </div>
                {/* 佔位空間用於顯示刪除按鈕 */}
                <div className="w-[20%] snap-end" />
              </div>
            </div>
            
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-20 group-hover:opacity-100 transition-opacity">
               <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest rotate-90 origin-right">Swipe Left 👈</span>
            </div>
          </div>
        ))}
        {filteredExpenses.length === 0 && (
          <div className="text-center py-20 opacity-30">
            <p className="text-xs font-black italic">No records found 🧸</p>
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

      {/* 新增記帳 Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-end p-0">
          <div className="w-full bg-[#FDF9F0] rounded-t-[2.5rem] p-6 space-y-4 animate-in slide-in-from-bottom-full border-t-8 border-[#C6A664]">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-xl font-black text-[#5D5443]">記一筆支出 🧸</h3>
              <button onClick={() => setShowAdd(false)} className="bg-white p-2 rounded-full border-2 border-[#E0E5D5] shadow-sm"><X size={20}/></button>
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

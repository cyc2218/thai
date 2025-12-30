
import React, { useState } from 'react';
import { CheckCircle2, Circle, ListTodo, ShoppingBag, Luggage, Sparkles, Wand2 } from 'lucide-react';
import { getSmartPackingList } from '../services/gemini';

const PlanningView: React.FC = () => {
  const [todos, setTodos] = useState([
    { id: '1', text: '申請泰國落地簽/電子簽 🛂', done: true, type: 'todo' },
    { id: '2', text: '預約機場接送 🚐', done: false, type: 'todo' },
    { id: '3', text: '萬用轉接頭 (Type C/A) ⚡', done: true, type: 'luggage' },
    { id: '4', text: '薄外套 (室內冷氣強) 🧥', done: false, type: 'luggage' },
    { id: '5', text: '驅蚊噴霧 🦟', done: false, type: 'shopping' },
  ]);

  const [aiLoading, setAiLoading] = useState(false);

  const toggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleAiSuggest = async () => {
    setAiLoading(true);
    const result = await getSmartPackingList("Bangkok, Thailand", 7);
    if (result.items) {
      const newItems = result.items.slice(0, 5).map((item: any, i: number) => ({
        id: `ai-${Date.now()}-${i}`,
        text: `${item.item} ✨`,
        done: false,
        type: 'luggage'
      }));
      setTodos([...todos, ...newItems]);
    }
    setAiLoading(false);
  };

  const categories = [
    { id: 'todo', label: '待辦清單', icon: <ListTodo size={20} />, color: 'bg-blue-50' },
    { id: 'luggage', label: '行李清單', icon: <Luggage size={20} />, color: 'bg-pink-50' },
    { id: 'shopping', label: '購物目標', icon: <ShoppingBag size={20} />, color: 'bg-yellow-50' },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="mori-card p-6 mori-shadow bg-[#FDF9F0] border-4 border-[#C6A664] overflow-hidden relative">
        <div className="washi-tape washi-tape-pink w-20"></div>
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-white p-2 rounded-2xl border-2 border-[#C6A664] mori-shadow">
            <Sparkles className="text-[#C6A664]" />
          </div>
          <h3 className="font-black text-lg text-[#5D5443]">Mori AI 規劃小助手</h3>
        </div>
        <p className="text-xs text-[#5D5443] font-bold mb-5 leading-relaxed">
          想知道曼谷 7 天該帶什麼嗎？<br/>讓 Gemini 為你自動分析清單！
        </p>
        <button 
          onClick={handleAiSuggest}
          disabled={aiLoading}
          className="w-full bg-[#C6A664] py-3 rounded-2xl text-sm font-black text-white mori-shadow active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {aiLoading ? (
            <span className="animate-spin">🍭</span>
          ) : (
            <><Wand2 size={16} /> 智能產生打包清單</>
          )}
        </button>
      </div>

      {categories.map(cat => (
        <div key={cat.id} className="space-y-4">
          <div className="flex items-center gap-2 px-4">
            <div className={`p-2 rounded-xl border-2 border-[#E0E5D5] mori-shadow bg-white`}>
              {cat.icon}
            </div>
            <h3 className="font-black text-[#5D5443]">{cat.label}</h3>
          </div>
          <div className="space-y-3">
            {todos.filter(t => t.type === cat.id).map(todo => (
              <div 
                key={todo.id} 
                onClick={() => toggleTodo(todo.id)}
                className="mori-card p-4 mori-shadow flex items-center gap-3 bg-white border-4 active:scale-98 transition-transform cursor-pointer group"
              >
                <div className="transition-transform group-active:scale-75">
                  {todo.done ? (
                    <CheckCircle2 className="text-[#8BAE8E]" size={24} />
                  ) : (
                    <Circle className="text-gray-200" size={24} />
                  )}
                </div>
                <span className={`text-sm font-black transition-all ${todo.done ? 'line-through text-gray-300 translate-x-1' : 'text-[#5D5443]'}`}>
                  {todo.text}
                </span>
                {todo.id.includes('ai') && (
                  <span className="text-[8px] bg-[#FDF9F0] px-2 py-0.5 rounded-full border border-[#E0E5D5] ml-auto">AI</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      
      <button className="w-full py-5 border-4 border-dashed border-[#E0E5D5] rounded-[2rem] text-gray-300 text-sm font-black hover:bg-white transition-all active:scale-95 hover:text-[#8BAE8E] hover:border-[#8BAE8E]">
        + 新增個人項目 🧸
      </button>
    </div>
  );
};

export default PlanningView;

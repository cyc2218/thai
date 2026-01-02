
import React, { useState, useContext } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  ListTodo, 
  ShoppingBag, 
  Luggage, 
  Sparkles, 
  Wand2, 
  Plus, 
  X, 
  ChevronUp, 
  ChevronDown, 
  Check, 
  Trash2 
} from 'lucide-react';
import { getSmartPackingList } from '../services/gemini';
import { AppContext } from '../App';

interface TodoItem {
  id: string;
  text: string;
  done: boolean;
  type: string;
}

const PlanningView: React.FC = () => {
  const { isEditMode } = useContext(AppContext);
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: '1', text: '申請泰國落地簽/電子簽 🛂', done: true, type: 'todo' },
    { id: '2', text: '預約機場接送 🚐', done: false, type: 'todo' },
    { id: '3', text: '萬用轉接頭 (Type C/A) ⚡', done: true, type: 'luggage' },
    { id: '4', text: '薄外套 (室內冷氣強) 🧥', done: false, type: 'luggage' },
    { id: '5', text: '驅蚊噴霧 🦟', done: false, type: 'shopping' },
  ]);

  const [aiLoading, setAiLoading] = useState(false);
  const [addingToCategory, setAddingToCategory] = useState<string | null>(null);
  const [newItemText, setNewItemText] = useState('');

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

  const addItem = (type: string) => {
    if (!newItemText.trim()) return;
    const newItem: TodoItem = {
      id: Date.now().toString(),
      text: newItemText.trim(),
      done: false,
      type: type
    };
    setTodos([...todos, newItem]);
    setNewItemText('');
    setAddingToCategory(null);
  };

  const deleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTodos(todos.filter(t => t.id !== id));
  };

  const moveItem = (id: string, direction: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    const type = todos.find(t => t.id === id)?.type;
    if (!type) return;

    const categoryItems = todos.filter(t => t.type === type);
    const indexInCategory = categoryItems.findIndex(t => t.id === id);
    
    if (direction === 'up' && indexInCategory === 0) return;
    if (direction === 'down' && indexInCategory === categoryItems.length - 1) return;

    const targetIndexInCategory = direction === 'up' ? indexInCategory - 1 : indexInCategory + 1;
    const targetId = categoryItems[targetIndexInCategory].id;

    // 在總列表中交換位置
    const newTodos = [...todos];
    const idx1 = newTodos.findIndex(t => t.id === id);
    const idx2 = newTodos.findIndex(t => t.id === targetId);
    [newTodos[idx1], newTodos[idx2]] = [newTodos[idx2], newTodos[idx1]];
    
    setTodos(newTodos);
  };

  const categories = [
    { id: 'todo', label: '待辦清單', icon: <ListTodo size={20} />, color: 'bg-blue-50' },
    { id: 'luggage', label: '行李清單', icon: <Luggage size={20} />, color: 'bg-pink-50' },
    { id: 'shopping', label: '購物目標', icon: <ShoppingBag size={20} />, color: 'bg-yellow-50' },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* AI 助手區塊 */}
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

      {categories.map(cat => {
        const categoryTodos = todos.filter(t => t.type === cat.id);
        return (
          <div key={cat.id} className="space-y-4">
            <div className="flex justify-between items-center px-4">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl border-2 border-[#E0E5D5] mori-shadow bg-white`}>
                  {cat.icon}
                </div>
                <h3 className="font-black text-[#5D5443]">{cat.label}</h3>
              </div>
              <button 
                onClick={() => setAddingToCategory(addingToCategory === cat.id ? null : cat.id)}
                className="bg-white p-2 rounded-full border-2 border-[#E0E5D5] text-[#8BAE8E] active:scale-90 transition-transform shadow-sm"
              >
                {addingToCategory === cat.id ? <X size={16}/> : <Plus size={16} />}
              </button>
            </div>

            {/* 新增項目輸入框 */}
            {addingToCategory === cat.id && (
              <div className="mx-4 animate-in slide-in-from-top-2 duration-200">
                <div className="mori-card p-3 border-4 border-dashed border-[#8BAE8E] bg-white flex items-center gap-2">
                  <input 
                    autoFocus
                    type="text"
                    placeholder="輸入內容後按 Enter..."
                    className="flex-1 bg-transparent outline-none text-sm font-bold text-[#5D5443] px-2"
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addItem(cat.id)}
                  />
                  <button 
                    onClick={() => addItem(cat.id)}
                    className="bg-[#8BAE8E] text-white p-1.5 rounded-lg active:scale-90 transition-transform"
                  >
                    <Check size={16} />
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {categoryTodos.map((todo, idx) => (
                <div 
                  key={todo.id} 
                  onClick={() => !isEditMode && toggleTodo(todo.id)}
                  className={`mori-card p-4 mori-shadow flex items-center gap-3 bg-white border-4 transition-all group ${
                    isEditMode ? 'border-dashed border-[#E0E5D5]' : 'active:scale-98 cursor-pointer'
                  }`}
                >
                  {/* 左側狀態圖示 / 編輯模式下的排序按鈕 */}
                  {isEditMode ? (
                    <div className="flex flex-col gap-1">
                      <button 
                        onClick={(e) => moveItem(todo.id, 'up', e)}
                        disabled={idx === 0}
                        className="text-gray-300 hover:text-[#8BAE8E] disabled:opacity-20"
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button 
                        onClick={(e) => moveItem(todo.id, 'down', e)}
                        disabled={idx === categoryTodos.length - 1}
                        className="text-gray-300 hover:text-[#8BAE8E] disabled:opacity-20"
                      >
                        <ChevronDown size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="transition-transform group-active:scale-75">
                      {todo.done ? (
                        <CheckCircle2 className="text-[#8BAE8E]" size={24} />
                      ) : (
                        <Circle className="text-gray-200" size={24} />
                      )}
                    </div>
                  )}

                  <span className={`flex-1 text-sm font-black transition-all ${
                    !isEditMode && todo.done ? 'line-through text-gray-300 translate-x-1' : 'text-[#5D5443]'
                  }`}>
                    {todo.text}
                  </span>

                  {/* 右側 AI 標籤或刪除按鈕 */}
                  <div className="flex items-center gap-2">
                    {todo.id.includes('ai') && (
                      <span className="text-[8px] bg-[#FDF9F0] px-2 py-0.5 rounded-full border border-[#E0E5D5]">AI</span>
                    )}
                    {isEditMode && (
                      <button 
                        onClick={(e) => deleteItem(todo.id, e)}
                        className="text-red-300 hover:text-red-500 p-1 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {categoryTodos.length === 0 && !addingToCategory && (
                <div className="text-center py-6 opacity-20 italic text-xs font-bold">
                  空空如也 🖍️
                </div>
              )}
            </div>
          </div>
        );
      })}
      
      <button 
        onClick={() => {
          setAddingToCategory('todo');
          // 滾動到第一個分類
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="w-full py-5 border-4 border-dashed border-[#E0E5D5] rounded-[2rem] text-gray-300 text-sm font-black hover:bg-white transition-all active:scale-95 hover:text-[#8BAE8E] hover:border-[#8BAE8E]"
      >
        + 快點擊分類旁的 [+] 新增項目 🧸
      </button>
    </div>
  );
};

export default PlanningView;

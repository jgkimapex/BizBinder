import React, { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { BinderItem, FileType } from "./types";
import { DEFAULT_ITEMS } from "./constants";
import { FileIcon } from "./components/FileIcon";
import { DetailView } from "./components/DetailView";
import { AddItemModal } from "./components/AddItemModal";

const App: React.FC = () => {
  const [items, setItems] = useState<BinderItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [subtitle, setSubtitle] = useState("Trip to N.Y.");

  useEffect(() => {
    setItems(DEFAULT_ITEMS);
  }, []);

  const handleAddItem = (title: string, type: FileType, content: string) => {
    const newItem: BinderItem = {
      id: Date.now().toString(),
      title,
      type,
      content,
      timestamp: Date.now(),
    };
    setItems(prev => [...prev, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    setSelectedId(null);
  };

  const handleUpdateItem = (id: string, newTitle: string, newContent?: string, newType?: FileType) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          title: newTitle,
          content: newContent !== undefined ? newContent : item.content,
          type: newType !== undefined ? newType : item.type,
        };
      }
      return item;
    }));
  };

  const selectedItem = items.find(item => item.id === selectedId);

  return (
    <div className="h-full w-full flex flex-col bg-gray-50 max-w-md mx-auto shadow-2xl overflow-hidden relative border-x border-gray-200">
      <div className="bg-primary text-white p-5 pt-8 shadow-lg shrink-0 flex justify-between items-center z-10">
        <div className="flex-1 min-w-0 mr-4">
          <h1 className="text-2xl font-bold tracking-tight">BizBinder</h1>
          <input 
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="bg-transparent text-sm text-slate-400 font-medium w-full outline-none border-b border-transparent focus:border-slate-500 focus:text-white transition-all placeholder-slate-600 truncate mt-1"
            placeholder="Enter trip title..."
          />
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-accent hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition transform active:scale-95 shrink-0"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
        <div className="grid grid-cols-3 gap-4 pb-20">
          {items.map((item) => (
            <div 
              key={item.id} 
              onClick={() => setSelectedId(item.id)}
              className="flex flex-col gap-2 group cursor-pointer"
            >
              <div className="aspect-square w-full rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-200 group-hover:shadow-md transition-all duration-200 relative">
                 <FileIcon type={item.type} content={item.content} thumbnail={item.thumbnail} />
                 <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] px-1.5 py-0.5 rounded-full uppercase font-bold tracking-wider backdrop-blur-sm">
                   {item.type === "link" ? "WEB" : item.type}
                 </div>
              </div>
              <p className="text-xs font-medium text-center text-gray-700 truncate px-1 group-hover:text-primary">
                {item.title}
              </p>
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-3 text-center py-20 text-gray-400">
              <p>No items yet.</p>
              <p className="text-sm">Tap + to add files.</p>
            </div>
          )}
        </div>
      </div>

      {selectedItem && (
        <DetailView 
          item={selectedItem} 
          onBack={() => setSelectedId(null)} 
          onDelete={handleDeleteItem}
          onUpdate={handleUpdateItem}
        />
      )}

      {showAddModal && (
        <AddItemModal 
          onClose={() => setShowAddModal(false)} 
          onAdd={handleAddItem} 
        />
      )}
    </div>
  );
};

export default App;

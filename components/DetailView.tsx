import React, { useState, useRef } from "react";
import { ArrowLeft, Trash2, RefreshCw, Save, ExternalLink } from "lucide-react";
import { BinderItem, FileType } from "../types";
import { FileIcon } from "./FileIcon";

interface DetailViewProps {
  item: BinderItem;
  onBack: () => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, newTitle: string, newContent?: string, newType?: FileType) => void;
}

export const DetailView: React.FC<DetailViewProps> = ({ item, onBack, onDelete, onUpdate }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(item.title);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTitleSave = () => {
    onUpdate(item.id, title);
    setIsEditingTitle(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    let newType: FileType = "doc";
    if (file.type.startsWith("image/")) newType = "image";
    else if (file.type.startsWith("video/")) newType = "video";
    else if (file.type.startsWith("audio/")) newType = "audio";
    else if (file.type === "application/pdf") newType = "pdf";
    else if (file.type === "text/plain") newType = "txt";
    else if (file.name.endsWith(".ppt") || file.name.endsWith(".pptx")) newType = "ppt";
    else if (file.name.endsWith(".doc") || file.name.endsWith(".docx")) newType = "doc";
    else if (file.name.endsWith(".xls") || file.name.endsWith(".xlsx")) newType = "xls";

    if (newType === "txt") {
        const reader = new FileReader();
        reader.onload = (ev) => {
            const result = ev.target?.result as string;
            onUpdate(item.id, file.name, result, newType);
        };
        reader.readAsText(file);
    } else {
        const objectUrl = URL.createObjectURL(file);
        onUpdate(item.id, file.name, objectUrl, newType);
    }
  };

  const renderContent = () => {
    switch (item.type) {
      case "image":
        return <img src={item.content} alt={item.title} className="max-w-full max-h-full object-contain shadow-lg" />;
      case "video":
        return (
          <video controls className="max-w-full max-h-full shadow-lg bg-black">
            <source src={item.content} />
          </video>
        );
      case "audio":
        return (
          <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg">
             <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <FileIcon type="audio" content="" className="w-16 h-16" />
             </div>
             <audio controls src={item.content} className="w-full min-w-[300px]" />
          </div>
        );
      case "txt":
        return (
          <div className="bg-yellow-50 p-6 rounded shadow-md w-full max-w-2xl min-h-[50vh] overflow-auto whitespace-pre-wrap font-mono text-sm border border-yellow-200">
            {item.content}
          </div>
        );
      case "link":
        return (
          <div className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-lg">
             <ExternalLink className="w-16 h-16 text-blue-500 mb-4" />
             <h3 className="text-xl font-bold mb-2 break-all">{item.content}</h3>
             <a href={item.content} target="_blank" rel="noopener noreferrer" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">Open Link</a>
          </div>
        );
      case "pdf":
         return (
             <div className="w-full h-full bg-white rounded-lg shadow-lg flex flex-col items-center justify-center p-4">
                 <iframe src={item.content} className="w-full h-full rounded border-0" title="PDF Preview"></iframe>
             </div>
         )
      default:
        return (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-lg">
            <div className="w-32 h-32 mb-6 rounded-2xl overflow-hidden">
                <FileIcon type={item.type} content={item.content} className="w-16 h-16" />
            </div>
            <p className="text-gray-500 text-center mb-4">Preview not available in demo.</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-100 flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-200">
      <div className="bg-primary text-white p-4 flex items-center shadow-md shrink-0">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="ml-2 flex-1">
          {isEditingTitle ? (
            <div className="flex items-center">
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="bg-white/10 text-white px-2 py-1 rounded w-full outline-none border border-white/30" autoFocus />
              <button onClick={handleTitleSave} className="ml-2 p-1 hover:bg-green-600 rounded"><Save className="w-5 h-5" /></button>
            </div>
          ) : (
            <h1 className="text-xl font-semibold truncate" onClick={() => setIsEditingTitle(true)}>{item.title}</h1>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center relative">{renderContent()}</div>
      <div className="bg-white border-t border-gray-200 p-4 shrink-0 flex justify-around items-center pb-8 safe-area-pb">
        <button onClick={() => onDelete(item.id)} className="flex flex-col items-center text-red-500 hover:opacity-70 transition group">
          <div className="p-3 bg-red-50 rounded-full group-hover:bg-red-100 mb-1"><Trash2 className="w-6 h-6" /></div>
          <span className="text-xs font-medium">Delete</span>
        </button>
        <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center text-primary hover:opacity-70 transition group">
          <div className="p-3 bg-slate-100 rounded-full group-hover:bg-slate-200 mb-1"><RefreshCw className="w-6 h-6" /></div>
          <span className="text-xs font-medium">Replace</span>
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
        </button>
      </div>
    </div>
  );
};

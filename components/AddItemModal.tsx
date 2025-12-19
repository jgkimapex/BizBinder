import React, { useRef, useState } from "react";
import { Image, FileText, Link, X } from "lucide-react";
import { FileType } from "../types";

interface AddItemModalProps {
  onClose: () => void;
  onAdd: (title: string, type: FileType, content: string) => void;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({ onClose, onAdd }) => {
  const [mode, setMode] = useState<"select" | "link_input">("select");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    let type: FileType = "doc";
    if (file.type.startsWith("image/")) type = "image";
    else if (file.type.startsWith("video/")) type = "video";
    else if (file.type.startsWith("audio/")) type = "audio";
    else if (file.type === "application/pdf") type = "pdf";
    else if (file.type === "text/plain") type = "txt";
    else if (file.name.endsWith(".ppt") || file.name.endsWith(".pptx")) type = "ppt";
    else if (file.name.endsWith(".doc") || file.name.endsWith(".docx")) type = "doc";
    else if (file.name.endsWith(".xls") || file.name.endsWith(".xlsx")) type = "xls";
    
    if (type === "txt") {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        onAdd(file.name, type, result);
        onClose();
      };
      reader.readAsText(file);
    } else {
      const objectUrl = URL.createObjectURL(file);
      onAdd(file.name, type, objectUrl);
      onClose();
    }
  };

  const handleLinkSubmit = () => {
    if (linkUrl && linkTitle) {
      let finalUrl = linkUrl;
      if (!finalUrl.startsWith("http")) {
        finalUrl = "https://" + finalUrl;
      }
      onAdd(linkTitle, "link", finalUrl);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center">
      <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-6 animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Add to BizBinder</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X className="w-5 h-5 text-gray-600" /></button>
        </div>

        {mode === "select" ? (
          <div className="grid grid-cols-3 gap-4">
            <button onClick={() => galleryInputRef.current?.click()} className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2 text-purple-600"><Image className="w-6 h-6" /></div>
              <span className="text-sm font-medium text-purple-900">Gallery</span>
            </button>
            <input type="file" ref={galleryInputRef} accept="image/*,video/*" className="hidden" onChange={handleFileSelect} />

            <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2 text-blue-600"><FileText className="w-6 h-6" /></div>
              <span className="text-sm font-medium text-blue-900">File</span>
            </button>
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />

            <button onClick={() => setMode("link_input")} className="flex flex-col items-center justify-center p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2 text-orange-600"><Link className="w-6 h-6" /></div>
              <span className="text-sm font-medium text-orange-900">Link</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input type="text" value={linkTitle} onChange={(e) => setLinkTitle(e.target.value)} placeholder="e.g., Hotel Reservation" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
              <input type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://..." className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <button onClick={handleLinkSubmit} disabled={!linkTitle || !linkUrl} className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-slate-800 disabled:opacity-50 transition">Add Link</button>
            <button onClick={() => setMode("select")} className="w-full py-2 text-gray-500 text-sm hover:text-gray-700">Back to options</button>
          </div>
        )}
      </div>
    </div>
  );
};

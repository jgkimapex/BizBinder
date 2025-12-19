const fs = require('fs');
const path = require('path');

const files = {
  'package.json': `{
  "name": "bizbinder",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.3",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.27",
    "tailwindcss": "^3.3.3",
    "typescript": "^5.0.2",
    "vite": "^4.4.5"
  }
}`,
  'vite.config.ts': `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})`,
  'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["."],
  "references": [{ "path": "./tsconfig.node.json" }]
}`,
  'tsconfig.node.json': `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}`,
  '.gitignore': `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules/
dist/
dist-ssr
*.local
.DS_Store
.env
`,
  'index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>BizBinder</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: '#0f172a', 
              secondary: '#334155', 
              accent: '#3b82f6', 
            }
          }
        }
      }
    </script>
    <style>
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    </style>
</head>
  <body class="bg-gray-100 h-screen w-screen overflow-hidden text-slate-900 select-none">
    <div id="root" class="h-full w-full"></div>
    <script type="module" src="/index.tsx"></script>
  </body>
</html>`,
  'index.tsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
  'metadata.json': `{
  "name": "BizBinder",
  "description": "A smart document and file organizer for business travelers and tourists.",
  "requestFramePermissions": []
}`,
  'types.ts': `export type FileType = 'image' | 'video' | 'audio' | 'pdf' | 'doc' | 'xls' | 'ppt' | 'txt' | 'link';

export interface BinderItem {
  id: string;
  title: string;
  type: FileType;
  content: string; 
  thumbnail?: string; 
  timestamp: number;
}`,
  'constants.ts': `import { BinderItem } from './types';

export const DEFAULT_ITEMS: BinderItem[] = [
  {
    id: '1',
    title: 'Passport',
    type: 'image',
    content: 'https://picsum.photos/id/103/600/800',
    timestamp: Date.now(),
  },
  {
    id: '2',
    title: 'VISA',
    type: 'image',
    content: 'https://picsum.photos/id/20/600/800',
    timestamp: Date.now() + 1,
  },
  {
    id: '3',
    title: 'Ticket',
    type: 'image',
    content: 'https://picsum.photos/id/3/600/400',
    timestamp: Date.now() + 2,
  },
  {
    id: '11',
    title: 'To Do List',
    type: 'txt',
    content: '1. Check in hotel\\n2. Meeting with CEO at 2 PM\\n3. Buy souvenirs',
    timestamp: Date.now() + 10,
  },
  {
    id: '12',
    title: 'Google',
    type: 'link',
    content: 'https://www.google.com',
    timestamp: Date.now() + 11,
  },
];`,
  'App.tsx': `import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { BinderItem, FileType } from './types';
import { DEFAULT_ITEMS } from './constants';
import { FileIcon } from './components/FileIcon';
import { DetailView } from './components/DetailView';
import { AddItemModal } from './components/AddItemModal';

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
                   {item.type === 'link' ? 'WEB' : item.type}
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

export default App;`,
  'components/FileIcon.tsx': `import React from 'react';
import { 
  FileText, Image as ImageIcon, Video, Music, Link as LinkIcon, 
  FileType as FileTypeIcon, FileSpreadsheet, Presentation, File
} from 'lucide-react';
import { FileType } from '../types';

interface FileIconProps {
  type: FileType;
  content: string;
  thumbnail?: string;
  className?: string;
}

export const FileIcon: React.FC<FileIconProps> = ({ type, content, thumbnail, className = "w-10 h-10" }) => {
  if (type === 'image') {
    return (
      <div className="w-full h-full overflow-hidden bg-gray-200 flex items-center justify-center">
        <img 
          src={content} 
          alt="thumbnail" 
          className="w-full h-full object-cover" 
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <ImageIcon className={\`\${className} text-gray-400 absolute opacity-50\`} />
      </div>
    );
  }

  if (thumbnail) {
    return (
        <div className="w-full h-full overflow-hidden bg-gray-200 flex items-center justify-center relative">
          <img src={thumbnail} alt="thumbnail" className="w-full h-full object-cover" />
          {type === 'video' && <div className="absolute inset-0 flex items-center justify-center bg-black/20"><Video className="w-8 h-8 text-white" /></div>}
        </div>
    );
  }

  const iconProps = { className: \`\${className} text-slate-600\` };

  switch (type) {
    case 'video': return <div className="w-full h-full flex items-center justify-center bg-red-100 text-red-600"><Video {...iconProps} className={\`\${className} text-red-500\`} /></div>;
    case 'audio': return <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-600"><Music {...iconProps} className={\`\${className} text-purple-500\`} /></div>;
    case 'pdf': return <div className="w-full h-full flex items-center justify-center bg-red-50 text-red-700"><FileTypeIcon {...iconProps} className={\`\${className} text-red-600\`} /></div>;
    case 'doc': return <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600"><FileText {...iconProps} className={\`\${className} text-blue-600\`} /></div>;
    case 'xls': return <div className="w-full h-full flex items-center justify-center bg-green-100 text-green-600"><FileSpreadsheet {...iconProps} className={\`\${className} text-green-600\`} /></div>;
    case 'ppt': return <div className="w-full h-full flex items-center justify-center bg-orange-100 text-orange-600"><Presentation {...iconProps} className={\`\${className} text-orange-600\`} /></div>;
    case 'txt': return <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-600"><FileText {...iconProps} /></div>;
    case 'link': return <div className="w-full h-full flex items-center justify-center bg-sky-100 text-sky-600"><LinkIcon {...iconProps} className={\`\${className} text-sky-500\`} /></div>;
    default: return <div className="w-full h-full flex items-center justify-center bg-gray-200"><File {...iconProps} /></div>;
  }
};`,
  'components/DetailView.tsx': `import React, { useState, useRef } from 'react';
import { ArrowLeft, Trash2, RefreshCw, Save, ExternalLink } from 'lucide-react';
import { BinderItem, FileType } from '../types';
import { FileIcon } from './FileIcon';

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

    let newType: FileType = 'doc';
    if (file.type.startsWith('image/')) newType = 'image';
    else if (file.type.startsWith('video/')) newType = 'video';
    else if (file.type.startsWith('audio/')) newType = 'audio';
    else if (file.type === 'application/pdf') newType = 'pdf';
    else if (file.type === 'text/plain') newType = 'txt';
    else if (file.name.endsWith('.ppt') || file.name.endsWith('.pptx')) newType = 'ppt';
    else if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) newType = 'doc';
    else if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) newType = 'xls';

    if (newType === 'txt') {
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
      case 'image':
        return <img src={item.content} alt={item.title} className="max-w-full max-h-full object-contain shadow-lg" />;
      case 'video':
        return (
          <video controls className="max-w-full max-h-full shadow-lg bg-black">
            <source src={item.content} />
          </video>
        );
      case 'audio':
        return (
          <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg">
             <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <FileIcon type="audio" content="" className="w-16 h-16" />
             </div>
             <audio controls src={item.content} className="w-full min-w-[300px]" />
          </div>
        );
      case 'txt':
        return (
          <div className="bg-yellow-50 p-6 rounded shadow-md w-full max-w-2xl min-h-[50vh] overflow-auto whitespace-pre-wrap font-mono text-sm border border-yellow-200">
            {item.content}
          </div>
        );
      case 'link':
        return (
          <div className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-lg">
             <ExternalLink className="w-16 h-16 text-blue-500 mb-4" />
             <h3 className="text-xl font-bold mb-2 break-all">{item.content}</h3>
             <a href={item.content} target="_blank" rel="noopener noreferrer" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">Open Link</a>
          </div>
        );
      case 'pdf':
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
};`,
  'components/AddItemModal.tsx': `import React, { useRef, useState } from 'react';
import { Image, FileText, Link, X } from 'lucide-react';
import { FileType } from '../types';

interface AddItemModalProps {
  onClose: () => void;
  onAdd: (title: string, type: FileType, content: string) => void;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({ onClose, onAdd }) => {
  const [mode, setMode] = useState<'select' | 'link_input'>('select');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    let type: FileType = 'doc';
    if (file.type.startsWith('image/')) type = 'image';
    else if (file.type.startsWith('video/')) type = 'video';
    else if (file.type.startsWith('audio/')) type = 'audio';
    else if (file.type === 'application/pdf') type = 'pdf';
    else if (file.type === 'text/plain') type = 'txt';
    else if (file.name.endsWith('.ppt') || file.name.endsWith('.pptx')) type = 'ppt';
    else if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) type = 'doc';
    else if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) type = 'xls';
    
    if (type === 'txt') {
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
      if (!finalUrl.startsWith('http')) {
        finalUrl = 'https://' + finalUrl;
      }
      onAdd(linkTitle, 'link', finalUrl);
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

        {mode === 'select' ? (
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

            <button onClick={() => setMode('link_input')} className="flex flex-col items-center justify-center p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition">
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
            <button onClick={() => setMode('select')} className="w-full py-2 text-gray-500 text-sm hover:text-gray-700">Back to options</button>
          </div>
        )}
      </div>
    </div>
  );
};`
};

for (const [filename, content] of Object.entries(files)) {
  const dir = path.dirname(filename);
  if (dir !== '.') {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
  fs.writeFileSync(filename, content);
  console.log('Created: ' + filename);
}
console.log('✅ 모든 파일 생성 완료!');
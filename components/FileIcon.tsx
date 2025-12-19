import React from "react";
import { 
  FileText, Image as ImageIcon, Video, Music, Link as LinkIcon, 
  FileType as FileTypeIcon, FileSpreadsheet, Presentation, File
} from "lucide-react";
import { FileType } from "../types";

interface FileIconProps {
  type: FileType;
  content: string;
  thumbnail?: string;
  className?: string;
}

export const FileIcon: React.FC<FileIconProps> = ({ type, content, thumbnail, className = "w-10 h-10" }) => {
  if (type === "image") {
    return (
      <div className="w-full h-full overflow-hidden bg-gray-200 flex items-center justify-center">
        <img 
          src={content} 
          alt="thumbnail" 
          className="w-full h-full object-cover" 
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        <ImageIcon className={`${className} text-gray-400 absolute opacity-50`} />
      </div>
    );
  }

  if (thumbnail) {
    return (
        <div className="w-full h-full overflow-hidden bg-gray-200 flex items-center justify-center relative">
          <img src={thumbnail} alt="thumbnail" className="w-full h-full object-cover" />
          {type === "video" && <div className="absolute inset-0 flex items-center justify-center bg-black/20"><Video className="w-8 h-8 text-white" /></div>}
        </div>
    );
  }

  const iconProps = { className: `${className} text-slate-600` };

  switch (type) {
    case "video": return <div className="w-full h-full flex items-center justify-center bg-red-100 text-red-600"><Video {...iconProps} className={`${className} text-red-500`} /></div>;
    case "audio": return <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-600"><Music {...iconProps} className={`${className} text-purple-500`} /></div>;
    case "pdf": return <div className="w-full h-full flex items-center justify-center bg-red-50 text-red-700"><FileTypeIcon {...iconProps} className={`${className} text-red-600`} /></div>;
    case "doc": return <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600"><FileText {...iconProps} className={`${className} text-blue-600`} /></div>;
    case "xls": return <div className="w-full h-full flex items-center justify-center bg-green-100 text-green-600"><FileSpreadsheet {...iconProps} className={`${className} text-green-600`} /></div>;
    case "ppt": return <div className="w-full h-full flex items-center justify-center bg-orange-100 text-orange-600"><Presentation {...iconProps} className={`${className} text-orange-600`} /></div>;
    case "txt": return <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-600"><FileText {...iconProps} /></div>;
    case "link": return <div className="w-full h-full flex items-center justify-center bg-sky-100 text-sky-600"><LinkIcon {...iconProps} className={`${className} text-sky-500`} /></div>;
    default: return <div className="w-full h-full flex items-center justify-center bg-gray-200"><File {...iconProps} /></div>;
  }
};

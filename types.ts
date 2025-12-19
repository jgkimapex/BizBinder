export type FileType = "image" | "video" | "audio" | "pdf" | "doc" | "xls" | "ppt" | "txt" | "link";

export interface BinderItem {
  id: string;
  title: string;
  type: FileType;
  content: string; 
  thumbnail?: string; 
  timestamp: number;
}

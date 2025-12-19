import { BinderItem } from "./types";

export const DEFAULT_ITEMS: BinderItem[] = [
  {
    id: "1",
    title: "Passport",
    type: "image",
    content: "https://picsum.photos/id/103/600/800",
    timestamp: Date.now(),
  },
  {
    id: "2",
    title: "VISA",
    type: "image",
    content: "https://picsum.photos/id/20/600/800",
    timestamp: Date.now() + 1,
  },
  {
    id: "3",
    title: "Ticket",
    type: "image",
    content: "https://picsum.photos/id/3/600/400",
    timestamp: Date.now() + 2,
  },
  {
    id: "11",
    title: "To Do List",
    type: "txt",
    content: "1. Check in hotel\n2. Meeting with CEO at 2 PM\n3. Buy souvenirs",
    timestamp: Date.now() + 10,
  },
  {
    id: "12",
    title: "Google",
    type: "link",
    content: "https://www.google.com",
    timestamp: Date.now() + 11,
  },
];

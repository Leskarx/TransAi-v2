export type AppMode = "translator" | "assistant";

export interface Message {
  id: string;
  type: "text" | "file";
  sender: "user" | "ai";
  text?: string;
  fileName?: string;
  fileUrl?: string;
  status?: "uploading" | "processing" | "done";
  detected?: string;
}

export interface Chat {
  id: string;
  title: string;
  mode: AppMode;
  messages: Message[];
  createdAt: number;
}

export const genId = () => Math.random().toString(36).slice(2, 10);

export const sendMessageAPI = async (text: string, mode: AppMode): Promise<{ detected?: string; response: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (mode === "translator") {
        resolve({
          detected: "English",
          response: "এইটো এটা demo অনুবাদ",
        });
      } else {
        resolve({
          response: "এইটো এটা AI সহায়ক উত্তৰ (demo)",
        });
      }
    }, 800);
  });
};

export const speechToTextAPI = async (): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("এইটো এটা demo voice input");
    }, 500);
  });
};

export const uploadFileAPI = async (file: File): Promise<{ status: string; fileName: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ status: "uploaded", fileName: file.name });
    }, 800);
  });
};

export const processFileAPI = async (file: File): Promise<{ fileName: string; fileUrl: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        fileName: "processed_" + file.name,
        fileUrl: URL.createObjectURL(file),
      });
    }, 2000);
  });
};

export const downloadFile = (fileUrl: string, fileName: string) => {
  const link = document.createElement("a");
  link.href = fileUrl;
  link.download = fileName;
  link.click();
};

// localStorage helpers
const STORAGE_KEY = "transai_chats";

export const loadChats = (): Chat[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveChats = (chats: Chat[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
};

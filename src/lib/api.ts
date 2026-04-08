export type AppMode = "translator" | "assistant";
const API_BASE = import.meta.env.VITE_API_BASE;

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

export const sendMessageAPI = async (
  text: string,
  mode: AppMode
): Promise<{ detected?: string; response: string }> => {
  try {
    let endpoint = "";
    let body: any = {};

    if (mode === "translator") {
      endpoint = "/translate";
      body = {
        text,
        source_lang: "eng_Latn",
        target_lang: "asm_Beng",
      };
    } else {
      endpoint = "/aimode";
      body = { text };
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Server error");
    }

    const data = await response.json();

    return {
      response: data?.message || "❌ No response from server.",
      detected: mode === "translator" ? "eng_Latn" : undefined,
    };

  } catch (error) {
    console.error("API Error:", error);

    return {
      response: "⚠️ Error: Unable to reach server.",
    };
  }
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

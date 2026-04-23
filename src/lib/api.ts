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



export const speechToTextAPI = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      reject("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN"; // or "as-IN"
    recognition.interimResults = false;
    recognition.continuous = false; // ✅ IMPORTANT

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      recognition.stop(); // ✅ STOP mic
      resolve(transcript);
    };

    recognition.onerror = (err: any) => {
      recognition.stop(); // ✅ STOP on error
      reject(err);
    };

    recognition.onend = () => {
      // optional safety
      recognition.stop();
    };

    recognition.start();
  });
};

export const uploadFileAPI = async (
  file: File
): Promise<{ fileName: string; fileUrl: string }> => {
  try {
    const formData = new FormData();
    formData.append("pdf", file); // must match multer

    const res = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Upload failed");
    }

    // 🔥 Get filename from headers (optional but good)
    let fileName = "translated.pdf";
    const disposition = res.headers.get("Content-Disposition");

    if (disposition) {
      const match = disposition.match(/filename="?(.+)"?/);
      if (match) fileName = match[1];
    }

    // 🔥 Convert response → blob
    const blob = await res.blob();

    // 🔥 Create temporary URL
    const fileUrl = URL.createObjectURL(blob);

    return { fileName, fileUrl };

  } catch (error) {
    console.error("Upload API error:", error);
    throw error;
  }
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

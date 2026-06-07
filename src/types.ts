export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  image?: {
    data: string; // base64 representation
    mimeType: string;
  };
}

export interface Hotspot {
  id: string;
  name: string;
  title: string;
  description: string;
  safetyProtocol: string;
  mechanicNote: string;
  coords: { x: number; y: number }; // Percentage position on a custom SVG bike diagram
  importance: "CRITICAL" | "HIGH" | "IMPORTANT";
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: "Mechanics" | "Safety" | "Fuel & Torque" | "First Ride";
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: "locked" | "unlocked";
}

export interface EngineStage {
  id: "intake" | "compression" | "power" | "exhaust";
  name: string;
  description: string;
  physicsNotion: string;
  ventStatus: string;
  pistonPosition: "down" | "up";
  color: string;
}

export interface AssemblyStep {
  id: string;
  phase: "Preparation" | "Core Mount" | "Drive Train" | "Fuel & Control" | "Final Tuning";
  title: string;
  description: string;
  sparkyTip: string;
  subtasks: { id: string; text: string; done: boolean; tools?: string[] }[];
  difficulty: "Easy" | "Medium" | "Challenging" | "Supervised";
  mechanicConcept: string;
}

export interface VideoChapter {
  time: string;
  title: string;
  description: string;
}

export interface VideoGuide {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  duration: string;
  category: "Safety Basics" | "Engine Assembly" | "Drive Train Setup" | "Fuel Tuning";
  safetyPrecaution: string;
  mechanicConcept: string;
  chapters: VideoChapter[];
}


export interface SendPromptInput {
  message: string;
  chat_id: string;
  from: string;
}

export interface Message {
  role?: "user" | "assistant" | undefined;
  content?: string | undefined;
}

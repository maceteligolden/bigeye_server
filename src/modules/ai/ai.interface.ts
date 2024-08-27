export interface SendPromptInput {
  message: string;
  chat_id: string;
}

export interface Message {
  role?: "user" | "assistant" | undefined;
  content?: string | undefined;
}

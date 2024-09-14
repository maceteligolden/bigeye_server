export type PushNotificationInput = {
  message: string;
  subject: string;
  targetarn: string;
  meta_data?: {
    chat_id?: string;
    user_id?: string;
  };
};

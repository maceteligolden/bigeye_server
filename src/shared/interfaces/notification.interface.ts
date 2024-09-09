export interface INotification {
  send(args: Record<string, unknown>): Promise<void>;
}

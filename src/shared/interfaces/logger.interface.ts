export interface ILogger {
  log(message: string, metadata?: any): Promise<void>;
}

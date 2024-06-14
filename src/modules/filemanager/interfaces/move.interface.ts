export interface IAction {
  move(object_id: string[], to: string): Promise<void>;
  copy(object_id: string, to: string): Promise<void>;
}

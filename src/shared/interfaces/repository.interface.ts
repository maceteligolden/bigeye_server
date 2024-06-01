export interface IRepository<T> {
  create(args: T): Promise<T>;
  fetchAll(): Promise<T[]>;
  fetchOneById(id: string): Promise<T | null>;
  update(id: string, update: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<T>;
}

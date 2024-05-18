export interface IRepository<T> {
  create(args: T): Promise<T>;
  fetchAll(): Promise<T[]>;
  fetchOneById(id: string): Promise<T>;
  update(id: string, update: Partial<T>): Promise<T>;
  delete(id: string): Promise<T>;
}

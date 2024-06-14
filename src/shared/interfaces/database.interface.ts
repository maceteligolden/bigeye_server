export interface IDatabase {
  connect(): void;
  disconnect(): void;
}

export type DeleteOutput = {
  deletedCount: number;
};

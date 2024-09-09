export interface IDatabase {
  connect(): void;
  disconnect(): void;
  convertStringToObjectId(id: string): any;
}

export type DeleteOutput = {
  deletedCount: number;
};

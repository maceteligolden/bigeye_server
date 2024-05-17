export interface IPaginator<T> {
    getNext(): Promise<T[]>;
    dataCount(): Promise<number>;
    pageCount(): Promise<number>;
}
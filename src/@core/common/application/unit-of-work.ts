export abstract class UnitOfWork {
  abstract runTransaction<T>(callback: () => Promise<T>): Promise<T>;
}
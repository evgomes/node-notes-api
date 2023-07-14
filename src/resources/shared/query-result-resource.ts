export default class QueryResultResource<T> {
  constructor(
    public items: T[],
    public totalItems: number,
  ) {
    if (totalItems <= 0) {
      totalItems = 0;
    }
  }
}

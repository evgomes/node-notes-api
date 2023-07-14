export default abstract class QueryResource {
  constructor(
    public page: number,
    public itemsPerPage: number,
  ) {
    this.configurePagination();
  }

  configurePagination() {
    if (this.page <= 0) {
      this.page = 1;
    }

    if (this.itemsPerPage <= 0 || this.itemsPerPage >= 100) {
      this.itemsPerPage = 10;
    }
  }
}

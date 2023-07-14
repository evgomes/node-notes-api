import QueryResource from '../shared/query-resource';

export default class NotesQueryResource extends QueryResource {
  constructor(
    page: number,
    itemsPerPage: number,
    public text?: string,
  ) {
    super(page, itemsPerPage);
  }
}

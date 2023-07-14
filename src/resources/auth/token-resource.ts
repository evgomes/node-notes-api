export default class TokenResource {
  constructor(
    public success: boolean,
    public token?: string,
    public message?: string,
  ) {
    this.success = success;
    this.message = message;
    this.token = token;
  }
}

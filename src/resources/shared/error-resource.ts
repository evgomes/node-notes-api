class ErrorResource {
  readonly success: boolean;
  messages!: string[];

  constructor(messages?: string[]) {
    this.success = false;
    this.messages = messages || [];
  }
}

export default ErrorResource;

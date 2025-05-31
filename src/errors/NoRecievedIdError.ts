export class NoRecievedIdError extends Error {
  constructor() {
    super('did not recieve an id after successful creation');
  }
}

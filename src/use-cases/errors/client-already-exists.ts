export class ClientAlreadyExistsError extends Error {
  constructor() {
    super('A Client with same email already exists!')
    this.name = 'ClientAlreadyExistsError'
  }
}

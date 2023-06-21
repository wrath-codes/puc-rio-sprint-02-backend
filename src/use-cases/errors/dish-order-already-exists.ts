export class DishOrderAlreadyExistsError extends Error {
  constructor() {
    super('A order with the same dish and client already exists')
    this.name = 'DishOrderAlreadyExistsError'
  }
}

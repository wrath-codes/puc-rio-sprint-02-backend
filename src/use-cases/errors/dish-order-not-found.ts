export class DishOrderNotFoundError extends Error {
  constructor() {
    super('Dish Order not found!')
    this.name = 'DishOrderNotFoundError'
  }
}

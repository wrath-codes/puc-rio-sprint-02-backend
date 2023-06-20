export class MenuNotFoundError extends Error {
  constructor() {
    super('Menu not found!')
    this.name = 'MenuNotFoundError'
  }
}

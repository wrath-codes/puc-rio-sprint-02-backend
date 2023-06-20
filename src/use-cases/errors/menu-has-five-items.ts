export class MenuHasFiveItemsError extends Error {
  constructor() {
    super('Menu has 5 items already!')
    this.name = 'MenuHasFiveItemsError'
  }
}

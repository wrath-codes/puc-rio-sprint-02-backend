export class ClienWithNoAddressError extends Error {
  constructor() {
    super('Client has no address!')
    this.name = 'ClienWithNoAddressError'
  }
}

export class POSTerminal {
  checkout(cart) {
    return cart.items.reduce((sum, item) => sum + item.price, 0);
  }
}

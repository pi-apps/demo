export class XPManager {
  addXP(user, amount) {
    user.xp += amount;
    return user.xp;
  }
}

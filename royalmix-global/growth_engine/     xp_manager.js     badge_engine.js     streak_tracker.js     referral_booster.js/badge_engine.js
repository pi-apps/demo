export class BadgeEngine {
  assign(user, badge) {
    if (!user.badges.includes(badge)) user.badges.push(badge);
    return user.badges;
  }
}

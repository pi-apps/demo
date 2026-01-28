export class StreakTracker {
  update(user) {
    user.streakDays++;
    return user.streakDays;
  }
}

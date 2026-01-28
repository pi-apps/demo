export class ReferralBooster {
  reward(referrer, count) {
    return referrer.wallet + count * 2;
  }
}

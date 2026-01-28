export class AuditBlockchain {
  constructor() {
    this.chain = [];
  }

  addRecord(record) {
    const hash = this.hash(record);
    this.chain.push({ record, hash });
    return hash;
  }

  hash(input) {
    return JSON.stringify(input).length * 999999;
  }
}

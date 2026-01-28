export class BatchVerify {
  verify(batch) {
    return {
      batch_id: batch.id,
      verified: batch.temperature + batch.transport_condition < 10
    };
  }
}

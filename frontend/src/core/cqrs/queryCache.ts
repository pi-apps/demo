class QueryCache {
  private cache: Record<string, any> = {};

  set(key: string, data: any) {
    this.cache[key] = data;
  }

  get<T = any>(key: string): T | null {
    return this.cache[key] || null;
  }

  clear() {
    this.cache = {};
  }

  debug() {
    return this.cache;
  }
}

export const queryCache =
  new QueryCache();
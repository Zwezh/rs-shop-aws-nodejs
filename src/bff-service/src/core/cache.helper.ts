export class CacheHelper {
  private expireTime: number;
  private cache: Map<string, any>;

  constructor(expireTime: number) {
    this.expireTime = expireTime;
    this.cache = new Map<string, any>();
  }

  setValue(key: string, value: any) {
    const cacheTime = this.expireTime;

    if (this.isCached(key)) {
      console.log('Value with such key already cached');
      return;
    }

    this.cache.set(key, value);

    setTimeout(() => {
      this.cache.delete(key);
    }, cacheTime);
  }

  isCached(key: string): boolean {
    return this.cache.has(key);
  }

  getValue(key: string) {
    const value = this.cache.get(key);
    return this.cache.has(key) ? value : null;
  }
}

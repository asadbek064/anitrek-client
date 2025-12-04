class ProxyPool {
  private counts = new Map<string, { bucket: number; count: number }>();
  private readonly RATE_LIMIT = 90;
  private readonly WINDOW_MS = 60000;
  private readonly PROXY_ENDPOINT = process.env.PROXY_ENDPOINT;

  async getProxy(): Promise<string> {
    const res = await fetch(this.PROXY_ENDPOINT);
    const { proxy } = await res.json() as { proxy: string };

    const now = Date.now();
    const bucket = Math.floor(now / this.WINDOW_MS);
    const key = `${proxy}:${bucket}`;

    // Clean old buckets
    Array.from(this.counts.entries()).forEach(([k, v]) => {
      if (v.bucket < bucket) this.counts.delete(k);
    });

    const current = this.counts.get(key) || { bucket, count: 0 };

    if (current.count >= this.RATE_LIMIT) {
      throw new Error('Rate limit exceeded - proxy capacity full');
    }

    this.counts.set(key, { bucket, count: current.count + 1 });
    return proxy;
  }
}

// Singleton instance
export const proxyPool = new ProxyPool();

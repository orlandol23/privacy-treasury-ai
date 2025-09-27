// Performance optimization middleware for PrivacyTreasuryAI
// Implements caching, compression, and response optimization

import compression from 'compression';
import { Request, Response, NextFunction } from 'express';

// Response caching middleware
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

export const cacheMiddleware = (ttl: number = 300000) => { // 5 minutes default
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.originalUrl || req.url;
    const cached = cache.get(key);
    
    if (cached && (Date.now() - cached.timestamp) < cached.ttl) {
      console.log(`🚀 Cache HIT: ${key}`);
      return res.json(cached.data);
    }
    
    const originalSend = res.json;
    res.json = function(data: any) {
      // Store in cache
      cache.set(key, {
        data,
        timestamp: Date.now(),
        ttl
      });
      console.log(`💾 Cache MISS: ${key} - Cached for ${ttl}ms`);
      return originalSend.call(this, data);
    };
    
    next();
  };
};

// Request/Response timing middleware
export const performanceMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime.bigint();
  const originalWriteHead = res.writeHead;

  res.writeHead = function writeHead(this: Response, ...args: any[]) {
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
    if (!res.headersSent) {
      res.setHeader('X-Response-Time', `${durationMs.toFixed(2)}ms`);
    }
    // Restore original implementation to avoid wrapping multiple times
    res.writeHead = originalWriteHead;
    return originalWriteHead.apply(this, args as any);
  };

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
    const duration = Math.round(durationMs);
    const color = duration > 1000 ? '🔴' : duration > 500 ? '🟡' : '🟢';
    console.log(`${color} ${req.method} ${req.path} - ${duration}ms`);
  });

  res.on('close', () => {
    res.writeHead = originalWriteHead;
  });

  next();
};

// Memory usage monitor
export const memoryMonitor = () => {
  const used = process.memoryUsage();
  const formatMB = (bytes: number) => Math.round(bytes / 1024 / 1024 * 100) / 100;
  
  return {
    rss: `${formatMB(used.rss)} MB`, // Resident Set Size
    heapTotal: `${formatMB(used.heapTotal)} MB`,
    heapUsed: `${formatMB(used.heapUsed)} MB`,
    external: `${formatMB(used.external)} MB`,
    arrayBuffers: `${formatMB(used.arrayBuffers)} MB`
  };
};

// Cache cleanup job (runs every 10 minutes)
setInterval(() => {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [key, cached] of cache.entries()) {
    if ((now - cached.timestamp) > cached.ttl) {
      cache.delete(key);
      cleaned++;
    }
  }
  
  if (cleaned > 0) {
    console.log(`🧹 Cache cleanup: Removed ${cleaned} expired entries`);
  }
}, 600000); // 10 minutes

// API response optimization
export const optimizeResponse = (data: any) => {
  // Remove undefined values and optimize data structure
  const optimized = JSON.parse(JSON.stringify(data, (key, value) => {
    if (value === undefined || value === null) return undefined;
    if (typeof value === 'number' && isNaN(value)) return 0;
    if (typeof value === 'string' && value.trim() === '') return undefined;
    return value;
  }));
  
  return optimized;
};

// Batch processing for multiple operations
export class BatchProcessor {
  private queue: Array<{ id: string; operation: () => Promise<any>; resolve: Function; reject: Function }> = [];
  private processing = false;
  private batchSize = 5;
  private processingInterval = 100; // ms
  
  async add<T>(id: string, operation: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({ id, operation, resolve, reject });
      this.process();
    });
  }
  
  private async process() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    const batch = this.queue.splice(0, this.batchSize);
    
    console.log(`⚡ Processing batch of ${batch.length} operations`);
    
    await Promise.allSettled(
      batch.map(async ({ id, operation, resolve, reject }) => {
        try {
          const result = await operation();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      })
    );
    
    this.processing = false;
    
    // Continue processing if there are more items
    if (this.queue.length > 0) {
      setTimeout(() => this.process(), this.processingInterval);
    }
  }
}

export const batchProcessor = new BatchProcessor();
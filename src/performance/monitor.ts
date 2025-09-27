// Performance monitoring and health check endpoint
// Provides real-time system performance metrics

import type { Request, Response, NextFunction } from 'express';

export interface PerformanceMetrics {
  memory: NodeJS.MemoryUsage;
  uptime: number;
  responseTime: {
    average: number;
    min: number;
    max: number;
    requests: number;
  };
  cacheStats: {
    hits: number;
    misses: number;
    hitRatio: number;
    size: number;
  };
  errorRate: {
    count: number;
    rate: number;
  };
  systemHealth: 'excellent' | 'good' | 'warning' | 'critical';
}

class PerformanceMonitor {
  private responseTimes: number[] = [];
  private cacheHits = 0;
  private cacheMisses = 0;
  private errorCount = 0;
  private requestCount = 0;
  private startTime = Date.now();

  recordResponseTime(time: number) {
    this.responseTimes.push(time);
    this.requestCount++;
    
    // Keep only last 1000 requests
    if (this.responseTimes.length > 1000) {
      this.responseTimes.shift();
    }
  }

  recordCacheHit() {
    this.cacheHits++;
  }

  recordCacheMiss() {
    this.cacheMisses++;
  }

  recordError() {
    this.errorCount++;
  }

  getMetrics(): PerformanceMetrics {
    const memory = process.memoryUsage();
    const uptime = Date.now() - this.startTime;
    
    const avgResponseTime = this.responseTimes.length > 0 
      ? this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length 
      : 0;
    
    const minResponseTime = this.responseTimes.length > 0 
      ? Math.min(...this.responseTimes) 
      : 0;
    
    const maxResponseTime = this.responseTimes.length > 0 
      ? Math.max(...this.responseTimes) 
      : 0;

    const totalCacheRequests = this.cacheHits + this.cacheMisses;
    const cacheHitRatio = totalCacheRequests > 0 
      ? (this.cacheHits / totalCacheRequests) * 100 
      : 0;

    const errorRate = this.requestCount > 0 
      ? (this.errorCount / this.requestCount) * 100 
      : 0;

    // Determine system health
    let systemHealth: 'excellent' | 'good' | 'warning' | 'critical' = 'excellent';
    
    if (avgResponseTime > 2000 || errorRate > 5 || memory.heapUsed > 500 * 1024 * 1024) {
      systemHealth = 'critical';
    } else if (avgResponseTime > 1000 || errorRate > 2 || memory.heapUsed > 300 * 1024 * 1024) {
      systemHealth = 'warning';
    } else if (avgResponseTime > 500 || errorRate > 1 || memory.heapUsed > 200 * 1024 * 1024) {
      systemHealth = 'good';
    }

    return {
      memory,
      uptime,
      responseTime: {
        average: Math.round(avgResponseTime),
        min: Math.round(minResponseTime),
        max: Math.round(maxResponseTime),
        requests: this.requestCount
      },
      cacheStats: {
        hits: this.cacheHits,
        misses: this.cacheMisses,
        hitRatio: Math.round(cacheHitRatio * 100) / 100,
        size: totalCacheRequests
      },
      errorRate: {
        count: this.errorCount,
        rate: Math.round(errorRate * 100) / 100
      },
      systemHealth
    };
  }

  reset() {
    this.responseTimes = [];
    this.cacheHits = 0;
    this.cacheMisses = 0;
    this.errorCount = 0;
    this.requestCount = 0;
    this.startTime = Date.now();
  }

  getHealthStatus(): { status: string; message: string; color: string } {
    const metrics = this.getMetrics();
    
    switch (metrics.systemHealth) {
      case 'excellent':
        return {
          status: 'Excellent',
          message: 'All systems operating optimally',
          color: '#10b981' // green
        };
      case 'good':
        return {
          status: 'Good',
          message: 'System performing well',
          color: '#3b82f6' // blue
        };
      case 'warning':
        return {
          status: 'Warning',
          message: 'Performance issues detected',
          color: '#f59e0b' // yellow
        };
      case 'critical':
        return {
          status: 'Critical',
          message: 'Immediate attention required',
          color: '#ef4444' // red
        };
      default:
        return {
          status: 'Unknown',
          message: 'Status cannot be determined',
          color: '#6b7280' // gray
        };
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Enhanced performance middleware with monitoring
export const enhancedPerformanceMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime.bigint();
  const originalWriteHead = res.writeHead;

  res.writeHead = function patchedWriteHead(this: Response, ...args: any[]) {
    if (!res.headersSent) {
      const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
      res.setHeader('X-Response-Time', `${durationMs.toFixed(2)}ms`);
      res.setHeader('X-Server-Health', performanceMonitor.getHealthStatus().status);
    }
    res.writeHead = originalWriteHead;
    return originalWriteHead.apply(this, args as any);
  };

  res.once('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
    const duration = Math.round(durationMs);
    performanceMonitor.recordResponseTime(duration);

    if (duration > 1000) {
      console.log(`🐌 Slow request: ${req.method} ${req.path} - ${duration}ms`);
    }

    if (res.statusCode >= 400) {
      performanceMonitor.recordError();
    }
  });

  res.once('close', () => {
    res.writeHead = originalWriteHead;
  });

  next();
};
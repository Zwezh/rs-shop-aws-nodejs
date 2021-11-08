import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, Method } from 'axios';
import { map, Observable, of } from 'rxjs';
import { CacheHelper } from './core/cache.helper';

@Injectable()
export class AppService {
  private cache = new CacheHelper(2 * 60 * 1000);
  private productsCacheKey = 'products';

  constructor(private readonly httpService: HttpService) {}

  use(recipient: string, originalUrl: string, method: string, body: unknown): Observable<any> {
    const recipientURL = process.env[recipient];
    if (method === 'GET' && recipient === this.productsCacheKey && this.cache.isCached(this.productsCacheKey)) {
      return of(this.cache.getValue(this.productsCacheKey));
    } else {
      const requestConfig: AxiosRequestConfig = {
        method: method as Method,
        url: `${recipientURL}${originalUrl}`,
        ...(Object.entries(body || {}).length > 0 ? { data: body } : {})
      };
      return this.httpService.request(requestConfig).pipe(
        map((response) => {
          this.setCache(method, recipient, response);
          return response.data;
        })
      );
    }
  }

  setCache(method: string, recipient: string, response: any): void {
    if (method === 'GET' && recipient === this.productsCacheKey) {
      this.cache.setValue(this.productsCacheKey, response.data);
    }
  }
}

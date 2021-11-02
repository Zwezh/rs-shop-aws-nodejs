import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class DenyMiddleware implements NestMiddleware {
  use(req: Request, response: Response, next: () => void) {
    console.info('Cannot process request');
    response.status(502).send('Cannot process request');
  }
}

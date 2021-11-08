import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class BlockNonExistMiddleware implements NestMiddleware {
  use(req: Request, response: Response, next: () => void) {
    const recipientServiceName = req.originalUrl.split(/[/?]/)[1];
    if (!recipientServiceName || !process.env[recipientServiceName]) {
      response.status(502).send('Cannot process request');
    }
    next();
  }
}

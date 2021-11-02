import { All, Controller, HttpException, InternalServerErrorException, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { map, of } from 'rxjs';
import { AppService } from './app.service';

@Controller('*')
export class AppController {
  constructor(private recipientService: AppService) {}

  @All()
  async proxy(@Req() req: Request, @Res() res: Response): Promise<any> {
    const { originalUrl, method, body } = req;
    const recipient = originalUrl.split('/')[1];
    try {
      return await this.recipientService.use(recipient, originalUrl, method, body).pipe(
        map((data) => {
          res.send(data);
        })
      );
    } catch (error) {
      console.log('Recipient error: ', JSON.stringify(error));
      if (error.response) {
        const { status, data } = error.response;
        throw of(new HttpException(data, status));
      } else {
        throw of(new InternalServerErrorException(error.message));
      }
    }
  }
}

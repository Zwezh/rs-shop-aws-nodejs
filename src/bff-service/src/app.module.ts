import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlockNonExistMiddleware } from './core/middlewares';

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BlockNonExistMiddleware).forRoutes('/');
  }
}

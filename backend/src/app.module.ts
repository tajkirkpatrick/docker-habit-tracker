import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { handler as ssrHandler } from '../dist/server/entry.mjs';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'dist/client'),
        }),
    ],
    controllers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(ssrHandler)
            .forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}

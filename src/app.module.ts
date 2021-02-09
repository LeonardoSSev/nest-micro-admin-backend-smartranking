import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategorySchema } from './interfaces/categories/category.schema';
import { PlayerSchema } from './interfaces/players/player.schema';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false 
    }),
    MongooseModule.forFeature([{
      name: 'Player',
      schema: PlayerSchema
    }]),
    MongooseModule.forFeature([{
      name: 'Category',
      schema: CategorySchema
    }])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { RoomGateway } from './gateway/room-gateway/room.gateway';
import { RoomEntity } from './model/room.entity';
import { RoomService } from './service/room-service/room/room.service';
import { ConnectionGateway } from './gateway/connection-gateway/connection.gateway';
import { RoomDiagramEntity } from './model/room-diagram.entity';
import { RoomDiagramService } from './service/room-diagram-service/room-diagram/room-diagram.service';
import { RoomController } from './controller/room.controller';

@Module({
  imports: [UserModule, AuthModule, TypeOrmModule.forFeature([RoomEntity, RoomDiagramEntity])],
  providers: [RoomGateway, RoomService, ConnectionGateway, RoomDiagramService],
  exports: [TypeOrmModule],
  controllers: [RoomController],
})
export class RoomModule {}

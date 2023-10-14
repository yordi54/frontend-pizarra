import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { RoomDiagramService } from 'src/room/service/room-diagram-service/room-diagram/room-diagram.service';

@WebSocketGateway({ namespace: 'connection', cors: { origin: '*' } })
export class ConnectionGateway {
  constructor(private roomDiagramService: RoomDiagramService) {}

  @SubscribeMessage('joinRoom')
  async onJoinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() room: any,
  ) {
    socket.join(room);

    socket.on('message', (diagram: string) => {
      socket.to(room).emit('message', diagram);
    });
  }
}

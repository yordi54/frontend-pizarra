import { UnauthorizedException } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/service/auth.service';
import { PageI } from 'src/room/model/page.interface';
import { RoomI } from 'src/room/model/room.interface';
import { RoomService } from 'src/room/service/room-service/room/room.service';
import { UserI } from 'src/user/model/user.interface';
import { UserService } from 'src/user/service/user-service/user.service';

@WebSocketGateway({ namespace: 'room', cors: { origin: '*' } })
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private roomService: RoomService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket, ...args: any[]) {
    try {
      const decodeToken = await this.authService.verifyJwt(
        socket.handshake.headers.authorization,
      );
      const user: UserI = await this.userService.getOne(decodeToken.user.id);
      if (!user) {
        this.disconnect(socket);
      } else {
        socket.data.user = user;
        const rooms = await this.roomService.getRoomsForUser(user.id, {
          page: 1,
          limit: 10,
        });
        rooms.meta.currentPage = rooms.meta.currentPage - 1;
        this.server.to(socket.id).emit('rooms', rooms);
      }
    } catch (error) {
      this.disconnect(socket);
    }
  }

  async handleDisconnect(socket: Socket) {
    socket.disconnect();
  }

  private disconnect(socket: Socket) {
    socket.emit('error', new UnauthorizedException());
    socket.disconnect();
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(socket: Socket, room: RoomI) {
    try {
      const decodeToken = await this.authService.verifyJwt(
        socket.handshake.headers.authorization,
      );
      const user: UserI = await this.userService.getOne(decodeToken.user.id);
      if (!user) {
        this.disconnect(socket);
      } else {
        await this.roomService.createRoom(room, user);
      }
    } catch (error) {
      this.disconnect(socket);
    }
  }

  @SubscribeMessage('paginateRooms')
  async onPaginateRooms(socket: Socket, page: PageI) {
    try {
      page.limit = page.limit > 100 ? 100 : page.limit;
      page.page = page.page + 1;
      const decodeToken = await this.authService.verifyJwt(
        socket.handshake.headers.authorization,
      );
      const user: UserI = await this.userService.getOne(decodeToken.user.id);
      if (!user) {
        this.disconnect(socket);
      } else {
        const rooms = await this.roomService.getRoomsForUser(user.id, page);
        rooms.meta.currentPage = rooms.meta.currentPage - 1;
        this.server.to(socket.id).emit('rooms', rooms);
      }
    } catch (error) {
      this.disconnect(socket);
    }
  }
}

import { Controller, Body, Post } from '@nestjs/common';
import { RoomDiagramService } from 'src/room/service/room-diagram-service/room-diagram/room-diagram.service';
import { DiagramRoomDto } from '../model/dto/diagram-room.dto';



@Controller('room')
export class RoomController {

  constructor(private RoomDiagramService: RoomDiagramService) { }
  //save
  @Post('save-diagram')
  async saveRoomDiagram(@Body() diagramRoomDto: DiagramRoomDto) {
    return await this.RoomDiagramService.saveRoomDiagram(diagramRoomDto.roomEntityId, diagramRoomDto.diagram);
  }
}

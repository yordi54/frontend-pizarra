import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomDiagramEntity } from 'src/room/model/room-diagram.entity';
import { RoomDiagramI } from 'src/room/model/room-diagram.interface';
import { Repository } from 'typeorm';
import { DiagramRoomDto } from '../../../model/dto/diagram-room.dto';

@Injectable()
export class RoomDiagramService {
  constructor(
    @InjectRepository(RoomDiagramEntity)
    private readonly roomDiagramRepository: Repository<RoomDiagramEntity>,
  ) {}
  async saveRoomDiagram(
    diagramRoomDto: DiagramRoomDto,
  ): Promise<RoomDiagramI> {
    const {roomEntityId, diagram1, diagram2, diagram3} = diagramRoomDto;
    const diagram = diagram1 + diagram2 + diagram3;
    console.log(diagram);
    //verificar si existe ya un diagrama para esa sala
    const roomDiagramExists = await this.roomDiagramExistsByRoomEntityId(roomEntityId);
    if(roomDiagramExists){
      //si existe, actualizar
      return await this.updateRoomDiagram(roomEntityId, diagram);        
    }
    return await this.roomDiagramRepository.save({ roomEntityId, diagram });
  }

  async updateRoomDiagram(
    roomEntityId: number,
    diagram: string,
  ): Promise<RoomDiagramI> {
    const roomDiagram = await this.findRoomDiagramByRoomEntityId(roomEntityId);
    roomDiagram.diagram = diagram;
    return await this.roomDiagramRepository.save(roomDiagram);
  }
  
  async findRoomDiagramByRoomEntityId(
    roomEntityId: number,
  ): Promise<RoomDiagramI> {
    return this.roomDiagramRepository.findOne({ roomEntityId });
  }

  async roomDiagramExistsByRoomEntityId(
    roomEntityId: number,
  ): Promise<boolean> {
    const roomDiagram = await this.roomDiagramRepository.findOne({
      roomEntityId,
    });
    if (roomDiagram) {
      return true;
    } else {
      return false;
    }
  }
}

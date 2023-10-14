import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomDiagramEntity } from 'src/room/model/room-diagram.entity';
import { RoomDiagramI } from 'src/room/model/room-diagram.interface';
import { Repository } from 'typeorm';

@Injectable()
export class RoomDiagramService {
  constructor(
    @InjectRepository(RoomDiagramEntity)
    private readonly roomDiagramRepository: Repository<RoomDiagramEntity>,
  ) {}
  async saveRoomDiagram(
    roomEntityId: number,
    diagram: string,
  ): Promise<RoomDiagramI> {
    return this.roomDiagramRepository.save({ roomEntityId, diagram });
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

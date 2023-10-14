import { Test, TestingModule } from '@nestjs/testing';
import { RoomDiagramService } from './room-diagram.service';

describe('RoomDiagramService', () => {
  let service: RoomDiagramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomDiagramService],
    }).compile();

    service = module.get<RoomDiagramService>(RoomDiagramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

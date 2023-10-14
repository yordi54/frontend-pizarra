import { Column, Entity, JoinTable, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { RoomEntity } from './room.entity';

@Entity()
export class RoomDiagramEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  roomEntityId: number;

  @OneToOne(() => RoomEntity)
  @JoinTable()
  room: RoomEntity;

  @Column()
  diagram: string;
}

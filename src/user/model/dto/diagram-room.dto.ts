import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DiagramRoomDto {
    @IsNotEmpty()
    @IsNumber()
    roomEntityId: number;
    @IsString()
    @IsNotEmpty()
    diagram: string;
}

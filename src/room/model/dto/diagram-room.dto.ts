import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DiagramRoomDto {
    @IsNotEmpty()
    @IsNumber()
    roomEntityId: number;
    @IsString()
    @IsNotEmpty()
    diagram1: string;
    @IsString()
    @IsNotEmpty()
    diagram2: string;
    @IsString()
    @IsNotEmpty()
    diagram3: string;
}

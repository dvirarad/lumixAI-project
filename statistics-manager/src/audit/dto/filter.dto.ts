import {ApiProperty} from "@nestjs/swagger";
import {Transform} from "class-transformer";
import {IsNumber, IsOptional, IsString} from "class-validator";

export class filterDTO {
    @ApiProperty({type: Number, required: false, description: "start Time"})
    @Transform(({value}) => Number.parseInt(value))
    @IsNumber()
    @IsOptional()
    startTime?: number;
    @ApiProperty({type: Number, required: false, description: "end Time"})
    @Transform(({value}) => Number.parseInt(value))
    @IsNumber()
    @IsOptional()
    endTime?: number;
    @ApiProperty({type: String, required: false, description: "operation"})
    @IsString()
    @IsOptional()
    operation?: string;
    @ApiProperty({type: String, required: false, description: "status"})
    @IsString()
    @IsOptional()
    status?: string;
    @ApiProperty({type: String, required: false, description: "text"})
    @IsString()
    @IsOptional()
    text?: string;
}

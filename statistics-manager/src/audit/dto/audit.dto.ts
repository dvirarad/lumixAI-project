import {ApiProperty} from '@nestjs/swagger';
import {ObjectId} from 'mongodb';

export class AuditDTO {
    @ApiProperty({type: ObjectId, required: true, description: "Id"})
    _id: ObjectId;
    @ApiProperty({type: String, required: true, description: "operation"})
    operation: string;
    @ApiProperty({type: String, required: true, description: "text"})
    text: string;
    @ApiProperty({type: Number, required: true, description: "created time"})
    created_at: number;
    @ApiProperty({type: Number, required: true, description: "count"})
    count: number;
    @ApiProperty({type: String, required: true, description: "status"})
    status: string;
}

export class AuditResponseDTO {
    @ApiProperty({type: AuditDTO, isArray: true, required: true, description: "data"})
    data: AuditDTO[];
    @ApiProperty({type: Number, required: true, description: "count"})
    count: number;
}

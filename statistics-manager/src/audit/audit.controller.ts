import {Controller, Get, Query, UseInterceptors} from '@nestjs/common';
import {AuditService} from './audit.service';
import {filterDTO} from "./dto/filter.dto";
import {AuditResponseDTO} from "./dto/audit.dto";
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags('Audit')
@Controller('audit')
export class AuditController {
    constructor(private readonly auditService: AuditService) {
    }

    @ApiOperation({summary: 'Find audit logs'})
    @ApiResponse({status: 200, description: 'Audit logs retrieved successfully.', type: AuditResponseDTO})
    @Get()
    async find(@Query() filter: filterDTO): Promise<AuditResponseDTO> {
        return this.auditService.find(filter);
    }


}

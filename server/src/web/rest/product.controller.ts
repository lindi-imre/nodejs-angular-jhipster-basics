import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { ProductDTO } from '../../service/dto/product.dto';
import { ProductService } from '../../service/product.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/products')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('products')
export class ProductController {
  logger = new Logger('ProductController');

  constructor(private readonly productService: ProductService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ProductDTO
  })
  async getAll(@Req() req: Request): Promise<ProductDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.productService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder()
    });
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: ProductDTO
  })
  async getOne(@Param('id') id: string): Promise<ProductDTO> {
    return await this.productService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ title: 'Create product' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: ProductDTO
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() productDTO: ProductDTO): Promise<ProductDTO> {
    const created = await this.productService.save(productDTO);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Product', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ title: 'Update product' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ProductDTO
  })
  async put(@Req() req: Request, @Body() productDTO: ProductDTO): Promise<ProductDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Product', productDTO.id);
    return await this.productService.update(productDTO);
  }

  @Delete('/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ title: 'Delete product' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async deleteById(@Req() req: Request, @Param('id') id: string): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Product', id);
    return await this.productService.deleteById(id);
  }
}

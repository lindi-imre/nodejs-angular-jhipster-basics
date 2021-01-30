/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

/**
 * A Product DTO object.
 */
export class ProductDTO extends BaseDTO {
  @ApiModelProperty({ description: 'name field', required: false })
  name: string;

  @ApiModelProperty({ description: 'price field', required: false })
  price: number;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

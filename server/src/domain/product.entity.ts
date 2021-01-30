/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

/**
 * A Product.
 */
@Entity('product')
export class Product extends BaseEntity {
  @Column({ name: 'name', nullable: true })
  name: string;

  @Column({ type: 'float', name: 'price', nullable: true })
  price: number;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}

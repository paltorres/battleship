/**
 * Ship model.
 */
import { Document, Schema, Model, model } from 'mongoose';
import toJson from '@meanie/mongoose-to-json';

import values from 'ramda/src/values';
import keys from 'ramda/src/keys';
import equals from 'ramda/src/equals';

import { IShip, Cell } from './interfaces/iship';

export { Cell }

export interface IShipModel extends IShip, Document {
  hit(): void,
  horizontal(): boolean,
  vertical(): boolean,
}

enum DIRECTIONS {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
}
export const SHIP_DIRECTIONS = values(DIRECTIONS);
export enum SHIPS {
  'aircraft-carrier' = 4,
  'submarine' = 3,
  'cruiser' = 2,
  'destroyer' = 1,
}

const shipSchema: Schema = new Schema({
  placement: {
    coordinateX: {
      type: Number,
      required: true,
    },
    coordinateY: {
      type: Number,
      required: true,
    },
    _id: false,
  },
  direction: {
    type: String,
    required: true,
    enum: SHIP_DIRECTIONS,
  },
  type: {
    type: String,
    enum: keys(SHIPS),
  },
  sunken: {
    type: Boolean,
    required: true,
    default: false,
  },
  hits: {
    type: Number,
    required: true,
    default: 0,
  },
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

shipSchema.virtual('length').get(getVirtualLength);

function getVirtualLength() {
  return SHIPS[this.type];
}

shipSchema.method('horizontal', horizontal);
shipSchema.method('vertical', vertical);
shipSchema.method('hit', hit);

function horizontal() {
  return this.direction === DIRECTIONS.HORIZONTAL;
}

function vertical() {
  return this.direction === DIRECTIONS.VERTICAL;
}

function hit() {
  this.hits += 1;
  if (equals(this.hits, this.length)) {
    this.sunken = true;
  }
}

shipSchema.plugin(toJson);

export const Ship: Model<IShipModel> = model<IShipModel>('Ship', shipSchema);

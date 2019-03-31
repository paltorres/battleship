/**
 * Ship model.
 */
import values from 'ramda/src/values';
import keys from 'ramda/src/keys';
import { Document, Schema, Model, model } from 'mongoose';
import toJson from '@meanie/mongoose-to-json';

import { IShip, Cell } from './interfaces/iship';

export { Cell }

export interface IShipModel extends IShip, Document {
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
};

const shipSchema: Schema = new Schema({
  // TODO: check if this is enough
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

function horizontal() {
  return this.direction === DIRECTIONS.HORIZONTAL;
}

function vertical() {
  return this.direction === DIRECTIONS.VERTICAL;
}

shipSchema.plugin(toJson);

export const Ship: Model<IShipModel> = model<IShipModel>('Ship', shipSchema);

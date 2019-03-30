/**
 * Ship model.
 */
import values from 'ramda/src/values';
import { Document, Schema, Model, model } from 'mongoose';
import toJson from '@meanie/mongoose-to-json';

import { IShip } from './interfaces/iship';

export interface IShipModel extends IShip, Document {
}

const SHIP_DIRECTIONS = ['vertical', 'horizontal'];
export const SHIPS = {
  'aircraft-carrier': 4,
  'submarine': 3,
  'cruiser': 2,
  'destroyer': 1,
};

const shipSchema: Schema = new Schema({
  // TODO: check if this is enough
  placement: {
    type: String,
    required: true,
  },
  direction: {
    type: String,
    required: true,
    enum: SHIP_DIRECTIONS,
  },
  type: {
    type: String,
    enum: values(SHIPS),
  },
  sunken: {
    type: Boolean,
    required: true,
    default: false,
  },
  length: {
    type: Number,
    required: true,
  },
});

shipSchema.virtual('length', getVirtualLength);

function getVirtualLength() {
  return SHIPS[this.type];
}

shipSchema.plugin(toJson);

export const Ship: Model<IShipModel> = model<IShipModel>('User', shipSchema);

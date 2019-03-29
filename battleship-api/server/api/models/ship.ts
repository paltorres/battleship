import values from 'lodash.values';
import { Schema, model } from 'mongoose';
import toJson from '@meanie/mongoose-to-json';

const SHIP_DIRECTIONS = ['vertical', 'horizontal'];
const SHIP_TYPES = {
  'aircraft-carrier': 4,
  'submarine': 3,
  'cruiser': 2,
  'destroyer': 1,
};


const ShipSchema: Schema = new Schema({
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
    enum: values(SHIP_TYPES),
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

ShipSchema.virtual('length', getVirtualLength);

function getVirtualLength() {
  return SHIP_TYPES[this.type];
}

ShipSchema.plugin(toJson);

export default model('Ship', ShipSchema);

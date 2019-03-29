import { Schema, model } from 'mongoose';
import toJson from '@meanie/mongoose-to-json';
import uniqueValidator from 'mongoose-unique-validator';


const AVAILABLE_STYLES = ['default'];

// to types
interface FleetConfig {
  type: string,
  quantity: number,
}

interface Board {
  height: number,
  width: number,
}

export interface GameModDefinition {
  name: string,
  playerQuantity: number,
  style: string
  fleet: [FleetConfig]
  board: Board,
}

const GameModSchema: Schema = new Schema({
  name: {
    type: String,
    unique: true,
    lowercase: true,
    require: true,
  },
  playerQuantity: {
    type: Number,
    required: true,
    default: 2,
  },
  style: {
    type: String,
    lowercase: true,
    require: true,
    enum: AVAILABLE_STYLES,
    default: 'default',
  },
  fleet: [{
    type: {
      type: String,
      require: true,
    },
    quantity: {
      type: Number,
      require: true,
    },
    _id: false,
  }],
  board: {
    height: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
  },
});


GameModSchema.plugin(toJson);
GameModSchema.plugin(uniqueValidator);

export default model('GameMod', GameModSchema);

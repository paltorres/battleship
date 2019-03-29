
const mongoose = require('mongoose');
const { model, Schema } = mongoose;

mongoose.connect('mongodb://localhost/battleship', { useNewUrlParser: true, useCreateIndex: true }).then(() => {

});


const User = model('User', new Schema({
    username: {
        type: String,
        required: true,
        lowercase: true,
    },
    dateCreated: { type: Date, default: Date.now() },
    lastUpdated: { type: Date, default: Date.now() },
}));

const Player = model('Player', new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    opponent: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        validate: function () {
            return this.creator !== this.opponent;
        },
    },
    title: { type: String, required: true },
    config: {
        env: {
            type: String,
        },
    },
    dateCreated: { type: Date, default: Date.now() },
    lastUpdated: { type: Date, default: Date.now() },
}));


async function createPlayer({creator, opponent}) {
    const player = new Player({
        title: 'test',
        creator: creator._id,
        opponent: opponent._id,
    });
    console.log("player");
    console.log(player);
    const r = await player.save();
    console.log("response");
    console.log(r);
}

async function createUser() {
    const creator = new User({ username: 'tesdsdasassats'});
    console.log("creator");
    console.log(creator);
    const creatorResponse = await creator.save();
    console.log("creatorResponse");
    console.log(creatorResponse);

    const opponent = new User({ username: 'tesdsaasastdaa_2'});
    console.log("opponent");
    console.log(opponent);
    const opponentResponse = await opponent.save();
    console.log("opponentResponse");
    console.log(opponentResponse);
    return {creator, opponent};
}

createUser().then((users) => createPlayer(users));

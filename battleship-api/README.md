# battleship-api

## Initialization (important!)

First at all, you have to insert at least one mod, run the following command:

In project root:

`cd /commands && insert_mod.sh` 

## API

All endpoints have as Base URL: `/api/battleship`.

The required headers is `x-user-id` to get access to endpoints.

### Authentication

This endpoints could live in another API o resource.

They are here just for easy implementation.

This api offers two endpoints, create an access token, and validate it.

#### Create token

Endpoint | method | body | params | response
-------- | ------ | ---- | ------ | --------
`/auth/token` | POST | { username: string, password: string } | N/A | { x-token, x-refresh-token }


#### Validate token
Endpoint | method | body | params | response
-------- | ------ | ---- | ------ | --------
`/auth/token` | GET { username: string, password: string } | N/A | { id, username }


### User

##### Create user

Endpoint | method | body | params | response
-------- | ------ | ---- | ------ | --------
`/users` | POST | { username: string, password: string } |  N/A | { id, username }


#### Get user

Endpoint | method | body | params | response
-------- | ------ | ---- | ------ | --------
`/users/:userId` | GET | N/A | The user id. | { id, username, dateCreated, lasUpdated }


### Modes

You can create a mode with some custom config.

Endpoint | method | body | params | response
-------- | ------ | ---- | ------ | --------
`/mods` | POST | modeConfig, see below | N/A | { id, name, ... }

Example of mode config:
```
{
  name: 'mod name',
  playerQuantity: 2,
  style: 'default',
  fleet: [
    {
      type: 'aircraft-carrier',
      quantity: 1,
    },
    {
      type: 'submarine',
      quantity: 2,
    },
    {
      type: 'cruiser',
      quantity: 3,
    },
    {
      type: 'destroyer',
      quantity: 4,
    },
  ],
  board: {
    height: 10,
    width: 10,
  }
}
```

#### Get all modes

Endpoint | method | body | params | response
-------- | ------ | ---- | ------ | --------
`/modes` | GET | N/A | N/A | { id, name, ... }


### Game

#### Create game

At first the game is created with the status `waiting_for_opponent`, and the fleet will be created when all required players are ready.

Endpoint | method | body | params | response
-------- | ------ | ---- | ------ | --------
`/games` | POST |{ title: string, mode: string, some mode id } | N/A | { id, title, status, ... }



#### Get game by id

Endpoint | method | body | params | response
-------- | ------ | ---- | ------ | --------
`/games/:gameId` | GET | N/A | The game id. | { id, title, status, ... }


#### Delete game

Endpoint | method | body | params | response
-------- | ------ | ---- | ------ | --------
`/games/:gameId` | DELETE | N/A | The game id. | { id, title, status, ... }



#### Add player to game (join game)

Endpoint | method | body | params | response
-------- | ------ | ---- | ------ | --------
`/games/:gameId/players` | POST | N/A | N/A | { id, title, status, ... }

If the quota of players are complete the fleet is created and the game start.


#### Fire shot

Endpoint | method | body | params | response
-------- | ------ | ---- | ------ | --------
`/games/:gameId/players/shots` | POST | { playerTarget, coordinateX, coordinateY } | The game id | { miss: boolean, coordinateX, coordinateY }

If fleet is sunken the game is set as finish and set the winner player.


#### Search games

Endpoint | method | body | params | response
-------- | ------ | ---- | ------ | --------
`/games/search` | GET | N/A | { isCreator: boolean, userPlayer: user id, status, userPlayer, mode } | { data: [ { id, title, status, ... } ] }

Examples:
If you want search all games that the user can join:

`curl -X '/games/search?is_creator=false&status=waiting_for_opponent' -H 'x-user-id:SOME_USER_ID'`

If you want search all some user's games:

`curl -X '/games/search?user_player=SOME_USER_ID' -H 'x-user-id:SOME_USER_ID'`



## Quick Start

Get started developing...

```shell
# install deps
npm install

# run in development mode
npm run dev

# run tests
npm run test
```

---

## Install Dependencies

Install all package dependencies (one time operation)

```shell
npm install
```

## Run It
#### Run in *development* mode:
Runs the application is development mode. Should not be used in production

```shell
npm run dev
```

or debug it

```shell
npm run dev:debug
```

#### Run in *production* mode:

Compiles the application and starts it in production production mode.

```shell
npm run compile
npm start
```

## Test It

Run the Mocha unit tests

```shell
npm test
```

or debug them

```shell
npm run test:debug
```


## Debug It

#### Debug the server:

```
npm run dev:debug
```

#### Debug Tests

```
npm run test:debug
```

#### Debug with VSCode

Add these [contents](https://github.com/cdimascio/generator-express-no-stress/blob/next/assets/.vscode/launch.json) to your `.vscode/launch.json` file

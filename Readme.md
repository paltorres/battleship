# Battleship Game

> Battleship game made it with apollo for frontend and typescript for backend.

## Environment setup

### Requirements

 - Install [Node.js](https://nodejs.org/)
   - This project was made with `node 10.2.1`
 - Install [mongo](https://docs.mongodb.com/manual/installation/)
 - Update `npm` to the latest version by running `npm i -g npm@latest`
 - Edit your `/etc/hosts` file by adding virtual hosts required for the app running:


```
127.0.0.1   dev.battleship.com
```

Or run

```
$ sudo ./commands/host_config.sh
```

### Run project

### 1) Install dependencies:

```
$ cd ./battleship-api && npm install && cd ../battheship-frontend && npm install
```

### 2) Run the app and mongo:

```
$ mongod
```

IMPORTANT: add the required initial data:

```
$ ./commands/insert_mod.sh
```

```
$ cd ./battleship-api && npm run start-dev
```

In another terminal

```
$ cd ./battleship-frontend && npm run start-dev
```

### 3) Navigate to:
```
http://dev.battleship.com:4000
```

At first time must create users.


That's it.

## More documentation?

* Usage guidelines
    - [API documentation](battleship-api/README.md)
    - [Frontend documentation](battleship-frontend/README.md)

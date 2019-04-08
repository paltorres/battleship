/**
 * Game model.
 */
import restClient from '../rest-client';

import Game from './game/game-model';

const generateGameModel = ({ user }) => ({
  async create({ title, mod }) {
    let response = null;
    try {
      response = await restClient.post('games', { title, mod }, { headers: { 'x-user-id': user.id } });
    } catch(e) {
      // return some error object
      console.log('error creating the game', e);
      return null;
    }

    return new Game({ userId: user.id, game: response.data });
  },

  async get({ id }) {
    let response = null;
    try {
      response = await restClient.get(`games/${id}`, { headers: { 'x-user-id': user.id } });
    } catch(e) {
      // return some error object
      console.log('error getting the game', e);
      return null;
    }

    return new Game({ userId: user.id, game: response.data });
  },

  async gamePool() {
    const params = { is_creator: false, status: 'waiting_for_opponent' };
    let response = null;
    try {
      response = await restClient.get('games/search', { params, headers: { 'x-user-id': user.id }});
    } catch(e) {
      console.log('Error getting `gamePool`:', e);
      return null;
    }

    return response.data.data.map(game => new Game({ userId: user.id, game }));
  },

  async myGames() {
    const params = { user_player: user.id, status: ['waiting_for_opponent', 'in_game'] };
    let response = null;
    try {
      response = await restClient.get('games/search', { params, headers: { 'x-user-id': user.id } });
    } catch (e) {
      console.log('Error getting `myGamesWaitingForOpponents`:', e.response);
      return null;
    }
    // todo: move this to apollo types
    return response.data.data.map(game => new Game({ userId: user.id, game }));
  },

  async joinGame({ gameId }) {
    let response = null;
    try {
      response = await restClient.post(`games/${gameId}/players`, {}, { headers: { 'x-user-id': user.id } });
    } catch(e) {
      console.log(`Error joining to game ${gameId}:`, e.response);
      return null;
    }
    return response.data;
  },

  async deleteGame({ gameId }) {
    let response = null;
    try {
      response = await restClient.delete(`games/${gameId}`, { headers: { 'x-user-id': user.id } });
    } catch(e) {
      console.log(`Error deleting the game '${gameId}':`, e.response);
      return null
    }

    return true;
  },

  async fireShot({ gameId, playerTarget, coordinateX, coordinateY }) {
    let response = null;
    const payload = { playerTarget, coordinateX, coordinateY };
    try {
      response = await restClient.post(`games/${gameId}/players/shots`, payload, { headers: { 'x-user-id': user.id } });
    } catch(e) {
      console.log(`Error shooting '[gameId:${gameId} playerTarget:${playerTarget}, coordinateX:${coordinateX}, coordinateY:${coordinateY}, status:${e.response.status}]':`, e);
      return null
    }

    return response.data;
  }
});

export default generateGameModel;

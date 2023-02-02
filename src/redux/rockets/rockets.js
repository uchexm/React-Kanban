import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const FETCH_ROCKETS = 'spacetravellershub/rockets/FETCH_ROCKETS';
const CANCEL_RESERVATION = 'spacetravellershub/rockets/CANCEL_RESERVATION';
const RESERVE_ROCKET = 'spacetravellershub/rockets/RESERVE_ROCKET';
const ROCKETS_URL = 'https://api.spacexdata.com/v3/rockets';

// Initial state
const rockets = [];

// Rocket reducer
const rocketsReducer = (state = rockets, action) => {
  const { type, payload } = action;
  switch (type) {
    case `${FETCH_ROCKETS}/fulfilled`:
      return payload.data;
    case RESERVE_ROCKET:
      return state.map((rocket) => (rocket.id === payload
        ? { ...rocket, reserved: !rocket.reserved }
        : rocket));
    case CANCEL_RESERVATION:
      return state.map((rocket) => {
        if (rocket.id !== payload) {
          return rocket;
        }
        return { ...rocket, reserved: true };
      });
    default:
      return state;
  }
};

export const fetchRockects = createAsyncThunk(FETCH_ROCKETS, async () => {
  const res = await axios.get(ROCKETS_URL);
  let { data } = res;
  data = data.map((info) => ({
    id: info.id,
    name: info.rocket_name,
    description: info.description,
    image: info.flickr_images[0],
    reserved: false,
  }));

  return { data };
});

export const reserveRocket = (id) => ({
  type: RESERVE_ROCKET,
  payload: id,
});

export const cancelReservation = (id) => ({
  type: RESERVE_ROCKET,
  payload: id,
});

export default rocketsReducer;

import {BASE_API_URL} from '../../constants';
import type {User, UserProfile} from '../../types';
import {readResponse} from '../response';

export const create = async (user: User) => {
  const response = await fetch(`${BASE_API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  return readResponse(response);
};

export const fetchMe = async () => {
  const response = await fetch(`${BASE_API_URL}/users/me`, {
    method: 'GET',
    credentials: 'include',
  });

  return readResponse<UserProfile>(response);
};

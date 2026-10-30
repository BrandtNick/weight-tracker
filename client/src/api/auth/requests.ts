import {BASE_API_URL} from '../../constants';
import type {User} from '../../types';
import {readResponse} from '../response';

export const authenticate = async (user: User) => {
  const response = await fetch(`${BASE_API_URL}/auth`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  return readResponse<{message: string}>(response);
};

export const signOut = async () => {
  const response = await fetch(`${BASE_API_URL}/auth`, {
    method: 'DELETE',
    credentials: 'include',
  });

  return readResponse<{message: string}>(response);
};

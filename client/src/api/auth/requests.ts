import {BASE_API_URL} from '../../constants';
import type {User} from '../../types';

export const authenticate = async (user: User) => {
  const response = await fetch(`${BASE_API_URL}/auth`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  const result = await response.json();
  return result;
};

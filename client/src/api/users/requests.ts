import {BASE_API_URL} from '../../constants';
import type {User} from '../../types';

export const create = async (user: User) => {
  const response = await fetch(`${BASE_API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  const result = await response.json();
  return result;
};

import {BASE_API_URL} from '../../constants';
import type {Weight} from '../../types';

export const fetchWeights = async () => {
  const response = await fetch(
    `${BASE_API_URL}/weights`,
    {
      method: 'GET',
      credentials: 'include',
    },
  );
  const data = await response.json();
  return data;
};

export const createWeight = async ({
  weight,
  timestamp,
}: {weight: Weight, timestamp: Date}) => {
  const response = await fetch(`${BASE_API_URL}/weights`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({weight, timestamp}),
  });
  const data = await response.json();
  return data;
};


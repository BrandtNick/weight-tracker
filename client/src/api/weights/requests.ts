import {BASE_API_URL} from '../../constants';
import type {Weight, WeightData} from '../../types';
import {readResponse} from '../response';

export const fetchWeights = async () => {
  const response = await fetch(
    `${BASE_API_URL}/weights`,
    {
      method: 'GET',
      credentials: 'include',
    },
  );
  return readResponse<WeightData[]>(response);
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
  return readResponse(response);
};


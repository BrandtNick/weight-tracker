import type {Weight, Metadata} from './types';

const URL = 'http://localhost:3000/api/v1';

export const fetchWeights = async () => {
  const response = await fetch(`${URL}/weights`);
  const data = await response.json();
  return data;
};

export const createWeight = async (weight: Weight, metadata: Metadata) => {
  const response = await fetch(`${URL}/weights`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({weight, metadata}),
  });
  const data = await response.json();
  return data;
};


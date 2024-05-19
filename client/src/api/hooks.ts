import {useQuery, useMutation} from '@tanstack/react-query';

import {fetchWeights, createWeight} from './requests';

export const useWeights = () => {
  return useQuery(['weights'], fetchWeights);
};

export const useCreateWeight = () => {
  return useMutation(createWeight);
};

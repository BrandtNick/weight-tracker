import React from 'react';
import {useQuery} from '@tanstack/react-query';

import WeightTracker from './weight-tracker';
import Login from './login';
import NewUser from './new-user';
import {userRequests} from '../api';

const Views = () => {
  const {
    isLoading,
    isError,
    data,
  } = useQuery({
    queryKey: ['me'],
    queryFn: userRequests.fetchMe,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <Login />;
  }

  if (!data) {
    return <div>No data</div>
  }

  return <WeightTracker />;
};

export default Views;

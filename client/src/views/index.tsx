import React from 'react';
import {useQuery} from '@tanstack/react-query';

import Spinner from '../components/spinner';
import Navbar from '../components/navbar';
import WeightTracker from './weight-tracker';
import Login from './login';
import NewUser from './new-user';
import {userRequests} from '../api';

const Views = () => {
  // API hooks
  const {
    isLoading,
    isError,
    data,
  } = useQuery({
    queryKey: ['me'],
    queryFn: userRequests.fetchMe,
    retry: 1,
  });

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <Login />;
  }

  if (!data) {
    return <div>No data</div>
  }

  return (
    <>
      <Navbar
        username={data.username}
      />
      <WeightTracker />;
    </>
  );
};

export default Views;

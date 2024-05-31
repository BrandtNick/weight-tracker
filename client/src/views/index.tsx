import React from 'react';
import {useQuery} from '@tanstack/react-query';

import Spinner from '../components/spinner';
import Navbar from '../components/navbar';
import WeightTracker from './weight-tracker';
import Login from './login';
import NewUser from './new-user';
import {userRequests} from '../api';
import {WEIGHT_TRACKER_ROUTES} from '../constants';

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

  // Local state hooks
  const [
    route,
    setRoute,
  ] = React.useState<keyof typeof WEIGHT_TRACKER_ROUTES>(WEIGHT_TRACKER_ROUTES);

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
        setRoute={setRoute}
      />
      <WeightTracker
        route={route}
        setRoute={setRoute}
      />
    </>
  );
};

export default Views;

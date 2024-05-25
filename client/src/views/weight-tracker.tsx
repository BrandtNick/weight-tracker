import React from 'react';
import {
  Flex,
} from '@chakra-ui/react';
import {useQuery} from '@tanstack/react-query';
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip} from 'recharts';

import {weightRequests} from '../api';

const WeightTracker = () => {
  const {
    isLoading,
    data,
  } = useQuery({
    queryKey: ['weights'],
    queryFn: weightRequests.fetchWeights,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data</div>;
  }
  console.log({data});

  return (
    <Flex>
      <LineChart
        width={900}
        height={600}
        data={data}
        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
      >
        <Line type="monotone" dataKey="weight" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <YAxis />
        <XAxis dataKey='timestamp' />
        <Tooltip />
      </LineChart>
    </Flex>
  );
};

export default WeightTracker;


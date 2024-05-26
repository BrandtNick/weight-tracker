import React from 'react';
import {
  Badge,
  Flex,
  Text,
} from '@chakra-ui/react';
import {useQuery} from '@tanstack/react-query';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import {format, parseISO} from 'date-fns';

import Spinner from '../components/spinner';
import {COLORS} from '../constants';
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
    return <Spinner />;
  }

  if (!data) {
    return <div>No data</div>;
  }

  const formattedData = data.map((weight) => ({
    ...weight,
    timestamp: format(parseISO(weight.timestamp), 'dd/MM/yyyy'),
  }));

  return (
    <Flex flexDir='column' color={COLORS.blue4}>
      <Flex h='200px' fontSize='.9em' align='center' justify='center'>
        <Text>Current weight</Text> 
        <Badge
          colorScheme='blue'
          color={COLORS.blue3}
          m='10px'
          p='5px'
          h='28px'
        >
          {data[data.length - 1].weight} kg
        </Badge>
      </Flex>
      <LineChart
        width={900}
        height={400}
        data={formattedData}
        margin={{top: 5, right: 20, bottom: 5, left: 0}}
      >
        <Line type="monotone" dataKey="weight" stroke="#8884d8" />
        <CartesianGrid stroke={COLORS.grey} strokeDasharray="5 5" />
        <YAxis stroke={COLORS.grey2} />
        <XAxis stroke={COLORS.grey2} dy={10} dataKey='timestamp' />
        <Tooltip />
      </LineChart>
    </Flex>
  );
};

export default WeightTracker;


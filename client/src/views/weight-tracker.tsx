import React from 'react';
import {
  Badge,
  Button,
  Flex,
  Text,
} from '@chakra-ui/react';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import {format, parseISO} from 'date-fns';

import Input from '../components/input';
import Spinner from '../components/spinner';
import {COLORS} from '../constants';
import {weightRequests} from '../api';

const WeightTracker = () => {
  // Third party hooks
  const queryClient = useQueryClient();

  // API hooks
  const {
    isLoading,
    data,
  } = useQuery({
    queryKey: ['weights'],
    queryFn: weightRequests.fetchWeights,
  });
  const weightCreationMutation = useMutation({
    mutationFn: weightRequests.createWeight,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['weights']});
    },
  });

  // Local state hooks
  const [weight, setWeight] = React.useState('');
  const [timestamp, setTimestamp] = React.useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"));

  const handleWeightCreation = async () => {
    await weightCreationMutation.mutateAsync({
      weight: Number(weight),
      timestamp: new Date(timestamp),
    });
  }

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
    <Flex flexDir='column' color={COLORS.blue4} align='center'>
    <Flex flexDir='column' w='300px'>
        <Input
          placeholder='Enter your weight'
          type='number'
          onChange={(evt) => setWeight(evt.target.value)}
          value={weight}
          valid={!!weight}
        />
        <Input
        // placeholder='Enter the date'
          type='datetime-local'
          onChange={(evt) => setTimestamp(evt.target.value)}
          value={timestamp}
          valid={!!timestamp}
        />
          <Button
          h='28px'
          w='100px'
          m='10px'
          variant='outline'
          colorScheme='blue'
          color={COLORS.blue3}
          onClick={handleWeightCreation}
          disabled={!weight || !timestamp}
          _hover={{
            bg: COLORS.blue2,
          }}
        >
          Create
        </Button>
      </Flex>
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


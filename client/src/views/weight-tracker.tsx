import React from 'react';
import {
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
  ResponsiveContainer,
} from 'recharts';
import {format, parseISO} from 'date-fns';
import {BarChart2} from 'react-feather';

import Input from '../components/input';
import Spinner from '../components/spinner';
import {COLORS, WEIGHT_TRACKER_ROUTES} from '../constants';
import {weightRequests} from '../api';

interface WeightTrackerProps {
  route: keyof typeof WEIGHT_TRACKER_ROUTES;
  setRoute: React.Dispatch<React.SetStateAction<keyof typeof WEIGHT_TRACKER_ROUTES>>;
}

const WeightTracker = (props: WeightTrackerProps) => {
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

  const getDataDifference = () => {
    const diff = Number((data[data.length - 1].weight - data[data.length - 2].weight).toFixed(1))
    return diff;
  };

  const isNegative = Math.sign(getDataDifference()) === -1;

  return (
    <Flex
      flexDir='column'
      color={COLORS.blue4}
      align='center'
      width='100%'
    >
      <Flex
        w='100%'
        h='420px'
        justify='space-around'
        align='center'
      >
        {{
          [WEIGHT_TRACKER_ROUTES.new]: (
            <Flex flexDir='column'>
              <Input
                placeholder='Enter your weight'
                type='number'
                onChange={(evt) => setWeight(evt.target.value)}
                value={weight}
                valid={!!weight}
              />
              <Input
                type='datetime-local'
                onChange={(evt) => setTimestamp(evt.target.value)}
                value={timestamp}
                valid={!!timestamp}
              />
              <Button
                h='40px'
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
              <Button
                h='40px'
                m='10px'
                variant='outline'
                colorScheme='blue'
                color={COLORS.blue3}
                onClick={() => props.setRoute(WEIGHT_TRACKER_ROUTES.show)}
                disabled={!weight || !timestamp}
                _hover={{
                  bg: COLORS.blue2,
                }}
              >
                Cancel
              </Button>
            </Flex>
          ),
          [WEIGHT_TRACKER_ROUTES.show]: (
            <Flex flexDir='column' h='80vh' w='100%'>
              <Flex
                h='220px'
                marginBottom='70px'
                fontSize='.9em'
                align='center'
                justify='center'
              >
                <Flex
                  boxShadow={'0 0 10px' + COLORS.blue3}
                  justify='center'
                  align='center'
                  flexDir='column'
                  borderRadius='100%'
                  border={'5px solid' + COLORS.blue3}
                  w='220px'
                  h='220px'
               >
                 <Flex justify='center' flexDir='column' align='center' fontSize='.9em' color={COLORS.blue4}>
                  <BarChart2 color={COLORS.blue3} />
                  {!isNegative && '+'}{getDataDifference()} kg
                 </Flex>
                  <Text
                    fontSize='3em'
                  >
                    {data[data.length - 1].weight} kg
                  </Text>
                </Flex>
              </Flex>
              <ResponsiveContainer width="100%" height='100%'>
                <LineChart
                  data={formattedData}
                  margin={{top: 5, right: 20, bottom: 5, left: 0}}
                >
                  <Line type="monotone" dataKey="weight" stroke={COLORS.blue3} />
                  <CartesianGrid stroke={COLORS.grey} strokeDasharray="3 3" />
                  <YAxis stroke={COLORS.blue4} />
                  <XAxis stroke={COLORS.blue4} dy={10} dataKey='timestamp' />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </Flex>
          ),
        }[props.route]}
      </Flex>
    </Flex>
  );
};

export default WeightTracker;


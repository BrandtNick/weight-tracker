import React from 'react';
import {
  Button,
  Flex,
  Text,
  chakra,
  shouldForwardProp,
} from '@chakra-ui/react';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {motion, isValidMotionProp} from "framer-motion";

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
import {WeightData} from '../types';

const ChakraBox = chakra(
  motion.div, 
  {shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop)},
);

interface WeightTrackerProps {
  route: keyof typeof WEIGHT_TRACKER_ROUTES;
  setRoute: React.Dispatch<React.SetStateAction<keyof typeof WEIGHT_TRACKER_ROUTES>>;
}

const WeightTracker = (props: WeightTrackerProps) => {
  // API hooks
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
  
  return (
    <Flex
      flexDir='column'
      color={COLORS.blue4}
      align='center'
      width='100%'
      height='80%'
      marginTop='120px'
      marginBottom='50px'
    >
      <Flex
        w='100%'
        h='100%'
        justify='space-around'
        align='center'
      >
        {{
          [WEIGHT_TRACKER_ROUTES.new]: <NewWeightData setRoute={props.setRoute} />,
          [WEIGHT_TRACKER_ROUTES.show]: <ShowWeightData data={data} />,
        }[props.route]}
      </Flex>
    </Flex>
  );
};

interface NewWeightDataProps {
  setRoute: React.Dispatch<React.SetStateAction<keyof typeof WEIGHT_TRACKER_ROUTES>>;
}

const NewWeightData = (props: NewWeightDataProps) => { 
  // Third party hooks
  const queryClient = useQueryClient();
  
  // Local state hooks
  const [weight, setWeight] = React.useState('');
  const [timestamp, setTimestamp] = React.useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"));

  const weightCreationMutation = useMutation({
    mutationFn: weightRequests.createWeight,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['weights']});
    },
  });
  const handleWeightCreation = async () => {
    await weightCreationMutation.mutateAsync({
      weight: Number(weight),
      timestamp: new Date(timestamp),
    });
    props.setRoute(WEIGHT_TRACKER_ROUTES.show);
    setWeight('');
    setTimestamp(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
  }

  return (
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
          onClick={() => {
            props.setRoute(WEIGHT_TRACKER_ROUTES.show);
            setWeight('');
            setTimestamp(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
          }}
          disabled={!weight || !timestamp}
          _hover={{
            bg: COLORS.blue2,
          }}
        >
          Cancel
        </Button>
    </Flex>
  );
};

interface ShowWeightDataProps {
  data: WeightData[] | undefined;
}

const ShowWeightData = (props: ShowWeightDataProps) => {
  if (props.data === undefined || props.data.length === 0) {
    return <Text color={COLORS.blue4}>No data available, add new data!</Text>;
  }

  const formattedData = props.data.map((weight: WeightData) => ({
    ...weight,
    timestamp: format(parseISO(weight.timestamp), 'dd/MM/yyyy'),
  }));

  const getDataDifference = props.data.length >= 2
    ? Number((props.data[props.data.length - 1]?.weight - props.data[props.data.length - 2]?.weight).toFixed(1))
    : 0;

  const isNegative = Math.sign(getDataDifference) === -1;

  return (
    <Flex justify='space-around' flexDir='column' h='100%' w='100%'>
      <Flex
        h='100%'
        maxH='220px'
        marginBottom='50px'
        fontSize='.9em'
        align='center'
        justify='center'
      >
        <ChakraBox
          animate={{
            scale: [1, 1.05, 1],
            // rotate: [0, 360],
            borderRadius: ["100%", "100%"]
          }}
          // @ts-expect-error - framer-motion types are incorrect
          transition={{
            duration: 3,
            // ease: "easeInOut",
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop"
          }}
          boxShadow={'0 0 10px' + COLORS.blue3}
          display='flex'
          justifyContent='center'
          alignItems='center'
          flexDir='column'
          border={'5px solid' + COLORS.blue3}
          w='220px'
          h='220px'
        >
          {/*
            <Flex justify='center' flexDir='column' align='center' fontSize='.9em' color={COLORS.blue4}>
              <BarChart2 color={COLORS.blue3} />
                {!isNegative && '+'}{getDataDifference()} kg
            </Flex>
            <Text
              fontSize='3em'
            >
              {data[data.length - 1].weight} kg
            </Text>
          */}
        </ChakraBox>
        <Flex position='absolute' flexDir='column'>
          <Flex justify='center' flexDir='column' align='center' fontSize='.9em' color={COLORS.blue4}>
            <BarChart2 color={COLORS.blue3} />
              {!isNegative && '+'}{getDataDifference} kg
          </Flex>
          <Text
            fontSize='3em'
          >
            {props.data[props.data.length - 1].weight} kg
          </Text>
        </Flex>
      </Flex>
      <ResponsiveContainer style={{padding: '0 20px 0 20px'}} maxHeight={400} width="100%" height='100%'>
        <LineChart
          data={formattedData}
          margin={{top: 5, right: 20, bottom: 5, left: 0}}
        >
          <Line type="monotone" dot={false} dataKey="weight" strokeWidth={2} stroke={COLORS.blue3} />
          <CartesianGrid stroke={COLORS.grey} strokeDasharray="3 3" />
          <YAxis stroke={COLORS.blue4} domain={['dataMin - 5', 'dataMax + 5']} unit=' kg' />
          <XAxis stroke={COLORS.blue3} dy={10} dataKey='timestamp' />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </Flex>
  );
};

export default WeightTracker;


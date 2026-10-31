import React from 'react';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  usePrefersReducedMotion,
  useToast,
  VStack,
} from '@chakra-ui/react';
import {keyframes} from '@emotion/react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type {DotProps} from 'recharts';
import {format, parseISO} from 'date-fns';
import {ArrowDownRight, ArrowUpRight, Plus, TrendingDown} from 'react-feather';

import CustomInput from '../components/input';
import Spinner from '../components/spinner';
import {COLORS, WEIGHT_TRACKER_ROUTES} from '../constants';
import {weightRequests} from '../api';
import {WeightData} from '../types';

const RANGE_OPTIONS = [
  {label: '1M', days: 30},
  {label: '3M', days: 90},
  {label: '6M', days: 180},
  {label: '1Y', days: 365},
  {label: 'All', days: Infinity},
] as const;

type RangeLabel = typeof RANGE_OPTIONS[number]['label'];

const latestPointPulse = keyframes`
  0% {
    opacity: 0.5;
    transform: scale(1);
  }
  70%, 100% {
    opacity: 0;
    transform: scale(3.2);
  }
`;

const chartLineDraw = keyframes`
  from { stroke-dashoffset: 2000; }
  to { stroke-dashoffset: 0; }
`;

const historyRowReveal = keyframes`
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
`;

const latestPointArrival = keyframes`
  from { opacity: 0.65; transform: scale(1); }
  to { opacity: 0; transform: scale(5); }
`;

interface WeightTrackerProps {
  route: keyof typeof WEIGHT_TRACKER_ROUTES;
  setRoute: React.Dispatch<React.SetStateAction<keyof typeof WEIGHT_TRACKER_ROUTES>>;
}

const WeightTracker = (props: WeightTrackerProps) => {
  const {isLoading, isError, error, data, refetch} = useQuery({
    queryKey: ['weights'],
    queryFn: weightRequests.fetchWeights,
  });
  const textColor = 'gray.100';

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Box
      as='main'
      color={textColor}
      width='100%'
      maxWidth='1440px'
      margin='0 auto'
      padding={{base: '92px 16px 40px', md: '104px 28px 56px'}}
    >
      {isError ? (
        <Alert status='error' borderRadius='xl'>
          <AlertIcon />
          <AlertDescription flex='1'>
            {error instanceof Error ? error.message : 'Unable to load your weight history.'}
          </AlertDescription>
          <Button size='sm' onClick={() => refetch()}>Try again</Button>
        </Alert>
      ) : {
        [WEIGHT_TRACKER_ROUTES.new]: (
          <NewWeightData setRoute={props.setRoute} />
        ),
        [WEIGHT_TRACKER_ROUTES.show]: (
          <ShowWeightData data={data || []} setRoute={props.setRoute} />
        ),
      }[props.route]}
    </Box>
  );
};

interface NewWeightDataProps {
  setRoute: React.Dispatch<React.SetStateAction<keyof typeof WEIGHT_TRACKER_ROUTES>>;
}

const NewWeightData = (props: NewWeightDataProps) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [weight, setWeight] = React.useState('');
  const [timestamp, setTimestamp] = React.useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"));

  const weightCreationMutation = useMutation({
    mutationFn: weightRequests.createWeight,
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ['weights']});
      toast({
        title: 'Measurement saved',
        status: 'success',
        duration: 2500,
        isClosable: true,
      });
    },
  });

  const handleWeightCreation = async () => {
    try {
      await weightCreationMutation.mutateAsync({
        weight: Number(weight),
        timestamp: new Date(timestamp),
      });
      props.setRoute(WEIGHT_TRACKER_ROUTES.show);
      setWeight('');
    } catch {
      // The mutation error is rendered below the form.
    }
  };

  return (
    <Box
      maxWidth='520px'
      margin='40px auto'
      padding={{base: 2, md: 4}}
    >
      <Heading size='lg'>Add a measurement</Heading>
      <Text color='gray.500' marginTop='2'>Record your weight and when you measured it.</Text>
      <VStack spacing='5' marginTop='8' align='stretch'>
        <CustomInput
          placeholder='ENTER YOUR WEIGHT (KG)'
          type='number'
          onChange={(event) => setWeight(event.target.value)}
          value={weight}
          valid={Number(weight) > 0}
        />
        <CustomInput
          placeholder='DATE AND TIME'
          type='datetime-local'
          onChange={(event) => setTimestamp(event.target.value)}
          value={timestamp}
          valid={Boolean(timestamp)}
        />
        {weightCreationMutation.isError && (
          <Alert status='error' borderRadius='lg'>
            <AlertIcon />
            {weightCreationMutation.error instanceof Error
              ? weightCreationMutation.error.message
              : 'Unable to save this measurement.'}
          </Alert>
        )}
        <HStack justify='space-between' spacing='3' paddingTop='2'>
          <Button
            width='50%'
            height='42px'
            variant='outline'
            borderRadius='2px'
            colorScheme='gray'
            color={COLORS.grey2}
            onClick={() => props.setRoute(WEIGHT_TRACKER_ROUTES.show)}
            _hover={{background: COLORS.blue2}}
          >
            Cancel
          </Button>
          <Button
            width='50%'
            height='42px'
            variant='outline'
            borderRadius='2px'
            colorScheme='blue'
            color={COLORS.blue4}
            onClick={handleWeightCreation}
            isDisabled={!weight || !timestamp || Number(weight) <= 0}
            isLoading={weightCreationMutation.isPending}
            _hover={{background: COLORS.blue2}}
          >
            Create
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

interface ShowWeightDataProps {
  data: WeightData[];
  setRoute: React.Dispatch<React.SetStateAction<keyof typeof WEIGHT_TRACKER_ROUTES>>;
}

const ShowWeightData = ({data, setRoute}: ShowWeightDataProps) => {
  const [range, setRange] = React.useState<RangeLabel>('6M');
  const mutedSurface = 'whiteAlpha.50';
  const borderColor = 'rgba(90, 158, 208, 0.18)';
  const gridColor = '#34445b';
  const axisColor = '#9DBDD2';
  const tooltipBackground = '#1A202C';
  const selectedRangeBackground = 'rgba(90, 158, 208, 0.20)';
  const selectedRangeColor = 'white';
  const rangeHover = 'rgba(90, 158, 208, 0.10)';
  const badgeBackground = 'rgba(90, 158, 208, 0.13)';
  const badgeColor = '#93B8D1';
  const dateTextColor = '#9DBDD2';
  const sectionLabelColor = '#6FA7C8';
  const prefersReducedMotion = usePrefersReducedMotion();
  const responsiveTickLimit = useBreakpointValue({base: 5, md: 8, xl: 10}) || 5;

  const sortedData = React.useMemo(
    () => [...data].sort((a, b) => parseISO(a.timestamp).getTime() - parseISO(b.timestamp).getTime()),
    [data],
  );

  const filteredData = React.useMemo(() => {
    if (sortedData.length === 0) return [];
    const selectedRange = RANGE_OPTIONS.find((option) => option.label === range);
    if (!selectedRange || !Number.isFinite(selectedRange.days)) return sortedData;

    const latestTime = parseISO(sortedData[sortedData.length - 1].timestamp).getTime();
    const cutoff = latestTime - selectedRange.days * 24 * 60 * 60 * 1000;
    return sortedData.filter(({timestamp}) => parseISO(timestamp).getTime() >= cutoff);
  }, [range, sortedData]);

  if (sortedData.length === 0) {
    return (
      <Flex
        minHeight='60vh'
        direction='column'
        align='center'
        justify='center'
        textAlign='center'
      >
        <Box
          display='grid'
          placeItems='center'
          width='72px'
          height='72px'
          borderRadius='4px'
          background={COLORS.accent}
          color='white'
          marginBottom='5'
        >
          <TrendingDown size={34} />
        </Box>
        <Heading size='lg'>Start your weight story</Heading>
        <Text color='gray.500' maxWidth='420px' marginTop='3' marginBottom='6'>
          Add your first measurement to unlock trends, averages, and progress insights.
        </Text>
        <Button
          background={COLORS.accent}
          color='white'
          borderRadius='4px'
          leftIcon={<Plus size={18} />}
          onClick={() => setRoute(WEIGHT_TRACKER_ROUTES.new)}
          _hover={{background: COLORS.accentHover}}
        >
          Add first measurement
        </Button>
      </Flex>
    );
  }

  const latest = sortedData[sortedData.length - 1];
  const previous = sortedData[sortedData.length - 2];
  const firstInRange = filteredData[0];
  const totalChange = latest.weight - firstInRange.weight;
  const lastChange = previous ? latest.weight - previous.weight : 0;
  const weeklyTrend = getWeeklyTrend(filteredData);
  const selectedRangeIndex = RANGE_OPTIONS.findIndex((option) => option.label === range);
  const visibleWeights = filteredData.map(({weight}) => weight);
  const yAxisMinimum = Math.floor(Math.min(...visibleWeights) / 5) * 5;
  const yAxisMaximum = Math.ceil(Math.max(...visibleWeights) / 5) * 5;
  const yAxisTicks = Array.from(
    {length: (yAxisMaximum - yAxisMinimum) / 5 + 1},
    (_, index) => yAxisMinimum + index * 5,
  );
  const tickLimitByRange: Record<RangeLabel, number> = {
    '1M': 5,
    '3M': 7,
    '6M': 7,
    '1Y': 7,
    All: 10,
  };
  const xAxisTicks = getEvenlySpacedTicks(
    filteredData,
    Math.min(responsiveTickLimit, tickLimitByRange[range]),
  );
  const yearBoundaries = range === '1Y' || range === 'All'
    ? filteredData.filter((entry, index) => (
      index > 0
      && parseISO(entry.timestamp).getFullYear()
        !== parseISO(filteredData[index - 1].timestamp).getFullYear()
    ))
    : [];
  const history = filteredData
    .map((entry, index) => ({
      ...entry,
      change: index > 0 ? entry.weight - filteredData[index - 1].weight : null,
    }))
    .reverse()
    .slice(0, 10);

  return (
    <VStack spacing={{base: 5, md: 7}} align='stretch'>
      <Flex
        direction={{base: 'column', md: 'row'}}
        justify='space-between'
        gap='4'
        align={{base: 'flex-start', md: 'center'}}
      >
        <Box>
          <Text color={sectionLabelColor} fontWeight='semibold' fontSize='sm' letterSpacing='wide'>OVERVIEW</Text>
          <Heading size={{base: 'lg', md: 'xl'}} marginTop='1'>Your progress</Heading>
          <Text color={dateTextColor} marginTop='1'>Updated {format(parseISO(latest.timestamp), 'd MMMM yyyy')}</Text>
        </Box>
        <HStack
          position='relative'
          background={mutedSurface}
          padding='1'
          borderRadius='4px'
          overflowX='auto'
          maxWidth='100%'
          spacing='0'
        >
          <Box
            position='absolute'
            top='1'
            left='1'
            width='52px'
            height='32px'
            background={selectedRangeBackground}
            borderBottom='2px solid #5A9ED0'
            boxShadow='0 3px 8px -4px rgba(90, 158, 208, 0.65)'
            borderRadius='3px'
            transform={`translateX(${selectedRangeIndex * 52}px)`}
            transition={prefersReducedMotion ? undefined : 'transform 220ms ease-out'}
          />
          {RANGE_OPTIONS.map((option) => (
            <Button
              key={option.label}
              size='sm'
              width='52px'
              minWidth='52px'
              zIndex='1'
              variant='ghost'
              background='transparent'
              color={range === option.label ? selectedRangeColor : undefined}
              borderRadius='3px'
              onClick={() => setRange(option.label)}
              aria-pressed={range === option.label}
              _hover={{background: range === option.label ? 'transparent' : rangeHover}}
            >
              {option.label}
            </Button>
          ))}
        </HStack>
      </Flex>

      <SimpleGrid
        columns={{base: 2, md: 4}}
        spacing='0'
        borderTop='1px solid'
        borderBottom='1px solid'
        borderColor={borderColor}
      >
        <MetricCard
          label='Current weight'
          value={latest.weight}
          help='Latest measurement'
        />
        <MetricCard
          label='Last change'
          value={lastChange}
          signed
          help='Since previous entry'
        />
        <MetricCard
          label={`${range} change`}
          value={totalChange}
          signed
          help='Across selected range'
        />
        <MetricCard
          label={`${range} trend`}
          value={weeklyTrend}
          signed
          precision={2}
          unit='kg/wk'
          help='Weekly rate in selected range'
        />
      </SimpleGrid>

      <Box
        padding={{base: '18px 0 28px', md: '24px 0 36px'}}
        borderBottom='1px solid'
        borderColor={borderColor}
      >
        <Flex justify='space-between' align='center' marginBottom='6'>
          <Box>
            <Heading size='md' color='#C7DFEF'>Weight trend</Heading>
            <Text color={dateTextColor} fontSize='sm' marginTop='1'>
              {format(parseISO(filteredData[0].timestamp), 'd MMM yyyy')}
              {' – '}
              {format(parseISO(filteredData[filteredData.length - 1].timestamp), 'd MMM yyyy')}
            </Text>
          </Box>
          <Badge
            background={badgeBackground}
            color={badgeColor}
            borderRadius='4px'
            padding='1.5px 8px'
          >
            {filteredData.length} entries
          </Badge>
        </Flex>
        <Box
          width='100%'
          height={{base: '300px', md: '390px'}}
          sx={prefersReducedMotion ? undefined : {
            '& .weight-trend-series .recharts-line-curve': {
              strokeDasharray: 2000,
              animation: `${chartLineDraw} 900ms ease-out both`,
            },
          }}
        >
          <ResponsiveContainer width='100%' height='100%'>
            <ComposedChart data={filteredData} margin={{top: 10, right: 12, bottom: 0, left: 2}}>
              <defs>
                <linearGradient id='weightAreaGradient' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='0%' stopColor='#5A9ED0' stopOpacity='0.23' />
                  <stop offset='100%' stopColor='#5A9ED0' stopOpacity='0' />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={gridColor} strokeDasharray='4 4' vertical={false} />
              <YAxis
                stroke={axisColor}
                tickLine={false}
                axisLine={false}
                width={68}
                domain={[yAxisMinimum, yAxisMaximum]}
                ticks={yAxisTicks}
                interval={0}
                tickFormatter={(value) => `${Number(value).toFixed(0)} kg`}
              />
              <XAxis
                dataKey='timestamp'
                stroke={axisColor}
                tickLine={false}
                axisLine={false}
                ticks={xAxisTicks}
                interval={0}
                tickMargin={10}
                padding={{left: 14, right: 14}}
                tickFormatter={(value) => formatXAxisTick(value, range)}
              />
              {yearBoundaries.map((entry) => (
                <ReferenceLine
                  key={entry.timestamp}
                  x={entry.timestamp}
                  stroke={gridColor}
                  strokeDasharray='3 5'
                  label={{
                    value: format(parseISO(entry.timestamp), 'yyyy'),
                    position: 'insideTopLeft',
                    fill: axisColor,
                    fontSize: 10,
                  }}
                />
              ))}
              <Tooltip
                cursor={{stroke: '#70ADD2', strokeWidth: 1, strokeOpacity: 0.7}}
                isAnimationActive={!prefersReducedMotion}
                animationDuration={140}
                labelFormatter={(value) => format(parseISO(String(value)), 'd MMMM yyyy, HH:mm')}
                formatter={(value) => [`${Number(value).toFixed(1)} kg`, 'Weight']}
                contentStyle={{
                  background: tooltipBackground,
                  border: `1px solid ${borderColor}`,
                  borderRadius: '4px',
                  boxShadow: '0 4px 18px rgba(0, 0, 0, 0.22)',
                }}
              />
              <Area
                type='monotone'
                dataKey='weight'
                stroke='#5A9ED0'
                strokeWidth={2.5}
                strokeOpacity={0.55}
                fill='url(#weightAreaGradient)'
                baseValue={yAxisMinimum}
                dot={(dotProps: DotProps & {index?: number}) => (
                  <ChartDot
                    cx={dotProps.cx}
                    cy={dotProps.cy}
                    isLatest={dotProps.index === filteredData.length - 1}
                    reduceMotion={prefersReducedMotion}
                  />
                )}
                activeDot={<ChartSpotlight />}
                isAnimationActive={false}
              />
              <Line
                key={range}
                className='weight-trend-series'
                type='monotone'
                dataKey='weight'
                stroke='#5A9ED0'
                strokeWidth={3}
                dot={false}
                activeDot={false}
                tooltipType='none'
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      <Box
        paddingBottom='8'
      >
        <Flex justify='space-between' align='center' padding={{base: '0 0 16px', md: '0 0 20px'}}>
          <Box>
            <Heading size='md' color='#C7DFEF'>Recent measurements</Heading>
            <Text color={dateTextColor} fontSize='sm' marginTop='1'>Your latest entries in this range</Text>
          </Box>
          <Button
            size='sm'
            variant='outline'
            borderColor={borderColor}
            color='inherit'
            borderRadius='4px'
            leftIcon={<Plus size={16} />}
            onClick={() => setRoute(WEIGHT_TRACKER_ROUTES.new)}
            _hover={{background: mutedSurface}}
          >
            Add
          </Button>
        </Flex>
        <TableContainer>
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th isNumeric>Weight</Th>
                <Th isNumeric>Change</Th>
              </Tr>
            </Thead>
            <Tbody>
              {history.map((entry, index) => (
                <Tr
                  key={entry._id}
                  animation={prefersReducedMotion
                    ? undefined
                    : `${historyRowReveal} 280ms ease-out ${index * 35}ms both`}
                >
                  <Td>
                    <Text fontWeight='medium'>{format(parseISO(entry.timestamp), 'd MMM yyyy')}</Text>
                    <Text color={dateTextColor} fontSize='xs'>{format(parseISO(entry.timestamp), 'HH:mm')}</Text>
                  </Td>
                  <Td isNumeric fontWeight='bold'>{entry.weight.toFixed(1)} kg</Td>
                  <Td isNumeric>
                    {entry.change === null ? (
                      <Text color='gray.500'>—</Text>
                    ) : (
                      <ChangeBadge value={entry.change} />
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </VStack>
  );
};

interface MetricCardProps {
  label: string;
  value: number;
  help: string;
  signed?: boolean;
  precision?: number;
  unit?: string;
}

const MetricCard = ({label, value, help, signed = false, precision = 1, unit = 'kg'}: MetricCardProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const displayValue = useAnimatedMetric(value, prefersReducedMotion);
  // Round before choosing a sign to avoid displaying negative zero mid-transition.
  const roundedValue = Number(displayValue.toFixed(precision));
  const formatAmount = (amount: number) => (
    `${signed && amount > 0 ? '+' : ''}${amount.toFixed(precision)}`
  );
  const labelColor = '#AEC1CF';
  const helperColor = '#91A6B7';
  return (
    <Stat
      padding={{base: '20px 16px', md: '24px 20px'}}
    >
      <StatLabel color={labelColor} fontSize='sm'>{label}</StatLabel>
      <StatNumber
        aria-label={`${formatAmount(Number(value.toFixed(precision)))} ${unit}`}
        fontSize={{base: 'xl', md: '2xl'}}
        sx={{fontVariantNumeric: 'tabular-nums'}}
        marginTop='1'
      >
        <span aria-hidden='true'>
          {formatAmount(roundedValue)}{' '}
          <Box as='span' color='#91A6B7'>{unit}</Box>
        </span>
      </StatNumber>
      <StatHelpText marginBottom='0' marginTop='2' color={helperColor}>{help}</StatHelpText>
    </Stat>
  );
};

const useAnimatedMetric = (value: number, reduceMotion: boolean) => {
  const [displayValue, setDisplayValue] = React.useState(value);
  const currentValue = React.useRef(value);

  React.useEffect(() => {
    const from = currentValue.current;
    if (reduceMotion || from === value) {
      currentValue.current = value;
      setDisplayValue(value);
      return;
    }

    let frameId: number;
    let startTime: number | undefined;
    const update = (time: number) => {
      startTime ??= time;
      const progress = Math.min((time - startTime) / 420, 1);
      const easedProgress = 1 - (1 - progress) ** 3;
      currentValue.current = progress === 1 ? value : from + (value - from) * easedProgress;
      setDisplayValue(currentValue.current);
      if (progress < 1) frameId = requestAnimationFrame(update);
    };
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [value, reduceMotion]);

  return reduceMotion ? value : displayValue;
};

const ChartSpotlight = ({cx, cy}: DotProps) => {
  if (cx === undefined || cy === undefined) return <></>;

  return (
    <g pointerEvents='none' aria-hidden='true'>
      <circle cx={cx} cy={cy} r={17} fill='#5A9ED0' fillOpacity={0.08} />
      <circle cx={cx} cy={cy} r={11} fill='#5A9ED0' fillOpacity={0.17} />
      <circle cx={cx} cy={cy} r={5.5} fill='#D6A85C' stroke='#0e2436' strokeWidth={2} />
    </g>
  );
};

const ChangeBadge = ({value}: {value: number}) => {
  const isLoss = value < 0;
  const badgeBackground = 'rgba(90, 158, 208, 0.13)';
  const badgeColor = '#93B8D1';
  return (
    <Badge
      background={badgeBackground}
      color={value === 0 ? 'gray.500' : badgeColor}
      borderRadius='4px'
      padding='1px 7px'
    >
      <Flex align='center' gap='1' justify='flex-end'>
        {isLoss ? <ArrowDownRight size={13} /> : value > 0 ? <ArrowUpRight size={13} /> : null}
        {formatSignedWeight(value)}
      </Flex>
    </Badge>
  );
};

interface ChartDotProps {
  cx?: number;
  cy?: number;
  isLatest: boolean;
  reduceMotion: boolean;
}

const ChartDot = ({cx, cy, isLatest, reduceMotion}: ChartDotProps) => {
  if (cx === undefined || cy === undefined) return <></>;

  return (
    <g>
      {isLatest && !reduceMotion && (
        <>
          <circle
            cx={cx}
            cy={cy}
            r='5'
            fill='#D6A85C'
            style={{
              animation: `${latestPointArrival} 700ms ease-out both`,
              transformBox: 'fill-box',
              transformOrigin: 'center',
            }}
          />
          <circle
            cx={cx}
            cy={cy}
            r='5'
            fill='#D6A85C'
            style={{
              animation: `${latestPointPulse} 2.4s ease-out 700ms infinite`,
              transformBox: 'fill-box',
              transformOrigin: 'center',
            }}
          />
        </>
      )}
      <circle
        cx={cx}
        cy={cy}
        r={isLatest ? 4.5 : 2.75}
        fill={isLatest ? '#D6A85C' : '#5A9ED0'}
      />
    </g>
  );
};

const getEvenlySpacedTicks = (data: WeightData[], limit: number) => {
  if (data.length <= limit) return data.map(({timestamp}) => timestamp);

  const lastIndex = data.length - 1;
  return Array.from({length: limit}, (_, index) => (
    data[Math.round(index * lastIndex / (limit - 1))].timestamp
  ));
};

const formatXAxisTick = (timestamp: string, range: RangeLabel) => {
  const date = parseISO(timestamp);

  if (range === '1M' || range === '3M') return format(date, 'd MMM');
  if (range === '6M') return format(date, 'MMM');
  return `${format(date, 'MMM')} ’${format(date, 'yy')}`;
};

const getWeeklyTrend = (data: WeightData[]) => {
  if (data.length < 2) return 0;
  const first = data[0];
  const last = data[data.length - 1];
  const elapsedDays = Math.max(
    (parseISO(last.timestamp).getTime() - parseISO(first.timestamp).getTime()) / (24 * 60 * 60 * 1000),
    1,
  );
  return (last.weight - first.weight) / (elapsedDays / 7);
};

const formatSignedWeight = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(1)} kg`;

export default WeightTracker;

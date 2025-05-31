import { useEffect, useMemo, useState, type Dispatch } from 'react';
import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import type { TrafficStats } from '../../../../../shared';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import type { ChartTrafficStats } from '../ChartTrafficStats';
import { formatDateString } from '../../../../utils';
import { useChartStyles } from '../chartStyles';
import { useChartAggregationStyles } from './chartAggregationStyles';

dayjs.extend(isoWeek);

interface ChartAggregationSelectorProps {
  recievedData: TrafficStats[];
  setChartTrafficData: Dispatch<ChartTrafficStats[]>;
  setChartTitle: Dispatch<string>;
}

type AggregationOption = 'daily' | 'weekly' | 'monthly';

export const ChartAggregationSelector = ({
  recievedData,
  setChartTrafficData,
  setChartTitle,
}: ChartAggregationSelectorProps) => {
  const [aggregationStatus, setAggregationStatus] =
    useState<AggregationOption>('daily');

  useEffect(() => {
    setChartTrafficData(aggregatedDataDict[aggregationStatus]);
  }, [recievedData, aggregationStatus]);

  const aggregatedByWeek: ChartTrafficStats[] = useMemo(() => {
    const aggregatedMap = recievedData.reduce(
      (acc: Map<string, number>, ts: TrafficStats) => {
        const weekIndex = dayjs(ts.date).isoWeek();
        const weekTitle = `${weekIndex}-${ts.date.getFullYear()}`;
        if (acc.has(weekTitle)) {
          acc.set(weekTitle, (acc.get(weekTitle) || 0) + ts.visits);
        } else {
          acc.set(weekTitle, ts.visits);
        }
        return acc;
      },
      new Map<string, number>()
    );
    return Array.from(aggregatedMap, ([key, value]) => ({
      dateTitle: key,
      visits: value,
    }));
  }, [recievedData]);

  const aggregatedByMonth: ChartTrafficStats[] = useMemo(() => {
    const aggregatedMap = recievedData.reduce(
      (acc: Map<string, number>, ts: TrafficStats) => {
        const monthTitle = `${ts.date.getMonth()}-${ts.date.getFullYear()}`;
        if (acc.has(monthTitle)) {
          acc.set(monthTitle, (acc.get(monthTitle) || 0) + ts.visits);
        } else {
          acc.set(monthTitle, ts.visits);
        }
        return acc;
      },
      new Map<string, number>()
    );
    return Array.from(aggregatedMap, ([key, value]) => ({
      dateTitle: key,
      visits: value,
    }));
  }, [recievedData]);

  const dailyData: ChartTrafficStats[] = useMemo(
    () =>
      recievedData.map(({ date, visits }) => ({
        dateTitle: formatDateString(date),
        visits,
      })),
    [recievedData]
  );

  const aggregatedDataDict = {
    daily: dailyData,
    weekly: aggregatedByWeek,
    monthly: aggregatedByMonth,
  };

  const onAggregationChange = (
    _event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    setAggregationStatus(value as AggregationOption);
    setChartTitle(`${value} user traffic`);
  };

  const classes = useChartAggregationStyles();

  return (
    <Box className={classes.aggregationSelectorArea}>
      <Typography variant='body1' sx={{ mx: 2 }}>
        Aggregate traffic:
      </Typography>
      <RadioGroup
        row
        defaultValue={aggregationStatus}
        onChange={onAggregationChange}
      >
        <FormControlLabel
          value='daily'
          label='per day'
          control={<Radio size='small' />}
        />
        <FormControlLabel
          value='weekly'
          label='per week'
          control={<Radio size='small' />}
        />
        <FormControlLabel
          value='monthly'
          label='per month'
          control={<Radio size='small' />}
        />
      </RadioGroup>
    </Box>
  );
};

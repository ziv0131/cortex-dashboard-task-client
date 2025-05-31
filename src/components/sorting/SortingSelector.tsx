import { useEffect, useMemo, useState, type Dispatch } from 'react';
import type { SortingOption } from '../../models';
import { Radio, RadioGroup, FormControlLabel } from '@mui/material';
import type { TrafficStats } from '../../../shared';
import { useSortingSelectorStyles } from './sortingSelectorStyles';

interface SortingSelectorProps {
  recievedData: TrafficStats[];
  setSortedData: Dispatch<TrafficStats[]>;
}

export const SortingSelector = ({
  recievedData,
  setSortedData,
}: SortingSelectorProps) => {
  const [sortStatus, setSortStatus] = useState<SortingOption>('date');

  const trafficSortedByDate = useMemo(
    () => [...recievedData].sort((a, b) => a.date.getTime() - b.date.getTime()),
    [recievedData]
  );

  const trafficSortedByVisits = useMemo(
    () => [...recievedData].sort((a, b) => a.visits - b.visits),
    [recievedData]
  );

  useEffect(() => {
    setSortedData(sortedDataDict[sortStatus]);
  }, [sortStatus]);

  const sortedDataDict = {
    date: trafficSortedByDate,
    visits: trafficSortedByVisits,
  };

  const onSortingChange = (
    _event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    setSortStatus(value as SortingOption);
  };

  const classes = useSortingSelectorStyles();

  return (
    <RadioGroup
      row
      className={classes.sortingGroup}
      defaultValue={sortStatus}
      onChange={onSortingChange}
    >
      <FormControlLabel
        value='date'
        label='by date'
        className={classes.sortOption}
        control={<Radio size='small' />}
      />
      <FormControlLabel
        value='visits'
        label='by visits'
        className={classes.sortOption}
        control={<Radio size='small' />}
      />
    </RadioGroup>
  );
};

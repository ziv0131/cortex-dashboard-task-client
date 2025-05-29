import { useMemo, useState, type Dispatch } from 'react';
import type { TrafficStats } from '../../shared';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { Box, TextField } from '@mui/material';
import type { PickerRangeValue } from '@mui/x-date-pickers/internals';
import { NumericFormat } from 'react-number-format';

interface TrafficDataFilterProps {
  recievedData: TrafficStats[];
  setRecievedData: Dispatch<TrafficStats[]>;
}

export const TrafficDataFilter = ({
  recievedData,
  setRecievedData,
}: TrafficDataFilterProps) => {
  const [dateRange, setDateRange] = useState<[any, any]>([null, null]);
  const [minVisits, setMinVisits] = useState<number | null>(null);
  const [maxVisits, setMaxVisits] = useState<number | null>(null);

  const filteredData = useMemo(() => {
    let filtered = recievedData;
    if (dateRange !== null) {
      filtered = filtered.filter(
        (ts) =>
          ts.date.getTime() >= dateRange[0].getTime() &&
          ts.date.getTime() <= dateRange[1].getTime()
      );
    }
    if (minVisits !== null) {
      filtered = filtered.filter((ts) => ts.visits >= minVisits);
    }
    if (maxVisits !== null) {
      filtered = filtered.filter((ts) => ts.visits <= maxVisits);
    }
    return filtered;
  }, [dateRange, minVisits, maxVisits]);

  const onFilterChange = () => setRecievedData(filteredData);

  const onDateRangeChange = (newDateRange: PickerRangeValue) => {
    setDateRange(newDateRange);
    onFilterChange();
  };

  const validate = (minVal, maxVal) => {
    const newErrors = { min: '', max: '' };
    const minNum = parseFloat(minVal);
    const maxNum = parseFloat(maxVal);

    if (isNaN(minNum)) {
      newErrors.min = 'Minimum value must be a number';
    }

    if (isNaN(maxNum)) {
      newErrors.max = 'Maximum value must be a number';
    }

    if (!isNaN(minNum) && !isNaN(maxNum) && minNum > maxNum) {
      newErrors.min = 'Minimum cannot be greater than maximum';
      newErrors.max = 'Maximum cannot be less than minimum';
    }

    setErrors(newErrors);
  };

  const onMinVisitsChange = (e) => {
    const newMinVisits = e.target.value;
    validate(newMinVisits, maxVisits);
    setMinVisits(newMinVisits);
  };

  const onMaxChange = (e) => {
    const value = e.target.value;
    setMaxVisits(value);
    validate(min, value);
  };

  const onMinVisitsChange;

  const numberInputSlotProps = { input: { inputProps: { min: 0 } } };

  return (
    <Box>
      <DateRangePicker
        label='Date range: '
        value={dateRange}
        onChange={(newDateRange) => onDateRangeChange(newDateRange)}
      />
      <TextField
        type='number'
        label='Minimum visits: '
        value={minVisits}
        slotProps={numberInputSlotProps}
        onChange={}
      />
      <TextField
        type='number'
        label='Maximum visits: '
        value={maxVisits}
        slotProps={numberInputSlotProps}
      />
      <NumericFormat value={minVisits} min={0} onChange={} />
    </Box>
  );
};

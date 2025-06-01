import { useState, type Dispatch } from 'react';
import type { SavedTrafficStats } from '../../../shared';
import 'rsuite/dist/rsuite.min.css';
import { DateRangePicker } from 'rsuite';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Box, Button, Typography } from '@mui/material';
import { NumericFormat } from 'react-number-format';
import { useFilterSelectorStyles } from './filterSelectorStyles';

interface FilterSelectorProps {
  recievedData: SavedTrafficStats[];
  setFilteredData: Dispatch<SavedTrafficStats[]>;
}

type DateRange = [Date, Date];

export const FilterSelector = ({
  recievedData,
  setFilteredData,
}: FilterSelectorProps) => {
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [minVisits, setMinVisits] = useState<string>('');
  const [maxVisits, setMaxVisits] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const filterData = () => {
    let filtered = recievedData;
    if (!!dateRange && dateRange.every((date) => date !== null)) {
      filtered = filtered.filter(
        (ts) =>
          ts.date.getTime() >= (dateRange[0] as Date).getTime() &&
          ts.date.getTime() <= (dateRange[1] as Date).getTime()
      );
    }
    if (minVisits !== '') {
      filtered = filtered.filter((ts) => ts.visits >= parseInt(minVisits));
    }
    if (maxVisits !== '') {
      filtered = filtered.filter((ts) => ts.visits <= parseInt(maxVisits));
    }
    setFilteredData(filtered);
  };

  const onDateRangeChange = (newDateRange: DateRange | null) => {
    setDateRange(newDateRange);
  };

  const validate = (minVisitsString: string, maxVisitsString: string) => {
    const minValue = parseFloat(minVisitsString);
    const maxValue = parseFloat(maxVisitsString);

    if (minValue > maxValue) {
      setError('Minimum cannot be greater than maximum');
      return false;
    }

    setError(null);
    return true;
  };

  const onMinVisitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (minVisits === value) return;
    const result = validate(value, maxVisits);
    if (result) {
      setMinVisits(value);
    }
  };

  const onMaxVisitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (maxVisits === value) return;
    const result = validate(minVisits, value);
    if (result) {
      setMaxVisits(value);
    }
  };

  const classes = useFilterSelectorStyles();

  return (
    <Box className={classes.filterArea}>
      <Box className={classes.filterOptionsWrapper}>
        <Typography variant='body2'>Date Range:</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateRangePicker
            className={classes.datePicker}
            value={dateRange}
            onChange={(newDateRange) => onDateRangeChange(newDateRange)}
          />
        </LocalizationProvider>
      </Box>
      <Box className={classes.filterOptionsWrapper}>
        <Typography variant='body2'>Visits Range:</Typography>
        <NumericFormat
          className={classes.visitsInput}
          value={minVisits}
          min={0}
          decimalScale={0}
          allowLeadingZeros={false}
          onChange={onMinVisitsChange}
        />
        <Typography>-</Typography>
        <NumericFormat
          className={classes.visitsInput}
          value={maxVisits}
          allowLeadingZeros={false}
          min={0}
          decimalScale={0}
          onChange={onMaxVisitsChange}
        />
      </Box>
      {error !== null ? (
        <Typography sx={{ color: '#ff0000' }}>{error}</Typography>
      ) : (
        <Button
          variant='contained'
          onClick={() => filterData()}
          className={classes.applyButton}
        >
          Apply
        </Button>
      )}
    </Box>
  );
};

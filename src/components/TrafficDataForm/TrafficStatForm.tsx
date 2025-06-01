import { useCallback, useEffect, useRef, useState, type Dispatch } from 'react';
import { type SavedTrafficStats } from '../../../shared';
import type { FormType } from '../../models';
import { useTrafficDataContext } from '../../contexts/TrafficDataContext';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Typography,
} from '@mui/material';
import { NumericFormat, type NumberFormatValues } from 'react-number-format';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV2';
import type { Dayjs } from 'dayjs';
import { useTrafficStatsFormStyles } from './trafficStatsFormStyles';

export interface TrafficStatFormProps {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  formType: FormType;
  trafficStat: SavedTrafficStats | null;
}

export const TrafficStatForm = ({
  formType,
  trafficStat,
  isOpen,
  setIsOpen,
}: TrafficStatFormProps) => {
  const [visits, setVisits] = useState<string>(
    !!trafficStat ? trafficStat.visits.toString() : ''
  );

  const [chosenDate, setChosenDate] = useState<Date | null>(
    !!trafficStat ? trafficStat.date : null
  );
  const [error, setError] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [visits]);

  const { trafficData, deleteTrafficStat, updateTrafficStat, addTrafficStat } =
    useTrafficDataContext();

  const handleClose = () => {
    setIsOpen(false);
  };

  const onDelete = () => {
    if (!!trafficStat) {
      deleteTrafficStat(trafficStat.id).then((errorMessage) => {
        if (errorMessage !== '') {
          setError(errorMessage);
        } else {
          setError('');
          setIsOpen(false);
        }
      });
    }
  };

  const onUpdate = () => {
    const parsedVisits = parseInt(visits);
    if (!!trafficStat && !isNaN(parsedVisits)) {
      updateTrafficStat({
        id: trafficStat.id,
        date: trafficStat.date,
        visits: parsedVisits,
      }).then((errorMessage) => {
        if (errorMessage !== '') {
          setError(errorMessage);
        } else {
          setError('');
          setIsOpen(false);
        }
      });
    }
  };

  const onAdd = () => {
    const parsedVisits = parseInt(visits);
    if (!!chosenDate && !isNaN(parsedVisits)) {
      addTrafficStat({
        date: chosenDate!,
        visits: parsedVisits,
      }).then((errorMessage) => {
        if (errorMessage !== '') {
          setError(errorMessage);
        } else {
          setError('');
          setIsOpen(false);
        }
      });
    }
  };

  const onVisitsChange = useCallback((values: NumberFormatValues) => {
    setVisits(values.value);
  }, []);

  const convertDateValueToDate = (dateValue: Date | Dayjs) =>
    dateValue instanceof Date ? dateValue : dateValue.toDate();

  const disableTakenDates = (dateValue: Date | Dayjs) => {
    const dateToCompare = convertDateValueToDate(dateValue);
    return trafficData.some(
      ({ date }) =>
        date.getFullYear() === dateToCompare.getFullYear() &&
        date.getMonth() === dateToCompare.getMonth() &&
        date.getDate() === dateToCompare.getDate()
    );
  };

  const onDateChange = (dateValue: Date | Dayjs | null) => {
    setChosenDate(!!dateValue ? convertDateValueToDate(dateValue) : null);
  };

  const isFormValid = () => {
    return (
      !!chosenDate &&
      !!visits &&
      (formType === 'create' ||
        (!isNaN(parseInt(visits)) && parseInt(visits) !== trafficStat?.visits))
    );
  };

  const onSubmit = (e: React.FormEvent<HTMLDivElement>) => {
    e.preventDefault();
    formType === 'create' ? onAdd() : onUpdate();
  };

  const classes = useTrafficStatsFormStyles();

  const DialogAligner = (props: any) => {
    return <Paper {...props} className={classes.dialogAligner} />;
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      onSubmit={onSubmit}
      component='form'
      PaperComponent={DialogAligner}
      maxWidth='lg'
    >
      <DialogTitle>
        {formType === 'create' ? 'New' : 'Edit'} Traffic Stat
      </DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            value={chosenDate}
            disabled={formType === 'update'}
            shouldDisableDate={disableTakenDates}
            onChange={(newDate) => onDateChange(newDate)}
            slotProps={{ textField: { size: 'small' } }}
          />
        </LocalizationProvider>
        <NumericFormat
          getInputRef={inputRef}
          value={visits}
          min={0}
          decimalScale={0}
          allowLeadingZeros={false}
          onValueChange={onVisitsChange}
          className={classes.visitsInput}
          placeholder='visits'
        />
        {error !== '' && <Typography color='error'>{error}</Typography>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        {formType === 'update' && (
          <Button variant='contained' color='error' onClick={onDelete}>
            Delete
          </Button>
        )}
        <Button variant='contained' type='submit' disabled={!isFormValid()}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

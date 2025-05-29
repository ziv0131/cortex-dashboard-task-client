import type { Dispatch } from 'react';
import type { SortingOption } from '../models';
import { Radio, RadioGroup } from '@mui/material';

interface SortingSelectorProps {
  sortStatus: SortingOption;
  setSortStatus: Dispatch<SortingOption>;
}

export const SortingSelector = ({
  sortStatus,
  setSortStatus,
}: SortingSelectorProps) => {
  const onSortingChange = (
    _event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    setSortStatus(value as SortingOption);
  };

  return (
    <RadioGroup defaultValue={sortStatus} onChange={onSortingChange}>
      <Radio value='none' aria-label='no sorting' />
      <Radio value='date' aria-label='by date' />
      <Radio value='visits' aria-label='by visits' />
    </RadioGroup>
  );
};

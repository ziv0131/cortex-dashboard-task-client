import DataTable from 'react-data-table-component';
import type { SavedTrafficStats, TrafficStats } from '../../../../shared';
import { formatDateString } from '../../../utils';
import { Box, Button, Container } from '@mui/material';
import React, { useState } from 'react';
import { useTableStyles } from './tableStyle';
import { TrafficStatForm } from '../../TrafficDataForm/TrafficStatForm';
import type { FormType } from '../../../models';

interface TrafficStatsTableProps {
  trafficData: SavedTrafficStats[];
}

const conditionalRowStyles = [
  {
    when: () => true,
    style: {
      '&:hover': {
        backgroundColor: '#f0f0f0',
        cursor: 'pointer',
      },
    },
  },
];

export const TrafficStatsTable = React.memo(
  ({ trafficData }: TrafficStatsTableProps) => {
    const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
    const [formType, setFormType] = useState<FormType>('create');
    const [trafficStat, setTrafficStat] = useState<SavedTrafficStats | null>(
      null
    );

    const columns = [
      {
        name: 'Date',
        selector: (trafficStat: TrafficStats) =>
          formatDateString(trafficStat.date),
        sortable: true,
      },
      {
        name: 'Visits',
        selector: (trafficStat: TrafficStats) => trafficStat.visits,
        sortable: true,
      },
    ];

    const onAddClick = () => {
      setFormType('create');
      setTrafficStat(null);
      setIsOpenForm(true);
    };

    const formProps = {
      isOpen: isOpenForm,
      setIsOpen: setIsOpenForm,
      formType,
      trafficStat,
    };

    const onItemSelection = (row: SavedTrafficStats) => {
      setFormType('update');
      setTrafficStat(row);
      setIsOpenForm(true);
    };

    const classes = useTableStyles();

    return (
      <Container className={classes.tableAreaContainer}>
        <Box className={classes.tableWrapper}>
          <DataTable
            columns={columns}
            data={trafficData}
            pagination
            fixedHeader
            onRowDoubleClicked={onItemSelection}
            conditionalRowStyles={conditionalRowStyles}
          />
        </Box>
        <Button
          disabled={isOpenForm}
          variant='contained'
          className={classes.newTrafficDataButton}
          onClick={() => onAddClick()}
        >
          +
        </Button>
        {isOpenForm && <TrafficStatForm {...formProps} />}
      </Container>
    );
  }
);

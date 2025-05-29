import DataTable from 'react-data-table-component';
import type { TrafficStats } from '../../../shared';
import { formatDateString } from '../../utils';
import { Container } from '@mui/material';
import React from 'react';

interface TrafficStatsTableProps {
  trafficData: TrafficStats[];
}

export const TrafficStatsTable = React.memo(
  ({ trafficData }: TrafficStatsTableProps) => {
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
    return (
      <Container sx={{ width: '500px', height: '500px' }}>
        <DataTable
          title='Traffic Stats'
          columns={columns}
          data={trafficData}
          pagination
          fixedHeader
          fixedHeaderScrollHeight='300px'
        />
      </Container>
    );
  }
);

import { makeStyles } from '@mui/styles';

export const useTableStyles = makeStyles(() => ({
  tableAreaContainer: {
    width: '100%',
    height: '45%',
    marginTop: '1%',
    display: 'flex',
    displayDirection: 'column',
    alignItems: 'stretch',
  },
  tableWrapper: {
    overflowX: 'auto',
    width: '90%',
  },
  newTrafficDataButton: {
    width: '10%',
  },
}));

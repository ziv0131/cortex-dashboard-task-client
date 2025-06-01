import { makeStyles } from '@mui/styles';

export const useChartStyles = makeStyles((itemCount: number) => ({
  chartAreaContainer: {
    width: '40%',
    height: '90%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: '3%',
  },
  chartOutterContainer: {
    alignSelf: 'left',
    overflowX: 'auto',
    overflowY: 'visible',
    width: '90%',
    borderColor: '#000000',
  },
  chartInnerContainer: {
    display: 'flex',
    justifyContent: 'left',
    width: `${Math.min(itemCount * 100, 2000)}px`,
  },
  errorMessage: {
    color: '#ff0000',
  },
}));

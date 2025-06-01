import { makeStyles } from '@mui/styles';

export const useTrafficStatsFormStyles = makeStyles(() => ({
  dialogAligner: {
    position: 'absolute',
    top: '20%',
    left: '40%',
    width: '40%',
  },
  datePicker: {
    marginInline: '2%',
  },
  visitsInput: {
    marginInline: '3%',
    padding: '4px 8px',
    width: '40%',
    height: '40px',
    borderRadius: '5px',
  },
}));

import { makeStyles } from '@mui/styles';

export const useFilterSelectorStyles = makeStyles(() => ({
  filterArea: {
    width: '100%',
    height: '70%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '3%',
    borderRadius: '5%',
  },
  filterOptionsWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '1%',
    padding: '3%',
  },
  datePicker: {
    marginInline: '2%',
  },
  visitsInput: {
    marginInline: '3%',
    padding: '4px 8px',
    width: '80px',
    height: '40px',
    borderRadius: '5px',
  },
  applyButton: {
    width: '10%',
    backgroundColor: '#2F5474',
    color: '#FFFFFF',
    marginBottm: '2%',
    marginTop: '2%',
  },
}));

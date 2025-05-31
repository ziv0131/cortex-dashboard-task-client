import { makeStyles } from '@mui/styles';

export const useSortingSelectorStyles = makeStyles(() => ({
  sortingGroup: {
    backgroundColor: '#2F5474',
    display: 'flex',
    justifyContent: 'center',
    borderTopRightRadius: '0%',
    borderTopLeftRadius: '0%',
    borderRadius: '10%',
  },
  sortOption: {
    color: '#ffffff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '1%',
  },
  radioButton: {},
  datePicker: {
    marginInline: '2%',
  },
  visitsInput: {
    marginRight: '2%',
  },
  applyButton: {
    width: '10%',
    backgroundColor: '#2F5474',
    color: '#FFFFFF',
    marginBottom: '2%',
  },
}));

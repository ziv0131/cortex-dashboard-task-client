import { makeStyles } from '@mui/styles';

export const useTrafficDisplayPageStyles = makeStyles(() => ({
  pageContainer: {
    width: '100vw',
    height: '98vh',
    display: 'flex',
    flexDirection: 'column',
    justifySelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF7EB',
  },
  errorMessage: {
    marginTop: '20%',
    color: '#ff0000',
  },
  loadingMessage: {
    marginTop: '20%',
  },
  sortingAndFilteringContainer: {
    width: '55%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#FFE8C2',
    borderRadius: '5px',
  },
  upperPageContainer: {
    height: '40%',
    width: '100%',
    display: 'flex',
  },
}));

import { Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import {
  deleteDuplicates,
  getDocumentCount,
  insertTrafficData,
} from './insertData';

export const InsertDataComponent = () => {
  const [count, setCount] = useState(0);
  //   const [isLoadData, setIsLoadData] = useState(false);
  const [isError, setIsError] = useState(false);
  useEffect(
    () => {
      // if (isLoadData) {
      //   insertTrafficData()
      //   deleteDuplicates()
      //     .then((isSuccess) => {
      //       if (isSuccess) {

      //       }
      //     })
      //     .catch((error) => {
      //       console.error(error);
      //     });

      getDocumentCount()
        .then((documentCount) => setCount(documentCount || 0))
        .catch((error) => {
          console.error(error);
        });

      // }
    },
    [
      /*isLoadData*/
    ]
  );

  return (
    <>
      {
        <Typography variant='h5'>
          traffic stats has insertion has {count} items
        </Typography>
      }
    </>
  );
};

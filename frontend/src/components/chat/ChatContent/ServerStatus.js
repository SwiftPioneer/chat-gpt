import * as React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import CheckIcon from '@mui/icons-material/Check';
import { subscribe, unsubscribe } from '../../../event/event';

export default function ServerStatus({status}) {
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const compSize = 24;

  React.useEffect(() => {
    subscribe('startLoading', onStartLoading);
    subscribe('endLoading', onEndLoading);

    //console.log(status);
    if (status == true){
      onStartLoading();
      //console.log("onStartLoading");
    }
    if (status == false){
      onEndLoading();
      //console.log("onEndLoading");
    }
  }, []);

  const onStartLoading = () => {
    setSuccess(false);
    setLoading(true);
  }

  const onEndLoading = (event) => {
    setSuccess(true);
    setLoading(false);
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ m: 1, position: 'relative' }}>
        {success? <CheckIcon color='success' /> : ""}
        {loading && (<CircularProgress
          size={compSize}
          sx={{
            // position: 'absolute',
            top: -compSize / 2,
            left: -compSize / 2,
            zIndex: 1,
          }}
        />)}
      </Box>
    </Box>
  );
}
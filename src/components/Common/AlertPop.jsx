import { Alert, Snackbar } from '@mui/material'
import React, { useEffect, useState } from 'react'

function AlertPop({ alertConfig }) {
  const [config, setConfig] = useState({ open: false, type: '', message: '' })
  useEffect(() => {
    setConfig(alertConfig)
  }, [alertConfig])

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setConfig({ ...config, open: false });
  };


  return (

    <Snackbar open={config.open} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} sx={{mt:6}} autoHideDuration={3000}>
      <Alert
        onClose={handleClose}
        severity={config.type}

        sx={{ width: '100%' }}
      >
        {config.message}
      </Alert>
    </Snackbar>
  )
}

export default AlertPop
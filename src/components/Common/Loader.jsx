import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';

import { CirclesWithBar } from 'react-loader-spinner'

export default function Loader({ openLoader }) {



    return (
        <div>

            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openLoader}

            >
                <CirclesWithBar
                    height="100"
                    width="100"
                    color='white'
                    // outerCircleColor="#ff68f0"
                    // innerCircleColor="rgb(153 133 246)"
                    // barColor="white"
                    ariaLabel="circles-with-bar-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                />
            </Backdrop>
        </div>
    );
}
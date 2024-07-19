import React from 'react';
import { observer } from 'mobx-react-lite';

const Chart = observer(() => {
    return (
        <div className='main_strategies'>
            <iframe className='analysis-iframe' src='https://deriv-strategy.vercel.app/' />
        </div>
    );
});

export default Chart;

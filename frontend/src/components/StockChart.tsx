import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state/index';
import Chart from "react-google-charts";
import { PriceChart } from '../styles/stock.style';
import CircularProgress from '@mui/material/CircularProgress';


interface DataItem {
    date: string,
    low: number,
    open: number,
    close: number,
    high: number,
}

interface Props {
    ticker: string,
}
// The candle stick chart that showing the price of the stocks in the past 2 months
const StockChart: React.FC<Props> = ({ ticker }) => {
    const dispatch = useDispatch();
    const { setToast } = bindActionCreators(actionCreators, dispatch);
    const [data, SetData] = useState<DataItem[][]>([]);

    const fetchPrices = useCallback(async (): Promise<() => void> => {
        let mounted = true;
        try {
            if (ticker !== '') {
                const exchangeType = ticker.includes('BTC') || ticker.includes('ETH') ? 'crypto' : 'stock';
                const response = await fetch(
                    `https://finnhub.io/api/v1/${exchangeType}/candle?symbol=${ticker}&resolution=D&from=${Math.floor(Date.now() / 1000 - 5184000)}&to=${Math.floor(Date.now() / 1000)}&token=c5vln0iad3ibtqnna830`
                    , {
                        method: 'GET'
                    });
                if (response.status === 200) {
                    const stockData = await response.json();
                    const length = stockData.c.length;
                    let newData: DataItem[][] = [];
                    
                    if (mounted) {
                        for (let i = 0; i < length; ++i) {
                            const date = new Date(stockData.t[i] * 1000);
                            newData.push([
                                `${date.getMonth() + 1}-${date.getDate()}`,
                                stockData.l[i],
                                stockData.o[i],
                                stockData.c[i],
                                stockData.h[i]
                            ]);
                        }
                        SetData(newData);

                    }
                } else {
                    throw new Error('Failed to fetch the chart');
                }
            }
        } catch (e) {
            setToast({ type: 'error', message: `${e}` });
        }
        return (): void => {
            mounted = false;
        };
    // eslint-disable-next-line
    }, [ticker]);

    useEffect(() => {
        SetData([]);
        fetchPrices();
    }, [fetchPrices]);

    return (
        <PriceChart>
            {data.length === 0
                ? <CircularProgress />
                : <Chart
                    width='100%'
                    height={500}
                    chartType="CandlestickChart"
                    loader={<div>Loading Chart</div>}
                    data={[['date', 'low', 'open', 'close', 'high'], ...data]}
                    options={{
                        legend: 'none',
                        candlestick: {
                            fallingColor: { strokeWidth: 1, fill: '#0017ea' },
                            risingColor: { strokeWidth: 1, fill: 'white' },
                        },
                        hAxis: {
                            slantedText: true
                        },
                    }}
                />
            }
        </PriceChart>
    );
};

export default StockChart;

import React from 'react';
import { TickerItem, Symbol, useStyles } from '../styles/watchlist.style';

interface Props {
    symbol: string,
    stockName: string,
    selected: boolean,
    selectTicker(): void;
}

const WatchlistTicker: React.FC<Props> = ({
    symbol,
    stockName,
    selected,
    selectTicker
}) => {
    const styles = useStyles();
    return (
        <TickerItem
            className={`${selected && styles.selected}`}
            onClick={selectTicker}
        >
            <Symbol>{symbol}</Symbol>
            <p>{stockName}</p>
        </TickerItem>
    );
};

export default WatchlistTicker;
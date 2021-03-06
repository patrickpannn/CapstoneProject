import { Request, Response } from 'express';
import Watchlist, { Ticker } from '../models/watchlistModel';

// The watchlist controller handles all
// backend functionality for watchlists.
// The watchlist controller will return a list or add/remove
// stocks for a specified user
export default class WatchListController {
    //return a list of watchlist tickers associated with items
    // in the users watchlist
    public static list = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            if (Object.keys(req.body).length) {
                throw new Error('Inputs are given but not needed.');
            }

            const watchlist = await Watchlist.findOne({ user: req.user._id });

            if (!watchlist) {
                throw new Error('Watchlist not found');
            }

            let tickerList: Ticker[] = [];

            for (let i = 0; i < watchlist.tickers.length; i++) {
                let tickerObj = { ticker: watchlist.tickers[i].ticker,
                                  stockName: watchlist.tickers[i].stockName };
                tickerList.push(tickerObj);
            }

            res.status(200).json(tickerList);
        } catch (e) {
            res.status(400).json({ error: 'Bad Request' });
        }
    };

    // add a specific ticker item to the users watchlist
    // the stockname is also included in the watchlist item
    public static addTicker = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const { ticker, stockName } = req.params;
            const watchlist = await Watchlist.findOne({ user: req.user._id });
            if (!watchlist) {
                throw new Error('Watchlist not found');
            }

            const tickers = watchlist.tickers;
            if (!tickers.every((t: Ticker) => {
                return t.ticker !== ticker.toUpperCase()
                    && t.stockName !== stockName;
            })
            ) {
                throw new Error('Duplicate tickers');
            }
            
            tickers.splice(0, 0, {
                ticker: ticker.toUpperCase(),
                stockName: stockName
            });
            await watchlist.save();

            res.status(200).json({ response: 'Successful' });
        } catch (e) {
            res.status(400).json({ error: 'Bad Request' });
        }
    };

    // remove a specified ticker from the users watchlist 
    public static removeTicker = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const ticker = req.params.ticker;
            const watchlist = await Watchlist.findOne({ user: req.user._id });
            if (!watchlist) {
                throw new Error('Watchlist not found');
            }

            let isTickers = false;
            watchlist.tickers = watchlist.tickers.filter((t: Ticker) => {
                if (t.ticker === ticker) isTickers = true;
                return t.ticker !== ticker;
            });

            if (!isTickers) {
                throw new Error('No such ticker');
            }
            await watchlist.save();
            res.status(200).json({ response: 'Successful' });
        } catch (e) {
            res.status(400).json({ error: 'Bad Request' });
        }
    };
}

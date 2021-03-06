import { Request, Response } from 'express';
import Portfolio from '../models/portfolioModel';
import Stock from '../models/stockModel';

interface StockObject {
    ticker: string,
    name: string,
    averagePrice: number,
    numUnits: number
};

// The portfolio controller handles all methods associated with the generation and
// handling of a users portfolios. 
// Create : create an empty portfolio for the user
// List : Generate a portfolio list object with all portfolios owned by a user
// Move : move a specified stock and quantity between 2 portfolios
// Delete : delete the specified portfolio and move all stocks to the default portfolio
export default class PortfolioController {
    public static create = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {

            if (!Object.keys(req.body).length) {
                throw new Error('No portfolio name given.');
            }

            const allowedFields = ['name'];

            for (let key in req.body) {
                if (!allowedFields.includes(key)) {
                    throw new Error('More fields than required are provided.');
                }
            }

            if (!req.body.name) {
                throw new Error('Could not create portfolio');
            }

            const portfolio = new Portfolio({ 
                user: req.user._id, name: req.body.name });

            if (!portfolio) {
                throw new Error('Could not create portfolio');
            }

            await portfolio.save();
            res.status(201).json({ response: 'Successful' });
        } catch (e) {
            res.status(400).json({ error: 'Portfolio Bad Request' });
        }
    };

    public static list = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {

            if (Object.keys(req.body).length) {
                throw new Error('Inputs are given but not needed.');
            }

            const portfolios = await Portfolio.find({ user: req.user._id });

            if (!portfolios.length) {
                throw new Error('User has no portfolios');
            }

            let list = [];

            for (let i = 0; i < portfolios.length; i++) {
                let stockList: StockObject[] = [];
                let portfolioInfo = { name: portfolios[i].name,
                                      stocks: stockList };

                let stocks = await Stock.find({ portfolio: portfolios[i]._id });

                for (let j = 0; j < stocks.length; j++) {
                    let stockObj = {
                        ticker: stocks[j].ticker,
                        name: stocks[j].name,
                        averagePrice: stocks[j].averagePrice,
                        numUnits: stocks[j].numUnits
                    };
                    portfolioInfo.stocks.push(stockObj);
                };
                list.push(portfolioInfo);
            }

            res.status(200).json(list);
        } catch (e) {
            res.status(400).json({ error: 'List of Portfolios Bad Request' });
        }
    };

    public static move = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {

            if (!Object.keys(req.body).length) {
                throw new Error('No input data given.');
            }

            const allowedFields = ['oldPortfolioName', 'newPortfolioName', 'ticker', 'amount'];

            for (let key in req.body) {
                if (!allowedFields.includes(key)) {
                    throw new Error('More fields than required are provided.');
                }
            }

            const oldPortfolio = await Portfolio.findOne({
                user: req.user._id, name: req.body.oldPortfolioName });
            
            const newPortfolio = await Portfolio.findOne({
                user: req.user._id, name: req.body.newPortfolioName });

            if (!oldPortfolio || !newPortfolio) {
                throw new Error('Could not find portfolios');
            }

            const stockToMove = await Stock.findOne({
                portfolio: oldPortfolio._id, ticker: req.body.ticker });
            
            if (!stockToMove) {
                throw new Error('Could not find stocks');
            }

            await stockToMove.merge(newPortfolio._id, req.body.amount);

            res.status(200).json({ response: 'Successful' });
        } catch (e) {
            res.status(400).json({ error: 'Moving stock to new portfolio failed' });
        }
    };

    public static delete = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {

            if (Object.keys(req.body).length !== 1) {
                throw new Error('No portfolio name given.');
            }

            if (!req.body.name || req.body.name === "Default") {
                throw new Error('Could not delete portfolio');
            }

            const deletedPortfolio = await Portfolio.findOne({
                user: req.user._id, name: req.body.name });

            if (!deletedPortfolio) {
                throw new Error('Could not delete portfolio');
            }

            await deletedPortfolio.deleteOne();

            res.status(200).json({ response: 'Successful' });
        } catch (e) {
            res.status(400).json({ error: 'Delete Portfolio - Bad Request' });
        }
    };
} 

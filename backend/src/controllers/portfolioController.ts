import { Request, Response } from 'express';
import Portfolio from '../models/portfolioModel';
import Stock from '../models/stockModel';

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

            if (req.body.amount > stockToMove.numUnits) {
                throw new Error('Moving more stocks than possible');
            }

            stockToMove.merge(newPortfolio._id, req.body.amount);

            res.status(200).json({ response: 'Successful' });
        } catch (e) {
            res.status(400).json({ error: 'Moving stock to new portfolio failed' });
        }
    };

} 
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

    public static delete = async (
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
                throw new Error('Could not delete portfolio');
            }

            const portfolio = await Portfolio.findOneAndDelete({
                user: req.user._id, name: req.body.name });

            if (!portfolio) {
                throw new Error('Could not delete portfolio');
            }

            await Stock.where({ portfolio: portfolio._id }).update({ name: "Default" });

            res.status(200).json({ response: 'Successful' });
        } catch (e) {
            res.status(400).json({ error: 'Portfolio Bad Request' });
        }
    };

} 
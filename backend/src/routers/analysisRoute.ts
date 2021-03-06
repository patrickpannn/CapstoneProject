import express, { Router } from 'express';
import Route from '../interfaces/routeInterface';
import AnalysisController from '../controllers/analysisController';
import UserAuthentication from '../middlewares/authentication';

export default class AnalysisRoute implements Route {

    private path: string = '/analysis';

    private router: Router = express.Router();

    constructor () {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get(`${this.path}/sentiment/:companyName`, UserAuthentication.auth, AnalysisController.getSentimentScore);
        this.router.get(`${this.path}/snowflake/:ticker`, UserAuthentication.auth, AnalysisController.snowflake);
    }

    public getRouter(): Router {
        return this.router;
    }
}
import axios from 'axios';

const dividendStock = "OMC";

export default class SnowflakeService {

    public static async getValue(
        ticker: String,
        cashFlow: number
    ): Promise<number> {

        try {
            const stockQuote = await axios.get(
                `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=c5vln0iad3ibtqnna830`);

            if (!stockQuote.data.c) {
                throw new Error("Unable to get the stock price");
            }

            const stockValue = cashFlow;
            const stockCost = stockQuote.data.c;

            const value = (stockCost - stockValue) / stockCost;

            return value;
        } catch (e) {
            return -1;
        }

    }

    public static async getPast(): Promise<number> {
        return 0.2;
    }

    public static async getFuture(): Promise<number> {
        return 0.3;
    }

    public static async getRisk(
        stockRiskYear1: number,
        stockRiskYear2: number
    ): Promise<number> {

        try {        
            let value = 0.5 +
                        ((stockRiskYear1 - stockRiskYear2) / stockRiskYear2);

            if (value > 1) {
                value = 1;
            } else if (value < 0) {
                value = 0;
            }

            return value;
        } catch (e) {
            return -1;
        }
    }

    public static async getDividend(
        stockYield: number
    ): Promise<number> {

        try {
            const compareResponse = await axios.get(
                `https://finnhub.io/api/v1/stock/metric?symbol=${dividendStock}&metric=all&token=c5vln0iad3ibtqnna830`);


            if (!compareResponse.data.metric.dividendYield5Y) {
                    throw new Error("Unable to determine dividend yield");
            }

            const comparisonYield = compareResponse.data.metric.dividendYield5Y;
            
            let value = 0.8 +
                        ((stockYield - comparisonYield) / comparisonYield);

            if (value > 1) {
                value = 1;
            } else if (value < 0) {
                value = 0;
            }

            return value;
        } catch (e) {
            return -1;
        }
    }
}
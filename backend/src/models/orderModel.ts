import { Schema, model, Document } from 'mongoose';
import Portfolio from './portfolioModel';
import dotenv from 'dotenv';
dotenv.config();

// Document interface
interface OrderInterface extends Document {
    user: Schema.Types.ObjectId,
    portfolio: Schema.Types.ObjectId,
    numUnits: number,
    executePrice: number,
    ticker: string,
    name: string,
    executed: boolean,
    direction: string,
    getObject: () => {};
}

// Schema
const OrderSchema = new Schema<OrderInterface>({
    user: {
        type: Schema.Types.ObjectId, 
        required: true, 
        ref: 'user',
    },
    portfolio: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'portfolio',
    },
    numUnits: {
        type: Number, 
        required: true,
        validate(units: number): void {
            if(units <=0)
            {
                throw new Error('You must order a positive quantity of stock shares');
            }
        }
    },
    executePrice: {
        type: Number,
        required: true,
        validate(price: number): void {
            if(price <=0)
            {
                throw new Error('You must specify a positive price for your limit order');
            }
        }
    },
    ticker: { 
        type: String, 
        required: true, 
        trim: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    executed: {
        type: Boolean,
        trim: true,
        default: false,
    },
    direction: {
        type: String,
        required: true,
    }
}, { timestamps: true });

OrderSchema.methods.getObject = async function (): Promise<{}> {

    try {
        const orderPortfolio = await Portfolio.findOne({ id: this.portfolio });

        if (!orderPortfolio) {
            throw new Error('Could not find portfolio associated with order');
        }

        let orderObj = {
            numUnits: this.numUnits,
            executePrice: this.executePrice,
            ticker: this.ticker,
            name: this.name,
            executed: this.executed,
            direction: this.direction,
            portfolio: orderPortfolio.name
        };

        return orderObj;
    } catch (e) {
        throw new Error('Could not return order object');
    }
};

export default model<OrderInterface>('order', OrderSchema);
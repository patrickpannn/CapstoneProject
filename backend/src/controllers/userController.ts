import { Request, Response } from 'express';
import User from '../models/userModel';
import bcrypt from 'bcryptjs';
import { RequestUser } from '../interfaces/requestUser';

export default class UserController {
    public static signup = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const user = new User(req.body);
            const token: string = user.generateAuth();
            user.tokens.push({ token });
            user.balance = 0;
            await user.save();

            res.status(201).json({ token });
        } catch (e) {
            res.status(400).json({ error: 'Bad Request.' });
        }
    };

    public static login = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const inputEmail = req.body.email;
            const user = await User.findOne({ email: inputEmail });

            if (!user || 
                !(await bcrypt.compare(req.body.password, user.password))) {
                res.status(400).json({ error: 'Bad Request.' });
            } else {
                const token: string = user.generateAuth();
                user.tokens.push({ token });
                await user.save();
                res.status(200).json({ token });
            }

        } catch (e) {
            res.status(400).json({ error: 'Bad Request.' });
        }
    };

    public static updateProfile = async (
        req: RequestUser,
        res: Response
    ): Promise<void> => {
        try {
            if (req.body.password) {
                req.user.password = req.body.password;
            }
            if (req.body.username) {
                req.user.username = req.body.username;
            }
            await req.user.save();
            res.status(201).json({ response: 'Successful' });
        } catch (e) {
            res.status(400).json({ error: 'Bad Request.' });
        }
    };
}
import * as jwt from 'jwt-simple';
import * as moment from 'moment';
import * as passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { getRepository } from 'typeorm';

import { User } from '../entity/User';

class Auth {

    public initialize = () => {
        passport.use('jwt', this.getStrategy());

        //this.register('root', 'password123');

        return passport.initialize();
    }

    public authenticate = (callback) => passport.authenticate('jwt', { session: false, failWithError: true }, callback);

    public register = async (username, password) => {
        const user = new User();
        user.username = username;
        user.password = password;
        await getRepository(User).manager.save(user);
    }

    public logout = (req, res) => {
        req.logout();
        res.redirect('/');
    }

    public login = async (req, res) => {
        try {
            let user: User = null;
            try {
                user = await getRepository(User).findOneOrFail({ where: { username: req.body.username } });
            } catch (error) {
                throw new Error('User not found');
            }

            if (user === null) {
                throw new Error('User not found');
            }

            const success = user.password === req.body.password;
            if (success === false) {
                throw new Error('');
            }

            res.status(200).json(this.genToken(user));
        } catch (err) {
            res.status(401).json({ message: 'Invalid credentials', errors: err });
        }
    }

    private genToken = (user: User) => {
        const expires = moment().utc().add({ days: 7 }).unix();
        const token = jwt.encode({
            exp: expires,
            username: user.username,
        }, process.env.JWT_SECRET);

        return {
            token: token,
            expires: moment.unix(expires).format(),
            user: user.id
        };
    }
    private getStrategy = (): Strategy => {
        const params = {
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            passReqToCallback: true
        };
        return new Strategy(params, async (_req, payload: any, done) => {
            let user: User;
            try {
                user = await getRepository(User).findOneOrFail({ where: { username: payload.username } });
            } catch (error) {
                return done(error);
            }
            if (user === null) {
                return done(null, false, { message: 'The user in the token was not found' });
            }

            return done(null, { id: user.id, username: user.username });
        });
    }
}

export default new Auth();

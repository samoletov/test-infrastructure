import Auth from '.';

export = (app) => {
    
    app.post('/auth/login', Auth.login);
    app.get('/auth/logout', Auth.logout);
    app.get('/auth/login', (_req, res) => {
        res.send(`<form action="/auth/login" method="post">
        <div>
            <label>Username:</label>
            <input type="text" name="username"/>
        </div>
        <div>
            <label>Password:</label>
            <input type="password" name="password"/>
        </div>
        <div>
            <input type="submit" value="Log In"/>
        </div>
    </form>`);
    });
};

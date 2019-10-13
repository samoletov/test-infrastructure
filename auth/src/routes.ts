export = (app) => {

    // Require the routes files in the routes directory
    require('./auth/routes')(app);

    app.get('/', (req, res) => {
        res.status(200).json({ status: 'OK' });
    });
    // If no route is matched by now, it must be a 404
    app.use((_req, res, next) => {
        res.status(404).json({ error: 'Endpoint not found' });
        next();
    });

    app.use((error, _req, res, next) => {
        if (process.env.NODE_ENV === 'production') {
            return res.status(500).json({ error: 'Unexpected error: ' + error });
        }
        next(error);
    });

};

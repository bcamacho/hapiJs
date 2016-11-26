module.exports = {
    server: {
        host: '0.0.0.0',
        port: 3000,
        routes: { cors: true }
    },
    database: {
        host: '127.0.0.1',
        port: 27017,
        db: 'hapi-rest-mongo',
        collection: 'projects',
        username: '',
        password: ''
    }
};

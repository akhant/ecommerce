export default {
    database: 'mongodb://localhost:27017/ecommerce',
    port: 3000,
    secretKey: 'banana2018',
    facebook: {
        clientID: process.env.FACEBOOK_ID || '' ,
        clientSecret: process.env.FACEBOOK_SECRET || '',
        profileFields: ['emails', 'displayName'],
        callbackURL: 'http://localhost:3000/auth/facebook/callback'
    }
}
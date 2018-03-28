export default {
    database: 'mongodb://localhost:27017/ecommerce',
    port: 3000,
    secretKey: 'banana2018',
    facebook: {
        clientID: process.env.FACEBOOK_ID || '1784325955202755' ,
        clientSecret: process.env.FACEBOOK_SECRET || '0e6abeed33d177ffb74d1eca44edaf1f',
        profileFields: ['emails', 'displayName'],
        callbackURL: 'http://localhost:3000/auth/facebook/callback'
    }
}
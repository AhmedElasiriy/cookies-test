// 1. create node server with express and cookie-parser middleware 
// 2. create a route to set a cookie and another route to get the cookie value
// 3. create a route to delete the cookie

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const NODE_ENV = 'development'; // development or production

const app = express();

app.use(cors({ origin: '*' }));


app.use(cookieParser());

// cookie options 
const accessTokenCookieOptions = {
    httpOnly: true, // client side js cannot access the cookie
    maxAge: 30 * 24 * 60 * 60 * 1000, // one month
    secure: NODE_ENV !== 'development', // cookie only works in https (secure is true if NODE_ENV is production and false if NODE_ENV is development)
    sameSite: NODE_ENV !== 'development' ? 'none' : 'lax', // sameSite is none if secure is true and lax if secure is false because we are using cors and we are not using csrf protection
};

const refreshTokenCookieOptions = {
    httpOnly: true, // client side js cannot access the cookie
    maxAge: 6 * 30 * 24 * 60 * 60 * 1000, // six months (6 * 30 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
    secure: NODE_ENV !== 'development', // cookie only works in https
    sameSite: NODE_ENV !== 'development' ? 'none' : 'lax', // sameSite is none if NODE_ENV is production and lax if NODE_ENV is development because we are using cors and we are not using csrf protection
    path: '/get-refresh-token', // cookie is only sent to this path
};


app.get('/set-cookie', (req, res) => {
    res.cookie('accessToken', '12345', accessTokenCookieOptions);
    res.cookie('refreshToken', '67890', refreshTokenCookieOptions);
    res.send('Cookie is set');
});

app.get('/get-cookie', (req, res) => {
    res.send(req.cookies);
});

app.get('/get-refresh-token', (req, res) => {
    res.send(req.cookies);
});

app.get('/delete-cookie', (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.send('Cookie is deleted');
});

app.listen(5000, () => {
    console.log('Server is running on port 3000');
});
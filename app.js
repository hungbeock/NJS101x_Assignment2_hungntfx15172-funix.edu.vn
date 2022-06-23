const express = require('express');
const app = express();
const csrf = require('csurf');
const session = require('express-session');
const mongodbStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const path = require('path');
const multer = require('multer');

const port = 3000;
const router = require('./src/router/index');
const db = require('./src/config/db');
const Staff = require('./src/models/staff');

const MONGODB_URI = 'mongodb+srv://hung:123456789a@cluster0.qxpusgq.mongodb.net/emoloyee';

// Connect to MongoDB
db();

// Parse body
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// View engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/src/views');

const fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

// Set static: public
app.use(express.static('public'));
app.use('/images', express.static('images'));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));

// save session
const store = new mongodbStore({
    uri: MONGODB_URI,
    collection: 'sessions',
});
app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store,
    })
);

// Token
const csrfProtection = csrf();
app.use(csrfProtection);

// set token, authenticated
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

// Add staff in request
app.use((req, res, next) => {
    if (!req.session.staff) {
        res.locals.role = false;
        return next();
    }
    Staff.findById(req.session.staff._id)
        .then((staff) => {
            if (!staff) {
                return next();
            }
            req.staff = staff;
            if (staff.role === 'admin') {
                res.locals.role = 'admin';
                return next();
            }
            res.locals.role = 'staff';
            next();
        })
        .catch((error) => {
            console.log(error);
        });
});

// Init router
router(app);

app.listen(process.env.PORT || 3001, () => {
    console.log(`Server is running.`);
});

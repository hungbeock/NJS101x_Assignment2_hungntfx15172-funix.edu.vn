const Staff = require('../models/staff');
class AuthController {
    //GET auth/login
    getLogin(req, res, next) {
        res.render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            isStarted: null,
            errorMessage: null,
        });
    }

    // POST auth/login
    postLogin(req, res, next) {
        const userName = req.body.userName;
        const password = req.body.password;

        Staff.findOne({ userName: userName })
            .then((staff) => {
                if (!staff) {
                    return res.render('auth/login', {
                        path: '/login',
                        pageTitle: 'Login',
                        isStarted: null,
                        errorMessage: 'Tên đăng nhập hoặc mật khẩu sai',
                    });
                }
                req.session.isLoggedIn = true;
                req.session.staff = staff;
                req.session.save((err) => {
                    return res.redirect('/');
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    // POST auth/logout
    postLogout(req, res, next) {
        req.session.destroy((err) => {
            console.log(err);
            res.redirect('/');
        });
    }
}

module.exports = new AuthController();

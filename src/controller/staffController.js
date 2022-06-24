const Methods = require('../utils/methods');
const deleteFile = require('../utils/fileHelper');
class StaffController {
    //  GET /staff/infoStaff
    getInfoStaff(req, res) {
        res.render('staff/infoStaff', {
            path: '/staff/infoStaff',
            pageTitle: 'Staff Info',
            isStarted: null,
            staff: req.staff,
        });
    }

    // POST /staff/edit
    postEditStaff(req, res) {
        deleteFile(req.staff.image);
        req.staff.image = req.file.path;
        req.staff
            .save()
            .then(() =>
                res.render('staff/infoStaff', {
                    path: '/staff/infoStaff',
                    pageTitle: 'Staff Info',
                    isStarted: null,
                    staff: req.staff,
                })
            )
            .catch((error) => console.log(error));
    }

    // GET /staff/reference
    getReference(req, res) {
        const timeWorked = Methods.timeConvert(Methods.calculateTimeWorked(req.staff));
        const lastTimeWorked = Methods.getLastWork(req.staff);
        const day = Methods.getDayLeave(req.staff, Methods.calculateTimeWorked(req.staff));
        const salary = Methods.getSalary(req.body.month, req.staff);

        let workTimes = [];
        if (req.query.rowPerPage) {
            req.staff.workTimes.length < +req.query.rowPerPage
                ? (req.query.rowPerPage = +req.staff.workTimes.length)
                : +req.query.rowPerPage;

            for (let i = 0; i < +req.query.rowPerPage; i++) {
                workTimes.push(req.staff.workTimes[i]);
            }
        } else {
            workTimes = req.staff.workTimes;
        }

        res.render('staff/reference', {
            path: '/staff/reference',
            pageTitle: 'Reference staff',
            isStarted: null,
            timeWorked, // Worked time in a day
            lastTimeWorked, // total times last worked
            staff: req.staff, // staff
            day, // arry of info annual leave
            salary,
            workTimes, //list work Time
        });
    }

    // POST /staff/reference
    postReference(req, res) {
        const timeWorked = Methods.timeConvert(Methods.calculateTimeWorked(req.staff));
        const lastTimeWorked = Methods.getLastWork(req.staff);
        const day = Methods.getDayLeave(req.staff, Methods.calculateTimeWorked(req.staff));
        const salary = Methods.getSalary(req.body.month, req.staff);

        res.render('staff/reference', {
            path: '/staff/reference',
            pageTitle: 'Reference staff',
            isStarted: null,
            timeWorked, // Worked time in a day
            lastTimeWorked, // total times last worked
            staff: req.staff, // staff
            day, // arry of info annual leave
            salary,
            workTimes
        });
    }
}

module.exports = new StaffController();

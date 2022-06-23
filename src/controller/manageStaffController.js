const Staff = require('../models/staff');
const Methods = require('../utils/methods');
class ManageStaffController {
    // GET /manageStaff
    getIndex(req, res, next) {
        Staff.find({ role: 'staff' })
            .then((staffs) => {
                res.render('manage/index', {
                    path: '/manageStaff',
                    pageTitle: 'Manage Staff',
                    isStarted: null,
                    staffs,
                    staff: false,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    //POST /manageStaff/staff
    postStaff(req, res, next) {
        if (req.body.staff === 'none') {
            return res.redirect('/manageStaff');
        }
        Staff.find({ role: 'staff' })
            .then((staffs) => {
                Staff.findById(req.body.staff)
                    .then((staff) => {
                        const workTimes = staff.workTimes.filter((workTime) => {
                            return staff.workTimes[0].startTime.getMonth() === +req.body.month;
                        });
                        if (staff.workTimes.length === 0) {
                            res.render('manage/staff', {
                                path: '/manageStaff',
                                pageTitle: 'Manage Staff',
                                isStarted: null,
                                staffs,
                                staff,
                                workTimes,
                                month: +req.body.month,
                            });
                        } else {
                            const timeWorked = Methods.timeConvert(
                                Methods.calculateTimeWorked(staff)
                            );
                            const lastTimeWorked = Methods.getLastWork(staff);
                            res.render('manage/staff', {
                                path: '/manageStaff',
                                pageTitle: 'Manage Staff',
                                isStarted: null,
                                staffs,
                                staff,
                                timeWorked,
                                lastTimeWorked,
                                workTimes,
                                month: +req.body.month,
                            });
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    // POST /manageStaff/postDeleteWorkTime
    postDeleteWorkTime(req, res, next) {
        Staff.findById(req.body.staffId)
            .then((staff) => {
                const workTimeDelete = staff.workTimes.filter((workTime) => {
                    return workTime._id.toString() === req.body.workTime;
                });
                const updateWorkTime = staff.workTimes.filter((workTime) => {
                    return workTime._id.toString() !== workTimeDelete[0]._id.toString();
                });
                staff.workTimes = updateWorkTime;
                return staff.save();
            })
            .then((result) => {
                res.redirect('/manageStaff');
            })
            .catch((error) => {
                console.log(error);
            });
    }

    // POST /manageStaff/comfirmTimeWork
    postComfirmTimeWork(req, res, next) {
        Staff.findById(req.body.staffId)
            .then((staff) => {
                staff.isConfirm.push({
                    confirmed: true,
                    month: req.body.month,
                });
                staff.save();
            })
            .then((result) => {
                res.redirect('/manageStaff');
            })
            .catch((error) => {
                console.log(error);
            });
    }
}

module.exports = new ManageStaffController();

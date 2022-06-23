const mongoose = require('mongoose');

const Staff = require('../models/staff');

async function connect() {
    try {
        mongoose.connect(
            'mongodb+srv://hung:123456789a@cluster0.qxpusgq.mongodb.net/emoloyee?retryWrites=true&w=majority'
        );
        console.log('Connected to MongoDB');
    } catch (err) {
        console.log(err);
    }
}

Staff.findOne()
    .then((staff) => {
        if (!staff) {
            const newStaff = new Staff({
                name: 'Nguyễn  Hưng',
                dOB: new Date(2000, 03, 11),
                salaryScale: 1.4,
                startDate: new Date(2020, 01, 01),
                department: 'IT',
                annualLeave: 14,
                image: 'https://res.cloudinary.com/diqqf3eq2/image/upload/v1586883417/person-3_ipa0mj.jpg',
                workTimes: [],
                listInfoList: [],
                bodyTemperature: [],
                vaccineInfo: [],
                infectCovidInfo: [],
                isConfirm:[ ],
                userName: 'manage',
                password: 'manage',
                role: 'admin',
            });
            console.log('thongtin')
            newStaff.save();
        }
    })
    .catch((error) => {
        console.log(error);
    });

module.exports = connect;

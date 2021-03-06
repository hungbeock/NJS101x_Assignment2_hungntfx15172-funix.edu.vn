const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const Staff = require('../models/staff');
class CovidDetailController {
    // GET /covidDetail
    getIndex(req, res) {
        Staff.find({ role: 'staff' })
            .then((staffs) => {
                res.render('covidDetail/index', {
                    path: '/covid',
                    pageTitle: 'Covide Detail',
                    staffs,
                });
            })
            .catch((error) => console.log(error));
    }

    // POST /covidDetail/temparature
    postTemperature(req, res) {
        req.staff.bodyTemperature = {
            temperature: req.body.temperature,
            date: req.body.dateOfTemperature,
            time: req.body.timeOfTemperature,
        };
        req.staff
            .save()
            .then(() => {
                res.render('covidDetail/index', {
                    path: '/covid',
                    pageTitle: 'Covide Detail',
                });
            })
            .catch((error) => console.log(error));
    }

    // POST /covidDetail/injection
    postInjection(req, res) {
        const firstVaccine = {
            nameVaccine: req.body.nameOfFirstVaccine,
            date: req.body.dateOfFirstVaccine,
        };
        const secondVaccine = {
            nameVaccine: req.body.nameOfSecondVaccine,
            date: req.body.dateOfSecondVaccine,
        };
        req.staff
            .addInject(firstVaccine, secondVaccine)
            .then(() => {
                res.render('covidDetail/index', {
                    path: '/covid',
                    pageTitle: 'Covide Detail',
                });
            })
            .catch((error) => console.log(error));
    }

    // POST /covidDteail/infect
    postInfect(req, res) {
        req.staff.infectCovidInfo = {
            datePositive: req.body.infectDate,
            dateRecover: req.body.recoverDate,
        };

        req.staff
            .save()
            .then(() => {
                res.render('covidDetail/index', {
                    path: '/covid',
                    pageTitle: 'Covide Detail',
                });
            })
            .catch((error) => console.log(error));
    }

    //GET PDF file
    getPDF(req, res, next) {
        Staff.findById(req.params.id)
            .then((staff) => {
                const doc = new PDFDocument();
                const invoicePath = path.join('data', 'invoices', invoiceName);
                const pathDoc = path.join('data', 'pdf');
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader(
                    'Content-Disposition',
                    'inline; filename="' + invoiceName + '"'
                );
                doc.pipe(fs.createWriteStream(invoicePath));
                doc.pipe(res);
                // doc.text('T??n nh??n vi??n: ' + staff.name);
                // doc.text('Nhi???t ?????: ' + staff.bodyTemperature[0].temperature);
                // doc.text('Vaccine m??i m???t: ' + staff.vaccineInfo[0].nameVaccine);
                // doc.text('Ng??y ti??m: ' + staff.vaccineInfo[0].date.toISOString());
                // doc.text('Vaccine m??i m???t: ' + staff.vaccineInfo[1].nameVaccine);
                // doc.text('Ng??y ti??m: ' + staff.vaccineInfo[1].date.toISOString());
                // doc.end();
                doc.text(
                    'T??n nh??n vi??n: ' + staff.name,
                    'Nhi???t ?????: ' + staff.bodyTemperature[0].temperature,
                    'Vaccine m??i m???t: ' + staff.vaccineInfo[0].nameVaccine,
                    'Ng??y ti??m: ' + staff.vaccineInfo[0].date.toISOString()
                
                )
            })
            .catch((error) => {
                console.log(error);
            });
    }
}

module.exports = new CovidDetailController();

const Methods = require('../utils/methods');

class AttendanceController {
    // GET /
    getIndex(req, res) {
        const presentMonth = new Date().getMonth();
        console.log('thangnayokia',presentMonth);
        const monthConfirmed = req.staff.isConfirm.filter((item) => {
            return item.month ;
        });
        console.log('okia ',monthConfirmed[0]?.month);
        let confirmed;
        if (monthConfirmed[0]?.month === presentMonth) {
            confirmed = false;
        }else{
            confirmed = true;

        }
      

        console.log('conpom',confirmed)
        
        res.render('attendance/index', {
            path: '/attendance',
            pageTitle: 'Attendanced',
            isStarted: Methods.CheckIsStarted(req.staff),
            confirmed:confirmed
        });
    }

    // GET /attendance/start
    getStartWork(req, res) {
        res.render('attendance/startForm', {
            path: '/attendance',
            pageTitle: 'Attendance',
            staff: req.staff,
            isStarted: Methods.CheckIsStarted(req.staff),
            confirmed:true
        });
    }

    // POST /attendance/start
    postStartWork(req, res) {
        const workPlace = req.body.workPlace;
        const newWorkTimes = {
            startTime: Date.now(),
            workPlace,
            working: true,
            endTime: null,
            confirmed:true
        };
        req.staff
            .addWorkTimes(newWorkTimes)
            .then((result) => {
                res.redirect('/attendance/infoStart');
            })
            .catch((error) => {
                console.log(error);
            });
    }

    // GET /attendance/infoStart
    getInfoStart(req, res) {
        res.render('attendance/startInfo', {
            path: '/attendance',
            pageTitle: 'Attendance',
            lastStart: Methods.getLastStart(req.staff),
            isStarted: Methods.CheckIsStarted(req.staff),
            staff: req.staff,
            confirmed:true
        });
    }

    // POST /attendance/end
    postEndWork(req, res) {
        const newEndTime = {
            working: false,
            endTime: new Date(),
        };
        req.staff
            .addEndTime(newEndTime)
            .then((result) => {
                res.redirect('/attendance/endInfo');
            })
            .catch((error) => {
                console.log(error);
            });
    }

    // GET /attendance/endInfo
    getInfoEnd(req, res) {
        const timeWorked = Methods.timeConvert(Methods.calculateTimeWorked(req.staff));
        res.render('attendance/endInfo', {
            path: '/attendance',
            pageTitle: 'Attendance',
            timeWorked,
            workedInDay: Methods.calculateTimeWorked(req.staff),
            isStarted: Methods.CheckIsStarted(req.staff),
            staff: req.staff,
            confirmed:true
        });
    }

    // GET /attendance/annulLeave
    getLeaveForm(req, res) {
        res.render('attendance/leaveForm', {
            path: '/attendance',
            pageTitle: 'Attendance',
            staff: req.staff,
            confirmed:true

        });
    }

    // POST /attendance/info
    postLeaveForm(req, res) {
        req.staff
            .addLeaveInfo({
                daysLeave: req.body.daysLeave,
                timesLeave: req.body.hoursLeave,
                reason: req.body.reason,
            })
            .then(() => {
                res.redirect('/');
            })
            .catch((error) => {
                console.log(error);
            });
    }
}
    getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    Order.findById(orderId)
      .then(order => {
        if (!order) {
          return next(new Error('No order found.'));
        }
        if (order.user.userId.toString() !== req.user._id.toString()) {
          return next(new Error('Unauthorized'));
        }
        const invoiceName = 'invoice-' + orderId + '.pdf';
        const invoicePath = path.join('data', 'invoices', invoiceName);
  
        const pdfDoc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
          'Content-Disposition',
          'inline; filename="' + invoiceName + '"'
        );
        pdfDoc.pipe(fs.createWriteStream(invoicePath));
        pdfDoc.pipe(res);
  
        pdfDoc.fontSize(26).text('Invoice', {
          underline: true
        });
        pdfDoc.text('-----------------------');
        let totalPrice = 0;
        order.products.forEach(prod => {
          totalPrice += prod.quantity * prod.product.price;
          pdfDoc
            .fontSize(14)
            .text(
              prod.product.title +
                ' - ' +
                prod.quantity +
                ' x ' +
                '$' +
                prod.product.price
            );
        });
        pdfDoc.text('---');
        pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);
  
        pdfDoc.end();
        // fs.readFile(invoicePath, (err, data) => {
        //   if (err) {
        //     return next(err);
        //   }
        //   res.setHeader('Content-Type', 'application/pdf');
        //   res.setHeader(
        //     'Content-Disposition',
        //     'inline; filename="' + invoiceName + '"'
        //   );
        //   res.send(data);
        // });
        // const file = fs.createReadStream(invoicePath);
  
        // file.pipe(res);
      })
      .catch(err => next(err));
  };

module.exports = new AttendanceController();

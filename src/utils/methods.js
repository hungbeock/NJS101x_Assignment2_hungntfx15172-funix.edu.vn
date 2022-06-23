class Methods {
    timeConvert = ({ totalTimeWorked }) => {
        const hours = totalTimeWorked / 60;
        const rhours = Math.floor(hours);
        const minutes = (hours - rhours) * 60;
        const rminutes = Math.round(minutes);
        return rhours + rminutes / 100;
    };

    calculateTimeWorked = (staff) => {
        let totalTimeWorked = 0;
        const workTimeInDay = [];
        const WorkTimesLength = staff.workTimes.length;
        let day = staff.workTimes[WorkTimesLength - 1].startTime.getDate();

        // find list work time in a day
        staff.workTimes.forEach((workTime) => {
            if (day === workTime.startTime.getDate()) {
                workTimeInDay.push(workTime);
            }
            return workTimeInDay;
        });

        workTimeInDay.forEach((workTime) => {
            // calculate minutes work
            const minutesStart =
                workTime.startTime.getHours() * 60 + workTime.startTime.getMinutes();
            const minutesEnd = workTime.endTime.getHours() * 60 + workTime.endTime.getMinutes();
            const minustesCalculate = (minutesEnd - minutesStart) / 60;

            // calculate Hours work
            const hoursWorked = workTime.endTime.getHours() - workTime.startTime.getHours();
            return (totalTimeWorked = totalTimeWorked + hoursWorked * 60 + minustesCalculate);
        });

        return { totalTimeWorked, workTimeInDay, day };
    };

    getLastStart = (staff) => {
        let lastWorked;
        const lastWorkedList = staff.workTimes.filter((workedTime) => {
            return workedTime.working === true;
        });
        return (lastWorked = lastWorkedList[lastWorkedList.length - 1]);
    };

    // compom=()=>{
    //     const presentMonth = new Date().getMonth();
    //     console.log('thangnayokia',presentMonth);
    //     const monthConfirmed = staff.isConfirm.filter((item) => {
    //         return item.month ;
    //     });
    //     console.log('okia ',monthConfirmed[0]?.month);
    //     let confirmed;
    //     if (monthConfirmed[0]?.month === presentMonth) {
    //         confirmed = false;
    //     }else{
    //         confirmed = true;

    //     }
    // }

    CheckIsStarted = (staff) => {
        if (staff.workTimes && staff.workTimes.length > 0) {
            const workTimeLength = staff.workTimes.length - 1;
            const lastStart = staff.workTimes[workTimeLength];
            if (lastStart.endTime) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    };

    getLastWork = (staff) => {
        const lastWorkedTime = staff.workTimes.length - 1;
        const workTime = staff.workTimes[lastWorkedTime];

        // calculate minutes worrk
        const hourStart = workTime.startTime.getHours();
        const hourEnd = workTime.endTime.getHours();
        const totalTimeWorked =
            hourEnd * 60 +
            workTime.endTime.getMinutes() -
            (hourStart * 60 + workTime.startTime.getMinutes());
        return (totalTimeWorked / 60).toFixed(2);
    };

    getDayLeave = (staff, { day }) => {
        const dayLeave = staff.leaveInfoList.filter((leaveInfo) => {
            const listDayleave = leaveInfo.daysLeave.split('-');
            const daysLeave = [];

            for (let i = 0; i < listDayleave.length; i++) {
                daysLeave.push(new Date(listDayleave[i]));
            }

            const startLeave = daysLeave[0].getDate();
            const endLeave = daysLeave[1].getDate();
            if (startLeave <= day && endLeave >= day) {
                return leaveInfo;
            }
        });
        return dayLeave;
    };

    getSalary = (month, staff) => {
        const year = 2021;
        const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
        let overTime = 0;
        let shortTime = 0;
        const listDayLeave = [];

        // get date leave
        staff.leaveInfoList.forEach((leaveInfo) => {
            const listDay = leaveInfo.daysLeave.split('-');
            const dayLeave = {};

            const dayStartLeave = new Date(listDay[0]);
            const dayEndLeave = new Date(listDay[1]);
            const timesLeave = leaveInfo.timesLeave;

            dayLeave.dayStartLeave = dayStartLeave.getDate();
            dayLeave.dayEndLeave = dayEndLeave.getDate();
            dayLeave.monthLeave = dayStartLeave.getMonth();
            dayLeave.time = timesLeave;
            return listDayLeave.push(dayLeave);
        });

        // get over time and short time;
        for (let i = 1; i <= lastDayOfMonth; i++) {
            let timeWorkInDay = 0;
            let timeAnnualLeave = 0;

            overTime += timeWorkInDay - 8 < 0 ? 0 : timeWorkInDay - 8;
            shortTime +=
                8 - (timeWorkInDay + timeAnnualLeave) < 0
                    ? 0
                    : 8 - (timeWorkInDay + timeAnnualLeave);

            staff.workTimes.forEach((workTime) => {
                if (
                    workTime.startTime.getDate() == i &&
                    workTime.startTime.getMonth() + 1 == month
                ) {
                    listDayLeave.forEach((day) => {
                        const hoursStart = workTime.startTime.getHours();
                        const hoursEnd = workTime.endTime.getHours();
                        const timeStart = hoursStart * 60 + workTime.startTime.getMinutes();
                        const timeEnd = hoursEnd * 60 + workTime.endTime.getMinutes();
                        // plus time leave to timework
                        if (
                            day.dayStartLeave <= workTime.startTime.getDate() &&
                            day.dayEndLeave >= workTime.startTime.getDate() &&
                            day.monthLeave + 1 == month
                        ) {
                            timeAnnualLeave = day.timesLeave;
                        }
                        timeWorkInDay += (timeEnd - timeStart) / 60;
                    });
                }
            });
        }
        return staff.salaryScale * 3000000 + (overTime - shortTime) * 200000;
    };

    getLastWorkList = (staff) => {
        lastWorkList = [];
        const lastWorkTimes = staff.workTimes.length - 1;
        const dateWork = staff.workTimes[lastWorkTimes].getDate();
        staff.workTimes.forEach((workTime) => {
            if (workTime.startTime.getDate() === dateWork) {
                lastWorkList.push(workTime);
            }
        });
        return lastWorkList;
    };
}

module.exports = new Methods();

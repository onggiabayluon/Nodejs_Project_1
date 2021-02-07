module.exports = function convertIOSdateInto_ddmmyy_format(iosDate) {
    //var date = new Date('2013-03-10T02:00:00Z');
    //getHours, getMinutes
    var hrs = iosDate.getHours();
    var year = iosDate.getFullYear();
    var month = iosDate.getMonth() + 1;
    var dt = iosDate.getDate();

    if (dt < 10) {
        dt = '0' + dt;
    }
    if (month < 10) {
        month = '0' + month;
    }

    console.log(year + '-' + month + '-' + dt + '-' + hrs);
}
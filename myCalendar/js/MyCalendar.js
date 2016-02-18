/**
 * 日历类
 * @param selectDate
 * @param startTime开始时间
 * @param endTime结束时间
 * @constructor
 */
function MyCalendar(selectDate, startTime, endTime,url) {
    this.now = new Date();
    this.nowDate = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate());
    this.currentMonthFirstDate = new Date(this.now.getFullYear(), this.now.getMonth(), 1);
    this.currentMonthLastDate = new Date(this.now.getFullYear(), this.now.getMonth(), 30);
    this.startTimeMonthFirstDate = '';
    this.endTimeMonthLastDate = '';
    if (selectDate == ''||selectDate==null) {
        this.selectDate = this.nowDate;
    }else{
        this.selectDate = new Date(selectDate.getFullYear(), selectDate.getMonth(),selectDate.getDate());
    }

    this.startTime = startTime;
    this.endTime = endTime;
    this.url=url;
    this.init = function () {
        this.currentMonthLastDate = new Date(this.currentMonthFirstDate.getFullYear(), this.currentMonthFirstDate.getMonth(), this.daysInMonth(this.currentMonthFirstDate));
        this.startTimeMonthFirstDate = new Date(this.startTime.getFullYear(), this.startTime.getMonth(), 1);
        this.endTimeMonthLastDate = new Date(this.endTime.getFullYear(), this.endTime.getMonth(), this.daysInMonth(this.endTime));
        this.arrangeDate(this.currentMonthFirstDate, this.selectDate);
    };

    this.arrangeDate = function () {
        var now = new Date();
        now = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        var monthFirstDate = new Date(this.currentMonthFirstDate.getFullYear(), this.currentMonthFirstDate.getMonth(), 1);
        //console.log('date=' + (this.currentMonthFirstDate.getMonth() + 1) + '-' + this.currentMonthFirstDate.getDate());
        //console.log('startTimeMonthFirstDate=' + (this.startTimeMonthFirstDate.getMonth() + 1) + '-' + this.startTimeMonthFirstDate.getDate());
        //console.log('startTimeMonthFirstDate=' + (this.endTimeMonthLastDate.getMonth() + 1) + '-' + this.endTimeMonthLastDate.getDate());
        if (this.currentMonthFirstDate.getTime() >= this.startTimeMonthFirstDate.getTime() && this.currentMonthLastDate.getTime() <= this.endTimeMonthLastDate.getTime()) {
            var year = this.currentMonthFirstDate.getFullYear();
            var month = this.currentMonthFirstDate.getMonth();
            $('#calendarDate-year').text(year);
            $('#calendarDate-month').text((month + 1)+'月');
            $("#calendar td").html('');

            var day_tds = $("#calendar").find("tbody tr td").toArray();
            var firstDay = this.getFirstDay(year, month);
            var daysInCurrentMonth = this.daysInMonth(this.currentMonthFirstDate);//月份天数

            for (i = 1; i <= daysInCurrentMonth; i++) //以月份天数为上限添加日期
            {
                var day_td = day_tds[firstDay + i - 1]; //从指定位置开始排列日期
                var time = new Date(year, month, i);
                var datetime =time.format('yyyy-MM-dd');
                if (time.getTime() > this.startTime.getTime() && time.getTime() < this.endTime.getTime()) {
                    var html = '<a href="'+this.url+datetime+'">' + i + '</a>';
                    if (time.getTime() == now.getTime()) {
                        html = '<a href="'+this.url+datetime+'" class="calendar-current-day">' + i + '</a>';
                    }
                    if (time.getTime() == this.selectDate.getTime()) {
                        html = '<a href="'+this.url+datetime+'" class="calendar-day-active">' + i + '</a>';
                    }
                } else {
                    var html = '<span class="calendar-unselectable">' + i + '</span>';
                    if (time.getTime() == now.getTime()) {
                        html = '<span class="calendar-current-day">' + i + '</span>';
                    }
                    if (time.getTime() == this.selectDate.getTime()) {
                        html = '<a href="'+this.url+datetime+'" class="calendar-day-active">' + i + '</a>';
                    }
                }
                day_td.innerHTML = html;
            }
        }
    };

    this.daysInMonth = function (date) {
        var daysInMonth = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31); //月份天数
        daysInMonth[1] = this.checkLeapMonth(date.getFullYear());
        return daysInMonth[date.getMonth()];
    };

    //检查闰月
    this.checkLeapMonth = function (year) {
        var days = 28; //声明局部变量，提供返回值
        var date = new Date();
        date.setFullYear(year); //将提供的四位年份数设置为date的年份
        date.setMonth(1); //设置月份，月份从0开始排列，如0对应1月，1对应2月
        date.setDate(29);
        //设置日期，范围从1-31，若超出则自动调至下个月，如当月有30日但输入了31，则自动转至下个月的1号
        if (date.getDate(29) == 29) {
            days = 29;
        }
        return days; //返回2月天数
    };
    //检查当月一号为周几：
    this.getFirstDay = function (year, month) {
        var date = new Date();
        date.setFullYear(year);
        date.setMonth(month);
        date.setDate(1);
        return date.getDay();//获取指定日期为周几，如周一，则返回1
    };
    this.getPrevMonth = function (date) {
        var year = date.getFullYear(); //获取当前日期的年份
        var month = date.getMonth(); //获取当前日期的月份
        var day = date.getDate(); //获取当前日期的日
        var days = new Date(year, month, 0);
        days = days.getDate(); //获取当前日期中月的天数
        var year2 = year;
        var month2 = parseInt(month) - 1;
        if (month2 == 0) {
            year2 = parseInt(year2) - 1;
            month2 = 12;
        }

        var date2 = new Date(year2, month2, 1);
        return date2;
    };
    this.getNextMonth = function (date) {
        var year = date.getFullYear(); //获取当前日期的年份
        var month = date.getMonth(); //获取当前日期的月份
        var day = date.getDate(); //获取当前日期的日
        var days = new Date(year, month, 0);
        var year2 = year;
        var month2 = parseInt(month) + 1;
        if (month2 == 13) {
            year2 = parseInt(year2) + 1;
            month2 = 1;
        }
        var date3 = new Date(year2, month2, 1);
        return date3;
    };
    this.nextMonth = function () {
        this.currentMonthLastDate = new Date(this.currentMonthFirstDate.getFullYear(), this.currentMonthFirstDate.getMonth(), this.daysInMonth(this.currentMonthFirstDate));
        if (this.currentMonthLastDate < this.endTimeMonthLastDate.getTime()) {
            this.currentMonthFirstDate = this.getNextMonth(this.currentMonthFirstDate);
            this.arrangeDate(this.currentMonthFirstDate, this.selectDate);
            //alert(this.currentMonthFirstDate.getMonth() + 1);
        }
    };

    this.prevMonth = function () {
        if (this.currentMonthFirstDate > this.startTimeMonthFirstDate) {
            this.currentMonthFirstDate = this.getPrevMonth(this.currentMonthFirstDate);
            this.arrangeDate(this.currentMonthFirstDate, this.selectDate);
            //alert(this.currentMonthFirstDate.getMonth() + 1);
        }
    }
}
Date.prototype.format =function(format)
{
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(),    //day
        "h+" : this.getHours(),   //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
        "S" : this.getMilliseconds() //millisecond
    };
    if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
        (this.getFullYear()+"").substr(4- RegExp.$1.length));
    for(var k in o)if(new RegExp("("+ k +")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length==1? o[k] :
                ("00"+ o[k]).substr((""+ o[k]).length));
    return format;
};
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = location.search.substr(1).match(reg);
    if (r != null) return unescape(decodeURI(r[2])); return null;
}
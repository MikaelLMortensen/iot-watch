let currentDate = { year: 1900, month: 1, day: 1, hour:0, minute:0, second:0, daylightsaving:false }

input.onButtonPressed(Button.B, function () {
    let setMinute = RTC_DS1307.getTime(RTC_DS1307.TimeType.MINUTE)
    setMinute = setMinute + 1
    if (setMinute > 60) {
        setMinute = 0
    }
    RTC_DS1307.setTime(RTC_DS1307.TimeType.MINUTE, setMinute)
})

// Show time in display:
input.onButtonPressed(Button.A, function () {
    let hourString = "";
    if (currentDate.hour < 10){
        hourString = "0"
    }
    hourString = hourString + currentDate.hour.toString()

    let minuteString = "";
    if (currentDate.minute < 10){
        minuteString = "0"
    }
    minuteString = minuteString + currentDate.minute.toString()

    let secondString = "";
    if (currentDate.second < 10){
        secondString = "0"
    }
    secondString = secondString + currentDate.second.toString()

    basic.showString(hourString + ":" + minuteString + "." + secondString +  " ")
})


basic.forever(function () {
    currentDate.hour = RTC_DS1307.getTime(RTC_DS1307.TimeType.HOUR)
    currentDate.minute = RTC_DS1307.getTime(RTC_DS1307.TimeType.MINUTE)
    currentDate.second = RTC_DS1307.getTime(RTC_DS1307.TimeType.SECOND)

    let hourValue = Math.floor(1023 * currentDate.hour / 24)
    let minuteValue = Math.floor(1023 * currentDate.minute / 60)
    let secondValue = Math.floor(1023 * currentDate.second / 60)

    pins.analogWritePin(AnalogPin.P0, secondValue)
    pins.analogWritePin(AnalogPin.P1, minuteValue)
    pins.analogWritePin(AnalogPin.P2, hourValue)
})

currentDate.hour = RTC_DS1307.getTime(RTC_DS1307.TimeType.HOUR)
currentDate.minute = RTC_DS1307.getTime(RTC_DS1307.TimeType.MINUTE)
currentDate.second = RTC_DS1307.getTime(RTC_DS1307.TimeType.SECOND)
if (currentDate.hour == 0 && currentDate.minute == 0){
 RTC_DS1307.DateTime(2020, 12, 08, 14, 28, 0)
}



// Handle 
// {"$id":"1","currentDateTime":"2021-01-07T06:38+01:00","utcOffset":"01:00:00","isDayLightSavingsTime":false,"dayOfTheWeek":"Thursday","timeZoneName":"Central Europe Standard Time","currentFileTime":132544751342391126,"ordinalDate":"2021-7","serviceResponse":null}
// Source: http://worldclockapi.com/api/jsonp/cet/now?callback=mycallback

function setDate(json:string) {
    let obj = JSON.parse(json);

    let cdt = obj.currentDateTime;
    let cdtArr = cdt.split('T');
    let ymd = cdtArr[0].split('-');
    currentDate.year = ymd[0];
    currentDate.month = parseInt(ymd[1]);
    currentDate.day = parseInt(ymd[2]);

    let toArr = cdtArr[1].split('+')
    let hm = toArr[0].split(':')
    currentDate.hour = parseInt(hm[0]);
    currentDate.minute = parseInt(hm[1]);

    currentDate.daylightsaving = (obj.isDayLightSavingsTime == 'true')
}


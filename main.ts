input.onButtonPressed(Button.A, function () {
    let setHour = RTC_DS1307.getTime(RTC_DS1307.TimeType.HOUR)
    setHour = setHour + 1
    RTC_DS1307.setTime(RTC_DS1307.TimeType.HOUR, setHour)
})

input.onButtonPressed(Button.AB, function () {
    RTC_DS1307.DateTime(2020, 12, 08, 14, 28, 0)
})

input.onButtonPressed(Button.B, function () {
    let setMinute = RTC_DS1307.getTime(RTC_DS1307.TimeType.MINUTE)
    setMinute = setMinute + 1
    RTC_DS1307.setTime(RTC_DS1307.TimeType.MINUTE, setMinute)
})

basic.forever(function () {
    let hour = RTC_DS1307.getTime(RTC_DS1307.TimeType.HOUR)
    let minute = RTC_DS1307.getTime(RTC_DS1307.TimeType.MINUTE)
    let second = RTC_DS1307.getTime(RTC_DS1307.TimeType.SECOND)

    let hourString = "";
    if (hour < 10){
        hourString = "0"
    }
    hourString = hourString + hour.toString()

    let minuteString = "";
    if (minute < 10){
        minuteString = "0"
    }
    minuteString = minuteString + minute.toString()

    let secondString = "";
    if (second < 10){
        secondString = "0"
    }
    secondString = secondString + second.toString()

    basic.showString(hourString + ":" + minuteString + "." + secondString +  "          ")
})

RTC_DS1307.DateTime(2020, 12, 08, 14, 28, 0)




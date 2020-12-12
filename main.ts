input.onButtonPressed(Button.A, function () {
    let setHour = RTC_DS1307.getTime(RTC_DS1307.TimeType.HOUR)
    setHour = setHour + 1
    if (setHour >= 24) {
        setHour = 0
    }
    RTC_DS1307.setTime(RTC_DS1307.TimeType.HOUR, setHour)
})

input.onButtonPressed(Button.B, function () {
    let setMinute = RTC_DS1307.getTime(RTC_DS1307.TimeType.MINUTE)
    setMinute = setMinute + 1
    if (setMinute > 60) {
        setMinute = 0
    }
    RTC_DS1307.setTime(RTC_DS1307.TimeType.MINUTE, setMinute)
})

input.onButtonPressed(Button.AB, function () {
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

    basic.showString(hourString + ":" + minuteString + "." + secondString +  " ")
})


basic.forever(function () {
    hour = RTC_DS1307.getTime(RTC_DS1307.TimeType.HOUR)
    minute = RTC_DS1307.getTime(RTC_DS1307.TimeType.MINUTE)
    second = RTC_DS1307.getTime(RTC_DS1307.TimeType.SECOND)

    let hourValue = Math.floor(1023 * hour / 24)
    let minuteValue = Math.floor(1023 * minute / 60)
    let secondValue = Math.floor(1023 * second / 60)

    pins.analogWritePin(AnalogPin.P0, secondValue)
    pins.analogWritePin(AnalogPin.P1, minuteValue)
    pins.analogWritePin(AnalogPin.P2, hourValue)
})

let hour = 0
let minute = 0
let second = 0
RTC_DS1307.DateTime(2020, 12, 08, 14, 28, 0)


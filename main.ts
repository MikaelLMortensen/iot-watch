let currentDate = { year: 1900, month: 1, day: 1, hour:0, minute:0, second:0, daylightsaving:false }
let lastTimeUpdate = currentDate

basic.showIcon(IconNames.SmallSquare)
ESP8266_IoT.initWIFI(SerialPin.P8, SerialPin.P12, BaudRate.BaudRate115200)
basic.showIcon(IconNames.Square)
ESP8266_IoT.connectWifi("", "")
basic.showIcon(IconNames.Yes)

input.onButtonPressed(Button.B, function () {
   basic.showIcon(IconNames.Heart)
   loadDate()
   basic.showIcon(IconNames.Target)
   RTC_DS1307.setTime(RTC_DS1307.TimeType.YEAR, currentDate.year)
   RTC_DS1307.setTime(RTC_DS1307.TimeType.MONTH, currentDate.month)
   RTC_DS1307.setTime(RTC_DS1307.TimeType.DAY, currentDate.day)
   RTC_DS1307.setTime(RTC_DS1307.TimeType.HOUR, currentDate.hour)
   RTC_DS1307.setTime(RTC_DS1307.TimeType.MINUTE, currentDate.minute)
   showTime()
})

input.onButtonPressed(Button.A, function () {
    // let test = '{"$id":"1","currentDateTime":"2021-01-07T06:38+01:00","utcOffset":"01:00:00","isDayLightSavingsTime":false,"dayOfTheWeek":"Thursday","timeZoneName":"Central Europe Standard Time","currentFileTime":132544751342391126,"ordinalDate":"2021-7","serviceResponse":null}';
    // setCurrentDate(test)
    showDate()
})

input.onButtonPressed(Button.AB, function () {
   RTC_DS1307.setTime(RTC_DS1307.TimeType.HOUR, 9)
   RTC_DS1307.setTime(RTC_DS1307.TimeType.MINUTE, 30)
   showTime()
})

basic.forever(function () {
    let hour = RTC_DS1307.getTime(RTC_DS1307.TimeType.HOUR)
    let minute = RTC_DS1307.getTime(RTC_DS1307.TimeType.MINUTE)
    let second = RTC_DS1307.getTime(RTC_DS1307.TimeType.SECOND)
    let day = RTC_DS1307.getTime(RTC_DS1307.TimeType.DAY)

    let hourValue = Math.floor(1023 * hour / 24)
    let minuteValue = Math.floor(1023 * minute / 60)
    let secondValue = Math.floor(1023 * second / 60)

    pins.analogWritePin(AnalogPin.P0, secondValue)
    pins.analogWritePin(AnalogPin.P1, minuteValue)
    pins.analogWritePin(AnalogPin.P2, hourValue)

    if (hour == 3 && minute > 30 && lastTimeUpdate.day != day) {
        loadDate()
        lastTimeUpdate = currentDate
    }
})

currentDate.hour = RTC_DS1307.getTime(RTC_DS1307.TimeType.HOUR)
currentDate.minute = RTC_DS1307.getTime(RTC_DS1307.TimeType.MINUTE)
currentDate.second = RTC_DS1307.getTime(RTC_DS1307.TimeType.SECOND)
if (currentDate.hour == 0 && currentDate.minute == 0){
 RTC_DS1307.DateTime(2020, 12, 08, 14, 28, 0)
}


// Show time in display:
function showTime() {
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
    basic.showString(hourString + ":" + minuteString + "." + secondString +  " ")
}

// Show time in display:
function showDate() {
    let year = RTC_DS1307.getTime(RTC_DS1307.TimeType.YEAR)
    let month = RTC_DS1307.getTime(RTC_DS1307.TimeType.MONTH)
    let day = RTC_DS1307.getTime(RTC_DS1307.TimeType.DAY)

    let dateString = year.toString() + "-";
    if (month < 10){
        dateString += "0"
    }
    dateString += month.toString() +  "-"

    if (day < 10) {
        dateString += "0"
    }
    dateString += day.toString()
    basic.showString(dateString +  " ")
}

// Handle 
// {"$id":"1","currentDateTime":"2021-01-07T06:38+01:00","utcOffset":"01:00:00","isDayLightSavingsTime":false,"dayOfTheWeek":"Thursday","timeZoneName":"Central Europe Standard Time","currentFileTime":132544751342391126,"ordinalDate":"2021-7","serviceResponse":null}
// Source: http://worldclockapi.com/api/jsonp/cet/now?callback=mycallback

function setCurrentDate(json:string) {
    let obj = JSON.parse(json);
    let cdt:string = obj.currentDateTime;
    if (cdt.indexOf('T') < 0){
        basic.showString("TIME NOT VALID  ")
        basic.showString(cdt)
        return
    } 

    let cdtArr =  cdt.split("T");
    let splitStr:string = cdtArr[0]
    let ymd = splitStr.split('-');
    currentDate.year = getNumber(ymd[0]);
    currentDate.month = getNumber(ymd[1]);
    currentDate.day = getNumber(ymd[2]);

    splitStr = cdtArr[1]
    let toArr = splitStr.split('+')
    splitStr = toArr[0]
    let hm = splitStr.split(':')

    currentDate.hour = getNumber(hm[0]);
    currentDate.minute = getNumber(hm[1]);

}

function loadDate(){

    if (ESP8266_IoT.wifiState(true)) {      
        let response = getClock()
        //basic.showString("Len:" + response.length.toString()+ "  ")
        let arr = response.split("\r")
        //basic.showString("Lines:" + arr.length.toString()+ "  ")

        let data = arr[arr.length - 1]
        let json = data.substr(data.indexOf('{'));
        json = json.substr(0, json.indexOf('}') + 1);

        if (json.indexOf("currentDateTime") > 0) {
            setCurrentDate(json);
        } else {
            basic.showString("JSON Invalid: " + json)
        }
    } else {
        basic.showString("WIFI not ready")
    }
}

function getClock(): string {
    serial.setTxBufferSize(500)
    serial.setRxBufferSize(500)
    myExecuteHttpMethod("worldclockapi.com", 80, "/api/jsonp/cet/now?callback=mycallback")     
    let response=waitResponse()

    // Close TCP connection:
    writeToSerial("AT+CIPCLOSE", 100)

    return response;
}

 // wait for certain response from ESP8266
function waitResponse(): string {
    let serial_str: string = ""
    let time: number = input.runningTime()
    while (true) {
        serial_str += serial.readString()
        if (input.runningTime() - time > 5000) {
            break
        }
    }
    return serial_str
}

function myExecuteHttpMethod(host: string, port: number, urlPath: string): void {
    let myMethod = "GET"
    // Establish TCP connection:
    let data: string = "AT+CIPSTART=\"TCP\",\"" + host + "\"," + port
    writeToSerial(data, 1000)
    data = myMethod + " " + urlPath + " HTTP/1.1" + "\u000D" + "\u000A"
        + "Host: " + host + "\u000D" + "\u000A"
    data += "\u000D" + "\u000A"
    // Send data:
    writeToSerial("AT+CIPSEND=" + (data.length + 2), 1000)
    writeToSerial(data, 0)
}


function writeToSerial(data: string, waitTime: number): void {
    serial.writeString(data + "\u000D" + "\u000A")
    if (waitTime > 0) {
        basic.pause(waitTime)
    }
}

// Removing leading zeros and return number
function getNumber(inp: string) : number {
    while(inp.length > 0 && inp[0] == '0') {
        inp = inp.substr(1)
    }

    return parseInt(inp)
}
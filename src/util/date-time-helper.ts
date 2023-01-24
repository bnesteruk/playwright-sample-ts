export default class DateTimeHelper {

    readonly date: Date
    readonly monthNames = [
        "January", "February", "March",
        "April", "May", "June",
        "July", "August", "September",
        "October", "November", "December"
    ];

    readonly dateFormatted: string
    readonly timeFormatted: string

    constructor(dateTimeString: string | Date) {
        this.date = new Date(dateTimeString)

        this.dateFormatted = this.date.toLocaleString('en-US', { year: 'numeric', month: 'numeric', day: '2-digit' })
        this.timeFormatted = this.date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    }

    year() {
        return this.date.getFullYear()
    }

    month() {
        return this.date.getMonth()
    }

    monthName() {
        return this.monthNames[this.month()]
    }

    day() {
        return this.date.getDate()
    }

    previousMonth() {
        const dateCopy = new Date(this.date.getTime())
        dateCopy.setMonth(dateCopy.getMonth() - 1)
        return new DateTimeHelper(dateCopy)
    }

    nextMonth() {
        const dateCopy = new Date(this.date.getTime())
        dateCopy.setMonth(dateCopy.getMonth() + 1)
        return new DateTimeHelper(dateCopy)
    }

    yesterday() {
        const dateCopy = new Date(this.date.getTime())
        dateCopy.setDate(dateCopy.getDate() - 1)
        return new DateTimeHelper(dateCopy)
    }

    tomorrow() {
        const dateCopy = new Date(this.date.getTime())
        dateCopy.setDate(dateCopy.getDate() + 1)
        return new DateTimeHelper(dateCopy)
    }

    hour() {
        return this.date.getHours()
    }

    amPmHour() {
        return this.date.getHours() % 12 || 12
    }

    plus({ plusYears = 0, plusMonths = 0, plusDays = 0, plusHours = 0, plusMinutes = 0 }) {
        const dateCopy = new Date(this.date.getTime())
        dateCopy.setFullYear(dateCopy.getFullYear() + plusYears)
        dateCopy.setMonth(dateCopy.getMonth() + plusMonths)
        dateCopy.setDate(dateCopy.getDate() + plusDays)
        dateCopy.setHours(dateCopy.getHours() + plusHours)
        dateCopy.setMinutes(dateCopy.getMinutes() + plusMinutes)
        return new DateTimeHelper(dateCopy)
    }

    isPm() {
        return this.hour() >= 12
    }

    minute() {
        return this.date.getMinutes()
    }

    toString() {
        return `${this.dateFormatted}, ${this.timeFormatted}`
    }
}
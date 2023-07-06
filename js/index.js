

class Calendar {
    static DAY_IN_MS = 1000 * 60 * 60 * 24

    static MONTHS = {
        'hijri': {
            'Muharrem': 30,
            'Safer': 29,
            'Rebiülevvel': 30,
            'Rebiülahır': 29,
            'Cemaziyevvel': 30,
            'Cemaziyelahır': 29,
            'Recep': 30,
            'Şaban': 29,
            'Ramazan': 30,
            'Şevval': 29,
            'Zilkade': 30,
            'Zilhicce': 29
        },
        'haab\'': {
            'Pop': 20,
            'Wo\'': 20,
            'Sip': 20,
            'Sotz\'': 20,
            'Sek': 20,
            'Xul': 20,
            'Yaxk\'in': 20,
            'Mol': 20,
            'Ch\'en': 20,
            'Yax': 20,
            'Sak\'': 20,
            'Keh': 20,
            'Mak': 20,
            'K\'ank\'in': 20,
            'Muwan': 20,
            'Pax': 20,
            'K\'ayab\'': 20,
            'Kumuk\'u': 20,
            '-': 5,
        },
        'ancient egyptian': {
            'Thoth': 30,
            'Phaophi': 30,
            'Athyr': 30,
            'Choiak': 30,
            'Tybi': 30,
            'Mechir': 30,
            'Phamenoth': 30,
            'Pharmuthi': 30,
            'Pachons': 30,
            'Payni': 30,
            'Epiphi': 30,
            'Mesore': 30,
            '-': 5
        }
    }

    static EPOCH = {
        'hijri': [1389, 10, 22],
        'haab\'': [0, 14, 3],
        'ancient egyptian': [1834, 9, 6]
    }

    static DAYS = Object.fromEntries(Object.entries(Calendar.MONTHS).map(([c, m]) => { return [c, Object.values(m)] }))
    static TOTAL_DAYS = Object.fromEntries(Object.entries(Calendar.DAYS).map(([c, m]) => { return [c, m.reduce((a, b) => a + b)] }))


    constructor(type) {
        this.time = 0
        this.daysSinceEpoch = 0
        this.type = type
        this.__date = []
        this._date = []
        this.epoch()
    }

    epoch() {
        this.date = [...Calendar.EPOCH[this.type]]
        this.formatYear()
    }

    set date(date) { this.__date = date, this._date = [date[0], date[1] - 1, date[2] - 1] }
    get date() { return this.__date }
    get dayOfYear() { return (this._date[1] > 0 ? this.days.slice(0, this._date[1]).reduce((a, b) => a + b) : 0) + this.date[2] }

    toString() {
        switch (this.type) {
            case 'haab\'': return `${this.date[2]} ${Object.keys(Calendar.MONTHS[this.type])[this._date[1]]}` 
            default: return `${this.date[2]} ${Object.keys(Calendar.MONTHS[this.type])[this._date[1]]} ${this.date[0]}` 
        }
    }

    formatYear() {
        if (this.isLeapYear) {
            switch (this.type) {
                case 'hijri': 
                    this.days = [...Calendar.DAYS[this.type]]
                    this.days[11] = 30, this.totalDays = 355
                    break
            default: break
            }
        }
        else [this.days, this.totalDays] = [Calendar.DAYS[this.type], Calendar.TOTAL_DAYS[this.type]]
    }

    get isLeapYear() {
        switch (this.type) {
            case 'hijri': return !!+'001001010010010100100100101001'[this.date[0] % 30]
            default: break
        }
    }

    addDays(_days) {
        let days = _days
        this.time += days * Calendar.DAY_IN_MS, this.daysSinceEpoch += days
        while (days > 0) {
            let month = this._date[1]
            let daysRemainsInMonth = this.days[month] - this.date[2]
            let daysRemainsInYear = this.totalDays - this.dayOfYear
            if (days > daysRemainsInYear) {
                days -= daysRemainsInYear + 1
                this.date[0] += 1, this._date[0] += 1
                this.date = [this.date[0], 1, 1]
                this.formatYear()
            }
            else if (days > daysRemainsInMonth) {
                days -= daysRemainsInMonth + 1
                this.date[2] = 1, this._date[2] = 0
                do {
                    this.date[1] += 1, this._date[1] += 1
                } while (this.days[this._date[1]] === 0)
            } else {
                this.date[2] += days
                this._date[2] += days
                break
            }
        }
    }

    setTime(time) {
        this.epoch()
        this.time = 0, this.daysSinceEpoch = 0
        let days = ~~(time / Calendar.DAY_IN_MS)
        this.addDays(days)
    }
}

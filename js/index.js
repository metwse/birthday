// LSP bugfix
if (typeof Calendar == 'undefined') Calendar = Calendar

const d = document, w = window

const template = d.querySelector('template')
const ul = d.querySelector('ul')
const birthday = new Date('2006/07/05').getTime() + Calendar.DAY_IN_MS
const now = ~~(new Date().getTime() / Calendar.DAY_IN_MS) * Calendar.DAY_IN_MS


function li(calendar) {
    const li = d.createElement('li')
    li.calendar = calendar
    li.innerHTML = template.innerHTML
    let daysLeft = '' + (calendar.daysSinceEpoch - ~~(now / Calendar.DAY_IN_MS))
    let gray = true
    if (!+daysLeft) daysLeft = 'NOW'
    else while (daysLeft.length < 3) daysLeft = '0' + daysLeft
    li.querySelector('.days').innerHTML = daysLeft.split('').map(v => { if (!!+v) gray = false; return `<span ${gray ? 'class="gray"' : ''}>${v}</span>` }).join('')
    if (daysLeft == 'NOW') li.querySelector('.title .days-left').innerText = 'Birthday in', li.querySelector('.desc .next').remove()
    li.querySelector('.title .calendar-name').innerText = calendar.type
    li.querySelector('.desc .date-calendar').innerText = calendar.toString()
    li.querySelector('.desc .date-gregorian').innerText = `(${new Date(calendar.time).toLocaleDateString(navigator.language, { year: 'numeric', month: 'long', day: 'numeric' })})`
    return [daysLeft == 'NOW' ? 0 : +daysLeft, li]
}

var g, h

var items = []
for (let type of Object.keys(Calendar.EPOCH)) {
    let calendar = new Calendar(type)
    calendar.setTime(birthday)
    if (calendar.type == 'gregorian') {
        while (calendar.gdate.getTime() < now) calendar.gdate.setYear(calendar.gdate.getFullYear() + 1)
        calendar.daysSinceEpoch = ~~(calendar.gdate.getTime() / Calendar.DAY_IN_MS)
        calendar.formatYear()
    }
    else while (calendar.time < now) calendar.addDays(calendar.totalDays)
    if (type == 'gregorian') g = calendar
    items.push(li(calendar))
}

for (let i of items.sort((a, b) => a[0] - b[0])) ul.appendChild(i[1])

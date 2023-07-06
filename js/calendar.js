// LSP bugfix
if (typeof Calendar == 'undefined') Calendar = Calendar

const d = document, w = window

const template = d.querySelector('template')
const ul = d.querySelector('ul')
const birthday = new Date('2006/07/05').getTime()
const now = new Date().getTime()



function li(calendar) {
    const li = d.createElement('li')
    li.innerHTML = template.innerHTML
    let daysLeft = '' + ~~(calendar.daysSinceEpoch - now / Calendar.DAY_IN_MS)
    let gray = true
    while (daysLeft.length < 3) daysLeft = '0' + daysLeft
    li.querySelector('.days').innerHTML = daysLeft.split('').map(v => { if (!!+v) gray = false; return `<span ${gray ? 'class="gray"' : ''}>${v}</span>` }).join('')
    li.querySelector('.title .calendar-name').innerText = calendar.type
    li.querySelector('.desc .date-calendar').innerText = calendar.toString()
    li.querySelector('.desc .date-gregorian').innerText = `(${new Date(calendar.time).toLocaleDateString(navigator.language, { year: 'numeric', month: 'long', day: 'numeric' })})`
    return [+daysLeft, li]
}


var items = []
for (let type of Object.keys(Calendar.EPOCH)) {
    let calendar = new Calendar(type)
    calendar.setTime(birthday)
    while (calendar.time < now) {
        calendar.addDays(calendar.totalDays)
    }
    items.push(li(calendar))
}

for (let i of items.sort((a, b) => a[0] - b[0])) ul.appendChild(i[1])

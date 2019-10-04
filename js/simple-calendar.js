const Calendar = function (container, option) {
    this.dayNames = ['일','월','화','수','목','금','토'];
    this.date = new Date();
    this.container;
    this.schedule;
    this._schedule;
    this.eventList = [];

    this.init(container, option);
}
Calendar.prototype.init = function(container, option) {
    this.container = document.querySelector(container);
    this.createTable();
    this.drawDate();
    
    if(option){
        if(option.schedule){
            this.schedule = option.schedule;
            this.mappingSchedule();
            this.drawSchedule();
        }
    }
    
}
Calendar.prototype.click = function(container, callback) {
    this.eventList.push({
        container: container,
        callback: callback
    });

    this.bind();
}
Calendar.prototype.bind = function() {
    this.eventList.forEach(function(event) {
        document.querySelectorAll(event.container).forEach(function(target) {
            target.onclick = function () {
                event.callback.bind(this)();
            }
        })
    });
}
Calendar.prototype.createTable = function () {
    const dayNames = this.dayNames;
    const table = document.createElement('table');
    const thead = table.createTHead();
    const tbody = table.createTBody();
    
    const row = thead.insertRow();
    for (let i=0, len=dayNames.length; i<len; i++){
        const cell = row.insertCell();
        if(i === 0) {
            cell.innerHTML = '<span class="holiday-sun">'+dayNames[i]+'</span>';
        } else if(i === 6) {
            cell.innerHTML = '<span class="holiday-sat">'+dayNames[i]+'</span>';
        } else {
            cell.innerHTML = '<span>'+dayNames[i]+'</span>';
        }
    }
    
    this.container.appendChild(table);
}
Calendar.prototype.drawDate = function() {
    const tbody = this.container.querySelector('tbody');
    tbody.innerHTML = '';
    
    const date = {
        first: new Date(this.date.getFullYear(),this.date.getMonth(),1),
        last: new Date(this.date.getFullYear(),this.date.getMonth()+1,0)
    }
    const today = new Date();

    let cnt = 1, rest = 1;
    for(let i=0; i<6; i++) {
        const row = tbody.insertRow();
        for(let j=0; j<7; j++) {
            const cell = row.insertCell();
            if(i === 0 && j<date.first.getDay()) {
                const prevMonthLastDate = new Date(this.date.getFullYear(), this.date.getMonth(),0);
                const day = (prevMonthLastDate.getDate() - date.first.getDay()) + (j+1);
                
                cell.classList.add('prevMonth');
                cell.dataset.day= day;
                cell.innerHTML = '<span>'+day+'</span>';
                continue;
            } else if (cnt <= date.last.getDate()) {
                const span = document.createElement('span');
                if(j === 0) {
                    cell.classList.add('holiday-sun');
                } else if(j === 6) {
                    cell.classList.add('holiday-sat');
                }
                if(today.getFullYear() == this.date.getFullYear()
                    && today.getMonth() == this.date.getMonth()
                    && today.getDate() == cnt) {
                    cell.classList.add('today');
                }
                cell.classList.add('currentMonth');
                cell.dataset.day= cnt;
                span.innerText = cnt++;

                cell.appendChild(span);
            } else {
                cell.classList.add('nextMonth');
                cell.dataset.day= rest;
                cell.innerHTML = '<span>'+(rest++)+'</span>';
            }
        }
    }

    this.bind();
}
Calendar.prototype.drawSchedule = function () {
    const that = this;
    const tbody = this.container.querySelector('tbody');
    const prevEle = tbody.querySelectorAll('.prevMonth');
    const currentEle = tbody.querySelectorAll('.currentMonth');
    const nextEle = tbody.querySelectorAll('.nextMonth');
    //console.log(prevEle, currentEle, nextEle);
    
    const year = this.date.getFullYear();
    const month = this.date.getMonth()+1;
    prevEle.forEach(function (prev) {
        let key = year+"-"+(month-1)+"-";
        key += prev.dataset.day;
        if(that._schedule[key]){
            prev.classList.add('schedule');
        }
    });
    currentEle.forEach(function(cur) {
        let key = year+"-"+month+"-";
        key += cur.dataset.day;
        if(that._schedule[key]){
            cur.classList.add('schedule');
        }
    });
    nextEle.forEach(function(next) {
        let key = year+"-"+(month+1)+"-";
        key += next.dataset.day;
        if(that._schedule[key]){
            next.classList.add('schedule');
        }
    });
    //
    this.bind();
}
Calendar.prototype.mappingSchedule = function() {
    let scheduleList = {};
    this.schedule.forEach(function(obj){
        const date = obj.date;
        const key = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
        if(!scheduleList[key]){
            scheduleList[key] = [];
        }
        scheduleList[key].push(obj);
    });
    
//    console.log(scheduleList);
    this._schedule = scheduleList;
}
Calendar.prototype.getSchedule = function(date){
    const getType = function (type) { 
		return Object.prototype.toString.call(type).slice(8, -1); 
    }
    
    const typeOf = getType(date);
    let key = null;
    if(!date) {
        return this.schedule;
    } else if(typeOf === 'Date') {
        key = date.getFullYear() +"-"+ (date.getMonth()+1) +"-"+ date.getDate();
    } else if(typeOf === 'Number' || typeOf === 'String') {
        key = this.date.getFullYear() +"-"+ (this.date.getMonth()+1) +"-"+ date;
    }else {
        //

    }
    return this._schedule[key];
}
Calendar.prototype.setSchedule = function(scheduleList) {
    this.schedule = scheduleList;
    this.mappingSchedule();
    this.drawDate();
    this.drawSchedule();

}
Calendar.prototype.appendSchedule = function(scheduleList) {
    const that = this;
    scheduleList.forEach(function(schedule) {
        that.schedule.push(schedule);
    });
    this.mappingSchedule();
    this.drawSchedule();
}
Calendar.prototype.getYear = function() {
    return this.date.getFullYear();
}
Calendar.prototype.getMonth = function() {
    return this.date.getMonth()+1;
}
Calendar.prototype.prev = function() {
    this.date.setMonth(this.date.getMonth()-1);
    this.drawDate();
    this.drawSchedule();
}
Calendar.prototype.next = function() {
    this.date.setMonth(this.date.getMonth()+1);
    this.drawDate();
    this.drawSchedule();
}
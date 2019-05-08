(function(){
	const root = window;
	function format(date) {
		var ret = '';
		var padding = function(num) {
			if (num <= 9) return '0' + num;
			else return num;
		};
		ret += date.getFullYear() + '-';
		ret += padding(date.getMonth() + 1) + '-';
		ret += padding(date.getDate());
		return ret;
	};
	function setDate(date) {
		date = date.split('-');
		return {
			year: date[0],
			month: date[1],
			date: date[2]
		}
	};
	class DatePicker {
		constructor({wrapper, year, month, input, limitMin = '', limitMax = ''}) {
			this.wrapper = wrapper;
			this.input = input;
			const today = new Date();
			this.year = year || today.getFullYear();
			this.month = month || today.getMonth() + 1;
			this.limitMax = setDate(limitMax); // 可选择的最小日期
			this.limitMin = setDate(limitMin); // 可选择的最大日期
			this._html = ''; // 显示的 html
			this._days = []; // 显示的所有日期
		};
		getMonthDate() {
			let firstDay = new Date(this.year, this.month - 1, 1);
			let firstDayWeekDay = firstDay.getDay();
			if (firstDayWeekDay === 0) firstDayWeekDay = 7;

			let lastDayOfLastMonth = new Date(this.year, this.month-1, 0);
			let lastDateOfLastMonth = lastDayOfLastMonth.getDate();

			let lastDay = new Date(this.year, this.month, 0);
			let lastDate = lastDay.getDate();

			let dates = [];

			this._days = [];

			for(let i = 0; i < 6*7; i++) {

				let date = i - firstDayWeekDay + 2;
				let thisMonth = this.month;
				let notSelect = false;

				if (date <= 0) {
					date = lastDateOfLastMonth + date;
					thisMonth -= 1;
					notSelect = true;
				} else if (date > lastDate) {
					date = date - lastDate;
					thisMonth += 1;
					notSelect = true;
				}

				if (thisMonth === 13) thisMonth = 1;
				if (thisMonth === 0) thisMonth = 12;

				this._days.push({
					date: date,
					month: thisMonth,
					notSelect: notSelect
				})
			};
		};
		buildUI() {
			let tableBody = '';
			this.getMonthDate();
			this._days.forEach((date, index) => {
				if (index % 7 === 0) tableBody += '<tr>';
				if (date.notSelect ||
					(date.month == this.limitMin.month && date.date < this.limitMin.date) ||
					(date.month == this.limitMax.month && date.date > this.limitMax.date) ||
					date.month < this.limitMin.month || date.month > this.limitMax.month) {
					tableBody += `<td data-date=${date.date} data-month=${date.month} class="notSelect">${date.date}</td>`
				} else {
					tableBody += `<td data-date=${date.date} data-month=${date.month} class="on">${date.date}</td>`
				}
				if(index%7 === 6) tableBody += '</tr>';
			})
			this._html = `
				<header class="datePicker-header">
					<button class="datePicker-header-btn datePicker-header-prev"><</button>
					<button class="datePicker-header-btn datePicker-header-next">></button>
					<span>${this.year}-${this.month}</span>
				</header>
				<table class="datePicker-body">
					<thead>
						<tr>
							<th>一</th>
							<th>二</th>
							<th>三</th>
							<th>四</th>
							<th>五</th>
							<th>六</th>
							<th>日</th>
						</tr>
					</thead>
					<tbody>
						${tableBody}
					</tbody>
				</table>`
		};
		render(direction) {
			if (direction === 'prev') this.month--;
			if (direction === 'next') this.month++;

			if (this.month === 13) {
				this.month = 1;
				this.year++;
			}
			if (this.month === 0) {
				this.month = 12;
				this.year--;
			}

			this.buildUI();
			this.$wrapper = document.querySelector(`.${this.wrapper}`);
			if (!this.$wrapper) {
				this.$wrapper = document.createElement('div');
				this.$wrapper.className = this.wrapper;
				document.body.appendChild(this.$wrapper);
			}
			this.$wrapper.innerHTML = this._html;
		};
		init() {
			this.render();
			const $input = document.querySelector('.' + this.input);
			let isOPen = false;
			const self = this;
			$input.addEventListener('click', function() {
				if (isOPen) {
					self.$wrapper.classList.remove('datePicker-wrapper-show');
				} else {
					self.$wrapper.classList.add('datePicker-wrapper-show');
				}
				isOPen = !isOPen;
			}, false);
			this.$wrapper.addEventListener('click', function(event) {
				const $target = event.target;
				if ($target.tagName.toLowerCase() !== 'td' || $target.classList.contains('notSelect')) return;
				const date = new Date(self.year, $target.dataset.month - 1, $target.dataset.date);
				$input.value = format(date);
				self.$wrapper.classList.remove('datePicker-wrapper-show');
				isOPen = false;
			}, false)
			this.$wrapper.addEventListener('click', function(event) {
				const $target = event.target;
				if ($target.classList.contains('datePicker-header-prev')) self.render('prev');
				else if ($target.classList.contains('datePicker-header-next')) self.render('next');
			}, false)
		};
		update(value) {
			const date = setDate(value);
			this.year = date.year || new Date().getFullYear();
			this.month = date.month || 1;
			this.init();
		};
	}
	root.DatePicker = DatePicker;
})();

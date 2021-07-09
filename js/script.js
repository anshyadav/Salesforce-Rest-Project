//test for iterating over child elements
var langArray = [];
$('#onlinestatus option').each(function () {
	var img = $(this).attr("data-thumbnail");
	var text = this.innerText;
	var value = $(this).val();
	var item = '<li><img src="' + img + '" alt="" value="' + value + '"/><span>' + text + '</span></li>';
	langArray.push(item);
})

$('#a').html(langArray);

//Set the button value to the first el of the array
$('.btn-select').html(langArray[0]);
$('.btn-select').attr('value', 'en');

//change button stuff on click
$('#a li').click(function () {
	var img = $(this).find('img').attr("src");
	var value = $(this).find('img').attr('value');
	var text = this.innerText;
	var item = '<li><img src="' + img + '" alt="" /><span>' + text + '</span></li>';
	$('.btn-select').html(item);
	$('.btn-select').attr('value', value);
	$(".b").toggle();
	//console.log(value);
});

$(".btn-select").click(function () {
	$(".b").toggle();
});


function initCalender(demo) {

	let today = new Date(),
		currentMonth = today.getMonth(),
		currentYear = today.getFullYear();

	// array dias de la semana
	const weekdays = [
		"monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
		"Sunday"
	];

	// array meses
	const months = [
		"JANUARY",
		"FEBRUARY",
		"MARCH",
		"APRIL",
		"MAY",
		"JUNE",
		"July",
		"AUGUST",
		"SEPTEMBER",
		"OCTOBER",
		"NOVEMBER",
		"DECEMBER"
	];


	// structure
	let structureCalendar = createElement("div", window.root, {
			id: "structureCalendar"
		}),

		// header
		calendarHeader = createElement("header", structureCalendar, {}),
		// header columns left center and right
		headerLeft = createElement("div", calendarHeader, {
			className: "left"
		}),
		headerCenter = createElement("div", calendarHeader, {
			className: "center"
		}),
		headerRight = createElement("div", calendarHeader, {
			className: "right"
		}),
		// inside left column
		buttonPrev = createElement("button", headerLeft, {
			textContent: "Back"
		}),
		buttonNext = createElement("button", headerLeft, {
			textContent: "Forward"
		}),
		centerTitle = createElement("h1", headerCenter, {
			textContent: months[currentMonth] + " " + currentYear
		}),

		// calendar body
		calendarBody = createElement("div", structureCalendar, {
			id: "calendar"
		}),
		weekdayBody = createElement("ul", calendarBody, {
			id: "weekdays"
		}),
		daysBody = createElement("ul", calendarBody, {
			id: "days"
		});

	// init calendar
	showCalendar(currentMonth, currentYear);

	// map week days
	weekdays.map((item, i) =>
		// change to monday
		today.getDay() - 1 == i ?
		createElement("li", weekdayBody, {
			className: "today",
			textContent: item
		}) :
		createElement("li", weekdayBody, {
			textContent: item
		}));


	// buttons next prev
	buttonPrev.onclick = () => prev();
	buttonNext.onclick = () => next();

	// generate calendar
	function showCalendar(month, year) {
		// first day - 1
		let firstDay = new Date(year, month).getDay() - 1;

		// clear preview content
		daysBody.textContent = "";

		// filing data about month and in the page via DOM.
		centerTitle.textContent = months[month] + " " + year;

		// creating all cells
		let date = 1;
		for (let i = 0; i < 6; i++) {
			//creating individual cells, filing them up with data.
			for (let j = 0; j < 7; j++) {
				if (i === 0 && j < firstDay) {
					createElement("li", daysBody, {
						textContent: ""
					});
				} else if (date > daysInMonth(month, year)) {
					break;
				} else {
					let li = createElement("li", daysBody, {}),
						info = createElement("div", li, {
							className: "info",
							textContent: weekdays[j]
						}),

						div = createElement("div", li, {
							className: "date",
							textContent: date
						});
					// ----------------------------
					// ----- view events
					if (typeof demo !== "undefined") {
						viewEvents(demo, li, [year, month, date]);
					}
					// ----------------------------
					if (
						date === today.getDate() &&
						year === today.getFullYear() &&
						month === today.getMonth()) {
						li.className = "today";
					}
					date++;
				}
			}
		}
	}
	// view events
	function viewEvents(data, where, args) {
		return (
			data &&
			data.map(item => {
				let date = item.date.split("/"),
					year = parseInt(date[0]),
					month = parseInt(date[1]) - 1,
					day = parseInt(date[2]);

				if (year === args[0] && month === args[1] && day === args[2]) {
					let event = createElement("div", where, {
							className: "ev",
							id: item.id
						}),
						eventDesc = createElement("div", event, {
							className: "ev-desc"
						});
					eventDesc.innerHTML = `<a href="${item.source}">${item.content}</a>`;
					event.onclick = () => alert(eventDesc.textContent);
				}
			}));

	}

	// next month
	function next() {
		currentMonth = (currentMonth + 1) % 12;
		currentYear = currentMonth === 11 ? currentYear + 1 : currentYear;
		showCalendar(currentMonth, currentYear);
	}
	// previus month
	function prev() {
		currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
		currentYear = currentMonth === 0 ? currentYear - 1 : currentYear;
		showCalendar(currentMonth, currentYear);
	}
	// check how many days in a month code from
	// https://dzone.com/articles/determining-number-days-month
	function daysInMonth(iMonth, iYear) {
		return 32 - new Date(iYear, iMonth, 32).getDate();
	}
	// --- Create element
	function createElement(element, where, args) {
		let d = document.createElement(element);
		if (args)
			for (const [k, v] of Object.entries(args)) d[k] = v;
		where.appendChild(d);
		return d;
	}
}
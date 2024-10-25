var _getEleById = document.getElementById.bind(document);

class DateRangePicker {

    constructor(options) {
        const today = new Date();
        this.options = options;
        this.selectedStartDate = this.formatDate(this.options.maxDate);  // Set today's date as default start date
        this.selectedEndDate = this.selectedStartDate;    // Default end date is the same as start date (today)
        this.currentMonth = today.getMonth();
        this.currentYear = today.getFullYear();
        this.previousMonth = this.currentMonth === 0 ? 11 : this.currentMonth - 1;
        this.previousMonthYear = this.currentMonth === 0 ? this.currentYear - 1 : this.currentYear;
        this.dateInput = _getEleById(this.options.dateInputId);
        this.dateFrom = _getEleById(this.options.dateFromId);
        this.dateTo = _getEleById(this.options.dateToId);
        this.dateFormat = this.options.dateFormatType.trim().toUpperCase()

        this.createDateRangePicker(); // Create the date range picker UI
        this.setDateRangeHandler(this.dateInput, this.dateFrom, this.dateTo) // Set the date range handler
        this.dateRangeContainer = _getEleById('dateRangePicker');


        // Hide the date picker if clicked outside both input and container
        document.addEventListener('click', (event) => {
            if (!this.dateRangeContainer.contains(event.target) && !this.dateInput.contains(event.target)) {
                this.hideDatePicker();
            }
        });

        // Prevent hiding when clicking inside the container or input field
        this.dateRangeContainer.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    }

    /**
     * Create the HTML structure and inject CSS for the date range picker.
     */
    createDateRangePicker() {
        const styles = `
            .date-range-picker-container {
                font-family: sans-serif;
                position: absolute;
                width: 600px;
                background-color: white;
                border: 1px solid #ccc;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                padding: 10px;
                display: none;
                z-index: 1000;
                transition: opacity 0.3s ease;
            }
    
            .date-range-picker-container.show {
                display: block;
                opacity: 1;
            }
    
            .date-range-picker-container.hide {
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .date-select-picker, date-select-picker:focus-visible{
                outline: none;
                padding: 2px 0px;
                border: 1px solid #b1b1b1;
                border-radius: 5px;
            }
    
            .date-range-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
    
            .date-range-body {
                display: flex;
                justify-content: space-between;
            }
    
            .calendar {
                width: 280px;
            }
    
            .calendar table {
                width: 100%;
                text-align: center;
            }
    
            .calendar th,
            .calendar td {
                padding: 5px;
            }
    
            .calendar .selected {
                background-color: #007bff;
                color: white;
            }
    
            .date-range-footer {
                display: flex;
                justify-content: space-between;
                margin-top: 10px;
                align-items: center;
            }
            .date-range-footer .errorMsg {
                color: red;
                font-size: 14px
            }
    
            .date-range-footer button {
                padding: 5px 15px;
                margin-left: 10px;
                cursor: pointer;
                border: 1px solid #050849;
                border-radius: 5px;
            }
    
            #applyDateRange {
                color: #fff;
                background-color: #014187;
            }
    
            .day.selected {
                background-color: #007bff;
                color: white;
            }
    
            .day.range {
                background-color: #d1e7fd;
            }
    
            .day.rounded-left {
                border-top-left-radius: 20%;
                border-bottom-left-radius: 20%;
            }
    
            .day.rounded-right {
                border-top-right-radius: 20%;
                border-bottom-right-radius: 20%;
            }
    
            .day.prev-month,
            .day.next-month {
                color: lightgray;
            }
    
            .hover-range {
                background-color: #e0eaff;
            }
    
            .prevMonth,
            .nextMonth {
                border: none;
                background: #d4ebff;
                border-radius: 6px;
            }
    
            .today {
                background-color: #ffeb3b;
                border-top-right-radius: 20%;
                border-bottom-right-radius: 20%;
                font-weight: bold;
            }
    
            .disabled {
                color: #d3d3d3;
                pointer-events: none;
                cursor: not-allowed;
            }
        `;

        // Append dynamic styles to the document
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);

        // Create the date range picker HTML
        const datePickerHTML = `
        <div id="dateRangePicker" class="date-range-picker-container">
            <div class="date-range-header">
                <button id="prevMonth" class="prevMonth">&#11164</button>
                <div id="dateHeader">
                <!-- Month dropdowns for left and right calendars -->
                <select id="leftMonthSelect" class="month-select date-select-picker">
                    ${this.generateMonthOptions(this.previousMonth)}
                </select>
                <select id="leftYearSelect" class="year-select date-select-picker">
                    ${this.generateYearOptions(this.previousMonthYear)}
                </select>
                -
                <select id="rightMonthSelect" class="month-select date-select-picker">
                    ${this.generateMonthOptions(this.currentMonth)}
                </select>
                <select id="rightYearSelect" class="year-select date-select-picker">
                    ${this.generateYearOptions(this.currentYear)}
                </select>
                </div>
                <button id="nextMonth" class="nextMonth">&#11166;</button>
            </div>
            <div class="date-range-body">
                <div class="calendar" id="leftCalendar"></div>
                <div class="calendar" id="rightCalendar"></div>
            </div>
            <div class="date-range-footer">
                <span class="errorMsg" id="errorMsg"></span>
                <div>
                    <button id="applyDateRange">Apply</button>
                    <button id="cancelDateRange">Cancel</button>
                </div>
            </div>
        </div>
    `;



        // Find the input element and append the picker to the same container
        const inputParent = this.dateInput.parentElement;
        inputParent.insertAdjacentHTML('beforeend', datePickerHTML);

        // Render both calendars and attach event handlers
        this.renderCalendars();
        this.attachEventHandlers();
    }

    /**
     * Attach event handlers for buttons and input field.
     */
    attachEventHandlers() {
        _getEleById('prevMonth').addEventListener('click', () => this.changeMonth(-1)); // Change to the previous month
        _getEleById('nextMonth').addEventListener('click', () => this.changeMonth(1)); // Change to the next month
        _getEleById('applyDateRange').addEventListener('click', () => this.applyDateRange(this.dateInput, dateFrom, dateTo)); // Apply selected date range
        _getEleById('cancelDateRange').addEventListener('click', () => this.hideDatePicker()); // Cancel and hide date picker
        this.dateInput.addEventListener('click', () => this.openDatePicker()); // Open date picker on input click
    };

    // JavaScript to generate options dynamically
    generateMonthOptions(selectedMonth) {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return months.map((month, index) =>
            `<option value="${index}" ${index === selectedMonth ? 'selected' : ''}>${month}</option>`
        ).join('');
    }

    generateYearOptions(selectedYear) {
        const currentYear = new Date().getFullYear();
        const minDate = this.formatDate(this.options.minDate);
        const [day, month, year] = minDate.split('-').map(Number); // Split date string and convert to numbers
        const startYear = year; // Starting year can be adjusted based on requirements
        const endYear = currentYear;
        let options = '';
        for (let year = startYear; year <= endYear; year++) {
            options += `<option value="${year}" ${year === selectedYear ? 'selected' : ''}>${year}</option>`;
        }
        return options;
    }

    /**
     * Render the left (previous month) and right (current month) calendars with dropdowns.
     */
    renderCalendars() {
        // Render left and right calendars based on selected months and years
        this.renderCalendar('leftCalendar', this.previousMonthYear, this.previousMonth);
        this.renderCalendar('rightCalendar', this.currentYear, this.currentMonth);

        // Update the dropdowns for left month and year
        const leftMonthSelect = _getEleById('leftMonthSelect');
        leftMonthSelect.innerHTML = this.generateMonthOptions(this.previousMonth);
        leftMonthSelect.value = this.previousMonth;

        const leftYearSelect = _getEleById('leftYearSelect');
        leftYearSelect.innerHTML = this.generateYearOptions(this.previousMonthYear);
        leftYearSelect.value = this.previousMonthYear;

        // Update the dropdowns for right month and year
        const rightMonthSelect = _getEleById('rightMonthSelect');
        rightMonthSelect.innerHTML = this.generateMonthOptions(this.currentMonth);
        rightMonthSelect.value = this.currentMonth;

        const rightYearSelect = _getEleById('rightYearSelect');
        rightYearSelect.innerHTML = this.generateYearOptions(this.currentYear);
        rightYearSelect.value = this.currentYear;

        // Add event listeners to dropdowns to update calendar on change
        leftMonthSelect.addEventListener('change', (e) => {
            this.previousMonth = parseInt(e.target.value, 10);
            this.renderCalendars(); // Re-render calendars with updated month
        });

        leftYearSelect.addEventListener('change', (e) => {
            this.previousMonthYear = parseInt(e.target.value, 10);
            this.renderCalendars(); // Re-render calendars with updated year
        });

        rightMonthSelect.addEventListener('change', (e) => {
            this.currentMonth = parseInt(e.target.value, 10);
            this.renderCalendars(); // Re-render calendars with updated month
        });

        rightYearSelect.addEventListener('change', (e) => {
            this.currentYear = parseInt(e.target.value, 10);
            this.renderCalendars(); // Re-render calendars with updated year
        });
    }


    /**
     * @param {Date} date - The date object to format.
     * @return {string} - The formatted date string.
     */
    formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0'); // Get day with leading zero
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month with leading zero
        const year = date.getFullYear(); // Get full year

        return `${day}-${month}-${year}`;  // Default format
    };

    /**
     * Formats a date object to a string based on the provided format.
     * @param {Date} date - The date object to format.
     * @return {string} - The formatted date string.
     */
    dateFormatType(date) {
        const day = String(date.getDate()).padStart(2, '0'); // Get day with leading zero
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month with leading zero
        const year = date.getFullYear(); // Get full year

        // Format date based on the specified format type
        switch (this.dateFormat) {
            case 'MM-DD-YYYY': return `${month}-${day}-${year}`;
            case 'YYYY-MM-DD': return `${year}-${month}-${day}`;
            case 'DD/MM/YYYY': return `${day}/${month}/${year}`;
            case 'YYYY/MM/DD': return `${year}/${month}/${day}`;
            case 'MM/DD/YYYY': return `${month}/${day}/${year}`;
            case 'DD-MM-YYYY': return `${day}-${month}-${year}`;
            case 'DD.MM.YYYY': return `${day}.${month}.${year}`;
            case 'MM.DD.YYYY': return `${month}.${day}.${year}`;
            case 'YYYY.MM.DD': return `${year}.${month}.${day}`;
            case 'YY-MM-DD': return `${year.toString().slice(-2)}-${month}-${day}`;
            case 'MM-DD-YY': return `${month}-${day}-${year.toString().slice(-2)}`;
            case 'DD-MM-YY': return `${day}-${month}-${year.toString().slice(-2)}`;
            case 'DD-MMM-YYYY': return `${day}-${this.getMonthName(month - 1)}-${year}`;
            case 'MMM-DD-YYYY': return `${this.getMonthName(month - 1)}-${day}-${year}`;
            case 'YYYY-MMM-DD': return `${year}-${this.getMonthName(month - 1)}-${day}`;
            default: return `${day}-${month}-${year}`; // Fallback default format
        }
    };

    /**
     * Parses a date string into a Date object.
     * @param {string} dateString - The date string to parse.
     * @return {Date} - The parsed Date object.
     */
    parseDate(dateString) {
        const [day, month, year] = dateString.split('-').map(Number); // Split date string and convert to numbers

        return new Date(year, month - 1, day); // Create Date object
    };

    /**
     * Render a calendar for a given month and year in a specified container.
     * @param {string} calendarId - The ID of the container to render the calendar.
     * @param {number} year - The year to render.
     * @param {number} month - The month (0-indexed) to render.
     */
    renderCalendar(calendarId, year, month) {
        const calendar = _getEleById(calendarId);
        const today = new Date();
        const maxDate = this.options.maxDate;
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();

        let calendarHTML = '<table><thead><tr>';
        ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].forEach(day => {
            calendarHTML += `<th>${day}</th>`;
        });
        calendarHTML += '</tr></thead><tbody><tr>';

        const prevMonthDays = this.getPreviousMonthDays(firstDay, month, year);
        calendarHTML += prevMonthDays;

        for (let day = 1; day <= daysInMonth; day++) {
            const fullDate = new Date(year, month, day);
            const formattedDate = this.formatDate(fullDate);
            let dayClass = '';

            if (fullDate.toDateString() === today.toDateString()) {
                dayClass = 'today';  // Highlight today's date
            }

            if (fullDate > maxDate) {
                dayClass += ' disabled';  // Disable future dates
            }

            if (this.selectedStartDate && formattedDate === this.selectedStartDate) {
                dayClass += ' selected rounded-left';
            }
            if (this.selectedEndDate && formattedDate === this.selectedEndDate) {
                dayClass += ' selected rounded-right';
            }

            // Highlight dates within the range
            if (this.selectedStartDate && this.selectedEndDate) {
                const currentDate = this.parseDate(formattedDate);
                const startDate = this.parseDate(this.selectedStartDate);
                const endDate = this.parseDate(this.selectedEndDate);

                if (currentDate > startDate && currentDate < endDate) {
                    dayClass += ' range';
                }
            }

            calendarHTML += `<td class="day ${dayClass}" data-date="${formattedDate}">${day}</td>`;
            if ((day + firstDay) % 7 === 0 && day !== daysInMonth) {
                calendarHTML += '</tr><tr>';
            }
        }

        // Next Month Days
        const remainingCells = 7 - ((daysInMonth + firstDay) % 7);
        if (remainingCells < 7) {
            const nextMonthDays = this.getNextMonthDays(remainingCells, month, year);
            calendarHTML += nextMonthDays;
        }

        calendarHTML += '</tr></tbody></table>';
        calendar.innerHTML = calendarHTML;

        this.addDayClickEvent(calendarId);  // Add event handlers
    };

    /**
     * Get the days from the previous month to display in the current month's calendar.
     * @param {number} firstDay - The first day of the current month.
     * @param {number} month - The current month (0-indexed).
     * @param {number} year - The current year.
     * @return {string} - The HTML string for the previous month's days.
     */
    getPreviousMonthDays(firstDay, month, year) {
        const prevMonth = month === 0 ? 11 : month - 1;
        const prevMonthYear = month === 0 ? year - 1 : year;
        const daysInPrevMonth = new Date(prevMonthYear, prevMonth + 1, 0).getDate();

        let prevMonthHTML = '';
        for (let i = firstDay - 1; i >= 0; i--) {
            prevMonthHTML += `<td class="day prev-month" data-date="${this.formatDate(new Date(prevMonthYear, prevMonth, daysInPrevMonth - i))}">${daysInPrevMonth - i}</td>`;
        }
        return prevMonthHTML;
    };

    /**
     * Get the days from the previous month to display in the current month's calendar.
     * @param {number} remainingCells - The remainingCells day of the next month.
     * @param {number} month - The current month (0-indexed).
     * @param {number} year - The current year.
     * @return {string} - The HTML string for the previous month's days.
     */
    getNextMonthDays(remainingCells, month, year) {
        const nextMonth = month === 11 ? 0 : month + 1;
        const nextMonthYear = month === 11 ? year + 1 : year;

        let nextMonthHTML = '';
        for (let day = 1; day <= remainingCells; day++) {
            nextMonthHTML += `<td class="day next-month" data-date="${this.formatDate(new Date(nextMonthYear, nextMonth, day))}">${day}</td>`;
        }
        return nextMonthHTML;
    }

    /**
     * Attach click event listeners for days in the calendar.
     * @param {string} calendarId - The ID of the calendar to attach the event.
     */
    addDayClickEvent(calendarId) {
        const days = document.querySelectorAll(`#${calendarId} .day`);
        days.forEach(day => {
            const selectedDate = this.parseDate(day.dataset.date);
            const minDate = this.options.minDate;
            const maxDate = this.options.maxDate;

            // Disable days outside the min/max date range
            if (selectedDate < minDate || selectedDate > maxDate) {
                day.classList.add('disabled');  // Add 'disabled' class to mark as unselectable
                return; // Skip adding click event for these days
            };

            day.addEventListener('click', (e) => {
                const selectedDate = e.target.dataset.date;

                // Reset the selection if both start and end are already selected
                if (!this.selectedStartDate || (this.selectedStartDate && this.selectedEndDate)) {
                    this.selectedStartDate = selectedDate;
                    this.selectedEndDate = null;  // Reset the end date when a new start date is chosen

                } else if (!this.selectedEndDate) {
                    if (this.parseDate(selectedDate) >= this.parseDate(this.selectedStartDate)) {
                        this.selectedEndDate = selectedDate; // If selecting the end date, ensure it's after or on the start date
                    } else {
                        this.selectedStartDate = selectedDate;
                        this.selectedEndDate = null;  // Reset the end date when a new start date is chosen
                    }

                } else if (selectedDate < this.selectedStartDate) {

                    // If user selects a date earlier than the start date, reassign it as the start
                    this.selectedStartDate = selectedDate;
                };
                this.renderCalendars();  // Re-render the calendar with the selected range
            });

            // Hover effect for range selection
            day.addEventListener('mouseover', (e) => {
                if (this.selectedStartDate && !this.selectedEndDate) {
                    const hoveredDate = this.parseDate(e.target.dataset.date);
                    const startDate = this.parseDate(this.selectedStartDate);

                    if (hoveredDate >= startDate) {
                        this.addDayHoverEffect(this.formatDate(hoveredDate));
                    };
                };
            });

            day.addEventListener('mouseout', () => {
                this.removeDayHoverEffect();
            });
        });
    };

    addDayHoverEffect(hoveredDate) {
        const allDays = document.querySelectorAll('.day');
        allDays.forEach(day => {
            const startDate = this.parseDate(this.selectedStartDate);
            const dayDate = this.parseDate(day.dataset.date);
            const parseHoveredDate = this.parseDate(hoveredDate);
            if (dayDate >= startDate && dayDate <= parseHoveredDate) {
                day.classList.add('hover-range');
            };
        });
    };

    removeDayHoverEffect() {
        const allDays = document.querySelectorAll('.day');
        allDays.forEach(day => {
            day.classList.remove('hover-range');
        });
    };

    /**
     * Changes the current month displayed in the calendars.
     * @param {number} step - The number of months to change (positive or negative).
     */
    changeMonth(step) {
        const newMonth = this.currentMonth + step;
        const newYear = this.currentYear + (newMonth < 0 ? -1 : (newMonth > 11 ? 1 : 0));
        const adjustedMonth = (newMonth + 12) % 12; // Keep months in 0-11 range

        const newDate = new Date(newYear, adjustedMonth);
        const minDate = new Date(this.options.minDate.getFullYear(), this.options.minDate.getMonth());
        const maxDate = new Date(this.options.maxDate.getFullYear(), this.options.maxDate.getMonth());

        if (newDate >= minDate && newDate <= maxDate) {
            this.currentMonth = adjustedMonth;
            this.currentYear = newYear;
            this.previousMonth = this.currentMonth === 0 ? 11 : this.currentMonth - 1;
            this.previousMonthYear = this.currentMonth === 0 ? this.currentYear - 1 : this.currentYear;
            this.renderCalendars();  // Re-render calendars with updated month
        };

        // Disable buttons if limits are reached
        _getEleById('prevMonth').disabled = newDate <= minDate;
        _getEleById('nextMonth').disabled = newDate >= maxDate;
    };

    /**
    * Gets the month name for a given month.
    * @param {number} month - The month (0-11).
    * @return {string} - The name of the month.
    */
    getMonthName(month) {
        // Return month name based on month
        return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][month];
    };

    /**
     * Handles the date range selection and updates the input fields.
     * @param {HTMLElement} dateInput - The main input element for the date range.
     * @param {HTMLElement} dateFrom - The input element for the start date.
     * @param {HTMLElement} dateTo - The input element for the end date.
     */
    setDateRangeHandler(dateInput, dateFrom, dateTo) {
        const startDate = this.parseDate(this.selectedStartDate);
        const endDate = this.selectedEndDate ? this.parseDate(this.selectedEndDate) : startDate;
        const diffInTime = endDate - startDate;
        const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24)) + 1; // Convert milliseconds to days
        const errorMsg = _getEleById('errorMsg');
        errorMsg.innerHTML = '' // Default stage clear error message

        // Check if the range exceeds maxDays
        if (this.options.maxDays && diffInDays > this.options.maxDays) {
            // Throw error message or handle it appropriately
            errorMsg.innerHTML = `The selected range exceeds the maximum of ${this.options.maxDays} days.`;
            return false;
        }

        // Update the input fields with the selected dates
        dateInput && (dateInput.value = `${this.dateFormatType(startDate)} - ${this.dateFormatType(endDate)}`);
        dateFrom && (dateFrom.value = this.dateFormatType(startDate));
        dateTo && (dateTo.value = this.dateFormatType(endDate));

        return true;
    };

    /**
     * Applies the selected date range to the input fields.
     * @param {HTMLElement} dateInput - The main input element for the date range.
     * @param {HTMLElement} dateFrom - The input element for the start date.
     * @param {HTMLElement} dateTo - The input element for the end date.
     */
    applyDateRange(dateInput, dateFrom, dateTo) {
        // Logic to apply selected date range goes here
        this.setDateRangeHandler(dateInput, dateFrom, dateTo)
        if (this.setDateRangeHandler(dateInput, dateFrom, dateTo)) {
            this.hideDatePicker(); // Hide the date picker after applying
        }
    };

    /**
     * Hides the date range picker.
     */
    hideDatePicker() {
        this.dateRangeContainer.classList.remove('show');
        this.dateRangeContainer.classList.add('hide');  // Hide date range picker
        setTimeout(() => this.dateRangeContainer.style.display = 'none', 300);  // Wait for the fade-out effect
    };

    /**
     * Open the date range picker.
     */
    openDatePicker() {
        this.dateRangeContainer.style.display = 'block';
        this.dateRangeContainer.classList.remove('hide');
        this.dateRangeContainer.classList.add('show'); // Show date range picker
        this.renderCalendars();
        this.changeMonth(0);
    };
}


// Initialize the date range picker
const datePickerOptions = {
    dateFormatType: 'DD-MM-YYYY', // Specifies the format in which the date should be displayed.
    minDate: new Date(2018, 0, 1), // Sets the minimum selectable date (January 1, 2018, in this case).
    maxDate: new Date(), // Sets the maximum selectable date to today.
    maxDays: '31', // Restricts the maximum number of days that can be selected in the range (changed to a number).
    dateInputId: 'dateRangeInput', // The ID of the input field where the selected date range will be displayed.
    dateFromId: 'dateFrom', // The ID for the start date input (Optional) if you want put value in dateFrom.
    dateToId: 'dateTo', // The ID for the end date input (Optional) if you want put value in dateTo.
};

const datepicker = new DateRangePicker(datePickerOptions);

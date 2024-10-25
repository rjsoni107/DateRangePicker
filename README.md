# DateRangePicker

A customizable date range picker built in vanilla JavaScript, allowing users to select a date range with ease. This library provides a simple and flexible way to integrate a date range selection feature into your web applications.

## Features

- User-friendly interface for selecting start and end dates.
- Customizable date formats.
- Handles date ranges with minimum and maximum date restrictions.
- Displays calendars for the current and previous month.
- Handles hover effects for range selection.
- Support for disabling dates beyond a specified maximum range.

## Installation

To use the DateRangePicker library, simply include the JavaScript file in your HTML:

```html
<script src="path/to/DateRangePicker.js"></script>
```

## Usage
### Initialization
You can initialize the DateRangePicker by providing an options object. Here's a basic example:  

```JavaScript
// Initialize the date range picker
    const datePickerOptions = {
        dateFormatType: 'DD-MM-YYYY', // Specifies the format in which the date should be displayed.
        minDate: new Date(2018, 0, 1), // Sets the minimum selectable date (January 1, 2018, in this case).
        maxDate: new Date(), // Sets the maximum selectable date to today.
        maxDays: '30', // Restricts the maximum number of days that can be selected in the range (changed to a number).
        dateInputId: 'dateRangeInput', // The ID of the input field where the selected date range will be displayed.
        dateFromId: 'dateFrom', // The ID for the start date input (Optional) if you want put value in dateFrom.
        dateToId: 'dateTo', // The ID for the end date input (Optional) if you want put value in dateTo.
    };

    const datepicker = new DateRangePicker(datePickerOptions);
```

## HTML Structure
Ensure your HTML includes the necessary input fields for the date range selection:
```html
<input type="text" id="dateRangeInput" placeholder="Select date range">
<input type="text" id="dateFrom" placeholder="Start date" readonly>
<input type="text" id="dateTo" placeholder="End date" readonly>
```

## Customization
You can customize the following options:

* **dateFormatType**: Choose from various formats like DD-MM-YYYY, MM-DD-YYYY, etc.
* **minDate**: Set the earliest date that can be selected.
* **maxDate**: Set the latest date that can be selected.
* **maxDays**: Limit the maximum number of days that can be selected in a range.
* **dateInputId, dateFromId, dateToId**: Specify the IDs of the input elements to be updated with the selected date range.

## Example
Here’s a complete example of how to integrate the DateRangePicker into your application:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Date Range Picker</title>
</head>
<body>

    <input type="text" id="dateRangeInput" placeholder="Select date range">
    <input type="text" id="dateFrom" placeholder="Start date" readonly>
    <input type="text" id="dateTo" placeholder="End date" readonly>

    <script src="path/to/DateRangePicker.js"></script>
    <script>
        // Initialize the date range picker
      const datePickerOptions = {
          dateFormatType: 'DD-MM-YYYY', // Specifies the format in which the date should be displayed.
          minDate: new Date(2018, 0, 1), // Sets the minimum selectable date (January 1, 2018, in this case).
          maxDate: new Date(), // Sets the maximum selectable date to today.
          maxDays: '30', // Restricts the maximum number of days that can be selected in the range (changed to a number).
          dateInputId: 'dateRangeInput', // The ID of the input field where the selected date range will be displayed.
          dateFromId: 'dateFrom', // The ID for the start date input (Optional) if you want put value in dateFrom.
          dateToId: 'dateTo', // The ID for the end date input (Optional) if you want put value in dateTo.
      };
  
      const datepicker = new DateRangePicker(datePickerOptions);
    </script>
</body>
</html>
```

## Contributing
Contributions are welcome! Feel free to open issues or submit pull requests to enhance the functionality of the DateRangePicker.

## Acknowledgments
Thanks to the open-source community for providing inspiration and resources that made this project possible.

Feel free to modify any sections to better fit your library's specifics or your personal style!

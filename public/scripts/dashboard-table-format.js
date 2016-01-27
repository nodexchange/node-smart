/**
 * Created by martinwojtala on 04/06/15.
 */

function detailFormatter(index, row) {
  var html = [];
  $.each(row, function (key, value) {
    if(key.indexOf('priceChart') > -1) {
      // CHART IN HERE?
    } else {
      html.push('<p><b>' + key + ':</b> ' + value + '</p>');
    }
  });
  return html.join('');
}


function dateFormater(data) {
  var date = new Date(data);
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];
  var day = date.getDate();
  var monthIndex = date.getMonth();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var dateFormatted = hours + ':'+ minutes + ' - ' + day + ' ' + monthNames[monthIndex];
  return dateFormatted;
}

function roundCash(data) {
  return Math.round(data*100)/100;
}
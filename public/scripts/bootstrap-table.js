var $table = $('#table'),
  $remove = $('#remove'),
  selections = [];



function getIdSelections() {
  return $.map($table.bootstrapTable('getSelections'), function(row) {
    return row.id
  });
}

function detailFormatter(index, row) {
  var html = [];
  $.each(row, function(key, value) {
    html.push('<p><b>' + key + ':</b> ' + value + '</p>');
  });
  return html.join('');
}

function operateFormatter(value, row, index) {
  return [
    '<a class="like" href="javascript:void(0)" title="Like">',
    '<i class="glyphicon glyphicon-heart"></i>',
    '</a>  ',
    '<a class="remove" href="javascript:void(0)" title="Remove">',
    '<i class="glyphicon glyphicon-remove"></i>',
    '</a>'
  ].join('');
}

window.operateEvents = {
  'click .like': function(e, value, row, index) {
    alert('You click like action, row: ' + JSON.stringify(row));
  },
  'click .remove': function(e, value, row, index) {
    $table.bootstrapTable('remove', {
      field: 'id',
      values: [row.id]
    });
  }
};

function totalTextFormatter(data) {
  return 'Total';
}

function totalNameFormatter(data) {
  return data.length;
}

function totalPriceFormatter(data) {
  var total = 0;
  $.each(data, function(i, row) {
    total += +(row.price.substring(1));
  });
  return '$' + total;
}

function getHeight() {
  return $(window).height() - $('h1').outerHeight(true);
}

$(function() {
  var scripts = [
      location.search.substring(1) || 'vendor/bootstrap-table/bootstrap-table.js',
      'vendor/bootstrap-table/bootstrap-table-export/bootstrap-table-export.js',
      'vendor/bootstrap-table/bootstrap-table-export/tableExport.js',
      'vendor/bootstrap-table/bootstrap-table-export/bootstrap-table-editable.js',
      'vendor/bootstrap-table/bootstrap-table-export/bootstrap-editable.js'
    ],
    eachSeries = function(arr, iterator, callback) {
      callback = callback || function() {};
      if (!arr.length) {
        return callback();
      }
      var completed = 0;
      var iterate = function() {
        iterator(arr[completed], function(err) {
          if (err) {
            callback(err);
            callback = function() {};
          } else {
            completed += 1;
            if (completed >= arr.length) {
              callback(null);
            } else {
              iterate();
            }
          }
        });
      };
      iterate();
    };

  eachSeries(scripts, getScript, initTable);
});

function getScript(url, callback) {
  var head = document.getElementsByTagName('head')[0];
  var script = document.createElement('script');
  script.src = url;

  var done = false;
  // Attach handlers for all browsers
  script.onload = script.onreadystatechange = function() {
    if (!done && (!this.readyState ||
        this.readyState == 'loaded' || this.readyState == 'complete')) {
      done = true;
      if (callback)
        callback();

      // Handle memory leak in IE
      script.onload = script.onreadystatechange = null;
    }
  };

  head.appendChild(script);

  // We handle everything using the script element injection
  return undefined;
}

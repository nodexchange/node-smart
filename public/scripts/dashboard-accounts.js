function initTable() {
  $table.bootstrapTable({
    height: getHeight(),
    columns: [
      [/*{
        field: 'state',
        checkbox: true,
        rowspan: 2,
        align: 'center',
        valign: 'middle'
      }, */{
        title: '_id',
        field: '_id',
        rowspan: 2,
        align: 'center',
        valign: 'middle',
        sortable: true,
        footerFormatter: totalTextFormatter
      }],
      [{
        field: 'username',
        title: 'username',
        sortable: true,
        editable: true,
        footerFormatter: totalNameFormatter,
        align: 'center'
      }, {
        field: '__v',
        title: '__v',
        sortable: true,
        align: 'center',
        editable: {
          type: 'text',
          title: 'Item Price',
          validate: function(value) {
            value = $.trim(value);
            if (!value) {
              return 'This field is required';
            }
            if (!/^$/.test(value)) {
              return 'This field needs to start width $.'
            }
            var data = $table.bootstrapTable('getData'),
              index = $(this).parents('tr').data('index');
            console.log(data[index]);
            return '';
          }
        },
        footerFormatter: totalPriceFormatter
      }]
    ]
  });

  // sometimes footer render error.
  setTimeout(function() {
    $table.bootstrapTable('resetView');
  }, 200);
  $table.on('check.bs.table uncheck.bs.table ' +
    'check-all.bs.table uncheck-all.bs.table',
    function() {
      $remove.prop('disabled', !$table.bootstrapTable('getSelections').length);

      // save your data, here just save the current page
      selections = getIdSelections();
      // push or splice the selections if you want to save all data selections
    });
  $table.on('expand-row.bs.table', function(e, index, row, $detail) {
    if (index % 2 == 1) {
      $detail.html('Loading from ajax request...');
      $.get('LICENSE', function(res) {
        $detail.html(res.replace(/\n/g, '<br>'));
      });
    }
  });
  $table.on('all.bs.table', function(e, name, args) {
    console.log(name, args);
  });
  $remove.click(function() {
    var ids = getIdSelections();
    $table.bootstrapTable('remove', {
      field: 'id',
      values: ids
    });
    $remove.prop('disabled', true);
  });
  $(window).resize(function() {
    $table.bootstrapTable('resetView', {
      height: getHeight()
    });
  });
}

function responseHandler(res) {
  $.each(res, function(i, row) {
    console.log(row.__v);
    row.state = $.inArray(row.__v, selections) !== -1;
  });
  console.log(res);
  return res;
}

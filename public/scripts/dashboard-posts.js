function initTable() {
  $table.bootstrapTable({
    height: getHeight(),
    columns: [
      [{
        field: 'state',
        checkbox: true,
        rowspan: 2,
        align: 'center',
        valign: 'middle'
      }, {
        title: 'Account ID',
        field: 'id',
        rowspan: 2,
        align: 'center',
        valign: 'middle',
        sortable: true,
        footerFormatter: totalTextFormatter
      }, {
        title: 'Account Detail',
        colspan: 3,
        align: 'center'
      }],
      [{
        field: 'username',
        title: 'Account Name',
        sortable: true,
        editable: true,
        footerFormatter: totalNameFormatter,
        align: 'center'
      }, {
        field: '_id',
        title: 'Account HASH',
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
      }, {
        field: 'operate',
        title: 'Item Operate',
        align: 'center',
        events: operateEvents,
        formatter: operateFormatter
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
  /*$table.on('expand-row.bs.table', function(e, index, row, $detail) {
    if (index % 2 == 1) {
      $detail.html('Loading from ajax request...');
      $.get('LICENSE', function(res) {
        $detail.html(res.replace(/\n/g, '<br>'));
      });
    }
  });
  */
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
  $.each(res.rows, function(i, row) {
    row.state = $.inArray(row.__v, selections) !== -1;
    row.id = i;
  });
  console.log(res);
  return res;
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
    ajaxPost(row, 'remove');
  }
};
function ajaxPost(row, action) {
  var data = {
    id: row._id,
    action: action
  };
  $.ajax({
    url: "/api/post/dashboard-accounts",
    type: "POST",
    data: data,
    success: function(data, textStatus, jqXHR) {
      console.log(data);
      //data - response from server
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(data);
    }
  });
}

console.log(' HERE > '+$('#my-ajax-table'));
$('#my-ajax-table').dynatable({
  dataset: {
    ajax: true,
    ajaxUrl: '/api/data/dashboard-accounts',
    ajaxOnLoad: true,
    records: []
  }
});

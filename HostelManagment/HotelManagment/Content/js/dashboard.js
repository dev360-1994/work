(function ($) {
    'use strict';
    $(function () {
        $('#example').DataTable();
        $('.dataTable').DataTable();
        $('.select2').select2({
            closeOnSelect: false,
            placeholder: "Select..."
        });

    });
})(jQuery);


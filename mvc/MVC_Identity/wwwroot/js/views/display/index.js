var popup, dataTable;

$(document).ready(function () {
    $.ajax({
        url: "/api/UserManager",
        type: "GET",
        dataType: "json",
        success: function (data) {
            // Check the response here
            if (data) {
                // Data is available, initialize the DataTable
                InitializeDataTable(data);
            } else {
                // Handle the case where the response is empty or not as expected
                console.error("Empty or unexpected response from the API.");
            }
        },
        error: function () {
            // Handle AJAX error, e.g., show an error message
            console.error("Error occurred while fetching data from the API.");
        }
    });

});

function InitializeDataTable(data) {
    dataTable = $('#user_grid').DataTable({
        data: data, // Use the data received from the API
        columns: [
            { data: "name" },
            { data: "userName" },
            { data: "email" },
            { data: "phoneNumber" },
            {
                data: "id",
                render: function (data) {
                    return "<a class='btn btn-default btn-sm' onclick='ShowPopup(\"/Admin/AddEditUser/" + data + "\")'><i class='fa fa-pencil'></i> Edit</a>" +
                        "<a class='btn btn-danger btn-sm' style='margin-left:5px' onclick='Delete(\"" + data + "\")'><i class='fa fa-trash'></i> Delete</a>";
                }

            }
        ],
        language: {
            emptyTable: "no data found."
        }
    });
}

function ShowPopup(url) {
    var formDiv = $('<div/>');
    $.get(url)
        .done(function (response) {
            formDiv.html(response);
            popup = formDiv.dialog({
                autoOpen: true,
                resizeable: false,
                width: 600,
                height: 650,
                title: 'Add or Edit Data',
                close: function () {
                    popup.dialog('destroy').remove();
                }
            });
        });
}

function SubmitAddEdit(form) {
    $.validator.unobtrusive.parse(form);
    if ($(form).valid()) {
        var data = $(form).serializeJSON();
        var actionType = data.Id !== "" && data.Id !== undefined ? 'PUT' : 'POST'
        data = JSON.stringify(data);
        $.ajax({
            type: actionType,
            url: '/api/UserManager',
            data: data,
            contentType: 'application/json',
            success: function (data) {
                if (data.success) {
                    popup.dialog('close');
                    ShowMessage(data.message);
                    RefreshGridData();
                }
            }
        });

    }
    return false;
}

function Delete(id) {
    swal({
        title: "Are you sure want to Delete?",
        text: "You will not be able to restore this user!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: true
    }, function () {
        $.ajax({
            type: 'DELETE',
            url: '/api/UserManager/' + id,
            success: function (data) {
                if (data.success) {
                    ShowMessage(data.message);
                    RefreshGridData();
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log(xhr.responseText);
                // Handle the error appropriately
            }
        });
    });
}

function ShowMessage(msg) {
    toastr.success(msg);
}

function RefreshGridData() {
    $.ajax({
        url: "/api/UserManager",
        type: "GET",
        dataType: "json",
        success: function (data) {
            // Check the response here
            if (data) {
                // Clear the existing data in the table
                dataTable.clear().draw();
                // Add the new data to the table
                dataTable.rows.add(data).draw();
            } else {
                // Handle the case where the response is empty or not as expected
                console.error("Empty or unexpected response from the API.");
            }
        },
        error: function () {
            // Handle AJAX error, e.g., show an error message
            console.error("Error occurred while fetching data from the API.");
        }
    });
}




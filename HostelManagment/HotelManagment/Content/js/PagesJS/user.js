
success = (data) => {
    launch_toast(data.success, data.message);
    var url = '/ManageUsers?handler=ListPartial&locationId=' + $("#model_LocationId").val();
    BindData(url, '#tblusers');
    clearform("model_UserId");
    
};
error = () => {
    launch_toast('false', 'Something Went Wrong');
};
ShowAddEditUserSection = () => {
    if ($('#AddEditSection').is(':visible')) {
        $('#AddEditSection').slideUp();
    }
    else {
        $('#AddEditSection').slideDown();
    }
};
var Show = false;
var encryptedpwd = $("#model_Password").val();
var decryptpwd;


/* PASSWORD VIEW START */
$(".toggle-password").click(function () {
     ;
    $(this).toggleClass("fa-eye fa-eye-slash");
    //var input = $($(this).attr("toggle"));
    if ($("#model_Password").attr("type") == "password") {

        $("#model_Password").attr("type", "text");
        //if (decryptpwd.length == 0) {
        //    fetch('/ManageUsers?handler=ShowPassword&value=' + encryptedpwd)
        //        .then((response) => {
        //            return response.text();
        //        })
        //        .then((result) => {
        //             ;
        //            decryptpwd = result.pwd;
        //            $("#model_Password").val(result.pwd);
        //            input.prop("type", "text");

        //            //document.getElementById('grid').innerHTML = result;
        //        });
        //}
        //else {
        //   // $("#model_Password").val(decryptpwd);
        //    input.prop("type", "text");
        //}

    } else {
        $("#model_Password").attr("type", "password");
    }
});

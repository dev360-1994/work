
function launch_toast() {   
    $("#toast").addClass("show");
    setTimeout(function () { $("#toast").removeClass("show"); }, 5000);
}

function launch_toast(type, message) {
    if (type == "true" || type == true) {
        $("#success").html(message);
        $("#Successtoast").addClass("show");
        setTimeout(function () { $("#Successtoast").removeClass("show"); }, 5000);
    }
    else if (type == "false" || type == false) {
        $("#error").html(message);
        $("#Errortoast").addClass("show");
        setTimeout(function () { $("#Errortoast").removeClass("show"); }, 5000);
    }
}
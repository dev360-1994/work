function launch_toast(type, message) {
    if (type === "true" || type === true) {
        $("#success").html(message);
        $("#Successtoast").addClass("show");
        setTimeout(function () { $("#Successtoast").removeClass("show"); }, 5000);
    }
    else {
        $("#error").html(message);
        $("#Errortoast").addClass("show");
        setTimeout(function () { $("#Errortoast").removeClass("show"); }, 5000);
    }
}
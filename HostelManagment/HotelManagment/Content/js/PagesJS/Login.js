function BindFishCategory() {
    $.ajax({
        type: "POST",
        url: "Login.aspx/BindFishCategory",
        data: {},
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.d != null) {
                var res = $.parseJSON(response.d);
                if (res.TotalMatches > 1) {
                    $("#divselect").show();
                    BindCategoryDrp(res.CategoryList);
                    // $("#btnuser").addClass(".active");
                }
                else {
                    $("#rfvddlcat").html("<%=Resources.Resource.Login_MsgUserNameNotFound%>");
                    return;

                }
            }
        },
        failure: function (response) {
            console.log(response.d);
        },
        error: function (response) {
            console.log(response.d);

        }
    });

}
function BindCategoryDrp(res) {
    $("#ddlcategory").empty();
    $("#ddlcategory").append(" <option>select</option>");
    $.each(res, function (data, value) {
        $("#ddlcategory").append($("<option></option>").val(value.DBContextId).html(value.Category));
    })
}
$(document).ready(function () {
     ;
    BindFishCategory();
}
);
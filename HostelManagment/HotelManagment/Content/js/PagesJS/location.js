
success = (data) => {
    launch_toast(data.success, data.message);
    BindLocations();
    clearform("model_LocationId");
};
error = (xhr, status, error) => {    
    //var err = eval("(" + xhr.responseText + ")");
    alert(error);
};
function BindLocations() {
    fetch('/Locations?handler=ListPartial')
        .then((response) => {
            return response.text();
        })
        .then((result) => {
            $('#tbllocations tbody').empty();
            $('#tbllocations  tbody').html(result);
        });
}

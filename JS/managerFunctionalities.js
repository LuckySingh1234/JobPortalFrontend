$(document).ready(function() {
    const signedInManager = localStorage.getItem('signedInManager');
    if (signedInManager === null) {
        window.location = "managerLogin.html";
        return;
    }

    // const reqData = {
    //     email: signedInManager
    // };

    // $.ajax({
    //     url: 'http://localhost:8080/OnlineStoreAppBackendAPI/webapi/myresource/getManagerActions',
    //     method: 'POST',
    //     contentType: 'application/json',
    //     data: JSON.stringify(reqData),
    //     success: function(response) {
    //         const managerActions = response.managerActions;
    //         const managerActionsArray = managerActions.split(',');
    //     },
    //     error: function(xhr, status, error) {
    //         // Handle error
    //         console.log('Error: ' + error);
    //     }
    // });
});

$(function() {
   $("#submitBtn").dxButton({
        stylingMode: "contained",
        text: "Submit",
        type: "default",
        width: 120,
        onClick: function() {
            $.ajax({
                url: "/loadSAndP",
                type: "get",
                success: function(response) {
                    DevExpress.ui.notify('complete', "info", 500);
                },
                error: function(xhr) {
                    DevExpress.ui.notify("Error", "warning", 500);
                }
            });
        }
    });
});
let currentTicker = '';
$(function() {
   $("#searchBox").dxTextBox({
        placeholder: "Enter ticker...",
        onValueChanged: function (e) {
            currentTicker = e.value;
        }
    });
   $("#submitBtn").dxButton({
        stylingMode: "contained",
        text: "Submit",
        type: "default",
        width: 120,
        onClick: function() {
            $.ajax({
                url: "/getTickerInfo",
                type: "get",
                data: {
                    ticker_name: currentTicker
                },
                success: function(response) {
                    DevExpress.ui.notify(response, "info", 500);
                },
                error: function(xhr) {
                    DevExpress.ui.notify("Error", "warning", 500);
                }
            });
        }
    });
});
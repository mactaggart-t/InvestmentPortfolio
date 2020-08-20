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
            $.post("/getTickerInfo", 
                {
                    ticker_name: currentTicker
                },
                function (price) {
                    DevExpress.ui.notify("Button was clicked: " + price);
                }
            )
        }
    });
});
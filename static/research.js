let currentTicker = '';
let dataSource = [{}];

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
                    if (response === 'DNE'){
                        DevExpress.ui.notify("Error: Ticker Does Not Exist", "warning", 500);
                    }
                    else{
                        $("#securityGraph").dxChart("option", "dataSource", response);
                        $("#securityGraph").dxChart().refresh();
                    }
                },
                error: function(xhr) {
                    DevExpress.ui.notify("Error", "warning", 500);
                }
            });
        }
    });
   $("#securityGraph").dxChart({
        dataSource: dataSource,
        title: {
            text: "",
        },
        series: {
            valueField: "price",
            name: "",
            argumentField: "date",
            type: "line"
        },
        legend: {
            visible: false,
        },
        argumentAxis: {
            argumentType: "datetime"
        },
        valueAxis: {
            position: "right"
        }
   });
});
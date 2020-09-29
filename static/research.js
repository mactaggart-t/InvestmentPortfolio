let currentTickers = {};
let dataSource = [{}];
let today = new Date();
let all_date = new Date('Jan 1, 2000');
let current_start = all_date;
let timeSelections = [
    {'label': '2W', 'text': '2W', 'begin_date': deltaDate(today, -14, 0, 0)},
    {'label': '1M', 'text': '1M', 'begin_date': deltaDate(today, 0, -1, 0)},
    {'label': '3M', 'text': '3M', 'begin_date': deltaDate(today, 0, -3, 0)},
    {'label': '6M', 'text': '6M', 'begin_date': deltaDate(today, 0, -6, 0)},
    {'label': 'YTD', 'text': 'YTD', 'begin_date': new Date(today.getFullYear(), 0, 1)},
    {'label': '1Y', 'text': '1Y', 'begin_date': deltaDate(today, 0, 0, -1)},
    {'label': '5Y', 'text': '5Y', 'begin_date': deltaDate(today, 0, 0, -5)},
    {'label': '10Y', 'text': '10Y', 'begin_date': deltaDate(today, 0, 0, -10)},
    {'label': 'All', 'text': 'All', 'begin_date': all_date}];


function deltaDate(input, days, months, years) {
    return new Date(
      input.getFullYear() + years,
      input.getMonth() + months,
      Math.min(
        input.getDate() + days,
        new Date(input.getFullYear() + years, input.getMonth() + months + 1, 0).getDate()
      )
    );
}


function get_all_tickers(){
    $.ajax({
        url: "/getAllTickers",
        type: "get",
        success: function(response) {
            $("#searchBox").dxTagBox('option', 'items', response);
        },
        error: function(xhr) {
            DevExpress.ui.notify("Error", "warning", 500);
        }
    });
}


function format_datasource(tickers, data_points){
    let formatted_data = [];
    for (let j = 0; j < tickers.length; j++){
        for (let i = 0; i < data_points[j].length; i++){
            let ticker = tickers[j].toString();
            if (formatted_data[i] === undefined){
                formatted_data.push({})
            }
            formatted_data[i][ticker] = data_points[j][i]['price'];
            formatted_data[i]['date'] = data_points[j][i]['date'];
        }
    }
    all_date = formatted_data[formatted_data.length-1]['date'];
    dataSource = formatted_data;
    return formatted_data
}


function get_base_prices(price_source, tickers, begin_dt) {
    begin_dt = new Date(begin_dt);
    let base_prices = [];
    for (let i = 0; i < tickers.length; i++){
        let ticker = tickers[i];
        for (let j = 0; j < price_source.length; j++){
            if (new Date(price_source[j]['date']) < begin_dt || price_source[j][ticker] === undefined){
                base_prices.push(price_source[j-1][ticker]);
                break;
            }
            else if(j === price_source.length -1){
                base_prices.push(price_source[price_source.length-1][ticker])
            }
        }
    }
    return base_prices
}

function format_datasource_percent(base_price, price_source, tickers) {
    for (let j = 0; j < tickers.length; j++){
        let ticker = tickers[j].toString();
        for (let i = 0; i < price_source.length; i++){
            if (price_source[i][ticker] !== undefined){
                price_source[i][ticker] = (price_source[i][ticker]-base_price[j])/base_price[j]
            }
        }
    }
    return price_source
}


function format_series(tickers){
    let formatted_series = [];
    for (let i = 0; i < tickers.length; i++){
        formatted_series.push({valueField: tickers[i], name: tickers[i]})
    }
    return formatted_series
}


$(function() {
    $("#searchBox").dxTagBox({
        items: get_all_tickers(),
        acceptCustomValue: true,
        searchEnabled: true,
        onValueChanged: function(e) {
            currentTickers = e.value;
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
                data: {tickers: JSON.stringify(currentTickers)},
                contentType: 'application/json; charset=utf-8',
                success: function(response) {
                    if (response === 'DNE'){
                        DevExpress.ui.notify("Error: Ticker Does Not Exist", "warning", 500);
                    }
                    else{
                        $("#securityGraph").dxChart("option", "dataSource", format_datasource(response[1], response[2]));
                        if ($("#percent_dollar").dxButtonGroup("option", 'selectedItemKeys')[0] === "%") {
                            let base_price = get_base_prices(dataSource, currentTickers, current_start);
                            let copied_ds = JSON.parse(JSON.stringify(dataSource));
                            $("#securityGraph").dxChart("option", "dataSource", format_datasource_percent(base_price, copied_ds,
                                currentTickers));
                        }
                        $("#securityGraph").dxChart("option", "series", format_series(response[1]));
                        $("#securityGraph").dxChart("option", "title", {'text': response[0]});
                        $("#securityGraph").dxChart("option", "valueAxis", {'title': 'Price($)'})
                    }
                },
                error: function(xhr) {
                    DevExpress.ui.notify("Error", "warning", 500);
                }
            });
        }
    });
   $("#single-selection").dxButtonGroup({
        items: timeSelections,
        stylingMode: "outlined",
        keyExpr: 'label',
        selectedItemKeys: ['All'],
        onItemClick: function(e){
            let selected_date = new Date(e.itemData.begin_date);
            let all_dt = new Date(all_date);
            if (selected_date > all_dt){
                current_start = selected_date
            }
            else{
                current_start = all_dt
            }
            if ($("#percent_dollar").dxButtonGroup("option", 'selectedItemKeys')[0] === "%"){
                let base_price = get_base_prices(dataSource, currentTickers, current_start);
                let copied_ds = JSON.parse(JSON.stringify(dataSource));
                $("#securityGraph").dxChart("option", "dataSource", format_datasource_percent(base_price, copied_ds,
                    currentTickers));
            }
            $("#securityGraph").dxChart("option", "argumentAxis", {'visualRange': [current_start, null]});
        }
    });
   $("#percent_dollar").dxButtonGroup({
       items: [{'text': '$'}, {'text': '%'}],
       stylingMode: "outlined",
       keyExpr: 'text',
       selectedItemKeys: ['$'],
       onItemClick: function (e) {
           if (e.itemData.text === '%'){
               let base_price = get_base_prices(dataSource, currentTickers, current_start);
               let copied_ds = JSON.parse(JSON.stringify(dataSource));
               $("#securityGraph").dxChart("option", "dataSource", format_datasource_percent(base_price, copied_ds,
                   currentTickers));
               $("#securityGraph").dxChart("option", "valueAxis", {'title': 'Price Change(%)'});
               $("#securityGraph").dxChart("option", "crosshair", {'horizontalLine': {'label': {'format': 'percent'}}});
               $("#securityGraph").dxChart("option", 'valueAxis', {'label': {'format': 'percent'}});
           }
           else {
               $("#securityGraph").dxChart("option", "dataSource", dataSource);
               $("#securityGraph").dxChart("option", "valueAxis", {'title': 'Price($)'});
               $("#securityGraph").dxChart("option", "crosshair", {'horizontalLine': {'label': {'format': 'currency'}}});
               $("#securityGraph").dxChart("option", 'valueAxis', {'label': {'format': 'currency'}})
           }
       }
   });
   $("#securityGraph").dxChart({
        dataSource: dataSource,
        title: {
            text: "",
        },
        commonSeriesSettings: {
            argumentField: 'date'
        },
        crosshair: {
            enabled: true,
            width: 3,
            label: {
                visible: true,
                font: {
                  size: 12,
                }
            },
            verticalLine: {
                label: {
                    format: 'shortDate'
                }
            },
            horizontalLine: {
                label: {
                    format: 'currency'
                }
            }
        },
        point: {
            size: 2
        },
        legend: {
            visible: true,
        },
        argumentAxis: {
            argumentType: "datetime",
            title: 'Date'
        },
        valueAxis: {
            position: "right",
            label: {
                format: 'currency'
            }
        }
   });
});
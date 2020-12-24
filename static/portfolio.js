let currentTickers = {};
let dataSource = [{}];
let gridDataSource = [{}];
let transactDataSource = [{}];
let secDistDataSource = [{}];
let sectorDistDataSource = [{}];
let portfolioValue = 0;
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
let newTicker = '';
let newPrice = 0;
let newShares = 0;
let base_price = 0;
let purchaseDt = new Date();
let buyOrSell = "Buy";


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

function get_username() {
    $.ajax({
        url: "/getUsername",
        type: "get",
        success: function(response) {
            document.getElementById("headerText").innerHTML = 'Hello ' + response;
        },
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

function get_base_prices() {
    $.ajax({
       url: "/getTotalPurchase",
       type: "get",
       success: function(response) {
           base_price = response['purchase'];
       },
   });
}

function format_datasource_percent(base_price, price_source, tickers) {
    for (let j = 0; j < tickers.length; j++){
        let ticker = tickers[j].toString();
        for (let i = 0; i < price_source.length; i++){
            if (price_source[i][ticker] !== undefined){
                let current_base = base_price[0];
                for (let k = 0; k < base_price.length; k++){
                    if (new Date(price_source[i]['date']) >= new Date(base_price[k]['date']) &&
                        new Date(base_price[k]['date']) > new Date(current_base['date'])) {
                        current_base = base_price[k];
                    }
                }
                price_source[i][ticker] = (price_source[i][ticker]-current_base['price'])/current_base['price'];
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

function load_portfolio_datagrid() {
    $.ajax({
       url: "/loadPortfolioDataGrid",
       type: "get",
       success: function(response) {
           gridDataSource = response;
           $("#securityGrid").dxDataGrid("option", "dataSource", response);
           $("#toastContainer").dxToast("hide");
       },
   });
}

function load_transaction_history() {
    $.ajax({
       url: "/loadTransactionHistory",
       type: "get",
       success: function(response) {
           transactDataSource = response;
           $("#transactionHistory").dxDataGrid("option", "dataSource", response);
           $("#toastContainer").dxToast("hide");
       },
   });
}

function load_portfolio() {
    $.ajax({
       url: "/loadPortfolio",
       type: "get",
       success: function(response) {
           $("#securityGraph").dxChart("option", "dataSource", format_datasource(response[1], response[2]));
           currentTickers = response[1];
            if ($("#percent_dollar").dxButtonGroup("option", 'selectedItemKeys')[0] === "%") {
                let copied_ds = JSON.parse(JSON.stringify(dataSource));
                $("#securityGraph").dxChart("option", "dataSource", format_datasource_percent(base_price, copied_ds,
                    currentTickers));
            }
            $("#securityGraph").dxChart("option", "series", format_series(response[1]));
            $("#securityGraph").dxChart("option", "title", {'text': response[0]});
            $("#securityGraph").dxChart("option", "valueAxis", {'title': 'Price($)'});
            $("#toastContainer").dxToast("hide");
       },
   });
}

function load_sec_distribution() {
    $.ajax({
       url: "/loadSecDistribution",
       type: "get",
       success: function(response) {
           secDistDataSource = response[0];
           portfolioValue = response[1];
           $("#secDistribution").dxPieChart("option", "dataSource", response[0]);
           $("#toastContainer").dxToast("hide");
       },
   });
}

function load_sector_distribution() {
    $.ajax({
       url: "/loadSectorDistribution",
       type: "get",
       success: function(response) {
           secDistDataSource = response;
           $("#sectorDistribution").dxPieChart("option", "dataSource", response);
           $("#toastContainer").dxToast("hide");
       },
   });
}

function hide_all() {
    $("#securityGraph").hide();
    $("#percent_dollar").hide();
    $("#single-selection").hide();
    $("#secDistribution").hide();
    $("#sectorDistribution").hide();
    $("#securityGrid").dxDataGrid("option", "visible", false);
    $("#transactionHistory").dxDataGrid("option", "visible", false);
}

$(function() {
   get_username();
   get_base_prices();
   $("#itemSelection").dxSelectBox({
       items: ['Portfolio Balance', 'Transaction History', 'Individual Securities(coming soon)', 'Portfolio Diversification'],
       placeholder: 'Select a view',
       width: 250,
       onItemClick: function (e) {
           if (e.itemData === 'Portfolio Balance') {
               hide_all();
               $("#securityGraph").show();
               $("#percent_dollar").show();
               $("#single-selection").show();
               $("#securityGrid").dxDataGrid("option", "visible", true);
               if (dataSource.length === 1 || gridDataSource.length === 1) {
                   $("#toastContainer").dxToast("show");
                   load_portfolio();
                   load_portfolio_datagrid();
               }

           }
           else if(e.itemData === 'Transaction History') {
               hide_all();
               $("#transactionHistory").dxDataGrid("option", "visible", true);
               if (transactDataSource.length === 1) {
                   $("#toastContainer").dxToast("show");
                   load_transaction_history();
               }
           }
           else if(e.itemData === 'Portfolio Diversification') {
               hide_all();
               $("#secDistribution").show();
               $("#sectorDistribution").show();
               if (secDistDataSource.length === 1) {
                   $("#toastContainer").dxToast("show");
                   load_sec_distribution();
                   load_sector_distribution();
               }

           }
       }
   });
   $("#buySell").dxButton({
       stylingMode: "contained",
       text: "Add Purchase/Sale",
       type: "default",
       width: 200,
       onClick: function() {
           $("#popupContent").dxPopup("option", "visible", true);
       }
   });
   $("#popupContent").dxPopup({
       visible: false,
       showCloseButton: true,
       width: 500,
       title: "Log a Purchase or Sale of a Security",
       contentTemplate: function (contentElement) {
            contentElement.append(
                $("<p />").text("Enter Ticker: "),
                $("<div />").attr("class", "center_horizontal").dxTextBox({
                    placeholder: "Enter Ticker",
                    width: '250px',
                    onValueChanged: function (e) {
                        newTicker = e.value;
                    }
                }),
                $("<div />").attr("class", "center_drop").dxRadioGroup({
                    items: ["Buy", "Sell"],
                    layout: "horizontal",
                    value: "Buy",
                    width: 150,
                    onValueChanged: function (e) {
                        buyOrSell = e.value;
                    }
                }),
                $("<p />").text("Enter Price: "),
                $("<div />").attr("class", "center_horizontal").dxNumberBox({
                    width: '250px',
                    format: {
                        type: 'currency',
                        precision: 2,
                        currency: 'USD'
                    },
                    onValueChanged: function (e) {
                        newPrice = e.value;
                    }
                }),
                $("<p />").text("Enter Number of Shares: "),
                $("<div />").attr("class", "center_horizontal").dxNumberBox({
                    width: '250px',
                    value: 0,
                    onValueChanged: function (e) {
                        newShares = e.value;
                    }
                }),
                $("<p />").text("Enter Date of Transaction: "),
                $("<div />").attr("class", "center_horizontal").dxDateBox({
                    width: '250px',
                    value: purchaseDt,
                    onValueChanged: function (e) {
                        purchaseDt = e.value;
                    }
                }),
                $("<div />").attr("class", "submit_btn").dxButton({
                    stylingMode: "contained",
                    text: "Confirm",
                    type: "success",
                    width: 200,
                    onClick: function() {
                        let confirmation = DevExpress.ui.dialog.confirm("Are you sure?", "Confirm");
                        confirmation.done(function (dialogResult) {
                            if (dialogResult) {
                                $.ajax({
                                    url: "/newTransaction",
                                    type: "get",
                                    data: {
                                        ticker: newTicker,
                                        buy_sell: buyOrSell,
                                        price: newPrice,
                                        shares: newShares,
                                        dt: purchaseDt
                                    },
                                    success: function(response) {
                                        if (response === 'success') {
                                            DevExpress.ui.notify("Purchase Logged", "success", 500);
                                            $("#popupContent").dxPopup("option", "visible", false);
                                            load_portfolio();
                                            load_portfolio_datagrid();
                                        }
                                        else if (response === 'valid sell') {
                                            DevExpress.ui.notify("Sale Logged", "success", 500);
                                            $("#popupContent").dxPopup("option", "visible", false);
                                        }
                                        else if (response === 'no exist') {
                                            DevExpress.ui.notify("Error: Ticker does not exist", "warning", 500);
                                        }
                                        else if (response === 'no sample') {
                                            DevExpress.ui.notify("Error: Cannot add to sample", "warning", 500);
                                        }
                                        else {
                                            DevExpress.ui.notify("Error: Cannot sell more than you own", "warning", 500);
                                        }
                                    },
                                    error: function(xhr) {
                                        DevExpress.ui.notify("Error", "warning", 500);
                                    }
                                });
                            }
                        });
                    }
                }),
            )
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
        visible: false,
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
            visible: false,
        },
        argumentAxis: {
            argumentType: "datetime",
            title: 'Date',
        },
        valueAxis: {
            position: "right",
            label: {
                format: 'currency'
            }
        },
   });
   $("#securityGrid").dxDataGrid({
       dataSource: gridDataSource,
       visible: false,
       columns: [{
           dataField: 'Company',
           dataType: "string",
       }, {
           dataField: 'Ticker',
           dataType: "string"
       }, {
           dataField: 'PurchasePrice',
           dataType: "number",
           format: {
               type: 'currency',
               precision: 2,
               currency: 'USD'
           },
       }, {
           dataField: 'Shares',
           dataType: "number"
       }, {
           dataField: 'CurrentPrice',
           dataType: "number",
           format: {
               type: 'currency',
               precision: 2,
               currency: 'USD'
           },
       }, {
           dataField: 'MarketValue',
           dataType: "number",
           format: {
               type: 'currency',
               precision: 2,
               currency: 'USD'
           },
       }, {
           dataField: 'Gain$',
           dataType: "number",
           format: {
               type: 'currency',
               precision: 2,
               currency: 'USD'
           },
       }, {
           dataField: 'Gain%',
           dataType: "number",
           format: {
               type: 'percent',
               precision: 2,
           },
       }],
       showBorders: true,
       showRowLines: true,
   });
   $("#transactionHistory").dxDataGrid({
       dataSource: transactDataSource,
       visible: false,
       columns: [{
           dataField: 'Company',
           dataType: "string",
       }, {
           dataField: 'Ticker',
           dataType: "string"
       }, {
           dataField: 'PurchaseOrSale',
           dataType: "string"
       }, {
           dataField: 'PurchaseOrSalePrice',
           dataType: "number",
           format: {
               type: 'currency',
               precision: 2,
               currency: 'USD'
           },
       }, {
           dataField: 'Shares',
           dataType: "number"
       }, {
           dataField: 'PurchaseOrSaleDate',
           dataType: "date",
           format: {
               type: "shortDate"
           }
       }],
       showBorders: true,
       showRowLines: true,
   });
   $("#toastContainer").dxToast({
        message: "Processing...",
        type: "success",
        displayTime: 100000,
    });
   $("#secDistribution").dxPieChart({
        palette: "bright",
        dataSource: secDistDataSource,
        legend: {
            horizontalAlignment: "left"
        },
        minDiameter: .85,
        series: [
            {
                argumentField: "ticker",
                valueField: "value",
                label: {
                    visible: true,
                    format: {
                        type: 'currency',
                        precision: 2,
                        currency: 'USD'
                    },
                    connector: {
                        visible: true,
                        width: 1
                    }
                }
            },
        ],
        tooltip: {
            enabled: false,
            customizeTooltip: function(arg) {
                let curVal = parseInt(arg.valueText.replace(",", ""));
                return {
                    text: arg.argumentText + "<br/>" + (curVal * 100 / portfolioValue).toFixed(2)+"%"
                };
            }
        },
        onPointHoverChanged: function(arg){
            if (arg.target.isHovered()) {
                arg.target.showTooltip();
            } else {
                arg.target.hideTooltip();
            }

        },
        title: "Security Distribution"
   });
   $("#sectorDistribution").dxPieChart({
        palette: "bright",
        dataSource: sectorDistDataSource,
        legend: {
            horizontalAlignment: "left"
        },
        minDiameter: .85,
        series: [
            {
                argumentField: "sector",
                valueField: "value",
                label: {
                    visible: true,
                    format: {
                        type: 'currency',
                        precision: 2,
                        currency: 'USD'
                    },
                    connector: {
                        visible: true,
                        width: 1
                    }
                }
            },
        ],
        tooltip: {
            enabled: false,
            customizeTooltip: function(arg) {
                let curVal = parseInt(arg.valueText.replace(",", ""));
                return {
                    text: arg.argumentText + "<br/>" + (curVal * 100 / portfolioValue).toFixed(2)+"%"
                };
            }
        },
        onPointHoverChanged: function(arg){
            if (arg.target.isHovered()) {
                arg.target.showTooltip();
            } else {
                arg.target.hideTooltip();
            }

        },
        title: "Sector Distribution"
    });
   hide_all()
});
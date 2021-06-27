let heatmapDataSource = [{}];

function hide_all() {
    $("#heatmap").hide();
    $("#toastContainer").dxToast("hide");
}

function load_heatmap() {
    $.ajax({
        url: "/getHeatmap",
        type: "get",
        success: function(response) {
            $("#heatmap").dxTreeMap("option", "dataSource", response);
            $("#toastContainer").dxToast("hide");
        },
    });
}

function onLinkClick(e) {
    $(e.target).data("node").drillDown();
}

$(function() {
   $("#itemSelection").dxSelectBox({
       items: ['Heatmap'],
       placeholder: 'Select a view',
       width: 250,
       onValueChanged: function (e) {
           if (e.value === 'Heatmap') {
               load_heatmap();
               $("#heatmap").show();
               $("#toastContainer").dxToast("show");
           }
       }
   });
   $("#heatmap").dxTreeMap({
        dataSource: heatmapDataSource,
        title: "Heatmap of S&P500 Companies by Market Cap",
        tile: {
            label: {
                font: {
                    size: 12
                }
            }
        },
        interactWithGroup: true,
        maxDepth: 2,
        onClick: function(e) {
            e.node.drillDown();
        },
        onDrill: function(e) {
            let markup = $("#drill-down-title").empty(),
                node;
            for (node = e.node.getParent(); node; node = node.getParent()) {
                markup.prepend(" > ").prepend($("<span />")
                    .addClass("link")
                    .text(node.label() || "All Sectors")
                    .data("node", node)
                    .on("dxclick", onLinkClick));
            }
            if (markup.children().length) {
                markup.append(e.node.label());
            }
        },
        tooltip: {
            enabled: true,
            format: "billions",
            customizeTooltip: function (arg) {
                let data = arg.node.data;
                let result = null;
                console.log(arg);
                if (arg.node.isLeaf()) {
                    result = "<span>Company: " + data.sec_name + "(" + data.name + ")" + "</br>Market Cap: " + arg.valueText + "</span>";
                }

                return {
                    text: result
                };
            }
        }
    });
    $("#toastContainer").dxToast({
        message: "Processing...",
        type: "success",
        displayTime: 100000,
    });
    hide_all();
});
import {FIVEY, FORMAT_DATA, FORMAT_DATA_IND, ONEM, ONEY, SIXM, TENY, THREEM, TWOW, YTD} from "./types";
import React from "react";

export function getFormattedDate(date) {
    const year = date.getFullYear();

    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
}

export const formatXAxis = (tickItem) => {
    if (tickItem === 0 || tickItem === 'auto' || tickItem === '') {
        return '';
    }
    return getFormattedDate(new Date(tickItem));
};

export const getStroke = (itemIndex) => {
    switch (itemIndex % 5) {
        case 0:
            return '#004E98';
        case 1:
            return '#C03221';
        case 2:
            return '#00CC14';
        case 3:
            return '#F99FAB';
        default:
            return '#989C94'
    }
};

export const formatData = (fullData, time, type, chartType, purchases=[]) => (dispatch) => {
    let copyData = fullData.slice(0);
    let selected_time = new Date('Jan 1, 2000');
    switch (time) {
        case '2w':
            selected_time = TWOW;
            break;
        case '1m':
            selected_time = ONEM;
            break;
        case '3m':
            selected_time = THREEM;
            break;
        case '6m':
            selected_time = SIXM;
            break;
        case 'ytd':
            selected_time = YTD;
            break;
        case '1y':
            selected_time = ONEY;
            break;
        case '5y':
            selected_time = FIVEY;
            break;
        case '10y':
            selected_time = TENY;
            break;
        default:
            selected_time =  new Date('Jan 1, 2000');
    }
    copyData.reverse();
    const index = copyData.findIndex(element => +new Date(element.date) <= +selected_time);
    let formattedData = copyData.slice(0, index).reverse();
    let reformattedData = [];
    if (type === '%') {
        if (chartType === 'portfolio') {
            let basePrice = formattedData[0]['Value'];
            for (let i = 0; i < formattedData.length; i++) {
                let dataObject = {};
                for (const [key, value] of Object.entries(formattedData[i])) {
                    if (key === 'date') {
                        dataObject[key] = value;
                    } else {
                        for (let j = 0; j < purchases.length; j++) {
                            if(Date.parse(purchases[j]['date']) === Date.parse(formattedData[i]['date'])) {
                                basePrice += purchases[j]['price'];
                                break;
                            }
                        }
                        dataObject[key] = (value - basePrice) / basePrice * 100;
                    }
                }
                reformattedData.push(dataObject)
            }
            formattedData = reformattedData;
        } else {
            const basePrices = formattedData[0];
            for (let i = 0; i < formattedData.length; i++) {
                let dataObject = {};
                for (const [key, value] of Object.entries(formattedData[i])) {
                    if (key === 'date') {
                        dataObject[key] = value;
                    } else {
                        dataObject[key] = (value - basePrices[key]) / basePrices[key] * 100
                    }
                }
                reformattedData.push(dataObject)
            }
            formattedData = reformattedData;
        }
    }
    if (chartType === 'individual') {
        dispatch({
            type: FORMAT_DATA_IND,
            payload: {formattedData: formattedData, time: time, type: type},
        });
    } else {
        dispatch({
            type: FORMAT_DATA,
            payload: {formattedData: formattedData, time: time, type: type},
        });
    }
};

export const CustomTooltip = (content) => {
    if (content.active && content.payload && content.payload.length) {
        console.log(content.payload);
        if (content.type === '$') {
            return (
                <div className={'tooltipBackground'}>
                    <p>{formatXAxis(content.payload[0].payload.date)}</p>
                    {content.payload.map(ticker => (<p>{`${ticker.name}: $${ticker.value.toFixed(2)}`}</p>))}
                </div>
            );
        }
        else {
            return (
                <div className={'tooltipBackground'}>
                    <p>{formatXAxis(content.payload[0].payload.date)}</p>
                    {content.payload.map(ticker => (<p>{`${ticker.name}: ${ticker.value.toFixed(2)}%`}</p>))}
                </div>
            )
        }
    }
    return null;
};
import { deviation } from "d3-array";

/* 
Returns the new array of moving averages. Parameters:
arr: the original array of objects with dates and close prices.
size: the moving averages size.
*/
const mAverage = (arr, size, arrStart) => {
    let newArr = [];

    for (let i = 0; i < arr.length; i++) {
        if (arr[i - size]) {
            let sum = 0;
            for (let j = 0; j < size; j++) {
                sum += arr[i - j].close;
            }

            const mAverage = {
                date: arr[i].date,
                close: sum / size
            }
            newArr.push(mAverage);
        } else {
            newArr.push({
                date: arr[i].date,
                close: arr[i].close
            });
        }
    }

    return newArr.slice(arrStart);
}

/*
Returns the geometric average of a set of returns. Parameters:
arr: the originall array of objects with dates and closing prices.
*/
const gMean = (arr) => {
    let sum = 1;
    
    for (let i = 0; i < arr.length; i++) {
        sum *= arr[i].close + 1;
    }

    console.log(Math.pow(sum, 1 / arr.length) - 1);
    return Math.pow(sum, 1 / arr.length) - 1;
}

/*
Returns the new array of growth rates. Parameters:
arr: the original array of objects with dates and closing prices.
period: the length of output array.
*/
const gRate = (arr, period) => {
    let newArr = [];

    for (let i = 0; i < period; i++) {
        if (arr[i + 1]) {
            const rate = (arr[i].close - arr[i +1].close) / arr[i + 1].close;
            newArr.push({
                date: arr[i].date,
                close: rate
            });
        }
    }
    return newArr;
}

const averageReturn = (arr) => {
    let interval = Math.floor(arr.length / 250);
    let averageReturns = [];
    for (let i = 0; i < interval - 1; i++) {
        const annualReturn = (arr[i * 250].close - arr[i * 250+250].close) / arr[i * 250+250].close;
        averageReturns.push({
            date: arr[i * 250 + 250].date,
            close: annualReturn * 100
        });
    }
    
    return averageReturns;
}



const stdDevReturn = (arr, period) => {
    let arr2 = arr.reverse();
    let sum = 0;
    let deviationSum = 0;
    let deviations = [];

    for (let i = 0; i < period; i++) {
        sum += arr2[i].close
    }
    const mean = sum / period;
    console.log('mean:' + mean);

    for (let i = 0; i < period; i++) {
        console.log(arr2[i].close);
        console.log(mean);
        deviations.push(Math.pow(arr2[i].close - mean, 2));
    }

    console.log('devbiations:');
    console.log(deviations);
    
    for (let i = 0; i < deviations.length; i++) {
        deviationSum += deviations[i];
    }
    
    const variance = deviationSum / (period - 1);
    const stdDev = Math.sqrt(variance);
    console.log(`Variance: ${variance}`);
    console.log(`Std Dev: ${stdDev}`);
}    

export { mAverage, gMean, gRate, averageReturn, stdDevReturn };
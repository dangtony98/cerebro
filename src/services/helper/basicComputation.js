import { decimal_reformat } from './metricReformat';

const compute_return = (startValue, endValue) => {
    if (startValue > 0 && endValue > 0) {
        return decimal_reformat((endValue - startValue) / startValue * 100)
    }
    return ""
}

export { compute_return };
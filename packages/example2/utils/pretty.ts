import { CoinPretty, PricePretty, RatePretty } from "@keplr-wallet/unit";

export function getPrettyFiat(value?: PricePretty) {
    if (value) {
        return value
            .trim(true)
            .maxDecimals(2)
            .toString();
    } else {
        return `${value!.symbol}-`;
    }
}

export function getPrettyRate(value?: RatePretty) {
    if (value) {
        return value
            .trim(true)
            .maxDecimals(2)
            .toString();
    } else {
        return `-%`;
    }
}

export function getPrettyCoin(value?: CoinPretty) {
    if (value) {
        return value
            .trim(true)
            .maxDecimals(2)
            .toString();
    } else {
        return `-${value!.denom}`;
    }
}
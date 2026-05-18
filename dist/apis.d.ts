export declare function getCryptoPrice(symbol: string): Promise<{
    symbol: string;
    price_usd: number;
    change_24h: number | null;
    market_cap: number | null;
    volume_24h: number | null;
}>;
export declare function getTopCryptos(limit?: number): Promise<{
    symbol: string;
    name: string;
    price_usd: number;
    change_24h: number;
    market_cap: number;
    volume_24h: number;
}[]>;
export declare function getForexRate(from: string, to: string): Promise<{
    pair: string;
    rate: number;
    base: string;
    quote: string;
}>;
export declare function getMultipleForexRates(base: string, targets: string[]): Promise<{
    pair: string;
    rate: number;
}[]>;
export declare function getFearGreedIndex(): Promise<{
    current: {
        value: number;
        classification: string;
        date: string;
    };
    history: {
        value: number;
        classification: string;
        date: string;
    }[];
}>;
export declare function getStockPrice(symbol: string): Promise<{
    symbol: string;
    price: number;
    currency: string;
    exchange: string;
    change_pct: number | null;
    previous_close: number;
}>;
export declare function getMarketIndices(): Promise<({
    name: string;
    symbol: string;
    price: number;
    change_pct: number | null;
    error?: undefined;
} | {
    name: string;
    symbol: string;
    price: null;
    change_pct: null;
    error: boolean;
})[]>;
export declare function getTrendingCryptos(): Promise<{
    name: string;
    symbol: string;
    rank: number;
    price_usd: number | null;
    change_24h: number | null;
}[]>;
export declare function getMarketSummary(): Promise<{
    cryptos: {
        symbol: string;
        name: string;
        price_usd: number;
        change_24h: number;
        market_cap: number;
        volume_24h: number;
    }[];
    forex: {
        pair: string;
        rate: number;
    }[];
    fear_greed: {
        value: number;
        classification: string;
        date: string;
    };
    indices: ({
        name: string;
        symbol: string;
        price: number;
        change_pct: number | null;
        error?: undefined;
    } | {
        name: string;
        symbol: string;
        price: null;
        change_pct: null;
        error: boolean;
    })[] | null;
}>;

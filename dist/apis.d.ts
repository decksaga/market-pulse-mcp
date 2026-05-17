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
}>;

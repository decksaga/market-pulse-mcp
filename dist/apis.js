const COINGECKO_BASE = "https://api.coingecko.com/api/v3";
const EXCHANGERATE_BASE = "https://open.er-api.com/v6/latest";
const YAHOO_BASE = "https://query1.finance.yahoo.com/v8/finance/chart";
async function fetchJSON(url, headers) {
    const res = await fetch(url, {
        headers: { "User-Agent": "MarketPulse/2.0", ...headers },
    });
    if (!res.ok)
        throw new Error(`API error: ${res.status} ${res.statusText}`);
    return res.json();
}
const CRYPTO_IDS = {
    bitcoin: "bitcoin", btc: "bitcoin",
    ethereum: "ethereum", eth: "ethereum",
    solana: "solana", sol: "solana",
    cardano: "cardano", ada: "cardano",
    ripple: "ripple", xrp: "ripple",
    dogecoin: "dogecoin", doge: "dogecoin",
    polkadot: "polkadot", dot: "polkadot",
    avalanche: "avalanche-2", avax: "avalanche-2",
    chainlink: "chainlink", link: "chainlink",
    litecoin: "litecoin", ltc: "litecoin",
    bnb: "binancecoin", binance: "binancecoin",
    matic: "matic-network", polygon: "matic-network",
};
function resolveCryptoId(query) {
    const lower = query.toLowerCase().trim();
    return CRYPTO_IDS[lower] ?? lower;
}
export async function getCryptoPrice(symbol) {
    const id = resolveCryptoId(symbol);
    const data = await fetchJSON(`${COINGECKO_BASE}/simple/price?ids=${id}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`);
    const coin = data[id];
    if (!coin)
        throw new Error(`Crypto "${symbol}" not found. Try: bitcoin, ethereum, solana, etc.`);
    return {
        symbol: symbol.toUpperCase(),
        price_usd: coin.usd,
        change_24h: coin.usd_24h_change ? Math.round(coin.usd_24h_change * 100) / 100 : null,
        market_cap: coin.usd_market_cap ?? null,
        volume_24h: coin.usd_24h_vol ?? null,
    };
}
export async function getTopCryptos(limit = 10) {
    const data = await fetchJSON(`${COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`);
    return data.map(c => ({
        symbol: c.symbol.toUpperCase(),
        name: c.name,
        price_usd: c.current_price,
        change_24h: Math.round(c.price_change_percentage_24h * 100) / 100,
        market_cap: c.market_cap,
        volume_24h: c.total_volume,
    }));
}
export async function getForexRate(from, to) {
    const base = from.toUpperCase();
    const target = to.toUpperCase();
    const data = await fetchJSON(`${EXCHANGERATE_BASE}/${base}`);
    if (data.result !== "success")
        throw new Error(`Forex API error for ${base}`);
    const rate = data.rates[target];
    if (!rate)
        throw new Error(`Currency "${target}" not found`);
    return {
        pair: `${base}/${target}`,
        rate,
        base: base,
        quote: target,
    };
}
export async function getMultipleForexRates(base, targets) {
    const baseUpper = base.toUpperCase();
    const data = await fetchJSON(`${EXCHANGERATE_BASE}/${baseUpper}`);
    if (data.result !== "success")
        throw new Error(`Forex API error for ${baseUpper}`);
    return targets.map(t => {
        const target = t.toUpperCase();
        return {
            pair: `${baseUpper}/${target}`,
            rate: data.rates[target] ?? null,
        };
    });
}
export async function getFearGreedIndex() {
    const data = await fetchJSON("https://api.alternative.me/fng/?limit=7");
    return {
        current: {
            value: parseInt(data.data[0].value),
            classification: data.data[0].value_classification,
            date: new Date(parseInt(data.data[0].timestamp) * 1000).toISOString().split("T")[0],
        },
        history: data.data.map(d => ({
            value: parseInt(d.value),
            classification: d.value_classification,
            date: new Date(parseInt(d.timestamp) * 1000).toISOString().split("T")[0],
        })),
    };
}
export async function getStockPrice(symbol) {
    const ticker = symbol.toUpperCase().trim();
    const data = await fetchJSON(`${YAHOO_BASE}/${encodeURIComponent(ticker)}?range=1d&interval=1d`);
    if (data.chart.error)
        throw new Error(`Stock "${ticker}" not found: ${data.chart.error.description}`);
    if (!data.chart.result?.length)
        throw new Error(`Stock "${ticker}" not found.`);
    const meta = data.chart.result[0].meta;
    const price = meta.regularMarketPrice;
    const prevClose = meta.previousClose;
    const change = prevClose ? ((price - prevClose) / prevClose) * 100 : null;
    return {
        symbol: meta.symbol,
        price,
        currency: meta.currency,
        exchange: meta.exchangeName,
        change_pct: change !== null ? Math.round(change * 100) / 100 : null,
        previous_close: prevClose ?? null,
    };
}
const INDICES = {
    "S&P 500": "^GSPC",
    "NASDAQ": "^IXIC",
    "Dow Jones": "^DJI",
    "Russell 2000": "^RUT",
    "VIX": "^VIX",
};
export async function getMarketIndices() {
    const entries = Object.entries(INDICES);
    const results = await Promise.allSettled(entries.map(([, ticker]) => getStockPrice(ticker)));
    return entries.map(([name], i) => {
        const result = results[i];
        if (result.status === "fulfilled") {
            return { name, symbol: result.value.symbol, price: result.value.price, change_pct: result.value.change_pct };
        }
        return { name, symbol: INDICES[name], price: null, change_pct: null, error: true };
    });
}
export async function getTrendingCryptos() {
    const data = await fetchJSON(`${COINGECKO_BASE}/search/trending`);
    return data.coins.slice(0, 7).map(c => ({
        name: c.item.name,
        symbol: c.item.symbol.toUpperCase(),
        rank: c.item.market_cap_rank,
        price_usd: c.item.data?.price ?? null,
        change_24h: c.item.data?.price_change_percentage_24h?.usd
            ? Math.round(c.item.data.price_change_percentage_24h.usd * 100) / 100
            : null,
    }));
}
// ─── MARKET SUMMARY ───
export async function getMarketSummary() {
    const [cryptos, forex, fearGreed, indices] = await Promise.all([
        getTopCryptos(5),
        getMultipleForexRates("USD", ["EUR", "GBP", "JPY", "CHF", "CAD"]),
        getFearGreedIndex(),
        getMarketIndices().catch(() => null),
    ]);
    return { cryptos, forex, fear_greed: fearGreed.current, indices };
}
//# sourceMappingURL=apis.js.map
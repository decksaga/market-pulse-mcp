const COINGECKO_BASE = "https://api.coingecko.com/api/v3"
const EXCHANGERATE_BASE = "https://open.er-api.com/v6/latest"

async function fetchJSON(url: string): Promise<unknown> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`)
  return res.json()
}

// ─── CRYPTO (CoinGecko, free, no API key) ───

interface CoinGeckoPrice {
  [id: string]: { usd: number; usd_24h_change?: number; usd_market_cap?: number; usd_24h_vol?: number }
}

const CRYPTO_IDS: Record<string, string> = {
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
}

function resolveCryptoId(query: string): string {
  const lower = query.toLowerCase().trim()
  return CRYPTO_IDS[lower] ?? lower
}

export async function getCryptoPrice(symbol: string) {
  const id = resolveCryptoId(symbol)
  const data = await fetchJSON(
    `${COINGECKO_BASE}/simple/price?ids=${id}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`
  ) as CoinGeckoPrice

  const coin = data[id]
  if (!coin) throw new Error(`Crypto "${symbol}" not found. Try: bitcoin, ethereum, solana, etc.`)

  return {
    symbol: symbol.toUpperCase(),
    price_usd: coin.usd,
    change_24h: coin.usd_24h_change ? Math.round(coin.usd_24h_change * 100) / 100 : null,
    market_cap: coin.usd_market_cap ?? null,
    volume_24h: coin.usd_24h_vol ?? null,
  }
}

export async function getTopCryptos(limit: number = 10) {
  const data = await fetchJSON(
    `${COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`
  ) as Array<{
    id: string; symbol: string; name: string; current_price: number
    price_change_percentage_24h: number; market_cap: number; total_volume: number
  }>

  return data.map(c => ({
    symbol: c.symbol.toUpperCase(),
    name: c.name,
    price_usd: c.current_price,
    change_24h: Math.round(c.price_change_percentage_24h * 100) / 100,
    market_cap: c.market_cap,
    volume_24h: c.total_volume,
  }))
}

// ─── FOREX (ExchangeRate API, free, no key) ───

interface ExchangeRateResponse {
  result: string
  base_code: string
  rates: Record<string, number>
}

export async function getForexRate(from: string, to: string) {
  const base = from.toUpperCase()
  const target = to.toUpperCase()
  const data = await fetchJSON(`${EXCHANGERATE_BASE}/${base}`) as ExchangeRateResponse

  if (data.result !== "success") throw new Error(`Forex API error for ${base}`)

  const rate = data.rates[target]
  if (!rate) throw new Error(`Currency "${target}" not found`)

  return {
    pair: `${base}/${target}`,
    rate,
    base: base,
    quote: target,
  }
}

export async function getMultipleForexRates(base: string, targets: string[]) {
  const baseUpper = base.toUpperCase()
  const data = await fetchJSON(`${EXCHANGERATE_BASE}/${baseUpper}`) as ExchangeRateResponse

  if (data.result !== "success") throw new Error(`Forex API error for ${baseUpper}`)

  return targets.map(t => {
    const target = t.toUpperCase()
    return {
      pair: `${baseUpper}/${target}`,
      rate: data.rates[target] ?? null,
    }
  })
}

// ─── FEAR & GREED INDEX (alternative.me, free) ───

interface FearGreedResponse {
  data: Array<{ value: string; value_classification: string; timestamp: string }>
}

export async function getFearGreedIndex() {
  const data = await fetchJSON("https://api.alternative.me/fng/?limit=7") as FearGreedResponse

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
  }
}

// ─── MARKET SUMMARY ───

export async function getMarketSummary() {
  const [cryptos, forex, fearGreed] = await Promise.all([
    getTopCryptos(5),
    getMultipleForexRates("USD", ["EUR", "GBP", "JPY", "CHF", "CAD"]),
    getFearGreedIndex(),
  ])

  return { cryptos, forex, fear_greed: fearGreed.current }
}

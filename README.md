<div align="center">

<img src="https://capsule-render.vercel.app/api?type=venom&color=0:0d1117,50:1a3a2a,100:6ee7b7&height=200&section=header&text=MARKET%20PULSE&fontSize=70&fontColor=ffffff&animation=twinkling&stroke=6ee7b7&strokeWidth=1" width="100%" />

<br />

<h3>Give Claude eyes on the market.</h3>

<p>
  <a href="https://github.com/decksaga/market-pulse-mcp/stargazers"><img src="https://img.shields.io/github/stars/decksaga/market-pulse-mcp?style=for-the-badge&color=6ee7b7&labelColor=0d1117" /></a>
  <a href="https://github.com/decksaga/market-pulse-mcp/blob/master/LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge&labelColor=0d1117" /></a>
  <img src="https://img.shields.io/badge/MCP-Compatible-6ee7b7?style=for-the-badge&labelColor=0d1117" />
  <img src="https://img.shields.io/badge/API_Keys-None-ff6b6b?style=for-the-badge&labelColor=0d1117" />
  <img src="https://img.shields.io/badge/Cost-$0-6ee7b7?style=for-the-badge&labelColor=0d1117" />
  <img src="https://img.shields.io/badge/v2.0-New-blueviolet?style=for-the-badge&labelColor=0d1117" />
</p>

</div>

<br />

## What is this?

An MCP server that gives Claude **live market data** instead of guessing or searching the web. Crypto, stocks, forex, indices, sentiment — real numbers from real APIs.

```
You: "how's the market doing?"
```

```
📊 MARKET SUMMARY
═══════════════════

🪙 Top Cryptos:
  Bitcoin (BTC):    $78,004.00   🔴 -0.24%
  Ethereum (ETH):    $2,489.00   🟢 +1.12%
  BNB (BNB):           $598.00   🟢 +0.87%
  Solana (SOL):        $148.30   🔴 -2.31%
  XRP (XRP):             $0.52   🟢 +0.45%

📈 Indices:
  S&P 500:   5,842.01   🟢 +0.62%
  NASDAQ:   18,847.28   🟢 +0.89%
  Dow Jones: 42,654.74   🔴 -0.12%

💱 Forex (USD base):
  USD/EUR: 0.9234
  USD/GBP: 0.7891
  USD/JPY: 154.23

😰 Fear & Greed: 38/100 (Fear)
```

No web searches. No hallucinated data. Just live numbers.

<br />

## 🛠️ 8 Tools

| | Tool | Does what |
|:--|:-----|:----------|
| 🪙 | `get_price` | Price of any crypto — BTC, ETH, SOL, DOGE, and 10+ more |
| 📊 | `get_top_cryptos` | Top N ranked by market cap |
| 📈 | `get_stock_price` | **NEW** — Any stock or ETF: AAPL, NVDA, TSLA, MSFT, SPY, QQQ... |
| 🏛️ | `get_market_indices` | **NEW** — S&P 500, NASDAQ, Dow Jones, Russell 2000, VIX |
| 🔥 | `get_trending_cryptos` | **NEW** — Top 7 trending coins on CoinGecko right now |
| 💱 | `get_forex_rate` | Exchange rate between any two currencies |
| 😱 | `get_fear_greed_index` | Fear & Greed Index + 7-day trend |
| 📋 | `get_market_summary` | Everything above in one call |

<br />

## 🚀 Setup (2 minutes)

**1.** Clone and install:

```bash
git clone https://github.com/decksaga/market-pulse-mcp.git
cd market-pulse-mcp
npm install
```

**2.** Add to your Claude config:

```json
{
  "mcpServers": {
    "market-pulse": {
      "command": "node",
      "args": ["/path/to/market-pulse-mcp/dist/server.js"]
    }
  }
}
```

**3.** Restart Claude. Ask it anything about the market.

Already compiled. No build step.

<br />

## 📡 Free APIs, No Keys

| Source | What it provides |
|:-------|:-----------------|
| [CoinGecko](https://www.coingecko.com/en/api) | Crypto prices, market caps, trending, 24h volume |
| [Yahoo Finance](https://finance.yahoo.com) | Stocks, ETFs, market indices |
| [ExchangeRate API](https://open.er-api.com) | 150+ fiat currency pairs |
| [Alternative.me](https://alternative.me/crypto/fear-and-greed-index/) | Crypto Fear & Greed Index |

<br />

## 📁 Structure

```
market-pulse-mcp/
├── src/
│   ├── server.ts    # Tool definitions (8 tools)
│   └── apis.ts      # CoinGecko, Yahoo Finance, ExchangeRate, Alternative.me
├── dist/            # Ready to run
├── package.json
└── tsconfig.json
```

<br />

## License

MIT — do whatever you want with it.

<br />

<div align="center">

Made by [@decksaga](https://github.com/decksaga)

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,50:1a3a2a,100:6ee7b7&height=100&section=footer" width="100%" />

</div>

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,50:1a3a2a,100:6ee7b7&height=220&section=header&text=Market%20Pulse%20MCP&fontSize=50&fontColor=ffffff&fontAlignY=35&desc=Real-time%20market%20data%20for%20Claude&descSize=18&descColor=6ee7b7&descAlignY=55&animation=fadeIn" width="100%" />

<br />

Give Claude real-time access to crypto prices, forex rates & market sentiment.  
No API keys. No costs. Just plug it in.

<p>
  <a href="https://github.com/decksaga/market-pulse-mcp/stargazers"><img src="https://img.shields.io/github/stars/decksaga/market-pulse-mcp?style=for-the-badge&color=6ee7b7&labelColor=0d1117" /></a>
  <a href="https://github.com/decksaga/market-pulse-mcp/blob/master/LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge&labelColor=0d1117" /></a>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white&labelColor=0d1117" />
  <img src="https://img.shields.io/badge/MCP-Compatible-6ee7b7?style=for-the-badge&labelColor=0d1117" />
</p>

<p>
  <a href="#quick-start">Quick Start</a> •
  <a href="#tools">Tools</a> •
  <a href="#data-sources">Data Sources</a>
</p>

</div>

<br />

## ⚡ Demo

Ask Claude anything about the market. It calls the right tool automatically.

```
You: "How's the crypto market doing today?"
```

```
📊 MARKET SUMMARY
═══════════════════

🪙 Top Cryptos:
  Bitcoin (BTC): $78,004 🔴 -0.24%
  Ethereum (ETH): $2,489 🟢 +1.12%
  BNB (BNB): $598 🟢 +0.87%
  Solana (SOL): $148 🔴 -2.31%
  XRP (XRP): $0.52 🟢 +0.45%

💱 Forex (USD base):
  USD/EUR: 0.9234
  USD/GBP: 0.7891
  USD/JPY: 154.23

😰 Fear & Greed: 38/100 (Fear)
```

No web searches. No hallucinations. Just live data.

<br />

## 🛠️ Tools

Market Pulse ships with **5 tools** that Claude can call on its own:

| Tool | What it does |
|:-----|:------------|
| `get_price` | Price of any crypto — BTC, ETH, SOL, and 10+ more |
| `get_top_cryptos` | Top N by market cap (1–25) |
| `get_forex_rate` | Exchange rate between any two currencies |
| `get_fear_greed_index` | Fear & Greed Index + 7-day history |
| `get_market_summary` | Full briefing: top 5 crypto + forex + sentiment |

<br />

## 🚀 Quick Start

**1.** Clone and install dependencies:

```bash
git clone https://github.com/decksaga/market-pulse-mcp.git
cd market-pulse-mcp
npm install
```

**2.** Add this to your Claude config (`~/.claude/settings.json` or `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "market-pulse": {
      "command": "node",
      "args": ["/absolute/path/to/market-pulse-mcp/dist/server.js"]
    }
  }
}
```

**3.** Restart Claude. Done.

Already compiled — no build step needed. Just clone, install, and go.

<br />

## 📡 Data Sources

Everything runs on free, public APIs. No keys needed.

| Source | Data |
|:-------|:-----|
| [CoinGecko](https://www.coingecko.com/en/api) | Crypto prices, market caps, 24h volume |
| [ExchangeRate API](https://open.er-api.com) | 150+ fiat currency pairs |
| [Alternative.me](https://alternative.me/crypto/fear-and-greed-index/) | Crypto Fear & Greed Index |

<br />

## 🪙 Supported Cryptos

<p>
  <code>Bitcoin</code> · <code>Ethereum</code> · <code>Solana</code> · <code>Cardano</code> · <code>XRP</code> · <code>Dogecoin</code> · <code>Polkadot</code> · <code>Avalanche</code> · <code>Chainlink</code> · <code>Litecoin</code> · <code>BNB</code> · <code>Polygon</code> + anything listed on CoinGecko
</p>

<br />

## 🏗️ Stack

<p>
  <img src="https://skillicons.dev/icons?i=ts,nodejs&theme=dark" height="40" />
</p>

TypeScript, Node.js, [`@modelcontextprotocol/sdk`](https://github.com/modelcontextprotocol/typescript-sdk), and [Zod v4](https://zod.dev) for validation.

<br />

## 📁 Structure

```
market-pulse-mcp/
├── src/
│   ├── server.ts    # Tool definitions & formatting
│   └── apis.ts      # CoinGecko, ExchangeRate, Alternative.me clients
├── dist/            # Compiled JS
├── package.json
└── tsconfig.json
```

<br />

## 📄 License

MIT — do whatever you want with it.

<br />

<div align="center">

Made by [@decksaga](https://github.com/decksaga)

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,50:1a3a2a,100:6ee7b7&height=100&section=footer" width="100%" />

</div>

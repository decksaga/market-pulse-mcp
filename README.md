<div align="center">

<!-- Header Banner -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,50:1a3a2a,100:6ee7b7&height=220&section=header&text=Market%20Pulse%20MCP&fontSize=50&fontColor=ffffff&fontAlignY=35&desc=Real-time%20market%20data%20for%20Claude&descSize=18&descColor=6ee7b7&descAlignY=55&animation=fadeIn" width="100%" />

<br />

<p>
  <strong>Give Claude real-time access to crypto prices, forex rates & market sentiment.</strong>
</p>

<p>
  <a href="https://github.com/decksaga/market-pulse-mcp/stargazers"><img src="https://img.shields.io/github/stars/decksaga/market-pulse-mcp?style=for-the-badge&color=6ee7b7&labelColor=0d1117" /></a>
  <a href="https://github.com/decksaga/market-pulse-mcp/blob/master/LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge&labelColor=0d1117" /></a>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white&labelColor=0d1117" />
  <img src="https://img.shields.io/badge/MCP-Compatible-6ee7b7?style=for-the-badge&labelColor=0d1117" />
</p>

<p>
  <a href="#quick-start">Quick Start</a> •
  <a href="#what-it-does">What it does</a> •
  <a href="#data-sources">Data Sources</a>
</p>

</div>

<br />

## ⚡ Demo

```
You: "How's the crypto market doing today?"
```

> Claude automatically calls `get_market_summary` and responds with:

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

<br />

## 🛠️ What it does

Market Pulse gives Claude access to live financial data through **5 tools**:

| Tool | Description |
|:-----|:------------|
| `get_price` | Current price of any cryptocurrency (BTC, ETH, SOL, and 10+ more) |
| `get_top_cryptos` | Top N cryptos ranked by market cap (1–25) |
| `get_forex_rate` | Exchange rate between any two fiat currencies |
| `get_fear_greed_index` | Crypto Fear & Greed Index with 7-day history |
| `get_market_summary` | Full market briefing: top 5 crypto + forex + sentiment |

<br />

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org) v18+
- [Claude Desktop](https://claude.ai/download) or [Claude Code](https://docs.anthropic.com/en/docs/claude-code)

### Install

```bash
git clone https://github.com/decksaga/market-pulse-mcp.git
cd market-pulse-mcp
npm install
npm run build
```

### Configure

Add to your Claude config (`~/.claude/settings.json` for Claude Code, or `claude_desktop_config.json` for Claude Desktop):

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

Restart Claude. That's it. ✅

<br />

## 📡 Data Sources

All APIs are **free and require no API keys**:

| Source | Data | Link |
|:-------|:-----|:-----|
| CoinGecko | Crypto prices & market data | [coingecko.com](https://www.coingecko.com/en/api) |
| ExchangeRate API | Forex rates (150+ currencies) | [open.er-api.com](https://open.er-api.com) |
| Alternative.me | Fear & Greed Index | [alternative.me](https://alternative.me/crypto/fear-and-greed-index/) |

<br />

## 🪙 Supported Cryptocurrencies

<p>
  <code>Bitcoin</code> · <code>Ethereum</code> · <code>Solana</code> · <code>Cardano</code> · <code>Ripple (XRP)</code> · <code>Dogecoin</code> · <code>Polkadot</code> · <code>Avalanche</code> · <code>Chainlink</code> · <code>Litecoin</code> · <code>BNB</code> · <code>Polygon</code> + any coin on CoinGecko
</p>

<br />

## 🏗️ Tech Stack

<p>
  <img src="https://skillicons.dev/icons?i=ts,nodejs&theme=dark" height="40" />
</p>

- **TypeScript** + **Node.js**
- [`@modelcontextprotocol/sdk`](https://github.com/modelcontextprotocol/typescript-sdk) — official MCP SDK
- [Zod v4](https://zod.dev) — schema validation

<br />

## 📁 Project Structure

```
market-pulse-mcp/
├── src/
│   ├── server.ts    # MCP tool definitions & formatting
│   └── apis.ts      # API clients (CoinGecko, ExchangeRate, Alternative.me)
├── dist/            # Compiled output
├── package.json
└── tsconfig.json
```

<br />

## 📄 License

MIT — use it, fork it, build on it.

<br />

<div align="center">

**Built by [@decksaga](https://github.com/decksaga)**

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,50:1a3a2a,100:6ee7b7&height=100&section=footer" width="100%" />

</div>

# 📊 Market Pulse MCP

A real-time market data server for Claude, built with the [Model Context Protocol](https://modelcontextprotocol.io). Get crypto prices, forex rates, and market sentiment — all from your AI assistant.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![MCP](https://img.shields.io/badge/MCP-Compatible-6ee7b7)
![License](https://img.shields.io/badge/License-MIT-yellow)

## What it does

Market Pulse gives Claude access to live financial data through 5 tools:

| Tool | Description |
|------|-------------|
| `get_price` | Current price of any cryptocurrency (BTC, ETH, SOL, and 10+ more) |
| `get_top_cryptos` | Top N cryptos ranked by market cap (1–25) |
| `get_forex_rate` | Exchange rate between any two fiat currencies |
| `get_fear_greed_index` | Crypto Fear & Greed Index with 7-day history |
| `get_market_summary` | Full market briefing: top 5 crypto + forex + sentiment |

### Example

> **You:** "How's the crypto market doing today?"
>
> Claude automatically calls `get_market_summary` and responds with live prices, 24h changes, forex rates, and the current Fear & Greed reading.

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org) v18+
- [Claude Desktop](https://claude.ai/download) or [Claude Code](https://docs.anthropic.com/en/docs/claude-code)

### Install & Configure

```bash
git clone https://github.com/YOUR_USERNAME/market-pulse-mcp.git
cd market-pulse-mcp
npm install
npm run build
```

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

Restart Claude. That's it.

## Data Sources

All APIs are **free and require no API keys**:

- **Crypto prices** — [CoinGecko](https://www.coingecko.com/en/api) (public endpoint)
- **Forex rates** — [ExchangeRate API](https://open.er-api.com)
- **Fear & Greed** — [Alternative.me](https://alternative.me/crypto/fear-and-greed-index/)

## Supported Cryptocurrencies

Bitcoin, Ethereum, Solana, Cardano, Ripple (XRP), Dogecoin, Polkadot, Avalanche, Chainlink, Litecoin, BNB, Polygon — plus any coin listed on CoinGecko by its ID.

## Tech Stack

- TypeScript + Node.js
- [`@modelcontextprotocol/sdk`](https://github.com/modelcontextprotocol/typescript-sdk) — official MCP SDK
- [Zod v4](https://zod.dev) — schema validation

## Project Structure

```
market-pulse-mcp/
├── src/
│   ├── server.ts    # MCP tool definitions
│   └── apis.ts      # API clients (CoinGecko, ExchangeRate, Alternative.me)
├── dist/            # Compiled output
├── package.json
└── tsconfig.json
```

## License

MIT

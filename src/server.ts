#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod/v4"
import {
  getCryptoPrice,
  getTopCryptos,
  getForexRate,
  getMultipleForexRates,
  getFearGreedIndex,
  getMarketSummary,
  getStockPrice,
  getMarketIndices,
  getTrendingCryptos,
} from "./apis.js"

const server = new McpServer({
  name: "market-pulse",
  version: "2.0.0",
})

// ─── TOOL: get_price ───

server.tool(
  "get_price",
  "Get the current price of a cryptocurrency. Supports: bitcoin, ethereum, solana, cardano, ripple, dogecoin, bnb, litecoin, avalanche, polkadot, chainlink, polygon, and more.",
  { symbol: z.string().describe("Crypto name or ticker (e.g. 'bitcoin', 'btc', 'ethereum', 'sol')") },
  async ({ symbol }) => {
    try {
      const data = await getCryptoPrice(symbol)
      const changeEmoji = data.change_24h !== null ? (data.change_24h >= 0 ? "🟢" : "🔴") : ""
      const text = [
        `${data.symbol} — $${data.price_usd.toLocaleString("en-US", { maximumFractionDigits: 2 })}`,
        data.change_24h !== null ? `${changeEmoji} 24h: ${data.change_24h >= 0 ? "+" : ""}${data.change_24h}%` : null,
        data.market_cap ? `Market Cap: $${(data.market_cap / 1e9).toFixed(2)}B` : null,
        data.volume_24h ? `Volume 24h: $${(data.volume_24h / 1e9).toFixed(2)}B` : null,
      ].filter(Boolean).join("\n")

      return { content: [{ type: "text", text }] }
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : "Unknown error"}` }], isError: true }
    }
  }
)

// ─── TOOL: get_forex_rate ───

server.tool(
  "get_forex_rate",
  "Get the current exchange rate between two currencies (forex). Examples: USD to EUR, GBP to JPY.",
  {
    from: z.string().describe("Base currency code (e.g. 'USD', 'EUR', 'GBP')"),
    to: z.string().describe("Target currency code (e.g. 'EUR', 'JPY', 'CHF')"),
  },
  async ({ from, to }) => {
    try {
      const data = await getForexRate(from, to)
      const text = `${data.pair}: ${data.rate.toFixed(4)}\n1 ${data.base} = ${data.rate.toFixed(4)} ${data.quote}`
      return { content: [{ type: "text", text }] }
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : "Unknown error"}` }], isError: true }
    }
  }
)

// ─── TOOL: get_top_cryptos ───

server.tool(
  "get_top_cryptos",
  "Get the top cryptocurrencies by market cap with prices and 24h changes.",
  { limit: z.number().min(1).max(25).default(10).describe("Number of cryptos to return (1-25, default 10)") },
  async ({ limit }) => {
    try {
      const data = await getTopCryptos(limit)
      const lines = data.map((c, i) => {
        const emoji = c.change_24h >= 0 ? "🟢" : "🔴"
        const price = c.price_usd >= 1
          ? `$${c.price_usd.toLocaleString("en-US", { maximumFractionDigits: 2 })}`
          : `$${c.price_usd.toFixed(6)}`
        return `${i + 1}. ${c.name} (${c.symbol}) — ${price} ${emoji} ${c.change_24h >= 0 ? "+" : ""}${c.change_24h}%`
      })

      return { content: [{ type: "text", text: `Top ${limit} Cryptos by Market Cap:\n\n${lines.join("\n")}` }] }
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : "Unknown error"}` }], isError: true }
    }
  }
)

// ─── TOOL: get_fear_greed_index ───

server.tool(
  "get_fear_greed_index",
  "Get the Crypto Fear & Greed Index. Values: 0-25 = Extreme Fear, 25-50 = Fear, 50-75 = Greed, 75-100 = Extreme Greed.",
  {},
  async () => {
    try {
      const data = await getFearGreedIndex()
      const { current, history } = data

      const emoji =
        current.value <= 25 ? "😱" :
        current.value <= 50 ? "😰" :
        current.value <= 75 ? "😀" : "🤑"

      const historyLines = history.slice(1).map(
        h => `  ${h.date}: ${h.value} (${h.classification})`
      )

      const text = [
        `${emoji} Fear & Greed Index: ${current.value}/100 — ${current.classification}`,
        `Date: ${current.date}`,
        "",
        "Last 7 days:",
        ...historyLines,
      ].join("\n")

      return { content: [{ type: "text", text }] }
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : "Unknown error"}` }], isError: true }
    }
  }
)

// ─── TOOL: get_stock_price ───

server.tool(
  "get_stock_price",
  "Get the current price of any stock or ETF. Works with any ticker: AAPL, NVDA, TSLA, MSFT, AMZN, SPY, QQQ, etc.",
  { symbol: z.string().describe("Stock ticker symbol (e.g. 'AAPL', 'NVDA', 'TSLA', 'MSFT')") },
  async ({ symbol }) => {
    try {
      const data = await getStockPrice(symbol)
      const changeEmoji = data.change_pct !== null ? (data.change_pct >= 0 ? "🟢" : "🔴") : ""
      const text = [
        `${data.symbol} — $${data.price.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${data.currency}`,
        data.change_pct !== null ? `${changeEmoji} Today: ${data.change_pct >= 0 ? "+" : ""}${data.change_pct}%` : null,
        data.previous_close ? `Previous Close: $${data.previous_close.toLocaleString("en-US", { maximumFractionDigits: 2 })}` : null,
        `Exchange: ${data.exchange}`,
      ].filter(Boolean).join("\n")

      return { content: [{ type: "text", text }] }
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : "Unknown error"}` }], isError: true }
    }
  }
)

// ─── TOOL: get_market_indices ───

server.tool(
  "get_market_indices",
  "Get major US market indices: S&P 500, NASDAQ, Dow Jones, Russell 2000, and VIX.",
  {},
  async () => {
    try {
      const data = await getMarketIndices()
      const lines = data.map(idx => {
        if (idx.price === null) return `  ${idx.name}: unavailable`
        const emoji = (idx.change_pct ?? 0) >= 0 ? "🟢" : "🔴"
        const change = idx.change_pct !== null ? ` ${emoji} ${idx.change_pct >= 0 ? "+" : ""}${idx.change_pct}%` : ""
        return `  ${idx.name}: ${idx.price.toLocaleString("en-US", { maximumFractionDigits: 2 })}${change}`
      })

      return { content: [{ type: "text", text: `📈 Market Indices:\n\n${lines.join("\n")}` }] }
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : "Unknown error"}` }], isError: true }
    }
  }
)

// ─── TOOL: get_trending_cryptos ───

server.tool(
  "get_trending_cryptos",
  "Get the top 7 trending cryptocurrencies right now on CoinGecko — what people are searching for.",
  {},
  async () => {
    try {
      const data = await getTrendingCryptos()
      const lines = data.map((c, i) => {
        const price = c.price_usd !== null
          ? `$${c.price_usd >= 1 ? c.price_usd.toLocaleString("en-US", { maximumFractionDigits: 2 }) : c.price_usd.toFixed(6)}`
          : "N/A"
        const change = c.change_24h !== null
          ? ` ${c.change_24h >= 0 ? "🟢" : "🔴"} ${c.change_24h >= 0 ? "+" : ""}${c.change_24h}%`
          : ""
        return `${i + 1}. ${c.name} (${c.symbol}) — ${price}${change}`
      })

      return { content: [{ type: "text", text: `🔥 Trending Cryptos:\n\n${lines.join("\n")}` }] }
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : "Unknown error"}` }], isError: true }
    }
  }
)

// ─── TOOL: get_market_summary ───

server.tool(
  "get_market_summary",
  "Get a complete market overview: top 5 cryptos, major forex rates, and the Fear & Greed Index. Great for a quick daily briefing.",
  {},
  async () => {
    try {
      const data = await getMarketSummary()

      const cryptoLines = data.cryptos.map(c => {
        const emoji = c.change_24h >= 0 ? "🟢" : "🔴"
        return `  ${c.name} (${c.symbol}): $${c.price_usd.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${emoji} ${c.change_24h >= 0 ? "+" : ""}${c.change_24h}%`
      })

      const forexLines = data.forex.map(f =>
        `  ${f.pair}: ${f.rate?.toFixed(4) ?? "N/A"}`
      )

      const fgEmoji =
        data.fear_greed.value <= 25 ? "😱" :
        data.fear_greed.value <= 50 ? "😰" :
        data.fear_greed.value <= 75 ? "😀" : "🤑"

      const indexLines = data.indices ? data.indices.map(idx => {
        if (idx.price === null) return `  ${idx.name}: unavailable`
        const emoji = (idx.change_pct ?? 0) >= 0 ? "🟢" : "🔴"
        const change = idx.change_pct !== null ? ` ${emoji} ${idx.change_pct >= 0 ? "+" : ""}${idx.change_pct}%` : ""
        return `  ${idx.name}: ${idx.price.toLocaleString("en-US", { maximumFractionDigits: 2 })}${change}`
      }) : []

      const text = [
        "📊 MARKET SUMMARY",
        "═══════════════════",
        "",
        "🪙 Top Cryptos:",
        ...cryptoLines,
        "",
        ...(indexLines.length ? ["📈 Indices:", ...indexLines, ""] : []),
        "💱 Forex (USD base):",
        ...forexLines,
        "",
        `${fgEmoji} Fear & Greed: ${data.fear_greed.value}/100 (${data.fear_greed.classification})`,
      ].join("\n")

      return { content: [{ type: "text", text }] }
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : "Unknown error"}` }], isError: true }
    }
  }
)

// ─── START SERVER ───

const transport = new StdioServerTransport()
await server.connect(transport)

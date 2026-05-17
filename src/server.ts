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
} from "./apis.js"

const server = new McpServer({
  name: "market-pulse",
  version: "1.0.0",
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

      const text = [
        "📊 MARKET SUMMARY",
        "═══════════════════",
        "",
        "🪙 Top Cryptos:",
        ...cryptoLines,
        "",
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

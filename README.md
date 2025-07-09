BullishFlag.xyz
BullishFlag.xyz is a dynamic crypto analytics dashboard designed to identify the top-performing cryptocurrencies based on user-defined filters. The platform integrates real-time market data with an intelligent, tool-calling AI assistant to provide users with unique and insightful market analysis.

🚀 Core Features
1. Dynamic Homepage Dashboard
The main page serves as a powerful control center for monitoring the crypto market's momentum.

Real-Time Data: Fetches the latest cryptocurrency data from the CoinMarketCap API upon loading.

Live Data Polling: The data automatically refreshes every 60 seconds in the background, ensuring the list is always up-to-date without requiring a manual page reload.

Customizable Filtering: Users can analyze the market based on two key criteria:

Market Cap Limit: Filter for the top 100, 500, 1000, 2000, or 5000 coins.

Performance Timeframe: View performance over 24 hours, 7 days, 30 days, or 90 days.

Performance Chart: A dynamic bar chart at the top of the page visualizes the top 10 best-performing assets according to the selected filters.

Data-Rich Table: A clean and responsive table lists the top 10 performers with their name, symbol, current price, and percentage change over the chosen timeframe.

2. Detailed Coin Pages
Clicking on any cryptocurrency in the table navigates the user to a dedicated detail page.

Fundamental Data: Displays key metrics for each asset, including precise price, market capitalization, and 24-hour trading volume.

Universal Live Chart: Features a smart fallback system to ensure maximum chart coverage for all types of assets:

DexScreener: For tokens running on a DEX-supported blockchain (e.g., Ethereum, BSC), it embeds a live chart from DexScreener using the token's contract address.

TradingView: For native coins without a contract address (e.g., Bitcoin, Stellar), it falls back to a professional TradingView chart widget, ensuring users always have access to price history.

3. Smart AI Assistant (BullishBot) 🤖
The project's most advanced feature is a custom AI assistant powered by OpenAI's gpt-4o model, equipped with Tool-Calling capabilities.

Context-Aware Analysis: The AI can analyze the real-time topCoins data currently displayed on the page to answer questions like "Summarize the top 3 performers" or "Compare XLM and RAY based on the provided data."

Live Price-Fetching Tool: If a user asks for the price of any cryptocurrency (e.g., "What is the price of Cardano?"), the AI intelligently uses a custom get_current_price tool to fetch live data from the CoinMarketCap API in real-time before answering.

General Crypto Knowledge: For broad questions like "What is a blockchain?", the assistant relies on its base model's knowledge to provide expert answers, behaving as a true crypto-savvy assistant.

🛠️ Technology Stack
Framework: Next.js (App Router)

Language: TypeScript

Styling: Tailwind CSS

UI Components: Shadcn/ui

Charts: Recharts & Embedded widgets (TradingView, DexScreener)

AI: OpenAI API (Tool Calling with gpt-4o)

Data Source: CoinMarketCap API

Deployment: Vercel

# Supertrend-Strategy-Nikko
Supertrend Strategy Nikko

📌 Script Overview
This script is a strategy implementation of the Supertrend indicator, a popular trend-following tool. It was adapted to run as a Pine Script v6 strategy so traders can backtest and evaluate its performance under various market conditions. The core idea is to generate long (buy) and short (sell/exit) signals based on volatility-adjusted price trends.

⚙️ How the Supertrend Algorithm Works
The Supertrend is based on the Average True Range (ATR), a measure of market volatility. It uses the ATR to build a dynamic band above and below price to determine trend direction:
- Uptrend (Bullish): When the price closes above the Supertrend line (ATR-based lower band), the trend is considered upward.
- Downtrend (Bearish): When the price closes below the Supertrend line (ATR-based upper band), the trend is considered downward.

The Supertrend band "flips" sides when price crosses it, signaling a possible trend reversal.

🧮 Parameters Explained
ATR Period (length)
 → Defines how many bars to use for calculating ATR. Default is 17.
→ A longer period smooths the indicator, reducing sensitivity.

ATR Multiplier (mult)
Scales the ATR to determine how far the Supertrend band should sit from price. Default is 5.
→ Higher values reduce noise but may delay signals.

Source (src)
The price basis used for calculations (default: HL2).
→ Can be adjusted to use Close, OHLC4, etc.

Take Wicks into Account (wicks)
Boolean option. If enabled, high/low prices are used instead of close price, which can affect where trend reversal is detected.

Show Buy/Sell Labels (showLabels)
Displays chart labels when signals are triggered.

Highlight State (highlightState)
Option to visually highlight the bullish or bearish state using background fills or overlays (currently commented out in the code).

✅ Benefits of This Strategy Version
Backtesting Ready: As a strategy, it allows testing on historical data using TradingView's built-in strategy tester.

- Customizable: Traders can change ATR parameters, wicks handling, and visual preferences.
- Clear Signals: Buy/sell signals are plotted directly on the chart with optional labels.
- Logic Transparency: Code logic is clearly written and adjustable for those who wish to modify or extend it.

⚠️ Notes & Considerations
- Lagging Nature: Like most trend-following indicators, Supertrend lags during sharp reversals or ranging markets.
- Low Win Rate: In fast or choppy markets, Supertrend may generate false signals due to its reliance on ATR.
- Best in Trending Markets: Works best when the market has clear direction and momentum.
- Wick Sensitivity: Enabling or disabling wick usage can significantly affect entry/exit behavior.

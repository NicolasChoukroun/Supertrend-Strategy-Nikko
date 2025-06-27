// This source code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
//  by Nikko June 2025
//@version=6

strategy("Supertrend Strategy v.1.0 (Nikko)", overlay=true, initial_capital=10000, pyramiding=1, default_qty_type=strategy.percent_of_equity, default_qty_value=100)

// === INPUT PARAMETERS ===
atrPeriod = input.int(title="ATR Period", defval=17)
atrMultiplier = input.float(title="ATR Multiplier", step=0.1, defval=5)
source = input.source(title="Source", defval=hl2)
includeWicks = input.bool(title="Take Wicks into Account ?", defval=true)
showLabels = input.bool(title="Show Buy/Sell Labels ?", defval=true)
highlightTrend = input.bool(title="Highlight State ?", defval=true)

// === ATR CALCULATION ===
atrValue = atrMultiplier * ta.atr(atrPeriod)

// === PRICE REFERENCE SETUP ===
highRef = includeWicks ? high : close
lowRef = includeWicks ? low : close
isDoji = open == close and open == low and open == high

// === LONG STOP LINE CALCULATION ===
longStop = source - atrValue
longStopPrev = na(longStop[1]) ? longStop : longStop[1]

if longStop > 0
    if isDoji
        longStop := longStopPrev
    else
        longStop := (lowRef[1] > longStopPrev ? math.max(longStop, longStopPrev) : longStop)
else
    longStop := longStopPrev

// === SHORT STOP LINE CALCULATION ===
shortStop = source + atrValue
shortStopPrev = na(shortStop[1]) ? shortStop : shortStop[1]

if shortStop > 0
    if isDoji
        shortStop := shortStopPrev
    else
        shortStop := (highRef[1] < shortStopPrev ? math.min(shortStop, shortStopPrev) : shortStop)
else
    shortStop := shortStopPrev

// === TREND DIRECTION LOGIC ===
var trendDir = 1 // 1 = long, -1 = short
trendDir := trendDir == -1 and highRef > shortStopPrev ? 1 :
            trendDir == 1 and lowRef < longStopPrev ? -1 :
            trendDir

// === COLOR SETTINGS ===
var color upColor = color.green
var color downColor = color.red

// === PLOT LINES AND SIGNALS ===
longStopPlot = plot(trendDir == 1 ? longStop : na, title="Long Stop", style=plot.style_linebr, linewidth=2, color=upColor)
buySignal = trendDir == 1 and trendDir[1] == -1
plotshape(buySignal ? longStop : na, title="Long Stop Start", location=location.absolute, style=shape.circle, size=size.tiny, color=upColor)
plotshape(buySignal and showLabels ? longStop : na, title="Buy Label", text="Buy", location=location.absolute, style=shape.labelup, size=size.tiny, color=upColor, textcolor=color.white)

shortStopPlot = plot(trendDir == 1 ? na : shortStop, title="Short Stop", style=plot.style_linebr, linewidth=2, color=downColor)
sellSignal = trendDir == -1 and trendDir[1] == 1
plotshape(sellSignal ? shortStop : na, title="Short Stop Start", location=location.absolute, style=shape.circle, size=size.tiny, color=downColor)
plotshape(sellSignal and showLabels ? shortStop : na, title="Sell Label", text="Sell", location=location.absolute, style=shape.labeldown, size=size.tiny, color=downColor, textcolor=color.white)

// === BACKGROUND HIGHLIGHTING (optional) ===
midPricePlot = plot(ohlc4, title="", style=plot.style_circles, linewidth=1, display=display.none, editable=false)

longFillColor = highlightTrend ? (trendDir == 1 ? upColor : na) : na
shortFillColor = highlightTrend ? (trendDir == -1 ? downColor : na) : na
//fill(midPricePlot, longStopPlot, title="Long State Filling", color=longFillColor)
//fill(midPricePlot, shortStopPlot, title="Short State Filling", color=shortFillColor)

// === STRATEGY EXECUTION ===
trendChanged = trendDir != trendDir[1]
//alertcondition(trendChanged, title="Alert: SuperTrend Direction Change", message="SuperTrend has changed direction!\nSymbol: {{exchange}}:{{ticker}}\nPrice: {{close}}")
//alertcondition(buySignal, title="Alert: SuperTrend Buy", message="SuperTrend Buy!\nSymbol: {{exchange}}:{{ticker}}\nPrice: {{close}}")
//alertcondition(sellSignal, title="Alert: SuperTrend Sell", message="SuperTrend Sell!\nSymbol: {{exchange}}:{{ticker}}\nPrice: {{close}}")

if buySignal
    strategy.entry("Buy", strategy.long, comment="Buy")
if sellSignal
    strategy.close("Buy", comment="Sell")

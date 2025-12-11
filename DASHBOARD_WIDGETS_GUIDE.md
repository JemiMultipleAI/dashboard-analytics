# Dashboard Widgets Guide

This guide lists all available widgets and which ones you need to create each Looker Studio-style dashboard.

## Available Widgets

### Google Analytics 4 (GA4) Widgets

#### Basic Widgets
- `ga4-realtime` - Realtime Overview
- `ga4-acquisition` - Acquisition Summary
- `ga4-top-pages` - Top Pages
- `ga4-events` - Events Summary
- `ga4-devices` - Device Breakdown
- `ga4-daily-users` - Daily Users Chart

#### Key Events Widgets (NEW)
- `ga4-key-events-summary` - Key Events Summary (2 cards: Key events, Session key event rate)
- `ga4-key-events-trend` - Key Events Trend Chart (line chart with previous year comparison)
- `ga4-key-events-source` - Key Events By Source Table
- `ga4-key-events-breakdown` - Key Event Breakdown Chart

#### Landing Pages Widgets (NEW)
- `ga4-landing-pages` - Landing Pages Performance (includes both Service Pages and Blog Content)

#### Traffic Widgets (NEW)
- `ga4-traffic-source` - Traffic Source Table
- `ga4-sessions-trend` - Sessions Trend Chart (with previous year comparison)
- `ga4-organic-sessions-trend` - Organic Sessions Trend Chart (with previous year comparison)

#### Audience Widgets (NEW)
- `ga4-audience-geography` - Audience By State (map placeholder + table)
- `ga4-audience-age` - Audience Age (pie chart)
- `ga4-audience-gender` - Audience Gender (pie chart)
- `ga4-audience-location-events` - Key Events Based on Location

### Google Search Console (GSC) Widgets

#### Basic Widgets
- `gsc-overview` - Performance Overview (2 cards: Clicks, Impressions)
- `gsc-queries` - Top Queries
- `gsc-pages` - Top Pages
- `gsc-indexing` - Indexing Status
- `gsc-vitals` - Core Web Vitals
- `gsc-clicks-chart` - Clicks Over Time (with previous year comparison)

#### New Widgets
- `gsc-keyword-positions` - Keyword Positions (4 summary cards + keyword table with Volume, Position, Δ)
- `gsc-impressions-chart` - Impressions Over Time (with previous year comparison)

### Google Ads Widgets

- `ads-overview` - Campaign Overview (2 cards)
- `ads-campaigns` - Campaign Performance Table
- `ads-keywords` - Keyword Performance
- `ads-recommendations` - Recommendations
- `ads-spend-chart` - Spend Over Time

---

## Dashboard Widget Requirements

### 1. Desktop Dashboard (Overview)
**Layout:** 2x3 grid of summary cards

**Required Widgets:**
1. **Key Events Card** - Use `ga4-key-events-summary` (shows 2 metrics)
2. **Website Traffic Card** - Use `ga4-sessions-trend` or create custom summary cards
3. **Keyword Positions Card** - Use `gsc-keyword-positions` (shows 4 summary cards)
4. **Google Ads Card** - Use `ads-overview` (shows 2 cards)
5. **Landing Page Performance** - Use `ga4-landing-pages` (shows tables)
6. **Audience Card** - Use `ga4-audience-gender` (pie chart)

**Note:** You may need to create custom summary widgets that combine multiple metrics into single cards for the overview dashboard.

---

### 2. Key Events Dashboard

**Required Widgets:**
1. `ga4-key-events-summary` - Top left (2 summary cards)
2. `ga4-key-events-trend` - Middle right (Overall Key Events line chart)
3. `ga4-key-events-source` - Bottom left (Key Events By Source table)
4. `ga4-key-events-breakdown` - Bottom right (Key Event Breakdown bar chart)

**Layout:**
- Top: 2 summary cards side by side
- Middle: Line chart (full width or right side)
- Bottom: Table (left) + Bar chart (right)

---

### 3. Traffic Dashboard

**Required Widgets:**
1. **Summary Cards** - Create custom cards or use:
   - `ga4-sessions-trend` (extract summary)
   - Custom Sessions card
   - Custom Organic Sessions card
2. `ga4-traffic-source` - Traffic Source table
3. `ga4-devices` - Device Breakdown (pie chart)
4. `ga4-sessions-trend` - Overall Sessions line chart
5. `ga4-organic-sessions-trend` - Organic Sessions line chart

**Layout:**
- Top: 2 summary cards
- Left: Traffic Source table + Device Breakdown pie chart
- Right: 2 line charts (Sessions and Organic Sessions)

---

### 4. Keywords Dashboard

**Required Widgets:**
1. `gsc-keyword-positions` - Includes all 4 summary cards + keyword table

**Layout:**
- Top: 4 summary cards in a row
- Bottom: Keyword positions table

---

### 5. Google Ads Dashboard

**Required Widgets:**
1. `ads-overview` - 4 summary cards (Clicks, Conversions, Cost, Cost/conv.)
2. `ads-campaigns` - Campaign Performance table
3. `ads-ad-groups` - Ad Group Performance (from AdsWidgets)
4. `ads-device-breakdown` - Device Breakdown (from AdsWidgets)
5. `ads-keywords` - Keyword Performance
6. `ads-recommendations` - Recommendations
7. `ads-spend-chart` - Spend Over Time

**Note:** This dashboard is already implemented at `/dashboard/ads`

---

### 6. Landing Pages Dashboard

**Required Widgets:**
1. `ga4-landing-pages` - Includes both Service Pages and Blog Content sections

**Layout:**
- Service Pages section (3 summary cards + table)
- Blog Content section (3 summary cards + table)

---

### 7. Audience Dashboard

**Required Widgets:**
1. `ga4-audience-geography` - Audience By State (map + table)
2. `ga4-audience-age` - Audience Age (pie chart)
3. `ga4-devices` - Device Breakdown (pie chart) - or use `ga4-audience-device` if created
4. `ga4-audience-gender` - Audience Gender (pie chart)
5. `ga4-audience-location-events` - Key Events Based on Location

**Layout:**
- Top: Audience By State (map + table)
- Middle: 3 pie charts (Age, Gender, Device)
- Bottom: Key Events By Location list

---

### 8. Search Console Dashboard

**Required Widgets:**
1. `gsc-overview` - 3 summary cards (Clicks, Impressions, Site CTR)
2. `gsc-clicks-chart` - Clicks Over Time (with previous year)
3. `gsc-impressions-chart` - Impressions Over Time (with previous year)
4. `gsc-queries` - Query table

**Layout:**
- Top: 3 summary cards
- Middle: 2 line charts side by side (Clicks and Impressions)
- Right: Query table

**Note:** You may need to enhance `gsc-overview` to show 3 cards instead of 2, or create a custom summary widget.

---

## Quick Reference: Widget IDs for Dashboard Builder

### For Desktop Dashboard Overview:
```
ga4-key-events-summary
ga4-sessions-summary (custom - may need to create)
gsc-keyword-positions-summary (extract from gsc-keyword-positions)
ads-overview
ga4-landing-pages-summary (extract from ga4-landing-pages)
ga4-audience-gender
```

### For Key Events Dashboard:
```
ga4-key-events-summary
ga4-key-events-trend
ga4-key-events-source
ga4-key-events-breakdown
```

### For Traffic Dashboard:
```
ga4-sessions-summary (custom)
ga4-traffic-source
ga4-devices
ga4-sessions-trend
ga4-organic-sessions-trend
```

### For Keywords Dashboard:
```
gsc-keyword-positions
```

### For Google Ads Dashboard:
```
ads-overview
ads-campaigns
ads-ad-groups
ads-device-breakdown
ads-keywords
ads-recommendations
ads-spend-chart
```

### For Landing Pages Dashboard:
```
ga4-landing-pages
```

### For Audience Dashboard:
```
ga4-audience-geography
ga4-audience-age
ga4-devices
ga4-audience-gender
ga4-audience-location-events
```

### For Search Console Dashboard:
```
gsc-overview (enhanced to 3 cards)
gsc-clicks-chart
gsc-impressions-chart
gsc-queries
```

---

## Notes

1. **Custom Summary Widgets:** Some dashboards may require custom summary widgets that extract specific metrics from larger widgets. You can create these in the Dashboard Builder by selecting specific metrics.

2. **Date Range Picker:** The date range picker is currently only available on the Ads dashboard. You may want to add it to other dashboards as well.

3. **Mock Data:** All widgets fall back to mock data if the API is not connected or fails. This allows you to test dashboards without real API connections.

4. **Real Data Integration:** When APIs are connected, widgets automatically fetch real data. The mock data structure matches the real data structure for seamless transitions.

---

## Next Steps

1. Go to the Dashboard Builder
2. Create a new dashboard
3. Add the required widgets listed above
4. Arrange them in the layout matching the Looker Studio examples
5. Save and test your dashboard

All widgets are now available in the widget library and can be added to your custom dashboards!


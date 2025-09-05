# CryptoTrend Alerts

> **Never miss a crypto market move again.**

A comprehensive, browser-based cryptocurrency price and volume alerts application built with React and Tailwind CSS. This application provides real-time monitoring, customizable alerts, and technical indicators for cryptocurrency trading.

## 🚀 Features

### Core Features
- **Real-time Trend Alerts**: Instant notifications for significant price movements or volume spikes
- **Personalized Watchlist**: Custom watchlists with user-defined alert parameters
- **Simplified Data Dashboard**: Clean interface displaying price, volume, and market cap data
- **Basic Trading Signal Indicators**: RSI, SMA, and volume spike detection

### Advanced Features
- **Volume Spike Detection**: Automated detection of unusual trading volume
- **Technical Indicators**: RSI (14-period), SMA (20/50), trend analysis
- **Browser Push Notifications**: Real-time alerts even when the app is closed
- **Subscription Tiers**: Free (3 alerts, 10 watchlist items) and Pro (unlimited)
- **Settings Management**: Customizable refresh intervals, currency display, themes
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **API**: CoinGecko API for real-time crypto data
- **Storage**: Local Storage for data persistence
- **Notifications**: Browser Notification API
- **State Management**: React Context API

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── AppShell.jsx    # Main layout component
│   ├── Dashboard.jsx   # Main dashboard view
│   ├── WatchlistItem.jsx # Individual crypto card
│   ├── AlertConfigForm.jsx # Alert configuration modal
│   ├── TechnicalIndicators.jsx # Trading signals display
│   ├── Settings.jsx    # Settings panel
│   ├── DataTable.jsx   # Reusable table component
│   ├── NotificationToggle.jsx # Notification controls
│   └── InputWithUnits.jsx # Input with unit display
├── contexts/           # React context providers
│   └── AppContext.jsx  # Main application state
├── services/           # API and utility services
│   ├── api.js         # CoinGecko API integration
│   ├── notifications.js # Browser notification service
│   └── storage.js     # Local storage service
├── types/              # Type definitions and constants
│   └── index.js       # Data models and types
└── styles/             # CSS styles
    └── index.css      # Global styles and Tailwind config
```

## 🎨 Design System

The application follows a comprehensive design system with:

### Color Palette
- **Primary**: `hsl(210, 80%, 50%)` - Blue for primary actions
- **Accent**: `hsl(140, 60%, 45%)` - Green for positive indicators
- **Background**: `hsl(210, 30%, 10%)` - Dark background
- **Surface**: `hsl(210, 30%, 15%)` - Card backgrounds
- **Positive**: `hsl(110, 60%, 45%)` - Green for gains
- **Negative**: `hsl(0, 70%, 50%)` - Red for losses

### Typography
- **Display**: `text-5xl font-bold` - Large headings
- **Heading**: `text-2xl font-semibold` - Section headers
- **Body**: `text-base font-normal` - Regular text
- **Caption**: `text-sm font-medium` - Small text

### Components
- **Cards**: Default and elevated variants with consistent spacing
- **Buttons**: Primary and secondary styles with hover states
- **Forms**: Consistent input styling with focus states
- **Tables**: Responsive data tables with formatting

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Modern web browser with notification support

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd crypto-trend-alerts
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 📊 API Integration

### CoinGecko API
- **Base URL**: `https://api.coingecko.com/api/v3`
- **Rate Limits**: Respects free tier limitations
- **Caching**: Implements response caching to reduce API calls
- **Error Handling**: Comprehensive error handling with user feedback

### Key Endpoints Used
- `/coins/markets` - Market data for cryptocurrencies
- `/search` - Search for cryptocurrencies
- `/coins/{id}/market_chart` - Historical data for technical indicators

## 🔔 Notification System

The application uses the Browser Notification API to provide real-time alerts:

- **Permission Handling**: Requests user permission gracefully
- **Alert Types**: Price above/below, percentage change, volume spikes
- **Customizable**: Users can enable/disable notifications per alert
- **Fallback**: Graceful degradation for unsupported browsers

## 💾 Data Persistence

All user data is stored locally using the browser's Local Storage:

- **User Preferences**: Settings, subscription tier, notification preferences
- **Watchlists**: Custom cryptocurrency watchlists
- **Alerts**: Active and historical alert configurations
- **Cache**: API response caching for improved performance

## 🎯 User Flows

### Onboarding Flow
1. User visits the application
2. Prompted to add first cryptocurrency to watchlist
3. Search and select cryptocurrency (e.g., Bitcoin)
4. Set custom alert parameters
5. Enable notifications (optional)
6. View dashboard with watchlist

### Alert Configuration Flow
1. Click settings icon on watchlist item
2. Configure alert types (price above/below, percentage change, volume spike)
3. Set threshold values
4. Enable/disable specific alerts
5. Save configuration
6. Receive notifications when thresholds are met

## 🔧 Configuration

### Environment Variables
No environment variables required - the application uses public APIs and local storage.

### Browser Compatibility
- Chrome 50+
- Firefox 44+
- Safari 10+
- Edge 79+

## 🚀 Deployment

The application is a static SPA that can be deployed to any static hosting service:

- **Vercel**: `vercel --prod`
- **Netlify**: Deploy `dist/` folder
- **GitHub Pages**: Deploy `dist/` folder
- **AWS S3**: Upload `dist/` contents

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 📈 Performance

- **Bundle Size**: ~190KB (gzipped: ~57KB)
- **Load Time**: < 2s on 3G connection
- **API Caching**: Reduces redundant requests
- **Lazy Loading**: Components loaded on demand

## 🔒 Security

- **No API Keys**: Uses public CoinGecko API
- **Local Storage**: All data stored locally, no server transmission
- **XSS Protection**: React's built-in XSS protection
- **HTTPS**: Recommended for production deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **CoinGecko** for providing free cryptocurrency data API
- **Lucide** for beautiful icons
- **Tailwind CSS** for utility-first styling
- **React** team for the excellent framework

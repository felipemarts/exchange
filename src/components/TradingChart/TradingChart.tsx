import { useEffect, useRef } from 'react';
import './TradingChart.scss';

interface TradingChartProps {
  symbol: string;
}

declare global {
  interface Window {
    TradingView: {
      widget: new (config: TradingViewConfig) => TradingViewWidget;
    };
  }
}

interface TradingViewConfig {
  autosize: boolean;
  symbol: string;
  interval: string;
  timezone: string;
  theme: string;
  style: string;
  locale: string;
  toolbar_bg: string;
  enable_publishing: boolean;
  allow_symbol_change: boolean;
  container_id: string;
  hide_side_toolbar: boolean;
  studies: string[];
  show_popup_button: boolean;
  popup_width: string;
  popup_height: string;
}

interface TradingViewWidget {
  remove: () => void;
}

export function TradingChart({ symbol }: TradingChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<TradingViewWidget | null>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (containerRef.current && window.TradingView) {
        // Map our symbol to TradingView format
        const tvSymbol = symbol.replace('/', '') === 'BTCBRL'
          ? 'BINANCE:BTCBRL'
          : symbol.replace('/', '') === 'ETHBRL'
          ? 'BINANCE:ETHBRL'
          : 'BINANCE:BTCUSDT';

        widgetRef.current = new window.TradingView.widget({
          autosize: true,
          symbol: tvSymbol,
          interval: '180',
          timezone: 'America/Sao_Paulo',
          theme: 'dark',
          style: '1',
          locale: 'br',
          toolbar_bg: '#0d1117',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: 'tradingview_chart',
          hide_side_toolbar: false,
          studies: ['Volume@tv-basicstudies'],
          show_popup_button: true,
          popup_width: '1000',
          popup_height: '650',
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      if (widgetRef.current) {
        try {
          widgetRef.current.remove();
        } catch (e) {
          // Widget may already be removed from DOM
        }
        widgetRef.current = null;
      }
      if (script.parentNode) {
        script.remove();
      }
    };
  }, [symbol]);

  return (
    <div className="trading-chart">
      <div className="chart-toolbar">
        <div className="time-intervals">
          <button className="interval-btn">1m</button>
          <button className="interval-btn">5m</button>
          <button className="interval-btn">15m</button>
          <button className="interval-btn">1h</button>
          <button className="interval-btn active">3h</button>
          <button className="interval-btn">1D</button>
          <button className="interval-btn">1W</button>
        </div>
        <div className="chart-tools">
          <button className="tool-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
              <path d="M11 8v6M8 11h6" />
            </svg>
            Comparar
          </button>
          <button className="tool-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3v18h18" />
              <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
            </svg>
            Indicadores
          </button>
        </div>
      </div>
      <div className="chart-container" ref={containerRef}>
        <div id="tradingview_chart" />
      </div>
    </div>
  );
}

import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';

/**
 * Web Vitals → GA4.
 *
 * A home tem uma cena WebGL, então LCP/INP reais importam. Cada métrica vira um
 * evento GA4 (o `gtag` já vive no index.html). Valores seguem a convenção do
 * Google: CLS ×1000 (inteiro), o resto em ms arredondado; `non_interaction`
 * para não sujar a taxa de rejeição. Rode só em produção.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const sendToGA = (metric: Metric) => {
  window.gtag?.('event', metric.name, {
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    metric_id: metric.id,
    metric_value: metric.value,
    metric_delta: metric.delta,
    metric_rating: metric.rating,
    non_interaction: true,
  });
};

/** Assina as métricas essenciais e as envia ao GA4. */
export const reportWebVitals = () => {
  onCLS(sendToGA);
  onINP(sendToGA);
  onLCP(sendToGA);
  onFCP(sendToGA);
  onTTFB(sendToGA);
};

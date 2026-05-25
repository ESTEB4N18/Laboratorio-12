import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './weather-time.js';

describe('weather-time', () => {
  let weatherTime;

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => ({
        current: {
          temperature_2m: 29.6,
          weather_code: 1
        }
      })
    })));

    weatherTime = document.createElement('weather-time');
    weatherTime.setAttribute('city', 'Liberia');
    weatherTime.setAttribute('latitude', '10.6346');
    weatherTime.setAttribute('longitude', '-85.4407');
  });

  afterEach(() => {
    weatherTime.remove();
    vi.unstubAllGlobals();
  });

  it('llama a la API de clima con las coordenadas configuradas', async () => {
    document.body.append(weatherTime);
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(fetch).toHaveBeenCalledOnce();

    const [url] = fetch.mock.calls[0];

    expect(url.origin).toBe('https://api.open-meteo.com');
    expect(url.pathname).toBe('/v1/forecast');
    expect(url.searchParams.get('latitude')).toBe('10.6346');
    expect(url.searchParams.get('longitude')).toBe('-85.4407');
    expect(url.searchParams.get('current')).toBe('temperature_2m,weather_code');
  });

  it('renderiza la temperatura y condicion recibidas desde la API', async () => {
    document.body.append(weatherTime);
    await new Promise((resolve) => setTimeout(resolve, 0));

    const temperature = weatherTime.shadowRoot.querySelector('.temperature');
    const condition = weatherTime.shadowRoot.querySelector('.condition');

    expect(temperature.textContent).toContain('30');
    expect(condition.textContent).toContain('Principalmente despejado');
  });
});

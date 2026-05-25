class WeatherTime extends HTMLElement {
  constructor() {
    super();
    // Shadow DOM: el clima mantiene HTML y CSS aislados del documento.
    this.attachShadow({ mode: 'open' });
    this.isReady = false;
    this.abortController = null;
    this.weather = {
      temperature: null,
      condition: null,
      icon: null,
      loading: false,
      error: ''
    };
  }

  // Reactividad: la ubicacion vuelve a consultar la API; temperature y condition son respaldo manual.
  static get observedAttributes() {
    return ['city', 'latitude', 'longitude', 'temperature', 'condition'];
  }

  connectedCallback() {
    this.isReady = true;
    this.render();
    this.loadWeather();
  }

  disconnectedCallback() {
    this.cancelWeatherRequest();
  }

  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (!this.isReady) return;

    this.render();

    if (['city', 'latitude', 'longitude'].includes(attributeName)) {
      this.loadWeather();
    }
  }

  get city() {
    return this.getAttribute('city') || 'Ciudad';
  }

  get latitude() {
    return this.getAttribute('latitude') || '10.6346';
  }

  get longitude() {
    return this.getAttribute('longitude') || '-85.4407';
  }

  get temperature() {
    return this.weather.temperature ?? this.getAttribute('temperature') ?? '--';
  }

  get condition() {
    return this.weather.condition ?? this.getAttribute('condition') ?? 'Sin datos';
  }

  get conditionLabel() {
    return this.condition;
  }

  get weatherIcon() {
    if (this.weather.icon) return this.weather.icon;

    const icons = {
      sunny: 'SOL',
      cloudy: 'NUB',
      rainy: 'LLV',
      stormy: 'TRM'
    };

    return icons[this.condition.toLowerCase()] || 'CLM';
  }

  getWeatherInfo(weatherCode) {
    const weatherCodes = {
      0: ['SOL', 'Despejado'],
      1: ['SOL', 'Principalmente despejado'],
      2: ['NUB', 'Parcialmente nublado'],
      3: ['NUB', 'Nublado'],
      45: ['NBL', 'Neblina'],
      48: ['NBL', 'Neblina'],
      51: ['LLV', 'Llovizna ligera'],
      53: ['LLV', 'Llovizna'],
      55: ['LLV', 'Llovizna intensa'],
      61: ['LLV', 'Lluvia ligera'],
      63: ['LLV', 'Lluvia'],
      65: ['LLV', 'Lluvia fuerte'],
      80: ['AGU', 'Aguaceros ligeros'],
      81: ['AGU', 'Aguaceros'],
      82: ['AGU', 'Aguaceros fuertes'],
      95: ['TRM', 'Tormenta'],
      96: ['TRM', 'Tormenta con granizo'],
      99: ['TRM', 'Tormenta fuerte']
    };

    const [icon, label] = weatherCodes[weatherCode] || ['CLM', 'Clima actualizado'];
    return { icon, label };
  }

  cancelWeatherRequest() {
    if (!this.abortController) return;

    this.abortController.abort();
    this.abortController = null;
  }

  async loadWeather() {
    this.cancelWeatherRequest();

    this.abortController = new AbortController();
    this.weather = {
      ...this.weather,
      loading: true,
      error: ''
    };
    this.render();

    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude', this.latitude);
    url.searchParams.set('longitude', this.longitude);
    url.searchParams.set('current', 'temperature_2m,weather_code');
    url.searchParams.set('timezone', 'auto');

    try {
      const response = await fetch(url, {
        signal: this.abortController.signal
      });

      if (!response.ok) {
        throw new Error('No se pudo obtener el clima');
      }

      const data = await response.json();
      const currentWeather = data.current;

      if (!currentWeather) {
        throw new Error('La API no devolvio clima actual');
      }

      const temperature = Math.round(currentWeather.temperature_2m);
      const weather = this.getWeatherInfo(currentWeather.weather_code);

      this.weather = {
        temperature,
        condition: weather.label,
        icon: weather.icon,
        loading: false,
        error: ''
      };

      this.render();
      this.emitWeatherUpdate();
    } catch (error) {
      if (error.name === 'AbortError') return;

      this.weather = {
        ...this.weather,
        loading: false,
        error: 'Clima no disponible'
      };
      this.render();
    }
  }

  emitWeatherUpdate() {
    if (!this.isReady) return;

    // CustomEvent informativo: comunica que los datos del clima se actualizaron.
    this.dispatchEvent(new CustomEvent('weather-update', {
      detail: {
        city: this.city,
        temperature: this.temperature,
        condition: this.condition
      },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    const eyebrow = this.weather.loading ? 'Consultando clima' : 'Clima actual';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          min-width: 0;
        }

        .weather {
          height: 100%;
          min-height: 270px;
          display: grid;
          align-content: space-between;
          gap: 22px;
          padding: 28px;
          border-radius: 8px;
          background: linear-gradient(160deg, #ffffff 0%, #f7fbfc 100%);
          box-shadow: 0 18px 45px rgba(28, 37, 41, 0.12);
          overflow: hidden;
          position: relative;
        }

        .weather::after {
          content: "";
          position: absolute;
          right: -44px;
          top: -44px;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: rgba(244, 196, 48, 0.22);
        }

        .header,
        .details {
          position: relative;
          z-index: 1;
        }

        .eyebrow {
          margin: 0 0 8px;
          color: #547079;
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .city {
          margin: 0;
          color: #1c2529;
          font-size: 1.45rem;
          font-weight: 850;
          line-height: 1.1;
        }

        .details {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 18px;
        }

        .temperature {
          color: #168aad;
          font-size: clamp(3rem, 9vw, 4.7rem);
          font-weight: 900;
          line-height: 0.9;
        }

        .condition {
          display: grid;
          justify-items: end;
          gap: 6px;
          color: #344b52;
          font-weight: 800;
          text-align: right;
        }

        .icon {
          width: 54px;
          height: 54px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          background: rgba(244, 196, 48, 0.22);
          color: #f4a261;
          font-size: 0.82rem;
          font-weight: 900;
          line-height: 1;
        }

        slot[name="note"]::slotted(*) {
          position: relative;
          z-index: 1;
          margin: 0;
          color: #547079;
          font-size: 0.9rem;
        }

        .message {
          position: relative;
          z-index: 1;
          margin: 0;
          color: #8b5151;
          font-size: 0.88rem;
          font-weight: 700;
        }
      </style>

      <section class="weather" part="card">
        <div class="header">
          <p class="eyebrow">${eyebrow}</p>
          <h2 class="city" part="city">${this.city}</h2>
        </div>

        <div class="details">
          <div class="temperature" part="temperature">${this.temperature}&deg;C</div>

          <div class="condition" part="condition">
            <span class="icon" aria-hidden="true">${this.weatherIcon}</span>
            <span>${this.conditionLabel}</span>
          </div>
        </div>

        ${this.weather.error ? `<p class="message">${this.weather.error}</p>` : ''}
        <slot name="note"></slot>
      </section>
    `;
  }
}

customElements.define('weather-time', WeatherTime);

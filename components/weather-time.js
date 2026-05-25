class WeatherTime extends HTMLElement {
  constructor() {
    super();
    // Shadow DOM: el clima mantiene HTML y CSS aislados del documento.
    this.attachShadow({ mode: 'open' });
    this.isReady = false;
  }

  // Reactividad: city, temperature y condition actualizan el render.
  static get observedAttributes() {
    return ['city', 'temperature', 'condition'];
  }

  connectedCallback() {
    this.isReady = true;
    this.render();
    this.emitWeatherUpdate();
  }

  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (oldValue === newValue) return;
    this.render();
    this.emitWeatherUpdate();
  }

  get city() {
    return this.getAttribute('city') || 'Ciudad';
  }

  get temperature() {
    return this.getAttribute('temperature') || '--';
  }

  get condition() {
    return this.getAttribute('condition') || 'Sin datos';
  }

  get conditionLabel() {
    const labels = {
      sunny: 'Soleado',
      cloudy: 'Nublado',
      rainy: 'Lluvioso',
      stormy: 'Tormenta'
    };

    return labels[this.condition.toLowerCase()] || this.condition;
  }

  get weatherIcon() {
    const icons = {
      sunny: 'SOL',
      cloudy: 'NUB',
      rainy: 'LLV',
      stormy: 'TRM'
    };

    return icons[this.condition.toLowerCase()] || 'CLM';
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
      </style>

      <section class="weather" part="card">
        <div class="header">
          <p class="eyebrow">Clima actual</p>
          <h2 class="city" part="city">${this.city}</h2>
        </div>

        <div class="details">
          <div class="temperature" part="temperature">${this.temperature}&deg;C</div>

          <div class="condition" part="condition">
            <span class="icon" aria-hidden="true">${this.weatherIcon}</span>
            <span>${this.conditionLabel}</span>
          </div>
        </div>

        <slot name="note"></slot>
      </section>
    `;
  }
}

customElements.define('weather-time', WeatherTime);

class WarningBadge extends HTMLElement {
  constructor() {
    super();
    // Shadow DOM: la alerta conserva su animacion y estilos encapsulados.
    this.attachShadow({ mode: 'open' });
    this.isReady = false;
  }

  // Reactividad: pulsing aparece/desaparece y vuelve a ejecutar render().
  static get observedAttributes() {
    return ['pulsing'];
  }

  connectedCallback() {
    this.isReady = true;
    this.render();
  }

  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (oldValue === newValue) return;
    this.render();
    this.emitPulseChange();
  }

  get pulsing() {
    return this.hasAttribute('pulsing');
  }

  emitPulseChange() {
    if (!this.isReady) return;

    // CustomEvent: avisa si la alerta entro o salio del estado pulsing.
    this.dispatchEvent(new CustomEvent('warning-pulse-change', {
      detail: {
        pulsing: this.pulsing
      },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    const pulseClass = this.pulsing ? 'is-pulsing' : '';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          min-width: 0;
        }

        .badge {
          min-height: 270px;
          height: 100%;
          display: grid;
          place-items: center;
          gap: 12px;
          padding: 28px;
          border-radius: 8px;
          background: #cf2a2a;
          color: #ffffff;
          box-shadow: 0 18px 45px rgba(207, 42, 42, 0.24);
          text-align: center;
          font-size: 1.15rem;
          font-weight: 850;
          line-height: 1.25;
        }

        .icon {
          width: 54px;
          height: 54px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.18);
          font-size: 1.9rem;
        }

        .is-pulsing {
          animation: pulse 950ms ease-in-out infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 18px 45px rgba(207, 42, 42, 0.24);
          }

          50% {
            transform: scale(1.035);
            box-shadow: 0 22px 52px rgba(207, 42, 42, 0.36);
          }

          100% {
            transform: scale(1);
            box-shadow: 0 18px 45px rgba(207, 42, 42, 0.24);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .is-pulsing {
            animation: none;
          }
        }
      </style>

      <aside class="badge ${pulseClass}" part="badge" role="status" aria-live="polite">
        <span class="icon" part="icon" aria-hidden="true">!</span>
        <slot>Alerta activa</slot>
      </aside>
    `;
  }
}

customElements.define('warning-badge', WarningBadge);

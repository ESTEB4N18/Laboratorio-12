class UserDashboard extends HTMLElement {
  constructor() {
    super();
    // Shadow DOM: user-dashboard encapsula el layout y distribuye hijos con slot.
    this.attachShadow({ mode: 'open' });
    this.handleUserGreet = this.handleUserGreet.bind(this);
    this.pulseTimer = null;
  }

  // Reactividad: el titulo del dashboard puede cambiar por atributo.
  static get observedAttributes() {
    return ['heading'];
  }

  connectedCallback() {
    this.render();
    this.addEventListener('user-greet', this.handleUserGreet);
  }

  disconnectedCallback() {
    this.removeEventListener('user-greet', this.handleUserGreet);
    clearTimeout(this.pulseTimer);
  }

  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (oldValue === newValue) return;
    this.render();
  }

  get heading() {
    return this.getAttribute('heading') || 'Panel de Usuario';
  }

  handleUserGreet(event) {
    const { name } = event.detail;
    const warningBadge = this.querySelector('warning-badge');

    // Flujo de eventos: captura user-greet, activa pulsing y luego lo remueve.
    console.log(`Hola ${name}`);

    if (!warningBadge) return;

    warningBadge.message = `Hola ${name}, saludo recibido`;
    warningBadge.setAttribute('pulsing', '');
    clearTimeout(this.pulseTimer);

    this.pulseTimer = setTimeout(() => {
      warningBadge.removeAttribute('pulsing');
    }, 3000);

    this.dispatchEvent(new CustomEvent('dashboard-greeting', {
      detail: {
        name,
        message: `Hola ${name}`
      },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          width: 100%;
          display: block;
        }

        .shell {
          display: grid;
          gap: 24px;
          padding: 0;
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .title {
          margin: 0;
          color: #1c2529;
          font-size: clamp(1.7rem, 4vw, 2.4rem);
          font-weight: 900;
          line-height: 1.05;
        }

        .status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(46, 125, 50, 0.12);
          color: #2e7d32;
          font-size: 0.86rem;
          font-weight: 800;
          white-space: nowrap;
        }

        .dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #2e7d32;
        }

        .content {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
        }

        slot {
          display: contents;
        }

        ::slotted(*) {
          min-width: 0;
        }

        @media (max-width: 880px) {
          .content {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 680px) {
          .shell {
            padding: 0;
          }

          .header {
            align-items: start;
            flex-direction: column;
          }

          .content {
            grid-template-columns: 1fr;
          }
        }
      </style>

      <section class="shell" part="shell">
        <header class="header" part="header">
          <h1 class="title" part="title">${this.heading}</h1>
          <span class="status" part="status">
            <span class="dot" aria-hidden="true"></span>
            Sesi&oacute;n activa
          </span>
        </header>

        <div class="content" part="content">
          <slot></slot>
        </div>
      </section>
    `;
  }
}

customElements.define('user-dashboard', UserDashboard);

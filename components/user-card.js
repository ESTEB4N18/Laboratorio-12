class UserCard extends HTMLElement {
  constructor() {
    super();
    // Shadow DOM: encapsula la estructura y estilos del componente.
    this.attachShadow({ mode: 'open' });
    this.handleClick = this.handleClick.bind(this);
  }

  // Reactividad: estos atributos ejecutan attributeChangedCallback al cambiar.
  static get observedAttributes() {
    return ['name', 'role', 'avatar'];
  }

  connectedCallback() {
    this.render();
    this.shadowRoot.addEventListener('click', this.handleClick);
  }

  disconnectedCallback() {
    this.shadowRoot.removeEventListener('click', this.handleClick);
  }

  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (oldValue === newValue) return;
    this.render();
  }

  get name() {
    return this.getAttribute('name') || 'Usuario';
  }

  get role() {
    return this.getAttribute('role') || 'Invitado';
  }

  get avatar() {
    return this.getAttribute('avatar') || 'https://i.pravatar.cc/150';
  }

  handleClick(event) {
    if (!event.target.closest('[data-action="greet"]')) return;
    this.sendGreeting();
  }

  sendGreeting() {
    // Flujo de eventos: user-card emite user-greet hacia user-dashboard.
    this.dispatchEvent(new CustomEvent('user-greet', {
      detail: {
        name: this.name
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

        .card {
          height: 100%;
          min-height: 270px;
          display: grid;
          align-content: center;
          justify-items: center;
          gap: 16px;
          padding: 28px;
          border-radius: 8px;
          background: #ffffff;
          box-shadow: 0 18px 45px rgba(28, 37, 41, 0.12);
          text-align: center;
        }

        .avatar {
          width: 104px;
          height: 104px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid #f4c430;
          box-shadow: 0 12px 28px rgba(28, 37, 41, 0.16);
        }

        .content {
          display: grid;
          gap: 5px;
        }

        .name {
          margin: 0;
          color: #1c2529;
          font-size: 1.45rem;
          font-weight: 800;
          line-height: 1.1;
        }

        .role {
          margin: 0;
          color: #547079;
          font-size: 0.98rem;
          font-weight: 600;
        }

        .button {
          border: 0;
          border-radius: 999px;
          padding: 12px 20px;
          background: #168aad;
          color: #ffffff;
          font: inherit;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 12px 24px rgba(22, 138, 173, 0.28);
          transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease;
        }

        .button:hover {
          background: #126f8d;
          transform: translateY(-2px);
          box-shadow: 0 16px 30px rgba(22, 138, 173, 0.32);
        }

        .button:focus-visible {
          outline: 3px solid rgba(244, 196, 48, 0.7);
          outline-offset: 3px;
        }

        slot[name="actions"]::slotted(*) {
          margin-top: 4px;
        }
      </style>

      <article class="card" part="card">
        <img class="avatar" part="avatar" src="${this.avatar}" alt="Avatar de ${this.name}">

        <div class="content">
          <h2 class="name" part="name">${this.name}</h2>
          <p class="role" part="role">${this.role}</p>
        </div>

        <button class="button" part="button" type="button" data-action="greet">
          Saludar
        </button>

        <slot name="actions"></slot>
      </article>
    `;
  }
}

customElements.define('user-card', UserCard);

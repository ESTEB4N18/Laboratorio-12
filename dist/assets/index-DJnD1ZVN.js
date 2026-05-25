var e=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t),e=null),t.exports);(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var t=e((()=>{var e=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:`open`}),this.handleClick=this.handleClick.bind(this)}static get observedAttributes(){return[`name`,`role`,`avatar`]}connectedCallback(){this.render(),this.shadowRoot.addEventListener(`click`,this.handleClick)}disconnectedCallback(){this.shadowRoot.removeEventListener(`click`,this.handleClick)}attributeChangedCallback(e,t,n){t!==n&&this.render()}get name(){return this.getAttribute(`name`)||`Usuario`}get role(){return this.getAttribute(`role`)||`Invitado`}get avatar(){return this.getAttribute(`avatar`)||`https://i.pravatar.cc/150`}handleClick(e){e.target.closest(`[data-action="greet"]`)&&this.sendGreeting()}sendGreeting(){this.dispatchEvent(new CustomEvent(`user-greet`,{detail:{name:this.name},bubbles:!0,composed:!0}))}render(){this.shadowRoot.innerHTML=`
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
    `}};customElements.define(`user-card`,e)})),n=e((()=>{var e=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:`open`}),this.isReady=!1}static get observedAttributes(){return[`city`,`temperature`,`condition`]}connectedCallback(){this.isReady=!0,this.render(),this.emitWeatherUpdate()}attributeChangedCallback(e,t,n){t!==n&&(this.render(),this.emitWeatherUpdate())}get city(){return this.getAttribute(`city`)||`Ciudad`}get temperature(){return this.getAttribute(`temperature`)||`--`}get condition(){return this.getAttribute(`condition`)||`Sin datos`}get conditionLabel(){return{sunny:`Soleado`,cloudy:`Nublado`,rainy:`Lluvioso`,stormy:`Tormenta`}[this.condition.toLowerCase()]||this.condition}get weatherIcon(){return{sunny:`SOL`,cloudy:`NUB`,rainy:`LLV`,stormy:`TRM`}[this.condition.toLowerCase()]||`CLM`}emitWeatherUpdate(){this.isReady&&this.dispatchEvent(new CustomEvent(`weather-update`,{detail:{city:this.city,temperature:this.temperature,condition:this.condition},bubbles:!0,composed:!0}))}render(){this.shadowRoot.innerHTML=`
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
    `}};customElements.define(`weather-time`,e)})),r=e((()=>{var e=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:`open`}),this.isReady=!1}static get observedAttributes(){return[`pulsing`]}connectedCallback(){this.isReady=!0,this.render()}attributeChangedCallback(e,t,n){t!==n&&(this.render(),this.emitPulseChange())}get pulsing(){return this.hasAttribute(`pulsing`)}emitPulseChange(){this.isReady&&this.dispatchEvent(new CustomEvent(`warning-pulse-change`,{detail:{pulsing:this.pulsing},bubbles:!0,composed:!0}))}render(){let e=this.pulsing?`is-pulsing`:``;this.shadowRoot.innerHTML=`
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

      <aside class="badge ${e}" part="badge" role="status" aria-live="polite">
        <span class="icon" part="icon" aria-hidden="true">!</span>
        <slot>Alerta activa</slot>
      </aside>
    `}};customElements.define(`warning-badge`,e)})),i=e((()=>{var e=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:`open`}),this.handleUserGreet=this.handleUserGreet.bind(this),this.pulseTimer=null}static get observedAttributes(){return[`heading`]}connectedCallback(){this.render(),this.addEventListener(`user-greet`,this.handleUserGreet)}disconnectedCallback(){this.removeEventListener(`user-greet`,this.handleUserGreet),clearTimeout(this.pulseTimer)}attributeChangedCallback(e,t,n){t!==n&&this.render()}get heading(){return this.getAttribute(`heading`)||`Panel de Usuario`}handleUserGreet(e){let{name:t}=e.detail,n=this.querySelector(`warning-badge`);console.log(`Hola ${t}`),n&&(n.setAttribute(`pulsing`,``),clearTimeout(this.pulseTimer),this.pulseTimer=setTimeout(()=>{n.removeAttribute(`pulsing`)},3e3),this.dispatchEvent(new CustomEvent(`dashboard-greeting`,{detail:{name:t,message:`Hola ${t}`},bubbles:!0,composed:!0})))}render(){this.shadowRoot.innerHTML=`
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
    `}};customElements.define(`user-dashboard`,e)}));t(),n(),r(),i();
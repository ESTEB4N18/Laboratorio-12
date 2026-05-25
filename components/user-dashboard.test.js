import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import './user-card.js';
import './warning-badge.js';
import './user-dashboard.js';

describe('user-dashboard', () => {
  let dashboard;

  beforeEach(() => {
    dashboard = document.createElement('user-dashboard');
    dashboard.innerHTML = `
      <user-card name="Alexander Rojas"></user-card>
      <warning-badge>Sesion por expirar</warning-badge>
    `;
    document.body.append(dashboard);
  });

  afterEach(() => {
    dashboard.remove();
  });

  it('cambia el mensaje del warning-badge al recibir el saludo del user-card', () => {
    const userCard = dashboard.querySelector('user-card');
    const warningBadge = dashboard.querySelector('warning-badge');

    userCard.shadowRoot.querySelector('[data-action="greet"]').click();

    expect(warningBadge.getAttribute('message')).toBe('Hola Alexander Rojas, saludo recibido');
    expect(warningBadge.shadowRoot.querySelector('.message').textContent).toBe('Hola Alexander Rojas, saludo recibido');
    expect(warningBadge.hasAttribute('pulsing')).toBe(true);
  });
});

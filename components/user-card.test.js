import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './user-card.js';

describe('user-card', () => {
  let userCard;

  beforeEach(() => {
    userCard = document.createElement('user-card');
    document.body.append(userCard);
  });

  afterEach(() => {
    userCard.remove();
  });

  it('se registra como custom element', () => {
    expect(customElements.get('user-card')).toBeDefined();
  });

  it('muestra el nombre, rol y avatar enviados por atributos', () => {
    userCard.setAttribute('name', 'Alexander Rojas');
    userCard.setAttribute('role', 'Profesor');
    userCard.setAttribute('avatar', 'https://example.com/avatar.png');

    const name = userCard.shadowRoot.querySelector('.name');
    const role = userCard.shadowRoot.querySelector('.role');
    const avatar = userCard.shadowRoot.querySelector('.avatar');

    expect(name.textContent).toBe('Alexander Rojas');
    expect(role.textContent).toBe('Profesor');
    expect(avatar.getAttribute('src')).toBe('https://example.com/avatar.png');
    expect(avatar.getAttribute('alt')).toBe('Avatar de Alexander Rojas');
  });

  it('emite el evento user-greet al presionar el boton de saludar', () => {
    const onGreeting = vi.fn();

    userCard.setAttribute('name', 'Alexander Rojas');
    userCard.addEventListener('user-greet', onGreeting);

    userCard.shadowRoot.querySelector('[data-action="greet"]').click();

    expect(onGreeting).toHaveBeenCalledOnce();
    const event = onGreeting.mock.calls[0][0];

    expect(event.detail).toEqual({
      name: 'Alexander Rojas'
    });
    expect(event.bubbles).toBe(true);
    expect(event.composed).toBe(true);
  });
});

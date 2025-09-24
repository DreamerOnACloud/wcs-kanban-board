export class WcsKanbanModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          display: none;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.5);
        }
        .modal {
          background: white;
          padding: 1rem;
          border-radius: 8px;
          width: 300px;
        }
      </style>
      <div class="modal">
        <slot></slot>
        <button id="close">Close</button>
      </div>
    `;
  }

  connectedCallback() {
    this.shadowRoot.querySelector('#close').addEventListener('click', () => {
      this.style.display = 'none';
    });
  }

  open() {
    this.style.display = 'flex';
  }

  close() {
    this.style.display = 'none';
  }
}

customElements.define('wcs-kanban-modal', WcsKanbanModal);

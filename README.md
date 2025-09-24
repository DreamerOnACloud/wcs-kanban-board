# wcs-kanban-board

A vanilla Web Component Kanban board project.  
This is a minimal starter template demonstrating modular Web Components with a Kanban board example.

---

## Features

- Modular Web Components:
  - `<wcs-kanban-board>` – main container
  - `<wcs-kanban-list>` – a column/list
  - `<wcs-kanban-card>` – a task card
  - `<wcs-kanban-modal>` – modal for card details/editing
- Titles for lists and cards handled correctly via `connectedCallback`
- Default fallback titles: "New List" and "New Task"
- Ready to extend and reuse in other projects

---

## Project Structure

```

wcs-kanban-board/
├── index.html
├── src/
│   ├── components/
│   │   ├── wcs-kanban-board.js
│   │   ├── wcs-kanban-list.js
│   │   ├── wcs-kanban-card.js
│   │   └── wcs-kanban-modal.js
│   ├── styles.css
│   └── main.js
├── package.json
└── README.md

````

---

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/wcs-kanban-board.git
cd wcs-kanban-board
````

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser at [http://localhost:5173](http://localhost:5173)

---

## Usage

* Use `<wcs-kanban-board>` as the main container in your HTML.
* Add `<wcs-kanban-list>` components dynamically or statically inside the board.
* Add `<wcs-kanban-card>` components inside lists.
* `<wcs-kanban-modal>` can be attached to cards for detail editing.

---

## Contributing

* Fork the repository
* Create your feature branch (`git checkout -b feature/my-component`)
* Commit your changes (`git commit -m 'Add some feature'`)
* Push to the branch (`git push origin feature/my-component`)
* Open a pull request

---

## License

MIT License © Konstantinos Norgias
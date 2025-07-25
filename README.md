# VoteD: Web3 Blockchain Voting App on Internet Computer

VoteD is a full-stack decentralized voting application built on the [Internet Computer](https://internetcomputer.org/) blockchain. It leverages Azle (TypeScript/JavaScript CDK) for smart contract (canister) development and React for the frontend, providing a secure, transparent, and user-friendly voting platform.

---

## 🚀 Features

- **Create Polls:** Authenticated users can create polls with multiple options, tags, and custom date ranges.
- **Vote:** Users can vote on polls (except their own) and only once per poll.
- **View Results:** Poll results are displayed with vote counts and percentages.
- **Voting History:** Users can view polls they have created.
- **Authentication:** Secure login/logout using Internet Identity.
- **Blockchain Backend:** All poll and vote data is stored on-chain via Azle canisters.
- **Tag & Search:** Filter and search polls by tags, date, and keywords.
- **Responsive UI:** Modern, mobile-friendly interface using Tailwind CSS and Flowbite React.

---

## 🛠️ Tech Stack

- **Smart Contracts:** [Azle](https://github.com/demergent-labs/azle) (TypeScript/JavaScript CDK for Internet Computer)
- **Frontend:** [React](https://react.dev/), [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), [Flowbite React](https://flowbite-react.com/)
- **Authentication:** [DFINITY Internet Identity](https://identity.ic0.app/)
- **ICP Local Development:** [DFX](https://internetcomputer.org/docs/current/developer-docs/cli-reference/dfx-tool/)

---

## 📁 Project Structure

```
.
├── src/
│ ├── backend/ # Azle canister (smart contract) code
│ ├── frontend/ # React frontend app
│ └── declarations/ # Auto-generated canister bindings
├── dfx.json # DFX project config
├── package.json # Workspace root scripts
├── .env # Canister IDs and environment variables
└── README.md # Project documentation
```

---

## ⚡ Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [DFX SDK](https://internetcomputer.org/docs/current/developer-docs/cli-reference/dfx-tool/) (`dfx`)
- [Docker](https://www.docker.com/) (for local replica)
- [Git](https://git-scm.com/)
- [npm](https://www.npmjs.com/)

### 2. Clone the Repository

```sh
git clone https://github.com/your-username/voted-apps.git
cd voted-apps
```

### 3. Install Dependencies

```sh
npm install
```

### 4. Start the Internet Computer Local Replica

```sh
dfx start --clean
```

> **Tip:** You may want to run this in a separate terminal window.

### 5. Deploy Canisters (Backend & Frontend)

```sh
dfx deploy
```

This will deploy the Azle backend and the frontend assets to the local replica.

### 6. Run the Frontend in Development Mode

```sh
cd src/frontend
npm run dev
```

- The app will be available at [http://localhost:5173](http://localhost:5173)
- The backend canister runs at [http://localhost:4943](http://localhost:4943)

---

## 🌐 Production Build & Deployment

1. **Build the Frontend:**

```sh
cd src/frontend
npm run build
```

2. **Deploy to Mainnet (Internet Computer):**

```sh
dfx deploy --ic
```

- Update your `.env` with the mainnet canister IDs as needed.
- The production frontend will be hosted by the asset canister.

---

## 🧑‍💻 Development Tips

- **Canister URLs:** Use `./canister_urls.py` to print the correct canister URLs for your environment.
- **Hot Reload:** The frontend supports hot reload with `npm run dev`.
- **Environment Variables:** Canister IDs and network info are injected via `.env` and Vite config.
- **Authentication:** Uses Internet Identity for secure, decentralized login.

---

## 📚 Documentation & References

- [Azle Book](https://demergent-labs.github.io/azle/the_azle_book.html)
- [Internet Computer Docs](https://internetcomputer.org/docs/current/developer-docs/ic-overview)
- [Vite Docs](https://vitejs.dev/guide/)
- [React Docs](https://react.dev/learn)
- [DFX CLI Reference](https://internetcomputer.org/docs/current/references/cli-reference/dfx-tool/)

---

## 🤝 Contributing

Pull requests and issues are welcome! Please open an issue to discuss your ideas or report bugs.

---

## 📝 License

MIT License. See [LICENSE](LICENSE) for details.

---

## 👤

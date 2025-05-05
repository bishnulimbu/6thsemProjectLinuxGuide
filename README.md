adb reverse tcp:8000 tcp:8000 //port forwarding for the mobile app access to backend url
Below is a concise and professional `README.md` file for the LinuxGuide project, tailored for a GitHub repository. It includes an overview of the project, setup instructions, features (including the search functionality), and other relevant details. Since the project is a web app with a React (TypeScript + Tailwind) frontend and a Node.js (Express + Sequelize) backend.

---

# LinuxGuide

A web application for creating, managing, and searching Linux guides and posts, built with React (TypeScript + Tailwind) for the frontend and Node.js (Express + Sequelize) for the backend. It includes a robust search feature to find guides and posts by title, description, and tags (for posts only), along with a WebSocket-based terminal sandbox using Docker.

## Features

- **Guides & Posts Management**: Create, edit, and view Linux guides and posts.
- **Search Functionality**:
  - Search guides by title and description.
  - Search posts by title, description, and tags.
- **Tagging System**: Associate tags with guides and posts for better categorization.
- **WebSocket Terminal**: Interactive Linux terminal sandbox powered by Docker (`linux-sandbox` image).
- **Responsive UI**: Built with Tailwind CSS for a modern, mobile-friendly design.
- **Database**: Uses Sequelize with a relational database (e.g., PostgreSQL/MySQL).

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Axios
- **Backend**: Node.js, Express, Sequelize, WebSocket (`ws`)
- **Database**: Configurable (e.g., PostgreSQL, MySQL)
- **Other**: Docker (for terminal sandbox), Lodash (for debouncing)

## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- A relational database (e.g., PostgreSQL, MySQL)
- Docker (for the terminal sandbox feature)
- Android Studio (if working on the mobile version)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/LinuxGuide.git
cd LinuxGuide
```

### 2. Backend Setup

1. Navigate to the backend directory (if separate, or root if combined):

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure the database:
   - Copy `.env.example` to `.env`:

     ```bash
     cp .env.example .env
     ```

   - Update `.env` with your database credentials:

     ```
     DB_HOST=localhost
     DB_USER=your_username
     DB_PASSWORD=your_password
     DB_NAME=linuxguide_db
     DB_DIALECT=postgres
     PORT=8000
     ```

4. Set up the database:
   - Ensure your database server is running.
   - Run migrations (if applicable):

     ```bash
     npx sequelize-cli db:migrate
     ```

5. Start the backend server:

   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:8000`.

### 3. Frontend Setup

1. Navigate to the frontend directory (if separate, or root if combined):

   ```bash
   cd frontend
   ```

2. opisInstall dependencies:

   ```bash
   npm install
   ```

3. Configure the API URL:
   - Copy `.env.example` to `.env`:

     ```bash
     cp .env.example .env
     ```

   - Update `.env` with your backend URL:

     ```
     VITE_API_URL=http://192.168.254.5:8000
     ```

4. Start the frontend development server:

   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173` (or another port if specified).

### 4. Docker Setup (for Terminal Sandbox)

1. Ensure Docker is installed and running.
2. Build the `linux-sandbox` image (or pull it if available):

   ```bash
   docker build -t linux-sandbox ./docker
   ```

   (Adjust the path to your Dockerfile for the sandbox image.)
3. The WebSocket terminal will automatically use this image when accessed.

## Usage

- **Access the Web App**: Open `http://localhost:5173` in your browser.
- **Search Guides & Posts**:
  - Navigate to the `/search` page.
  - Enter a search term to find guides (by title/description) and posts (by title/description/tags).
- **Terminal Sandbox**:
  - Access the terminal feature via the WebSocket endpoint (`/ws`).
  - Run Linux commands in a sandboxed Docker container.

## Project Structure

- **`backend/`** (or root if combined):
  - `server.js`: Main Express server file.
  - `routes/`: API routes (e.g., `guides.js`, `posts.js`, `search.js`).
  - `models/`: Sequelize models (e.g., `Guide`, `Post`, `Tag`).
- **`frontend/`** (or root if combined):
  - `src/pages/`: React pages (e.g., `Search.tsx`, `Guides.tsx`).
  - `src/services/`: API service functions (e.g., `api.ts`).
  - `src/interfaces/`: TypeScript interfaces (e.g., `interface.ts`).

## API Endpoints

- `GET /guides`: Fetch all guides.
- `GET /posts`: Fetch all posts.
- `GET /search?search=term`: Search guides (title, description) and posts (title, description, tags).
- `WS /ws`: WebSocket endpoint for the terminal sandbox.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For questions or feedback, please open an issue on GitHub or contact the maintainers at [subashlimbu987654321@gmail.com].

---

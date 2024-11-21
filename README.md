# ScraperVenezuela - Node.js Server Application

## Overview

**ScraperVenezuela** is a Node.js-based server application designed to scrape Venezuela's newspapers for information about the current political situation. It collects relevant articles, headlines, and content, then stores the data in a **Supabase** database for further analysis or usage.

This application leverages the following technologies:

- **Node.js** for backend logic.
- **Express.js** as the web server framework.
- **Playwright** for robust and flexible web scraping.
- **Supabase** as the database solution for storing and managing scraped data.

## Features

- **Web scraping with Playwright:** Collect structured data, including headlines, article content, publication dates, and source URLs.
- **Express.js API:** A RESTful API to trigger scraping, retrieve data, and manage configurations.
- **Supabase Integration:** Secure storage of scraped data with easy querying capabilities.
- **Error Handling:** Robust mechanisms to handle website changes, rate-limiting, and scraping errors.

---

## Installation

### Prerequisites

- **Node.js** (version 16 or higher)
- **Supabase Account** with database set up
- **npm** or **yarn**
- Ensure `supabase-cli` is installed and configured if running locally.

### Clone the Repository

```bash
git clone https://github.com/your-username/scrapervenezuela.git
cd scrapervenezuela
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory and populate it with the following variables:

```env
# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_service_role_key

# Scraping Configuration
SCRAPER_USER_AGENT=your_custom_user_agent_string
SCRAPER_TIMEOUT=10000 # Timeout in milliseconds

# Server Configuration
PORT=3000
```

---

## Usage

### Start the Server

Run the server using:

```bash
npm start
```

The server will start and be accessible at `http://localhost:3000`.

### Endpoints

#### **POST /scrape**

Trigger the scraping process for predefined Venezuela newspapers.

- **Request Body** (optional):
  ```json
  {
    "newspaper": "specific newspaper name or URL"
  }
  ```

- **Response**:
  ```json
  {
    "status": "success",
    "message": "Scraping started",
    "task_id": "unique_task_identifier"
  }
  ```

#### **GET /articles**

Retrieve stored articles from the database.

- **Query Parameters**:
  - `limit` (optional): Number of articles to fetch.
  - `offset` (optional): Offset for pagination.
  - `newspaper` (optional): Filter by newspaper source.

- **Response**:
  ```json
  [
    {
      "id": 1,
      "title": "Sample headline",
      "content": "Sample article content",
      "source": "Newspaper name",
      "publication_date": "2024-11-21"
    }
  ]
  ```

#### **GET /health**

Health check endpoint to verify the server is operational.

- **Response**:
  ```json
  {
    "status": "ok",
    "uptime": 3600
  }
  ```

---

## Architecture

1. **Scraping Process**:
   - The scraping logic uses Playwright to fetch dynamic and static web pages.
   - The content is parsed using DOM selectors for structured data extraction.

2. **Database Storage**:
   - Extracted data is normalized and stored in Supabase tables.
   - Example schema for `articles` table:
     ```sql
     CREATE TABLE articles (
         id SERIAL PRIMARY KEY,
         title TEXT NOT NULL,
         content TEXT NOT NULL,
         source TEXT NOT NULL,
         publication_date DATE,
         url TEXT NOT NULL,
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     );
     ```

3. **API Layer**:
   - Built with Express.js, provides RESTful endpoints to trigger scraping, retrieve data, and monitor the server's health.

---

## Development

### Running in Development Mode

To run the application with live reloading:

```bash
npm run dev
```

### Linting and Code Formatting

Ensure your code adheres to the defined style guide:

```bash
npm run lint
```

---

## Deployment

1. **Environment Configuration**:
   Ensure the `.env` file is properly set up for the production environment.

2. **Deploy to Hosting Provider**:
   Use any Node.js-compatible hosting solution (e.g., AWS, Heroku, Vercel, or DigitalOcean).

3. **Supabase Integration**:
   Ensure your Supabase instance is accessible from your hosting environment and is secured with proper API keys and rules.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit changes: `git commit -m 'Add feature'`.
4. Push the branch: `git push origin feature-name`.
5. Submit a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

## Acknowledgments

- **Node.js** for the server runtime.
- **Express.js** for simplifying the API layer.
- **Playwright** for its robust web automation capabilities.
- **Supabase** for the modern database experience.

---

For any inquiries, please contact gar.santeliz@gmail.com

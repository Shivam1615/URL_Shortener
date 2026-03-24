# URL_Shortener
Creates a URL_Shortener and displays clicks analytics data in a UI dashboard

## Tech stack
   ## Backend and Databases
      - Java 21 and Spring Boot 3
      - PostgreSQL
      - Flyway (datbase migrations)
      - JPA/Hibernate
      - JUnit + Mockito (unit tests)
      - MockMvc (Integration tests)

   ## Frontend
      - React + Vite
      - Axios for API calls
   
   ## AI Tools
      - Claude AI code

## Why These Choices
   **Java + Spring Boot** 
      — Mature, production-grade framework with strong support for REST APIs, validation, and database management using the controller, service, and repository patterns from Spring. 

   **PostgreSQL** 
      — Relational database with strong consistency guarantees. The click analytics query, which is where I did GROUP BY day, is a natural fit for SQL for example.

   **Flyway over Hibernate DDL** 
      — Hibernate's `ddl-auto` is not safe for production as it can drop and recreate tables on restart. Flyway runs versioned migrations in order and never runs them twice.

   **React + Vite + Axios** 
      — Fast development setup. Vite's dev server proxies API calls cleanly during development. Axios simplifies API requests and data management.

## Getting Started

   ## Instructions on setting up database
      - brew install postgresql@15
      - brew services start postgresql@15
      If you don't have postgres on your machine

      ### Database Setup
      ```bash
      psql postgres -c "CREATE DATABASE urlshortener;"
      psql postgres -c "CREATE DATABASE urlshortener_test;"
      ```

      ### Backend
      ```bash
      cd urlshortener-backend
      ./mvnw spring-boot:run
      ```
      Backend runs on `http://localhost:8080`. Flyway will automatically run migrations and seed data on startup.

      ### Frontend
      ```bash
      cd frontend
      npm install
      npm run dev
      ```
      Frontend runs on `http://localhost:5173`.

## API Endpoints
| Method |           Endpoint             | Description |
|--------|--------------------------------|-------------|
| POST   | `/api/v1/links`                | Create a short link 
| GET    | `/api/v1/links`                | List all links 
| GET    | `/:slug`                       | Redirect to target URL + record click 
| GET    | `/api/v1/links/{id}/analytics` | Total clicks + clicks by day 

## Testing Instructions
   ```bash
   cd urlshortener-backend
   ./mvnw test
   ```

   **Unit tests** (`LinkServiceTest.java`)
   - Valid slug resolves to correct target URL
   - Invalid slug throws exception, no click recorded
   - Duplicate URL returns existing slug

   **Integration tests** (`LinkControllerIntegrationTest.java`)
   - `POST /api/v1/links` valid URL → 201 created
   - `GET /:slug` valid slug → 302 redirect
   - `POST /api/v1/links` invalid URL → 400 with error message
   - `GET /:slug` unknown slug → 404
   - `GET /:slug` → click event recorded in database


## LLM Prompts Used
   - *"I have a URL shortener with links and click tracking. Should I store click counts as a column on the links table or as separate rows in a click_events table? What are the trade-offs?"*
   - *"Should click recording be a separate PUT endpoint called by the client, or should it happen automatically server-side during the redirect?"*
   - *"What's the best approach for generating short URL slugs — Base64, UUID, or random alphanumeric? Consider URL safety and collision resistance."*
   - *"Where would this URL shortener design break at scale, and what would the production fixes be for the redirect endpoint and analytics queries?"*
   - *"What's the right way to handle validation errors and not-found errors globally in Spring Boot without putting try/catch in every controller method?"*
   - *"Should I use Flyway migrations or Hibernate's ddl-auto for schema management? What are the production implications of each?"*
   ## Entity Design
      "How do I model a many-to-one relationship between ClickEvent and Link in Spring Boot JPA? What fetch type should I use and why?"

   ## Repository Layer
      "How do I write a JPQL query in Spring Data JPA to group click events by day and return the count per day?"

   ## Service Layer
      "How do I generate a random URL-safe slug in Java and check for collisions against the database?"
      "How do I inject a property from application.properties into a Spring service using @Value?"

   ## Error Handling
      "How do I create a global exception handler in Spring Boot that returns clean JSON error responses instead of stack traces?"

   ## Testing
      "How do I write integration tests for a Spring Boot REST API using MockMvc with a separate test database profile?"

   ## Frontend
      "How do I set up a single page React app with conditional rendering instead of React Router for simple two-view navigation?"
      "How do I create an Axios client in React that centralizes all API calls in one file?"

## Architecture Notes
   **Two table schema:**
   - `links` — stores slug, target URL, created date
   - `click_events` — append-only table, one row per click with timestamp and user agent

   Click counts are never stored as a column — they are always derived by counting rows in `click_events`. This avoids race conditions and keeps data accurate under concurrent traffic.

   **Indexes:**
      - `links.slug` — unique index for O(log n) redirect lookups
      - `click_events.link_id` — index for fast analytics queries

   **Redirect endpoint design:**
   Click recording happens server-side during the redirect in a single transaction. The client never calls a separate endpoint. This keeps the redirect fast and ensures clicks are never missed.

   **Duplicate URL handling:**
   Submitting the same long URL twice returns the existing slug. No duplicate rows are created in the database table.

## Performance & Scalability

   The app is designed correctly for MVP scale. Here is how it would scale further:

   **Redirect endpoint (hottest path)**
   - Add Redis caching on slug lookup — avoids a DB hit on every redirect
   - At high traffic, a cache hit rate of 95%+ would dramatically reduce DB load

   **Analytics queries**
   - Current approach queries raw `click_events` rows directly
   - At 100M+ rows, add a pre-aggregated daily summary table updated in the background
   - Analytics queries would then hit the small summary table instead of scanning millions of rows to reduce latency and increase performance.

   **Database**
   - Add connection pooling configuration (HikariCP) for high concurrency
   - Partition `click_events` by date at very large scale

## Intentional Simplifications
   - No authentication — links are public and anonymous
   - No link expiry — links live forever
   - No pagination on `/api/v1/links` — would add with cursor-based pagination at scale
   - No rate limiting on link creation — would add to prevent abuse in production
   - No custom slugs — auto-generated only

## Future Improvements if I had more time
   - Redis caching on slug lookup
   - Pre-aggregated analytics summary table
   - Link expiry with a scheduled cleanup job
   - Custom slug support
   - Rate limiting on link creation
   - Cursor-based pagination on list endpoint





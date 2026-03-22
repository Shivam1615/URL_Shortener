# URL_Shortener
Creates a URL_Shortener and displays clicks analytics data in a UI dashboard

#Instructions on setting up database
    - brew install postgresql@15
    - brew services start postgresql@15

    #Create database name
    - psql postgres -c "CREATE DATABASE urlshortener;"


#LLM Prompts used for thought provoking questions during design
Schema Design
   -  "I have a URL shortener with links and click tracking. Should I store click counts as a column on the links table or as separate rows in a click_events table? What are the trade-offs?"

API Design
   - "Should click recording be a separate PUT endpoint called by the client, or should it happen automatically server-side during the redirect?"

Slug Generation
   - "What's the best approach for generating short URL slugs — Base64, UUID, or random alphanumeric? Consider URL safety and collision resistance."

Performance & Scalability
   - "Where would this URL shortener design break at scale, and what would the production fixes be for the redirect endpoint and analytics queries?"

Error Handling
   - "What's the right way to handle validation errors and not-found errors globally in Spring Boot without putting try/catch in every controller method?"

Flyway vs Hibernate DDL
   - "Should I use Flyway migrations or Hibernate's ddl-auto for schema management? What are the production implications of each?"


# Shopify Data Ingestion & Insights Service

A multi-tenant service to ingest data from Shopify and visualize it on a dashboard. Built with Node.js, Express, Prisma, SQLite (for demo), and Next.js.

## Features
- **Multi-tenancy**: Supports multiple stores with data isolation.
- **Data Ingestion**: Fetches Products, Customers, and Orders from Shopify (mocked for demo).
- **Insights Dashboard**: Visualizes key metrics like Total Revenue, Top Customers, and Order Trends.
- **Tech Stack**: Node.js, Express, Prisma, SQLite, Next.js, Tailwind CSS, Recharts.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repo-url>
    cd Xeno FDE
    ```

2.  **Backend Setup**
    ```bash
    cd apps/backend
    npm install
    # Create .env file (or rename .env.example)
    # Ensure DATABASE_URL="file:./dev.db"
    npx prisma migrate dev --name init
    node prisma/seed.js
    node src/index.js
    ```
    Backend runs on `http://localhost:4000`.

3.  **Frontend Setup**
    ```bash
    cd apps/frontend
    npm install
    npm run dev
    ```
    Frontend runs on `http://localhost:3000`.

## Architecture
- **Backend**: Express server with Prisma ORM. Uses SQLite for simplicity.
- **Frontend**: Next.js App Router. Fetches data from Backend APIs.
- **Ingestion**: `ShopifyService` handles data fetching. `IngestController` processes and stores data.

## API Endpoints
- `POST /api/ingest`: Triggers data ingestion for a tenant. Body: `{ tenantId }`.
- `GET /api/dashboard/:tenantId`: Fetches aggregated data for the dashboard.

## Assumptions
- **Database**: Switched to SQLite for easier local demonstration without requiring a running Postgres instance.
- **Shopify API**: Mocked to simulate data fetching without needing live Shopify credentials.
- **Authentication**: Simplified to a Tenant ID input field for the demo.

## Next Steps
- Implement real Shopify OAuth.
- Switch to PostgreSQL for production.
- Add user authentication (Auth0 or NextAuth).
- Add background job processing (BullMQ) for large-scale ingestion.

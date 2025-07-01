```mermaid 
---
title: Recipe App Architecture Diagram
---

flowchart TD
  subgraph Client
    A[Browser]
  end

  subgraph NextJS[Next.js App]
    B[App Router]
    C[Server Components]
    D[Client Components]
    E[API Routes / Server Actions]
    F[SessionProvider]
    G[TopNav / UI Components]
  end

  subgraph Auth[Authentication]
    H[NextAuth.js]
    I[OAuth Provider / Email]
  end

  subgraph DB[Database]
    J[Prisma ORM]
    K[(SQLite DB)]
  end

  A -- HTTP/HTTPS --> B
  B --> C
  B --> D
  D --> G
  C --> E
  D --> E
  E --> F
  F --> H
  H --> I
  E --> J
  J --> K

  style NextJS fill:#f3f4f6,stroke:#6366f1,stroke-width:2px
  style DB fill:#f3f4f6,stroke:#10b981,stroke-width:2px
  style Auth fill:#f3f4f6,stroke:#f59e0b,stroke-width:2px
  style Client fill:#f3f4f6,stroke:#3b82f6,stroke-width:2px 
  ```
  
# OCR App

A full-stack document processing application that demonstrates OCR capabilities using modern web technologies. This project showcases file upload, processing queues, AI-powered document classification, and real-time status updates.

## 🏗️ Architecture

The application consists of two main components:

- **Next.js Frontend App**: Handles user interface, file uploads, and displays processed documents
- **Node.js Worker**: Processes OCR jobs in the background using AI for document classification

### Data Flow
```
User Upload → S3 Storage → Redis Queue → OCR Worker → AI Classification → Results Display
```

## 📋 Features

- **File Upload**: Drag-and-drop PDF upload with validation (10MB limit)
- **Real-time Processing**: Live status updates with 3-second polling
- **Document Classification**: AI-powered categorization (invoices, receipts, contracts)  
- **OCR Simulation**: Mock OCR with realistic error patterns for testing
- **Document Management**: View original files, extracted text, and structured data
- **Responsive UI**: Modern interface built with Tailwind CSS and Radix UI

## 🌐 Demo
Check [ocr.olio.solutions](https://ocr.olio.solutions) for a hosted version.

## Technical Choices

I used some of these following technologies for quite some time now. For this project I tried to be as pragmatic as possible. You will find documentation of the rest within the code. Check Attachments for Interesting Files
<details> 
<summary>
Open Spoiler
</summary>

#### Next.js
> My daily driver throughout the last two years. Ideal for iterating fast on small to medium projects. Has many helpers and functionality to serve modern web technology and best practices. Uses React under the hood - the most popular JavaScript library. In combination with Radix or shadcn it allows fast development at good quality.

#### Redis
> Redis integrates perfectly with BullMQ, so that's a must. Since adding another DB like SQLite would have added overhead as well as more surface to secure, I opted to also use Redis to persist Data.

#### Docker
> 'It works on my machine' once went too far for me, so I started containerizing every application in my arsenal for portability and ease the pain of scaling vertically or horizontally. Simplifies dev setups and small production setups - perfect for this use case.

#### AWS
> AWS is ubiquitous nowadays. Especially for this project, I wanted to demonstrate the ability to securely use Cloud File Storage and outsource SDK functionality into Singletons to improve performance. Apart from that, if this project needed a really pragmatic choice, I'd go with the file system to store the PDF files that aren't even evaluated.

#### BullMQ
> First discovered in Nest.js, I started using BullMQ a year ago, coming from RabbitMQ. It's a breeze to use and comes with a powerful syntax, directly hooking into and abstracting away Redis to facilitate easy Queueing while being lightweight.

#### Vercel AI SDK
> I've tried Langchain, LlamaIndex, OpenAI SDK and a few more. Vercel AI SDK packs a punch for the most basic things and can be integrated very elegantly. For more complex use cases I fall back to Langchain, though. Specifially for this project, it was a match made in heaven since it was a breeze to implement and solves the classifying problem very well.

#### Zod
> In this particular instance, I use zod to get a validated Schema out of an LLM query. I also use it to then infer the TypeScript type and allow the rest of the app to know what the data looks like. In other applications I also use this for runtime type checks, e.g. in API routes to validate correct form of transmitted data. 

</details>

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- AWS S3 bucket configured
- OpenAI API key

### Installation

1. **Clone and setup environment**
   ```bash
   git clone https://github.com/RayNCooper/ocr-app.git
   cd ocr-app
   cp .env.example .env
   ```

2. **Configure environment variables**
   Edit `.env` with your credentials:
   ```env
   # Redis (pre-configured for Docker with example password)
   REDIS_PASSWORD=h7DAWVz5PVSm!2Ew
   REDIS_HOST=redis
   REDIS_PORT=6379
   REDIS_URL=redis://:h7DAWVz5PVSm!2Ew@redis:6379
   
   # AWS S3 Configuration
   AWS_REGION=your-region
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   AWS_S3_BUCKET_NAME=your-bucket-name
   
   # OpenAI API
   OPENAI_API_KEY=your-openai-key
   ```

3. **Setup AWS S3 permissions**
   Configure your S3 bucket with the IAM policy provided in the [Security section](#-security)

4. **Start the application**
   ```bash
   # Development with Docker
   docker compose up
   
   # Production with Caddy reverse proxy
   docker compose -f docker-compose.prod.yml up
   ```

### Development Mode

For local development without Docker:

```bash
# Terminal 1: Frontend
cd nextjs-app
cp ../.env .env.local  # Copy environment variables
npm install
npm run dev

# Terminal 2: Worker  
cd worker
cp ../.env .env.local  # Copy environment variables
npm install
npm run dev

# Terminal 3: Redis
docker run -p 6379:6379 redis:7-alpine redis-server --requirepass h7DAWVz5PVSm!2Ew
```

## 📁 Project Structure

```
ocr-app/
├── nextjs-app/                 # Frontend application
│   ├── app/
│   │   ├── actions.ts         # Server actions for Redis/S3 operations
│   │   ├── api/upload/        # File upload API endpoint
│   │   ├── page.tsx           # Main application page
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   ├── file-upload.tsx    # Drag-and-drop upload component
│   │   ├── entry-list.tsx     # Document carousel with real-time updates
│   │   └── ui/               # Radix UI components
│   └── lib/
│       ├── redisClient.ts     # Redis singleton client
│       ├── s3Client.ts        # AWS S3 singleton client
│       ├── types.ts           # TypeScript definitions
│       └── utils.ts           # File validation & utilities
├── worker/                     # Background processing worker
│   └── src/
│       ├── index.ts           # Main worker process
│       └── lib/
│           ├── ocr.ts         # OCR simulation with mock data
│           ├── classification.ts  # AI-powered document classification
│           ├── redisHelper.ts     # Redis operations
│           └── types.ts       # Worker type definitions
├── docker-compose.yml         # Development environment
├── docker-compose.prod.yml    # Production with Caddy reverse proxy
├── Caddyfile                  # Caddy web server configuration
└── .env.example              # Environment template
```

## 🛠️ Technology Stack

### Frontend (Next.js App)
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **State Management**: SWR for server state
- **Validation**: Zod schemas
- **Notifications**: Sonner for toasts

### Backend (Worker)
- **Runtime**: Node.js 18
- **Queue System**: BullMQ with Redis
- **AI Integration**: OpenAI GPT-4o-mini via Vercel AI SDK  
- **File Storage**: AWS S3 with presigned URLs
- **Data Storage**: Redis for metadata and job queues

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Caddy for production
- **Database**: Redis (both cache and primary storage)
- **File Storage**: AWS S3

## 🔒 Security

### AWS S3 Bucket Policy

This application requires an S3 bucket policy that provides secure access with no public access but full read/write for a specific IAM user in the uploads directory.

**Setup Instructions:**
1. Replace `ACCOUNT-ID` with your AWS account ID
2. Replace `USER-NAME` with your IAM user name  
3. Replace `BUCKET-NAME` with your S3 bucket name
4. Adjust `"s3:prefix": "uploads/*"` if you want a different directory

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowListUploadsOnly",
      "Effect": "Allow",
      "Principal": {
        "AWS": ["arn:aws:iam::ACCOUNT-ID:user/USER-NAME"]
      },
      "Action": "s3:ListBucket", 
      "Resource": "arn:aws:s3:::BUCKET-NAME",
      "Condition": {
        "StringLike": {
          "s3:prefix": "uploads/*"
        }
      }
    },
    {
      "Sid": "AllowGetBucketLocation",
      "Effect": "Allow", 
      "Principal": {
        "AWS": ["arn:aws:iam::ACCOUNT-ID:user/USER-NAME"]
      },
      "Action": "s3:GetBucketLocation",
      "Resource": "arn:aws:s3:::BUCKET-NAME"
    },
    {
      "Sid": "AllowReadWriteUploads",
      "Effect": "Allow",
      "Principal": {
        "AWS": ["arn:aws:iam::ACCOUNT-ID:user/USER-NAME"]
      },
      "Action": [
        "s3:GetObject",
        "s3:PutObject", 
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::BUCKET-NAME/uploads/*"
    },
    {
      "Sid": "DenyAllOthers",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::BUCKET-NAME",
        "arn:aws:s3:::BUCKET-NAME/*"
      ],
      "Condition": {
        "StringNotEquals": {
          "aws:PrincipalArn": ["arn:aws:iam::ACCOUNT-ID:user/USER-NAME"]
        }
      }
    }
  ]
}
```

### Security Features
- **File Validation**: Only PDF files up to 10MB accepted
- **Presigned URLs**: Temporary access to S3 objects (24-hour expiry)
- **Environment Variables**: Secrets managed via Docker environment
- **IAM Policies**: Least-privilege access to AWS resources
- **Container Security**: Non-root users in Docker containers

## 🏗️ Development Notes

### Key Implementation Details

- **Singleton Pattern**: Redis and S3 clients use singleton pattern for connection pooling
- **Error Handling**: Comprehensive error handling with status tracking in Redis
- **Type Safety**: Full TypeScript coverage with Zod runtime validation  
- **Real-time Updates**: SWR polling every 3 seconds with exponential backoff
- **Queue Processing**: BullMQ handles job processing with concurrency limits
- **Graceful Shutdown**: Proper cleanup of connections and workers

### For Production Use

To convert this demo into a production system:

1. **Replace OCR Simulation**: Integrate with real OCR service (AWS Textract, Google Vision, etc.)
2. **Add Authentication**: Implement user authentication and file ownership
3. **Database Migration**: Consider PostgreSQL for complex queries and relationships  
4. **Monitoring**: Add logging, metrics, and error tracking (Sentry, DataDog)
5. **Scaling**: Implement horizontal scaling for workers and load balancing
6. **File Management**: Add file retention policies and cleanup jobs
7. **Testing**: Add comprehensive test coverage for all components

---

*This project serves as a demonstration of modern full-stack development practices.*
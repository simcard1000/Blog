import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create sample categories
  const categories = await Promise.all([
    prisma.blogCategory.upsert({
      where: { slug: 'web-development' },
      update: {},
      create: {
        title: 'Web Development',
        slug: 'web-development',
        description: 'Articles about web development, frameworks, and tools',
        order: 1,
        isActive: true,
      },
    }),
    prisma.blogCategory.upsert({
      where: { slug: 'programming' },
      update: {},
      create: {
        title: 'Programming',
        slug: 'programming',
        description: 'General programming concepts and best practices',
        order: 2,
        isActive: true,
      },
    }),
    prisma.blogCategory.upsert({
      where: { slug: 'ui-ux-design' },
      update: {},
      create: {
        title: 'UI/UX Design',
        slug: 'ui-ux-design',
        description: 'User interface and experience design articles',
        order: 3,
        isActive: true,
      },
    }),
    prisma.blogCategory.upsert({
      where: { slug: 'database' },
      update: {},
      create: {
        title: 'Database',
        slug: 'database',
        description: 'Database design and management topics',
        order: 4,
        isActive: true,
      },
    }),
    prisma.blogCategory.upsert({
      where: { slug: 'devops' },
      update: {},
      create: {
        title: 'DevOps',
        slug: 'devops',
        description: 'Development operations and deployment strategies',
        order: 5,
        isActive: true,
      },
    }),
    prisma.blogCategory.upsert({
      where: { slug: 'mobile' },
      update: {},
      create: {
        title: 'Mobile',
        slug: 'mobile',
        description: 'Mobile app development and design',
        order: 6,
        isActive: true,
      },
    }),
  ])

  console.log('Created categories:', categories.map(c => c.title))

  // Create sample users with passwords
  const hashedPassword = await bcrypt.hash('password123', 12)

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'John Developer',
      password: hashedPassword,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    },
  })

  const regularUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Sarah Coder',
      password: hashedPassword,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    },
  })

  const designerUser = await prisma.user.upsert({
    where: { email: 'designer@example.com' },
    update: {},
    create: {
      email: 'designer@example.com',
      name: 'Mike Designer',
      password: hashedPassword,
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    },
  })

  console.log('Created users:', adminUser.email, regularUser.email, designerUser.email)

  // Create sample blog posts
  const posts = await Promise.all([
    prisma.blogPost.upsert({
      where: { slug: 'getting-started-with-nextjs-14' },
      update: {},
      create: {
        title: 'Getting Started with Next.js 14: A Complete Guide',
        slug: 'getting-started-with-nextjs-14',
        description: 'Learn the fundamentals of Next.js 14, including the new App Router, Server Components, and how to build modern web applications with React.',
        content: `# Getting Started with Next.js 14: A Complete Guide

Next.js 14 is the latest version of the popular React framework, bringing exciting new features and improvements to help you build better web applications.

## What's New in Next.js 14?

Next.js 14 introduces several key improvements:

- **Turbopack**: Faster bundling and development experience
- **Server Actions**: Simplified server-side data mutations
- **Partial Prerendering**: Enhanced performance with selective static generation
- **Improved App Router**: Better developer experience and performance

## Setting Up Your First Project

To create a new Next.js 14 project, run:

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

## Understanding the App Router

The App Router is the new routing system in Next.js 13+ that provides:

- **File-based routing**: Organize your routes with folders and files
- **Layouts**: Shared UI that persists across pages
- **Loading UI**: Built-in loading states
- **Error handling**: Error boundaries for better UX

## Server Components vs Client Components

Next.js 14 makes it easy to choose between server and client rendering:

\`\`\`javascript
// Server Component (default)
async function ServerComponent() {
  const data = await fetch('https://api.example.com/data');
  return <div>{data.title}</div>;
}

// Client Component
'use client';
function ClientComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
\`\`\`

## Conclusion

Next.js 14 is a powerful framework that makes building modern web applications easier than ever. Start your journey today!`,
        img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop',
        catSlug: 'web-development',
        status: 'PUBLISHED',
        isPrivate: false,
        tags: 'nextjs,react,web-development,app-router',
        keywords: 'nextjs 14 tutorial,react framework,app router,server components',
        readTime: 8,
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        userId: adminUser.id,
      },
    }),
    prisma.blogPost.upsert({
      where: { slug: 'typescript-best-practices-2024' },
      update: {},
      create: {
        title: 'TypeScript Best Practices for Modern Development',
        slug: 'typescript-best-practices-2024',
        description: 'Discover essential TypeScript patterns, type safety techniques, and best practices that will make your code more maintainable and robust.',
        content: `# TypeScript Best Practices for Modern Development

TypeScript has become the standard for building large-scale JavaScript applications. Here are the essential best practices every developer should know.

## 1. Use Strict Type Checking

Enable strict mode in your \`tsconfig.json\`:

\`\`\`json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
\`\`\`

## 2. Define Clear Interfaces

Create well-defined interfaces for your data structures:

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

interface CreateUserRequest {
  name: string;
  email: string;
}
\`\`\`

## 3. Use Union Types for Better Type Safety

Leverage union types to handle different states:

\`\`\`typescript
type LoadingState = 'idle' | 'loading' | 'success' | 'error';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: LoadingState;
}
\`\`\`

## 4. Implement Generic Types

Use generics for reusable components:

\`\`\`typescript
interface Repository<T> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}

class UserRepository implements Repository<User> {
  async findById(id: string): Promise<User | null> {
    // Implementation
  }
}
\`\`\`

## 5. Use Type Guards

Implement type guards for runtime type checking:

\`\`\`typescript
function isUser(obj: any): obj is User {
  return obj && typeof obj.id === 'string' && typeof obj.name === 'string';
}

if (isUser(data)) {
  // data is now typed as User
  console.log(data.name);
}
\`\`\`

## Conclusion

Following these TypeScript best practices will help you write more maintainable, type-safe code that's easier to debug and refactor.`,
        img: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=450&fit=crop',
        catSlug: 'programming',
        status: 'PUBLISHED',
        isPrivate: false,
        tags: 'typescript,programming,best-practices,type-safety',
        keywords: 'typescript tips,programming best practices,type safety,interfaces',
        readTime: 12,
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        userId: regularUser.id,
      },
    }),
    prisma.blogPost.upsert({
      where: { slug: 'building-responsive-designs-tailwind' },
      update: {},
      create: {
        title: 'Building Responsive Designs with Tailwind CSS',
        slug: 'building-responsive-designs-tailwind',
        description: 'Master the art of creating beautiful, responsive web designs using Tailwind CSS utility classes and modern CSS techniques.',
        content: `# Building Responsive Designs with Tailwind CSS

Tailwind CSS has revolutionized how we approach styling in modern web development. Learn how to create stunning, responsive designs with utility-first CSS.

## Understanding Tailwind's Responsive System

Tailwind uses a mobile-first approach with breakpoints:

- \`sm:\` - 640px and up
- \`md:\` - 768px and up
- \`lg:\` - 1024px and up
- \`xl:\` - 1280px and up
- \`2xl:\` - 1536px and up

## Creating Responsive Layouts

Build flexible layouts that adapt to any screen size:

\`\`\`html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h3 class="text-lg font-semibold mb-2">Card Title</h3>
    <p class="text-gray-600">Card content goes here</p>
  </div>
</div>
\`\`\`

## Responsive Typography

Scale your text appropriately across devices:

\`\`\`html
<h1 class="text-3xl md:text-4xl lg:text-5xl font-bold">
  Responsive Heading
</h1>
<p class="text-sm md:text-base lg:text-lg text-gray-600">
  Responsive paragraph text
</p>
\`\`\`

## Mobile-First Navigation

Create navigation that works on all devices:

\`\`\`html
<nav class="flex flex-col md:flex-row items-center justify-between p-4">
  <div class="logo mb-4 md:mb-0">Logo</div>
  <div class="hidden md:flex space-x-6">
    <a href="#" class="text-gray-600 hover:text-gray-900">Home</a>
    <a href="#" class="text-gray-600 hover:text-gray-900">About</a>
  </div>
  <button class="md:hidden">Menu</button>
</nav>
\`\`\`

## Custom Responsive Utilities

Extend Tailwind with custom responsive utilities:

\`\`\`javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      }
    }
  }
}
\`\`\`

## Conclusion

Tailwind CSS makes responsive design accessible and maintainable. Start building beautiful, responsive interfaces today!`,
        img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop',
        catSlug: 'ui-ux-design',
        status: 'PUBLISHED',
        isPrivate: false,
        tags: 'tailwind-css,responsive-design,ui-ux,css',
        keywords: 'tailwind css tutorial,responsive design,mobile-first,utility classes',
        readTime: 6,
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        userId: designerUser.id,
      },
    }),
    prisma.blogPost.upsert({
      where: { slug: 'mongodb-performance-optimization' },
      update: {},
      create: {
        title: 'MongoDB Performance Optimization: Essential Tips',
        slug: 'mongodb-performance-optimization',
        description: 'Learn how to optimize your MongoDB database for better performance, including indexing strategies, query optimization, and monitoring techniques.',
        content: `# MongoDB Performance Optimization: Essential Tips

MongoDB is a powerful NoSQL database, but without proper optimization, it can become a bottleneck in your application. Here are essential tips to keep your MongoDB running at peak performance.

## 1. Proper Indexing Strategy

Indexes are crucial for query performance:

\`\`\`javascript
// Create compound indexes for common query patterns
db.users.createIndex({ "email": 1, "status": 1 })

// Use partial indexes for filtered queries
db.orders.createIndex(
  { "status": 1, "createdAt": -1 },
  { "partialFilterExpression": { "status": { $in: ["pending", "processing"] } } }
)
\`\`\`

## 2. Query Optimization

Write efficient queries:

\`\`\`javascript
// Good: Use projection to limit returned fields
db.users.find({ status: "active" }, { name: 1, email: 1 })

// Good: Use limit and skip for pagination
db.posts.find().sort({ createdAt: -1 }).limit(10).skip(20)

// Avoid: Large result sets without limits
db.posts.find() // This could return millions of documents
\`\`\`

## 3. Aggregation Pipeline Optimization

Optimize your aggregation pipelines:

\`\`\`javascript
db.orders.aggregate([
  { $match: { status: "completed", createdAt: { $gte: new Date("2024-01-01") } } },
  { $group: { _id: "$userId", total: { $sum: "$amount" } } },
  { $sort: { total: -1 } },
  { $limit: 100 }
])
\`\`\`

## 4. Connection Pooling

Configure connection pooling properly:

\`\`\`javascript
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/myapp', {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
});
\`\`\`

## 5. Monitoring and Profiling

Enable profiling to identify slow operations:

\`\`\`javascript
// Enable profiling for operations slower than 100ms
db.setProfilingLevel(1, { slowms: 100 })

// View slow operations
db.system.profile.find().sort({ ts: -1 }).limit(5)
\`\`\`

## Conclusion

Proper MongoDB optimization requires understanding your data patterns and query requirements. Monitor, measure, and iterate for the best results.`,
        img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
        catSlug: 'database',
        status: 'PUBLISHED',
        isPrivate: false,
        tags: 'mongodb,database,performance,optimization',
        keywords: 'mongodb performance,database optimization,indexing,query optimization',
        readTime: 10,
        publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        userId: adminUser.id,
      },
    }),
    prisma.blogPost.upsert({
      where: { slug: 'docker-containerization-guide' },
      update: {},
      create: {
        title: 'Docker Containerization: A Complete Guide',
        slug: 'docker-containerization-guide',
        description: 'Master Docker containerization from basics to advanced concepts. Learn how to containerize applications, manage containers, and deploy with confidence.',
        content: `# Docker Containerization: A Complete Guide

Docker has revolutionized how we develop, package, and deploy applications. This comprehensive guide will take you from Docker basics to advanced containerization techniques.

## What is Docker?

Docker is a containerization platform that allows you to package applications and their dependencies into lightweight, portable containers.

## Key Benefits

- **Consistency**: Same environment across development, testing, and production
- **Portability**: Run anywhere Docker is installed
- **Efficiency**: Shared OS kernel, faster startup times
- **Scalability**: Easy horizontal scaling

## Creating Your First Dockerfile

\`\`\`dockerfile
# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
\`\`\`

## Multi-stage Builds

Optimize your images with multi-stage builds:

\`\`\`dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## Docker Compose for Development

\`\`\`yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
  
  database:
    image: postgres:15
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
\`\`\`

## Best Practices

1. **Use .dockerignore**: Exclude unnecessary files
2. **Minimize layers**: Combine RUN commands
3. **Use specific tags**: Avoid \`latest\` in production
4. **Run as non-root**: Add USER directive
5. **Health checks**: Add HEALTHCHECK instruction

## Conclusion

Docker containerization simplifies deployment and ensures consistency across environments. Start containerizing your applications today!`,
        img: 'https://images.unsplash.com/photo-1605745341112-85968b19335a?w=800&h=450&fit=crop',
        catSlug: 'devops',
        status: 'PUBLISHED',
        isPrivate: false,
        tags: 'docker,containerization,devops,deployment',
        keywords: 'docker tutorial,containerization,devops,dockerfile',
        readTime: 15,
        publishedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
        userId: regularUser.id,
      },
    }),
    prisma.blogPost.upsert({
      where: { slug: 'react-native-performance-tips' },
      update: {},
      create: {
        title: 'React Native Performance Optimization Tips',
        slug: 'react-native-performance-tips',
        description: 'Boost your React Native app performance with these proven optimization techniques. Learn about memory management, rendering optimization, and best practices.',
        content: `# React Native Performance Optimization Tips

React Native apps can suffer from performance issues if not properly optimized. Here are proven techniques to make your mobile apps run smoothly.

## 1. Optimize FlatList Performance

FlatList is crucial for displaying large lists efficiently:

\`\`\`javascript
import { FlatList } from 'react-native';

const OptimizedList = ({ data }) => (
  <FlatList
    data={data}
    renderItem={({ item }) => <ItemComponent item={item} />}
    keyExtractor={(item) => item.id}
    getItemLayout={(data, index) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    })}
    removeClippedSubviews={true}
    maxToRenderPerBatch={10}
    windowSize={10}
    initialNumToRender={10}
  />
);
\`\`\`

## 2. Use React.memo and useMemo

Prevent unnecessary re-renders:

\`\`\`javascript
import React, { memo, useMemo } from 'react';

const ExpensiveComponent = memo(({ data, filter }) => {
  const filteredData = useMemo(() => {
    return data.filter(item => item.category === filter);
  }, [data, filter]);

  return (
    <View>
      {filteredData.map(item => (
        <Item key={item.id} data={item} />
      ))}
    </View>
  );
});
\`\`\`

## 3. Optimize Images

Handle images efficiently:

\`\`\`javascript
import { Image } from 'react-native';

const OptimizedImage = ({ source, style }) => (
  <Image
    source={source}
    style={style}
    resizeMode="cover"
    fadeDuration={0} // Disable fade animation for better performance
  />
);

// For remote images, consider using react-native-fast-image
import FastImage from 'react-native-fast-image';

const FastImageComponent = ({ uri, style }) => (
  <FastImage
    source={{ uri }}
    style={style}
    resizeMode={FastImage.resizeMode.cover}
  />
);
\`\`\`

## 4. Memory Management

Prevent memory leaks:

\`\`\`javascript
import { useEffect, useRef } from 'react';

const ComponentWithCleanup = () => {
  const intervalRef = useRef();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      // Do something
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return <View />;
};
\`\`\`

## 5. Bundle Size Optimization

Reduce your app size:

\`\`\`javascript
// Use dynamic imports for large libraries
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

// Tree shake unused code
import { specificFunction } from 'large-library';
// Instead of: import * as library from 'large-library';
\`\`\`

## Conclusion

Performance optimization is an ongoing process. Profile your app regularly and implement these techniques to deliver smooth user experiences.`,
        img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=450&fit=crop',
        catSlug: 'mobile',
        status: 'PUBLISHED',
        isPrivate: false,
        tags: 'react-native,mobile,performance,optimization',
        keywords: 'react native performance,mobile optimization,flatlist,memory management',
        readTime: 9,
        publishedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        userId: designerUser.id,
      },
    }),
  ])

  console.log('Created blog posts:', posts.map(p => p.title))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

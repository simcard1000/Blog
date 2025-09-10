import { PrismaClient } from '@prisma/client'

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
      where: { slug: 'tutorials' },
      update: {},
      create: {
        title: 'Tutorials',
        slug: 'tutorials',
        description: 'Step-by-step tutorials and guides',
        order: 3,
        isActive: true,
      },
    }),
  ])

  console.log('Created categories:', categories.map(c => c.title))

  // Create sample users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
    },
  })

  const regularUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Regular User',
    },
  })

  console.log('Created users:', adminUser.email, regularUser.email)

  // Create sample blog posts
  const posts = await Promise.all([
    prisma.blogPost.upsert({
      where: { slug: 'getting-started-with-nextjs' },
      update: {},
      create: {
        title: 'Getting Started with Next.js',
        slug: 'getting-started-with-nextjs',
        description: 'Learn the basics of Next.js and how to build modern web applications',
        content: `# Getting Started with Next.js

Next.js is a React framework that provides a great developer experience with many built-in features.

## What is Next.js?

Next.js is a production-ready React framework that helps you build fast, SEO-friendly web applications. It provides:

- Server-side rendering (SSR)
- Static site generation (SSG)
- API routes
- Built-in CSS support
- Automatic code splitting

## Getting Started

To create a new Next.js project, run:

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

This will create a new Next.js application and start the development server.

## Key Features

### Pages and Routing

Next.js uses a file-based routing system. Create a file in the \`pages\` directory and it automatically becomes a route.

### API Routes

You can create API endpoints by adding files to the \`pages/api\` directory.

### Styling

Next.js supports CSS modules, styled-jsx, and other CSS-in-JS solutions out of the box.

## Conclusion

Next.js is a powerful framework that makes building React applications easier and more efficient. Start building your next project with Next.js today!`,
        catSlug: 'web-development',
        status: 'PUBLISHED',
        isPrivate: false,
        tags: 'nextjs,react,web-development',
        keywords: 'nextjs tutorial,react framework,web development',
        readTime: 5,
        publishedAt: new Date(),
        userId: adminUser.id,
      },
    }),
    prisma.blogPost.upsert({
      where: { slug: 'javascript-best-practices' },
      update: {},
      create: {
        title: 'JavaScript Best Practices',
        slug: 'javascript-best-practices',
        description: 'Essential JavaScript best practices every developer should know',
        content: `# JavaScript Best Practices

JavaScript is a powerful and flexible language, but it's important to follow best practices to write maintainable code.

## 1. Use const and let instead of var

Always use \`const\` for values that won't change and \`let\` for values that will be reassigned.

\`\`\`javascript
// Good
const name = 'John';
let age = 25;

// Bad
var name = 'John';
var age = 25;
\`\`\`

## 2. Use meaningful variable names

Choose descriptive names that clearly indicate what the variable represents.

\`\`\`javascript
// Good
const userEmail = 'user@example.com';
const isLoggedIn = true;

// Bad
const e = 'user@example.com';
const flag = true;
\`\`\`

## 3. Use arrow functions for short functions

Arrow functions are more concise and have lexical \`this\` binding.

\`\`\`javascript
// Good
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);

// Bad
const doubled = numbers.map(function(n) {
  return n * 2;
});
\`\`\`

## 4. Handle errors properly

Always handle potential errors and provide meaningful error messages.

\`\`\`javascript
// Good
try {
  const data = await fetchData();
  return data;
} catch (error) {
  console.error('Failed to fetch data:', error);
  throw new Error('Unable to load data');
}
\`\`\`

## 5. Use modern JavaScript features

Take advantage of ES6+ features like destructuring, template literals, and async/await.

\`\`\`javascript
// Good
const { name, email } = user;
const message = \`Hello, \${name}!\`;
const data = await fetchUserData();

// Bad
const name = user.name;
const email = user.email;
const message = 'Hello, ' + name + '!';
fetchUserData().then(data => {
  // handle data
});
\`\`\`

## Conclusion

Following these best practices will help you write cleaner, more maintainable JavaScript code.`,
        catSlug: 'programming',
        status: 'PUBLISHED',
        isPrivate: false,
        tags: 'javascript,programming,best-practices',
        keywords: 'javascript tips,programming best practices,clean code',
        readTime: 8,
        publishedAt: new Date(),
        userId: adminUser.id,
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

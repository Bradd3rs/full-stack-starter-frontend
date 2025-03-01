# 🎨 Next.js Frontend: The Perfect Match for Your [FastAPI Backend](https://github.com/Bradd3rs/full-stack-starter-backend)!

Hey there, awesome developer! 👋 Welcome to this super slick Next.js frontend that pairs perfectly with the FastAPI + PostgreSQL backend. No complicated setup, no headaches - just a beautiful UI that connects to your API in minutes!

## ✨ What's in the Box?

- 🚀 **Next.js 15** - The React framework that makes frontend development a breeze!
- ⚛️ **React 19** - The latest and greatest React goodness
- 🔷 **TypeScript** - Because types are your friends, not enemies
- 🎭 **Tailwind + Radix UI** - Beautiful components without the styling headaches
- 🌗 **Dark Mode** - Because your eyes deserve some love too
- 🔄 **SWR** - Magical data fetching that just works
- 🔌 **API Integration** - Pre-configured to talk to your FastAPI backend

## 🏁 Getting Started in 3... 2... 1...

### 1. Grab the Code & Install Dependencies

```bash
# Clone this beauty
git clone https://github.com/Bradd3rs/full-stack-starter-frontend
cd full-stack-starter-frontend

# Install the goodies
npm install
# or use yarn/pnpm if that's your jam!
```

### 2. Connect to Your Backend (Just One File!)

Create a `.env.local` file with this single line:

```
API_URL=http://localhost:8000/api/v1
```

That's it! This points to your FastAPI backend running on the default port. 🔌

### 3. Fire It Up!

```bash
npm run dev
```

Now open [http://localhost:3000](http://localhost:3000) and marvel at your creation! ✨

## 🤝 Playing Nice with Your FastAPI Backend

This frontend is designed to work seamlessly with the [full-stack-starter-backend](https://github.com/Bradd3rs/full-stack-starter-backend).

For setup instructions and more details, please visit the backend repository. Once you have the backend running, your API will be available at http://localhost:8000.

## 🔄 How the Magic Happens

### Todo API - Ready to Use!

The frontend already knows how to talk to these endpoints:

- `GET /api/v1/todos` - Fetch all your todos
- `POST /api/v1/todos` - Create a new todo
- `GET /api/v1/todos/{todo_id}` - Get a specific todo
- `PUT /api/v1/todos/{todo_id}` - Update a todo
- `DELETE /api/v1/todos/{todo_id}` - Make a todo disappear!

### 🧙‍♂️ The Code Does the Heavy Lifting

We've already set up the API integration for you! Check out how clean this is:

```typescript
// This is already implemented in the app!
const fetchTodos = async () => {
  const response = await fetch('/api/todos')
  return response.json()
}
```

## 📁 Project Structure - Simple & Clean

```
full-stack-starter-frontend/
├── app/                    # Next.js app directory
│   ├── api/                # API routes (talks to your backend)
│   │   └── todos/          # Todo API endpoints
│   ├── page.tsx            # Main application page
│   └── layout.tsx          # Root layout component
├── components/             # React components
│   ├── ui/                 # UI components
│   └── todo-list.tsx       # Todo list component
├── lib/                    # Utility functions
├── types/                  # TypeScript type definitions
├── .env.local              # Just one environment variable!
└── package.json            # Project dependencies
```

## 🚀 Deployment - As Easy as Development

### Deploy on Vercel in 4 Clicks

1. Push to GitHub/GitLab/BitBucket
2. Import to [Vercel](https://vercel.com/new)
3. Set the `API_URL` environment variable
4. Click "Deploy" 🚀

That's literally it! No complex configuration, no server setup.

## 🎯 Ready to Build Something Amazing?

This frontend is designed to get out of your way so you can focus on building features that matter. The connection to your FastAPI backend just works, letting you focus on creating an awesome user experience.

Happy coding! 🎉

## 🔗 Learn More (If You Really Want To)

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

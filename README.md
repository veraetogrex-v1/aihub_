# 🎮 LifeQuest

> Transform your daily tasks into an epic adventure with AI-powered gamification!

LifeQuest is a task management application that combines RPG-style progression with intelligent AI assistance to make productivity fun and engaging. Level up your character, complete quests, and let AI guide you on your journey to success.

## ✨ Features

- 🎯 **Smart Task Management** - Organize your tasks with a beautiful, intuitive interface
- 🤖 **AI-Powered Suggestions** - Get personalized recommendations on what to do next based on your mood and task list
- 🎲 **AI Quest Generation** - Let AI create custom quests tailored to your interests and current state
- 💪 **Character Progression** - Earn XP for completing tasks and level up your hero
- 😊 **Mood Tracking** - Daily mood tracking influences AI recommendations
- 🎉 **Celebration Effects** - Confetti animations when you level up
- 💾 **Persistent Storage** - All data saved locally in your browser
- 🎨 **Beautiful UI** - Modern design with smooth animations and gradients

## 🚀 Quick Start

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd lifequest
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory (or copy from `.env.example`):
```bash
VITE_AIMLAPI_KEY=your_api_key_here
```

> Get your API key from [AIMLAPI.com](https://aimlapi.com)

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
```
http://localhost:5173
```

## 📖 How to Use

### 1. Set Your Mood
Select one of five mood emojis (😢😕😐😊🎉) to indicate how you're feeling today. This influences AI recommendations.

### 2. Add Tasks
Use the input field to add new tasks. Each task starts with 10 XP by default.

### 3. Get AI Suggestions
Click **"Что делать сейчас?"** to get AI recommendations on which task to tackle based on your mood and current tasks.

### 4. Generate Quests
Click **"Создать квест"** to have AI generate a personalized quest for you, complete with custom XP rewards.

### 5. Complete Tasks
Check off tasks to earn XP. Every 100 XP = 1 Level Up with confetti celebration! 🎉

### 6. Track Progress
Watch your character level up and monitor your statistics:
- Current Level
- Completed Tasks
- Total Tasks

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| ⚛️ **React 19** | UI framework |
| 📘 **TypeScript** | Type safety and better DX |
| ⚡ **Vite** | Fast build tool and dev server |
| 🎨 **Tailwind CSS v4** | Utility-first styling (latest version) |
| 🎯 **lucide-react** | Beautiful icon library |
| 🎊 **canvas-confetti** | Celebration effects |
| 🤖 **AIMLAPI** | AI-powered features (GPT-4o) |

## 📁 Project Structure

```
lifequest/
├── src/
│   ├── components/         # React components (future)
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts       # Shared interfaces
│   ├── ai.ts              # AI integration with AIMLAPI
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global Tailwind styles
├── public/                # Static assets
├── .env                   # Environment variables (not in git)
├── .env.example           # Environment template
├── postcss.config.js      # PostCSS with Tailwind v4
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_AIMLAPI_KEY` | Your AIMLAPI.com API key for AI features | Yes |

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

## 🎯 Core Mechanics

### XP & Leveling System
- Each completed task awards XP (default: 10 XP, AI quests: 10-150 XP)
- **100 XP = 1 Level**
- Current level determines XP needed for next level
- Confetti celebration on level up! 🎉

### AI Features
1. **Task Suggestions** - AI analyzes your incomplete tasks and mood to recommend what to do next
2. **Quest Generation** - AI creates personalized tasks based on your history, interests, and current state

### Data Persistence
All data is stored in browser's localStorage:
- `lifequest_tasks` - Your task list
- `lifequest_character` - XP and level data
- `lifequest_mood` - Daily mood selection

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for your own purposes!

## 🙏 Acknowledgments

- Built with [Claude Code](https://claude.com/claude-code) - AI-powered development
- Powered by [AIMLAPI](https://aimlapi.com) - AI/ML API platform
- Icons by [Lucide](https://lucide.dev)
- Confetti by [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Made with ❤️ and 🤖 AI** | LifeQuest v1.0

import { useState, useEffect, useCallback } from 'react'
import confetti from 'canvas-confetti'
import { Plus, Trash2, Sparkles, Target, CheckCircle2, Trophy, ListTodo, TrendingUp, Briefcase, Heart, Home, BookOpen, User, Edit2, Flame } from 'lucide-react'
import { getAISuggestion, generateQuest, getMoodEmoji, type Task as AITask } from './ai'

export type TaskCategory = 'work' | 'health' | 'home' | 'learning' | 'personal' | 'other'

export interface CategoryConfig {
  icon: typeof Briefcase
  label: string
  color: string
  bgColor: string
  borderColor: string
}

export const CATEGORIES: Record<TaskCategory, CategoryConfig> = {
  work: {
    icon: Briefcase,
    label: 'Работа',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
  },
  health: {
    icon: Heart,
    label: 'Здоровье',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
  },
  home: {
    icon: Home,
    label: 'Дом',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-300',
  },
  learning: {
    icon: BookOpen,
    label: 'Учеба',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300',
  },
  personal: {
    icon: User,
    label: 'Личное',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-300',
  },
  other: {
    icon: Target,
    label: 'Другое',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-300',
  },
}

interface Task {
  id: string
  title: string
  completed: boolean
  xp: number
  createdAt: Date
  category: TaskCategory
}

interface Character {
  xp: number
  level: number
}

interface Streak {
  current: number
  longest: number
  lastCompletionDate: string | null
}

function App() {
  // State
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('lifequest_tasks')
    if (saved) {
      const parsed: Task[] = JSON.parse(saved)
      return parsed.map((t) => ({
        ...t,
        createdAt: new Date(t.createdAt),
        category: t.category || 'other' // Обратная совместимость
      }))
    }
    return []
  })

  const [character, setCharacter] = useState<Character>(() => {
    const saved = localStorage.getItem('lifequest_character')
    return saved ? JSON.parse(saved) : { xp: 0, level: 1 }
  })

  const [mood, setMood] = useState<number>(() => {
    const today = new Date().toDateString()
    const saved = localStorage.getItem('lifequest_mood')
    if (saved) {
      const { date, value }: { date: string; value: number } = JSON.parse(saved)
      if (date === today) return value
    }
    return 3
  })

  const [newTaskTitle, setNewTaskTitle] = useState<string>('')
  const [newTaskCategory, setNewTaskCategory] = useState<TaskCategory>('other')
  const [aiSuggestion, setAiSuggestion] = useState<string>('')
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)

  const [streak, setStreak] = useState<Streak>(() => {
    const saved = localStorage.getItem('lifequest_streak')
    return saved ? JSON.parse(saved) : { current: 0, longest: 0, lastCompletionDate: null }
  })

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('lifequest_tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem('lifequest_character', JSON.stringify(character))
  }, [character])

  useEffect(() => {
    const today = new Date().toDateString()
    localStorage.setItem('lifequest_mood', JSON.stringify({ date: today, value: mood }))
  }, [mood])

  useEffect(() => {
    localStorage.setItem('lifequest_streak', JSON.stringify(streak))
  }, [streak])

  // Trigger confetti
  const triggerConfetti = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FFA500', '#FF69B4', '#9370DB'],
    })
  }, [])

  // Add task
  const addTask = useCallback((title: string, xp: number = 10, category: TaskCategory = 'other') => {
    if (!title.trim()) return

    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      completed: false,
      xp,
      createdAt: new Date(),
      category,
    }

    setTasks((prev) => [...prev, newTask])
    setNewTaskTitle('')
    setNewTaskCategory('other')
  }, [])

  // Toggle task completion (complete or uncomplete)
  const toggleTask = useCallback(
    (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId)
      if (!task) return

      const wasCompleted = task.completed
      const oldLevel = character.level

      // Toggle completion status
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
      )

      // Calculate total XP from all completed tasks (including this toggle)
      let totalXP = 0
      tasks.forEach((t) => {
        if (t.id === taskId) {
          // This task is being toggled
          if (!wasCompleted) {
            totalXP += t.xp // Adding XP
          }
          // If wasCompleted, don't add (removing XP)
        } else if (t.completed) {
          // Other completed tasks
          totalXP += t.xp
        }
      })

      // Calculate level and remaining XP from total XP
      let newLevel = 1
      let remainingXP = totalXP

      while (remainingXP >= newLevel * 100) {
        remainingXP -= newLevel * 100
        newLevel++
      }

      // Update character
      setCharacter({
        xp: remainingXP,
        level: newLevel,
      })

      // Trigger confetti only when completing a task AND leveling up
      if (!wasCompleted && newLevel > oldLevel) {
        triggerConfetti()
      }

      // Update streak when completing a task
      if (!wasCompleted) {
        const today = new Date().toDateString()
        const lastDate = streak.lastCompletionDate

        if (lastDate === today) {
          // Already completed a task today, no change to streak
          return
        }

        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = yesterday.toDateString()

        if (lastDate === yesterdayStr || lastDate === null) {
          // Continue streak or start new one
          const newCurrent = (lastDate === yesterdayStr) ? streak.current + 1 : 1
          setStreak({
            current: newCurrent,
            longest: Math.max(newCurrent, streak.longest),
            lastCompletionDate: today,
          })
        } else {
          // Streak broken, start over
          setStreak({
            current: 1,
            longest: streak.longest,
            lastCompletionDate: today,
          })
        }
      }
    },
    [tasks, character, triggerConfetti, streak]
  )

  // Delete task
  const deleteTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
  }, [])

  // Edit task
  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
    )
  }, [])

  // Get AI suggestion
  const handleAISuggestion = useCallback(async () => {
    setIsLoadingAI(true)
    setAiSuggestion('')

    try {
      const aiTasks: AITask[] = tasks.map((t) => ({
        id: t.id,
        title: t.title,
        completed: t.completed,
        xp: t.xp,
      }))

      const suggestion = await getAISuggestion(aiTasks, mood)
      setAiSuggestion(suggestion)
    } catch (error) {
      setAiSuggestion('❌ Ошибка при получении рекомендации. Проверьте API ключ в .env')
      console.error('AI Suggestion Error:', error)
    } finally {
      setIsLoadingAI(false)
    }
  }, [tasks, mood])

  // Generate AI quest
  const handleGenerateQuest = useCallback(async () => {
    setIsLoadingAI(true)

    try {
      const completedCount = tasks.filter((t) => t.completed).length
      const aiTasks: AITask[] = tasks.map((t) => ({
        id: t.id,
        title: t.title,
        completed: t.completed,
        xp: t.xp,
      }))

      const quest = await generateQuest(completedCount, aiTasks, mood)
      addTask(quest.title, quest.xp, 'other')
      setAiSuggestion(`✨ Создан новый квест: "${quest.title}" (${quest.xp} XP)\n${quest.description}`)
    } catch (error) {
      setAiSuggestion('❌ Ошибка при создании квеста. Проверьте API ключ в .env')
      console.error('Generate Quest Error:', error)
    } finally {
      setIsLoadingAI(false)
    }
  }, [tasks, mood, addTask])

  // Calculate stats
  const completedTasks = tasks.filter((t) => t.completed).length
  const totalTasks = tasks.length
  const xpForNextLevel = character.level * 100
  const progressPercentage = Math.min((character.xp / xpForNextLevel) * 100, 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-5xl sm:text-6xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-orange-500 transition-all duration-300">
            LifeQuest
          </h1>
          <p className="text-white/80 text-lg">
            Gamify your life with AI-powered task management
          </p>
        </header>

        {/* Character Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 transition-all duration-300 hover:shadow-2xl hover:border-white/30">
          <div className="flex items-center gap-6 mb-4">
            <div className="text-6xl transition-transform duration-300 hover:scale-110">🦸‍♂️</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Герой {character.level} уровня</h2>
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>
                    XP: {character.xp} / {xpForNextLevel}
                  </span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="bg-purple-500/20 rounded-xl p-3 text-center border border-purple-500/30 transition-all duration-300 hover:bg-purple-500/30 hover:scale-105">
              <Trophy className="w-6 h-6 mx-auto mb-1 text-yellow-400" />
              <div className="text-2xl font-bold">{character.level}</div>
              <div className="text-xs text-white/70">Уровень</div>
            </div>
            <div className="bg-green-500/20 rounded-xl p-3 text-center border border-green-500/30 transition-all duration-300 hover:bg-green-500/30 hover:scale-105">
              <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-green-400" />
              <div className="text-2xl font-bold">{completedTasks}</div>
              <div className="text-xs text-white/70">Выполнено</div>
            </div>
            <div className="bg-blue-500/20 rounded-xl p-3 text-center border border-blue-500/30 transition-all duration-300 hover:bg-blue-500/30 hover:scale-105">
              <ListTodo className="w-6 h-6 mx-auto mb-1 text-blue-400" />
              <div className="text-2xl font-bold">{totalTasks}</div>
              <div className="text-xs text-white/70">Всего</div>
            </div>
            <div className="bg-orange-500/20 rounded-xl p-3 text-center border border-orange-500/30 transition-all duration-300 hover:bg-orange-500/30 hover:scale-105">
              <Flame className="w-6 h-6 mx-auto mb-1 text-orange-400 animate-pulse" />
              <div className="text-2xl font-bold">{streak.current}</div>
              <div className="text-xs text-white/70">Стрик</div>
            </div>
          </div>
        </div>

        {/* Mood Tracker */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 transition-all duration-300">
          <h2 className="text-xl font-bold mb-4 text-center">Как ваше настроение?</h2>
          <div className="flex justify-center gap-3 flex-wrap">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => setMood(value)}
                className={`text-4xl p-3 rounded-xl transition-all duration-300 transform hover:scale-110 ${
                  mood === value
                    ? 'bg-purple-500/40 border-2 border-purple-400 scale-110 shadow-lg'
                    : 'bg-white/5 border border-white/20 hover:bg-white/10'
                }`}
                title={['Очень плохо', 'Плохо', 'Нормально', 'Хорошо', 'Отлично'][value - 1]}
              >
                {getMoodEmoji(value)}
              </button>
            ))}
          </div>
        </div>

        {/* AI Section */}
        <div className="bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-orange-600/30 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-purple-500/30 transition-all duration-300">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
            AI Помощник
          </h2>

          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={handleAISuggestion}
              disabled={isLoadingAI || tasks.length === 0}
              className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:from-purple-500 disabled:hover:to-pink-500"
            >
              <Target className="w-5 h-5" />
              {isLoadingAI ? 'Думаю...' : 'Что делать сейчас?'}
            </button>

            <button
              onClick={handleGenerateQuest}
              disabled={isLoadingAI}
              className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:from-orange-500 disabled:hover:to-pink-500"
            >
              <Sparkles className="w-5 h-5" />
              {isLoadingAI ? 'Создаю...' : 'Создать квест'}
            </button>
          </div>

          {aiSuggestion && (
            <div className="bg-white/10 rounded-lg p-4 border border-white/20 whitespace-pre-line animate-fade-in">
              {aiSuggestion}
            </div>
          )}
        </div>

        {/* Task Input */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 transition-all duration-300">
          <h2 className="text-xl font-bold mb-4">Добавить задачу</h2>

          {/* Category selector */}
          <div className="flex flex-wrap gap-2 mb-4">
            {(Object.keys(CATEGORIES) as TaskCategory[]).map((cat) => {
              const config = CATEGORIES[cat]
              const Icon = config.icon
              return (
                <button
                  key={cat}
                  onClick={() => setNewTaskCategory(cat)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    newTaskCategory === cat
                      ? `${config.bgColor} ${config.borderColor} border-2 scale-105 shadow-lg`
                      : 'bg-white/5 border border-white/20 hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${newTaskCategory === cat ? config.color : 'text-white/70'}`} />
                  <span className={`text-sm ${newTaskCategory === cat ? config.color : 'text-white/70'}`}>
                    {config.label}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask(newTaskTitle, 10, newTaskCategory)}
              placeholder="Введите новую задачу..."
              className="flex-1 px-4 py-3 rounded-lg bg-white/20 border border-white/30 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
            />
            <button
              onClick={() => addTask(newTaskTitle, 10, newTaskCategory)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Добавить
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 transition-all duration-300">
          <h2 className="text-xl font-bold mb-4">
            Задачи ({tasks.filter((t) => !t.completed).length} активных)
          </h2>

          {tasks.length === 0 ? (
            <div className="text-center py-12 text-white/60">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50 animate-pulse" />
              <p className="text-lg mb-2">Нет задач. Начните свой квест!</p>
              <p className="text-sm text-white/40">
                Добавьте первую задачу или создайте квест с помощью AI
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center gap-3 p-4 rounded-lg transition-all duration-300 ${
                    task.completed
                      ? 'bg-green-500/20 border border-green-500/40'
                      : 'bg-white/5 border border-white/20 hover:bg-white/10 hover:border-white/30'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="w-5 h-5 cursor-pointer accent-green-500 transition-transform duration-200 hover:scale-110"
                  />

                  <span
                    className={`flex-1 transition-all duration-300 ${
                      task.completed ? 'line-through text-white/50' : ''
                    }`}
                  >
                    {task.title}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold transition-all duration-300 ${
                      task.completed
                        ? 'bg-green-500/30 text-green-200'
                        : 'bg-purple-500/30 text-purple-200'
                    }`}
                  >
                    {task.xp} XP
                  </span>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-300 hover:text-red-200 transition-all duration-300 transform hover:scale-110"
                    title="Удалить"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center text-white/50 text-sm py-4">
          Powered by AIMLAPI 🤖 • Made with AI & React • LifeQuest v1.0
        </footer>
      </div>
    </div>
  )
}

export default App

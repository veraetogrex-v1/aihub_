// AI Integration for LifeQuest using AIMLAPI.COM

export interface Task {
  id: string
  title: string
  completed: boolean
  xp: number
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface ChatCompletionResponse {
  choices: {
    message: {
      content: string
    }
  }[]
}

interface QuestResponse {
  title: string
  description: string
  xp: number
}

const API_ENDPOINT = 'https://api.aimlapi.com/v1/chat/completions'
const API_KEY = import.meta.env.VITE_AIMLAPI_KEY
const MODEL = 'chatgpt-4o-latest'

/**
 * Отправляет запрос к AIMLAPI
 */
async function callAI(messages: ChatMessage[]): Promise<string> {
  console.log('🤖 [AI] Starting AI request...')
  console.log('🔑 [AI] API_KEY exists:', !!API_KEY)
  console.log('🔑 [AI] API_KEY length:', API_KEY?.length || 0)
  console.log('🌐 [AI] Endpoint:', API_ENDPOINT)
  console.log('📝 [AI] Model:', MODEL)

  if (!API_KEY) {
    console.error('❌ [AI] No API key found!')
    throw new Error('VITE_AIMLAPI_KEY is not configured. Please set it in your .env file.')
  }

  if (API_KEY === 'your_api_key_here') {
    console.error('❌ [AI] Using placeholder API key!')
    throw new Error('Please replace "your_api_key_here" with a real API key in .env file.')
  }

  try {
    const requestBody = {
      model: MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 500,
    }

    console.log('📤 [AI] Sending request to AIMLAPI...')
    console.log('📤 [AI] Request body:', JSON.stringify(requestBody, null, 2))

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    })

    console.log('📥 [AI] Response status:', response.status, response.statusText)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('❌ [AI] API error response:', errorData)
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}. ${
          errorData.error?.message || ''
        }`
      )
    }

    const data: ChatCompletionResponse = await response.json()
    console.log('✅ [AI] Response received successfully')
    console.log('📄 [AI] Response data:', JSON.stringify(data, null, 2))

    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error('❌ [AI] Invalid response format:', data)
      throw new Error('Invalid response format from API')
    }

    console.log('✅ [AI] AI response:', data.choices[0].message.content)
    return data.choices[0].message.content
  } catch (error) {
    console.error('❌ [AI] Error in callAI:', error)
    throw error
  }
}

/**
 * Получает эмоджи для настроения
 */
export function getMoodEmoji(mood: number): string {
  const moods: Record<number, string> = {
    1: '😢',
    2: '😕',
    3: '😐',
    4: '😊',
    5: '🎉',
  }
  return moods[mood] || '😐'
}

/**
 * Извлекает категории задач по ключевым словам
 */
export function extractCategories(tasks: Task[]): string[] {
  const categoryKeywords: Record<string, string[]> = {
    'Работа': ['работа', 'проект', 'задача', 'встреча', 'отчет', 'код', 'programming'],
    'Здоровье': ['спорт', 'тренировка', 'здоровье', 'врач', 'workout', 'exercise'],
    'Дом': ['уборка', 'покупки', 'готовка', 'ремонт', 'cleaning', 'shopping'],
    'Учеба': ['учеба', 'курс', 'книга', 'изучить', 'learn', 'study'],
    'Личное': ['звонок', 'друзья', 'семья', 'хобби', 'hobby', 'family'],
  }

  const foundCategories = new Set<string>()

  tasks.forEach(task => {
    const lowerTitle = task.title.toLowerCase()

    Object.entries(categoryKeywords).forEach(([category, keywords]) => {
      if (keywords.some(keyword => lowerTitle.includes(keyword))) {
        foundCategories.add(category)
      }
    })
  })

  return Array.from(foundCategories)
}

/**
 * Получает рекомендацию ИИ какую задачу делать сейчас
 */
export async function getAISuggestion(tasks: Task[], mood: number): Promise<string> {
  console.log('🎯 [getAISuggestion] Called with:', { tasksCount: tasks.length, mood })

  const incompleteTasks = tasks.filter(task => !task.completed)
  console.log('📋 [getAISuggestion] Incomplete tasks:', incompleteTasks.length)

  if (incompleteTasks.length === 0) {
    console.log('✅ [getAISuggestion] No incomplete tasks, returning success message')
    return '🎉 Отлично! Все задачи выполнены. Время отдохнуть или добавить новые цели!'
  }

  const moodEmoji = getMoodEmoji(mood)
  const categories = extractCategories(incompleteTasks)
  console.log('📊 [getAISuggestion] Categories:', categories)
  console.log('😊 [getAISuggestion] Mood emoji:', moodEmoji)

  const tasksList = incompleteTasks
    .map((task, idx) => `${idx + 1}. ${task.title} (${task.xp} XP)`)
    .join('\n')

  const systemPrompt = `Ты — персональный AI-коуч по продуктивности в приложении LifeQuest.
Твоя задача — анализировать задачи пользователя и его настроение, чтобы дать персонализированную рекомендацию.

Принципы рекомендаций:
- Если настроение низкое (1-2) — предлагай простые задачи для моментального успеха
- Если настроение среднее (3) — предлагай задачи средней сложности
- Если настроение хорошее (4-5) — можно браться за сложные задачи
- Учитывай XP задач как индикатор их важности
- Будь мотивирующим и позитивным

Формат ответа СТРОГО: "🎯 Рекомендую: [название задачи]. [Краткая причина 1-2 предложения]"`

  const userPrompt = `Текущее настроение: ${moodEmoji} (${mood}/5)
Категории задач: ${categories.length > 0 ? categories.join(', ') : 'Смешанные'}

Невыполненные задачи:
${tasksList}

Какую задачу мне лучше выполнить сейчас?`

  try {
    console.log('🚀 [getAISuggestion] Calling callAI...')
    const response = await callAI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ])

    console.log('✅ [getAISuggestion] Received response from AI')
    return response.trim()
  } catch (error) {
    console.error('❌ [getAISuggestion] Error getting AI suggestion:', error)

    // Fallback: простая рекомендация
    const randomTask = incompleteTasks[Math.floor(Math.random() * incompleteTasks.length)]
    const fallbackMessage = `🎯 Рекомендую: ${randomTask.title}. Это отличная задача для начала!`
    console.log('🔄 [getAISuggestion] Using fallback:', fallbackMessage)
    return fallbackMessage
  }
}

/**
 * Генерирует новую задачу-квест с помощью ИИ
 */
export async function generateQuest(
  completedTasksCount: number,
  existingTasks: Task[],
  mood: number
): Promise<QuestResponse> {
  console.log('✨ [generateQuest] Called with:', { completedTasksCount, tasksCount: existingTasks.length, mood })

  const moodEmoji = getMoodEmoji(mood)
  const categories = extractCategories(existingTasks)
  console.log('📊 [generateQuest] Categories:', categories)
  console.log('😊 [generateQuest] Mood emoji:', moodEmoji)

  const recentTasks = existingTasks
    .slice(-5)
    .map(task => task.title)
    .join(', ')

  const systemPrompt = `Ты — генератор персонализированных квестов для приложения LifeQuest.
Создавай интересные, мотивирующие задачи, которые помогут пользователю развиваться.

Правила генерации квестов:
- Квесты должны быть конкретными и выполнимыми
- XP зависит от сложности: 10-30 для простых, 40-70 для средних, 80-150 для сложных
- Учитывай настроение: при низком настроении предлагай простые воодушевляющие квесты
- Учитывай контекст существующих задач пользователя
- Название до 50 символов, описание до 100 символов

ВАЖНО: Ответ ТОЛЬКО в формате JSON, без дополнительного текста:
{
  "title": "Название квеста",
  "description": "Описание квеста",
  "xp": число
}`

  const userPrompt = `Настроение: ${moodEmoji} (${mood}/5)
Выполнено задач: ${completedTasksCount}
Категории интересов: ${categories.length > 0 ? categories.join(', ') : 'Не определены'}
${recentTasks ? `Недавние задачи: ${recentTasks}` : ''}

Сгенерируй новый квест!`

  try {
    console.log('🚀 [generateQuest] Calling callAI...')
    const response = await callAI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ])

    console.log('✅ [generateQuest] Received response from AI')
    console.log('📝 [generateQuest] Raw response:', response)

    // Удаляем markdown блоки если есть
    let jsonStr = response.trim()
    jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    console.log('🔄 [generateQuest] Cleaned JSON:', jsonStr)

    // Парсим JSON
    const quest: QuestResponse = JSON.parse(jsonStr)

    // Валидация
    if (!quest.title || !quest.description || typeof quest.xp !== 'number') {
      throw new Error('Invalid quest format')
    }

    // Ограничиваем длину
    quest.title = quest.title.slice(0, 50)
    quest.description = quest.description.slice(0, 100)
    quest.xp = Math.max(10, Math.min(150, quest.xp)) // XP между 10 и 150

    return quest
  } catch (error) {
    console.error('Error generating quest:', error)

    // Fallback квесты в зависимости от настроения
    const fallbackQuests: Record<number, QuestResponse> = {
      1: {
        title: '☕ Сделай перерыв и выпей воды',
        description: 'Небольшой отдых поможет восстановить силы и улучшить настроение',
        xp: 15,
      },
      2: {
        title: '🎵 Послушай любимую музыку 10 минут',
        description: 'Музыка поднимает настроение и мотивирует на новые свершения',
        xp: 20,
      },
      3: {
        title: '📚 Прочитай 10 страниц интересной книги',
        description: 'Чтение развивает мышление и расширяет кругозор',
        xp: 30,
      },
      4: {
        title: '💪 Сделай 15-минутную тренировку',
        description: 'Физическая активность улучшает здоровье и продуктивность',
        xp: 50,
      },
      5: {
        title: '🚀 Начни новый амбициозный проект',
        description: 'Твоя энергия на пике! Самое время для больших целей',
        xp: 100,
      },
    }

    return fallbackQuests[mood] || fallbackQuests[3]
  }
}

# 🤖 AI Usage Documentation

This document explains how Artificial Intelligence is used in the LifeQuest project, both in the product itself and during its development.

## 📊 Table of Contents

1. [AI in the Product](#ai-in-the-product)
2. [AI Integration Details](#ai-integration-details)
3. [Development with Claude Code](#development-with-claude-code)
4. [Prompts Used](#prompts-used)

---

## 🎯 AI in the Product

LifeQuest uses AI to enhance user productivity through two main features:

### 1. 🎲 AI Task Suggestions

**Purpose**: Help users decide what task to work on next based on their current mood and task list.

**How it works**:
- Analyzes all incomplete tasks
- Considers user's current mood (1-5 scale)
- Extracts task categories (Work, Health, Home, Study, Personal)
- Uses GPT-4o to provide personalized recommendations
- Returns motivating, contextual advice

**Implementation**: `getAISuggestion(tasks, mood)` in [src/ai.ts](src/ai.ts)

**Example Response**:
```
🎯 Рекомендую: Сделать 15-минутную тренировку.
При хорошем настроении физическая активность усилит вашу энергию
и поможет сохранить продуктивность на весь день!
```

### 2. ✨ AI Quest Generation

**Purpose**: Generate personalized tasks/quests tailored to user's interests and current state.

**How it works**:
- Considers completed tasks count (progression)
- Analyzes recent tasks to understand user interests
- Factors in current mood
- Generates JSON with: title, description, XP reward
- Validates and sanitizes output

**Implementation**: `generateQuest(completedTasksCount, existingTasks, mood)` in [src/ai.ts](src/ai.ts)

**Example Response**:
```json
{
  "title": "💪 Сделай 15-минутную тренировку",
  "description": "Физическая активность улучшает здоровье и продуктивность",
  "xp": 50
}
```

---

## 🔧 AI Integration Details

### API Configuration

**Provider**: [AIMLAPI.com](https://aimlapi.com)
**Endpoint**: `https://api.aimlapi.com/chat/completions`
**Model**: `gpt-4o`
**Authentication**: Bearer token from `VITE_AIMLAPI_KEY`

### Request Format

```typescript
{
  model: 'gpt-4o',
  messages: [
    { role: 'system', content: 'System prompt...' },
    { role: 'user', content: 'User prompt...' }
  ],
  temperature: 0.7,
  max_tokens: 500
}
```

### Error Handling

Both AI functions include:
- Try-catch blocks for API errors
- Fallback responses when API fails
- User-friendly error messages
- Console logging for debugging

---

## 💡 Example AI Prompts Used in Product

### System Prompt: Task Suggestions

```
Ты — персональный AI-коуч по продуктивности в приложении LifeQuest.
Твоя задача — анализировать задачи пользователя и его настроение,
чтобы дать персонализированную рекомендацию.

Принципы рекомендаций:
- Если настроение низкое (1-2) — предлагай простые задачи для моментального успеха
- Если настроение среднее (3) — предлагай задачи средней сложности
- Если настроение хорошее (4-5) — можно браться за сложные задачи
- Учитывай XP задач как индикатор их важности
- Будь мотивирующим и позитивным

Формат ответа СТРОГО: "🎯 Рекомендую: [название задачи]. [Краткая причина 1-2 предложения]"
```

### User Prompt: Task Suggestions

```
Текущее настроение: 😊 (4/5)
Категории задач: Работа, Здоровье

Невыполненные задачи:
1. Написать код для проекта (50 XP)
2. Сделать тренировку (30 XP)
3. Прочитать книгу (20 XP)

Какую задачу мне лучше выполнить сейчас?
```

### System Prompt: Quest Generation

```
Ты — генератор персонализированных квестов для приложения LifeQuest.
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
}
```

### User Prompt: Quest Generation

```
Настроение: 🎉 (5/5)
Выполнено задач: 15
Категории интересов: Программирование, Спорт
Недавние задачи: Написать код, Тренировка, Чтение

Сгенерируй новый квест!
```

---

## 🛠️ Development with Claude Code

This entire project was built using [Claude Code](https://claude.com/claude-code), an AI-powered development environment.

### How Claude Code Was Used

1. **Project Setup**
   - Generated Vite + React + TypeScript boilerplate
   - Configured Tailwind CSS
   - Set up project structure

2. **AI Integration**
   - Implemented AIMLAPI integration
   - Created prompt engineering for optimal responses
   - Built error handling and fallback systems

3. **UI Development**
   - Designed component structure
   - Implemented Tailwind styling with gradients
   - Added animations and transitions

4. **Code Quality**
   - TypeScript type safety
   - Performance optimization with useCallback
   - Code review and refactoring

5. **Documentation**
   - Generated comprehensive README
   - Created this AI usage documentation
   - Added code comments

### Benefits of AI-Assisted Development

- ⚡ **Speed**: Rapid prototyping and iteration
- 🎯 **Accuracy**: TypeScript types and error handling
- 📚 **Best Practices**: Modern React patterns (hooks, functional updates)
- 🎨 **Design**: Beautiful UI without design expertise
- 📖 **Documentation**: Auto-generated, comprehensive docs

---

## 📝 Prompts Used During Development

### Initial Project Creation

```
Создай новый Vite React TypeScript проект со следующей структурой:

1. Инициализируй проект с vite, react, typescript
2. Установи зависимости: canvas-confetti, lucide-react
3. Настрой Tailwind CSS
4. Создай файл .env с переменной VITE_AIMLAPI_KEY
5. Настрой tailwind.config.js
6. Добавь Tailwind директивы в src/index.css
7. Создай структуру папок: src/components, src/types
8. Удали стандартный App.css и лишние файлы

Проект называется "lifequest" - геймификация задач с ИИ.
```

### AI Integration

```
Создай файл src/ai.ts с интеграцией AIMLAPI.COM для ИИ-функций:

Требования:
1. Используй API endpoint: https://api.aimlapi.com/chat/completions
2. API ключ берется из import.meta.env.VITE_AIMLAPI_KEY
3. Модель: 'gpt-4o'
4. Создай интерфейс Task с полями: id, title, completed, xp

Создай 3 экспортируемые async функции:
1. getAISuggestion(tasks, mood) - рекомендует задачу
2. generateQuest(completedTasksCount, existingTasks, mood) - генерит квест
3. Вспомогательные функции: getMoodEmoji, extractCategories
```

### Main App Component

```
Создай полноценный файл src/App.tsx - главное приложение LifeQuest:

ИНТЕРФЕЙСЫ:
- Task: id, title, completed, xp, createdAt
- Character: xp, level

STATE (используй localStorage):
- tasks, character, mood, newTaskTitle, aiSuggestion, isLoadingAI

ФУНКЦИИ:
1. addTask - добавляет задачу
2. completeTask - начисляет XP, проверяет level up, запускает confetti
3. deleteTask - удаляет задачу
4. handleAISuggestion - вызывает AI
5. handleGenerateQuest - генерит квест через AI

UI КОМПОНЕНТЫ (Tailwind, градиенты purple-pink-orange):
1. Header, 2. Character Card, 3. Mood Tracker, 4. AI Section,
5. Task Input, 6. Task List
```

### Code Review and Optimization

```
Проверь и исправь проект:

1. Убедись что все импорты корректны
2. Добавь обработку пустых состояний (иконка TrendingUp)
3. Проверь прогресс-бар XP (Math.min)
4. Добавь disabled состояния для AI кнопок
5. Добавь плавные transitions
6. Confetti только при реальном level up
7. Обнови footer
8. Проверь согласованность цветов
9. Enter для добавления задачи
10. Проверь TypeScript типы (no any)

Оптимизируй производительность и читаемость.
```

### Documentation

```
Создай файлы документации:

1. README.md с разделами:
   - Описание проекта LifeQuest
   - Установка и запуск
   - Настройка .env
   - Основные функции
   - Технологический стек

2. AI_USAGE.md с детальным описанием:
   - Как используется ИИ в продукте
   - Примеры промптов для AIMLAPI
   - Как использовался Claude Code при разработке
   - Список всех промптов

3. .env.example файл с шаблоном

Форматирование markdown с эмоджи.
```

---

## 🎓 Lessons Learned

### Prompt Engineering Tips

1. **Be Specific**: Clear, detailed prompts yield better results
2. **Provide Context**: Include user state (mood, tasks, history)
3. **Format Instructions**: Specify exact output format (JSON, text structure)
4. **System Prompts**: Use them to define AI personality and rules
5. **Error Handling**: Always have fallback responses

### AI Integration Best Practices

1. **Type Safety**: Define clear TypeScript interfaces
2. **Validation**: Always validate and sanitize AI responses
3. **User Feedback**: Show loading states and error messages
4. **Graceful Degradation**: App should work even if AI fails
5. **Cost Management**: Set max_tokens to control API costs

---

## 🔮 Future AI Enhancements

Potential features to add:

- 🧠 **Smart Scheduling**: AI suggests optimal times for tasks
- 📊 **Analytics**: AI-powered insights on productivity patterns
- 🎭 **Personality**: Customizable AI coach personality
- 🌍 **Multi-language**: AI responses in user's preferred language
- 🔄 **Adaptive Learning**: AI learns from user preferences over time
- 🎨 **Dynamic Theming**: AI suggests themes based on mood
- 📱 **Push Notifications**: AI-timed reminders for tasks

---

## 📚 Resources

- [AIMLAPI Documentation](https://docs.aimlapi.com)
- [OpenAI GPT-4 Guide](https://platform.openai.com/docs/guides/gpt)
- [Prompt Engineering Guide](https://www.promptingguide.ai)
- [Claude Code Documentation](https://docs.claude.com/claude-code)

---

**Last Updated**: 2025-10-25
**Version**: 1.0
**AI Model**: GPT-4o via AIMLAPI

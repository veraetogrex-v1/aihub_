# 🔍 AI Debug Guide

## Проблема: AI не обращается к AIMLAPI

Если вы видите что API ключ настроен в `.env`, но логи AIMLAPI показывают что запросов нет - следуйте этой инструкции.

---

## ✅ Добавлено детальное логирование

В проект добавлено полное логирование AI запросов. Теперь каждый запрос выводит детальную информацию в консоль браузера.

### Как проверить логи:

1. **Откройте DevTools в браузере** (F12 или Ctrl+Shift+I)
2. **Перейдите на вкладку Console**
3. **Нажмите AI кнопку** в приложении
4. **Смотрите логи**

---

## 📊 Что показывают логи

### При нажатии "Создать квест":

```
✨ [generateQuest] Called with: { completedTasksCount: 0, tasksCount: 0, mood: 3 }
📊 [generateQuest] Categories: []
😊 [generateQuest] Mood emoji: 😐
🚀 [generateQuest] Calling callAI...
🤖 [AI] Starting AI request...
🔑 [AI] API_KEY exists: true
🔑 [AI] API_KEY length: 52
🌐 [AI] Endpoint: https://api.aimlapi.com/chat/completions
📝 [AI] Model: gpt-4o
📤 [AI] Sending request to AIMLAPI...
📤 [AI] Request body: {
  "model": "gpt-4o",
  "messages": [...],
  "temperature": 0.7,
  "max_tokens": 500
}
📥 [AI] Response status: 200 OK
✅ [AI] Response received successfully
📄 [AI] Response data: {...}
✅ [AI] AI response: {...}
✅ [generateQuest] Received response from AI
```

### При нажатии "Что делать сейчас?":

```
🎯 [getAISuggestion] Called with: { tasksCount: 3, mood: 4 }
📋 [getAISuggestion] Incomplete tasks: 2
📊 [getAISuggestion] Categories: ['Работа']
😊 [getAISuggestion] Mood emoji: 😊
🚀 [getAISuggestion] Calling callAI...
🤖 [AI] Starting AI request...
[... аналогично ...]
```

---

## 🐛 Возможные проблемы и решения

### ❌ Проблема 1: API ключ не найден

**Лог**:
```
❌ [AI] No API key found!
```

**Решение**:
1. Проверьте что `.env` файл существует в корне проекта
2. Убедитесь что в `.env` есть строка:
   ```
   VITE_AIMLAPI_KEY=your_actual_key
   ```
3. **ВАЖНО**: Перезапустите dev сервер:
   ```bash
   # Ctrl+C чтобы остановить
   npm run dev
   ```

---

### ❌ Проблема 2: Используется плейсхолдер

**Лог**:
```
❌ [AI] Using placeholder API key!
```

**Решение**:
1. Откройте `.env`
2. Замените `your_api_key_here` на реальный ключ
3. Перезапустите сервер

---

### ❌ Проблема 3: API ключ неправильный

**Лог**:
```
📥 [AI] Response status: 401 Unauthorized
❌ [AI] API error response: { error: { message: "Invalid API key" } }
```

**Решение**:
1. Зайдите на https://aimlapi.com
2. Проверьте что ключ активен
3. Скопируйте ключ заново
4. Вставьте в `.env`
5. Перезапустите сервер

---

### ❌ Проблема 4: Нет задач

**Лог** (для "Что делать сейчас?"):
```
📋 [getAISuggestion] Incomplete tasks: 0
✅ [getAISuggestion] No incomplete tasks, returning success message
```

**Это НЕ ошибка!** Кнопка "Что делать сейчас?" disabled если нет задач.

**Решение**: Добавьте хотя бы одну задачу

---

### ❌ Проблема 5: Сетевая ошибка

**Лог**:
```
❌ [AI] Error in callAI: TypeError: Failed to fetch
```

**Возможные причины**:
1. Нет интернета
2. Блокировка CORS (маловероятно)
3. Файрвол блокирует запросы
4. AIMLAPI недоступен

**Решение**:
1. Проверьте интернет подключение
2. Проверьте https://aimlapi.com в браузере
3. Временно отключите VPN/Proxy
4. Проверьте настройки файрвола

---

### ❌ Проблема 6: Запрос не доходит до AIMLAPI

**Симптомы**:
- Логи показывают что запрос отправлен
- Но в логах AIMLAPI его нет

**Возможные причины**:

#### 1. Ключ от другого аккаунта
```
# Проверьте что ключ в .env соответствует вашему аккаунту на AIMLAPI
```

#### 2. Используется другой endpoint
```
🌐 [AI] Endpoint: https://api.aimlapi.com/chat/completions
# Убедитесь что это правильный endpoint
```

#### 3. Кеш браузера
```
# Очистите кеш браузера:
1. DevTools (F12) → Network
2. Поставьте галочку "Disable cache"
3. Обновите страницу (Ctrl+R)
```

#### 4. Service Worker
```
# Проверьте в DevTools → Application → Service Workers
# Удалите если есть
```

---

## 🧪 Шаги отладки

### Шаг 1: Проверьте .env

```bash
cat .env
# Должно быть:
# VITE_AIMLAPI_KEY=sk-proj-xxxxxxxxxxxx
```

### Шаг 2: Перезапустите сервер

```bash
# ВСЕГДА перезапускайте после изменения .env!
npm run dev
```

### Шаг 3: Откройте DevTools

1. F12
2. Console tab
3. Clear console (очистить)

### Шаг 4: Добавьте задачу

```
1. Добавьте задачу "Test task"
2. Выберите настроение 😊
```

### Шаг 5: Нажмите "Создать квест"

```
1. Нажмите кнопку
2. Смотрите логи в Console
3. Ищите 🤖 [AI] Starting AI request...
```

### Шаг 6: Анализируйте логи

**Если видите**:
```
🤖 [AI] Starting AI request...
🔑 [AI] API_KEY exists: true
📤 [AI] Sending request to AIMLAPI...
📥 [AI] Response status: 200 OK
✅ [AI] Response received successfully
```
**= ВСЁ РАБОТАЕТ! ✅**

**Если видите**:
```
❌ [AI] ...
```
**= Ошибка, смотрите выше в разделе "Возможные проблемы"**

---

## 📸 Screenshot логов

Если проблема не решается, сделайте скриншот консоли браузера с логами и отправьте:

1. Откройте DevTools (F12)
2. Console tab
3. Нажмите AI кнопку
4. Screenshot всей консоли
5. Отправьте в issue

---

## 🔬 Дополнительная отладка

### Проверить что API ключ читается

Добавьте временно в `src/ai.ts` (в начале файла):

```typescript
console.log('🔑 DEBUG: API_KEY =', import.meta.env.VITE_AIMLAPI_KEY)
```

Откройте консоль браузера - должен быть ваш ключ.

**ВАЖНО**: Удалите эту строку после отладки!

---

### Проверить Network запросы

1. DevTools → **Network** tab
2. Нажмите AI кнопку
3. Найдите запрос к `aimlapi.com`
4. Проверьте:
   - Status code (должен быть 200)
   - Headers → Authorization (должен быть ваш ключ)
   - Response (ответ от API)

---

## ✅ Контрольный список

Перед тем как сообщать о проблеме, проверьте:

- [ ] `.env` файл существует
- [ ] `.env` содержит реальный API ключ (не `your_api_key_here`)
- [ ] Dev сервер перезапущен после изменения `.env`
- [ ] Браузер обновлен (Ctrl+R)
- [ ] DevTools открыты (F12)
- [ ] Console tab активна
- [ ] Есть хотя бы одна задача (для "Что делать сейчас?")
- [ ] Настроение выбрано
- [ ] Логи показывают `🤖 [AI] Starting AI request...`

---

## 🆘 Если ничего не помогает

1. Создайте новый `.env` файл
2. Сгенерируйте новый API ключ на https://aimlapi.com
3. Остановите ВСЕ процессы node
4. Удалите `node_modules/.vite` кеш
5. Перезапустите:
   ```bash
   npm run dev
   ```
6. Откройте в **приватном окне** браузера

---

**Последнее обновление**: 2025-10-25
**Версия логирования**: 2.0 (детальное)

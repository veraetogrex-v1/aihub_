# 🤖 AI Setup Guide

## Quick Check: Is AI Working?

### ✅ AI Integration Status

AI is **fully integrated** in the LifeQuest project! Here's what's already working:

1. ✅ **AI Code**: `src/ai.ts` - Complete AIMLAPI integration
2. ✅ **AI Functions**:
   - `getAISuggestion()` - Task recommendations
   - `generateQuest()` - Quest generation
3. ✅ **UI Buttons**: 2 AI buttons in the app
4. ✅ **Error Handling**: Fallback responses when API fails

### 🔍 How to Verify AI is Integrated

**Open the app** (http://localhost:5176) and you'll see:

1. **AI Section** with purple-pink gradient
2. **Two buttons**:
   - 🎯 "Что делать сейчас?" - Get AI suggestion
   - ✨ "Создать квест" - Generate AI quest

**Try clicking them!**

---

## 🔑 Setting Up Your API Key

### Step 1: Get an API Key

1. Go to [AIMLAPI.com](https://aimlapi.com)
2. Sign up for an account (free tier available)
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-proj-...`)

### Step 2: Configure Environment

**Edit the `.env` file** in your project root:

```bash
# Before:
VITE_AIMLAPI_KEY=your_api_key_here

# After:
VITE_AIMLAPI_KEY=sk-proj-your-actual-key-here
```

### Step 3: Restart Dev Server

**IMPORTANT**: Vite only loads `.env` on startup!

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 4: Test AI Features

1. Open http://localhost:5176
2. Add some tasks (e.g., "Write code", "Exercise", "Read book")
3. Select your mood (😢😕😐😊🎉)
4. Click **"Что делать сейчас?"**
5. Wait 2-5 seconds
6. See AI recommendation! 🎉

---

## 🧪 Testing AI Features

### Test 1: AI Task Suggestion

**Setup**:
```
1. Add 3+ tasks with different names
2. Set your mood to 😊 (happy)
3. Click "Что делать сейчас?"
```

**Expected Result**:
```
🎯 Рекомендую: Exercise. При хорошем настроении
физическая активность усилит вашу энергию!
```

### Test 2: AI Quest Generation

**Setup**:
```
1. Set mood to 🎉 (excellent)
2. Click "Создать квест"
```

**Expected Result**:
```
✨ Создан новый квест: "🚀 Начни новый амбициозный проект" (100 XP)
Твоя энергия на пике! Самое время для больших целей
```

**Plus**: A new task appears in your task list!

---

## ❌ Troubleshooting AI Issues

### Issue 1: "Ошибка при получении рекомендации"

**Possible Causes**:
- ❌ API key not set
- ❌ Invalid API key
- ❌ Server not restarted after `.env` change
- ❌ Network issues

**Solutions**:
1. Check `.env` has real key (not `your_api_key_here`)
2. Verify key at https://aimlapi.com
3. Restart dev server: `npm run dev`
4. Check browser console for errors (F12)

### Issue 2: AI Buttons Disabled

**Cause**: No tasks in the list

**Solution**: Add at least one task first

### Issue 3: Slow Response

**Normal**: AI requests take 2-10 seconds

**Check**:
- Network connection
- AIMLAPI status
- Browser console for errors

---

## 🎯 How AI Works in LifeQuest

### Feature 1: Smart Task Suggestions

**Input**:
```typescript
{
  tasks: [
    { title: "Write code", completed: false, xp: 50 },
    { title: "Exercise", completed: false, xp: 30 },
    { title: "Read book", completed: false, xp: 20 }
  ],
  mood: 4 // 😊
}
```

**AI Analysis**:
1. ✅ Considers your mood level
2. ✅ Analyzes task complexity (XP = difficulty)
3. ✅ Detects task categories (Work, Health, Learning)
4. ✅ Provides motivating recommendation

**Output**:
```
🎯 Рекомендую: Exercise. При хорошем настроении
физическая активность даст энергию на весь день!
```

### Feature 2: Personalized Quest Generation

**Input**:
```typescript
{
  completedTasksCount: 15,
  existingTasks: [...],
  mood: 5 // 🎉
}
```

**AI Analysis**:
1. ✅ Looks at your progression (15 tasks done)
2. ✅ Analyzes recent task patterns
3. ✅ Considers current mood
4. ✅ Generates appropriate difficulty

**Output**:
```json
{
  "title": "💪 Сделай 20-минутную тренировку",
  "description": "Физическая активность улучшает здоровье",
  "xp": 50
}
```

---

## 🔐 API Key Security

### ✅ Good Practices

- ✅ `.env` is in `.gitignore` (already configured)
- ✅ Never commit `.env` to git
- ✅ Use `.env.example` for templates
- ✅ Regenerate key if accidentally exposed

### ❌ Don't Do This

- ❌ Hardcode API key in source code
- ❌ Share `.env` file
- ❌ Commit API key to GitHub
- ❌ Use production key in development

---

## 📊 AI Usage & Costs

### AIMLAPI Pricing

**Free Tier** (check current limits):
- ~100 requests/day
- GPT-4o model access
- Good for development/testing

**Paid Tiers**:
- Higher request limits
- Faster responses
- Priority support

### Optimizing Usage

**Tips to save API calls**:
1. Cache AI responses (future feature)
2. Use fallback responses for testing
3. Limit AI calls during development
4. Use mock data for UI testing

---

## 🚀 Advanced: Customizing AI Behavior

### Modify System Prompts

**File**: `src/ai.ts`

**Current behavior**:
- Low mood (1-2) → suggests simple tasks
- Medium mood (3) → suggests medium tasks
- High mood (4-5) → suggests challenging tasks

**To customize**:
1. Open `src/ai.ts`
2. Find `systemPrompt` in `getAISuggestion()`
3. Modify principles/rules
4. Save & test

### Example: More Encouraging AI

```typescript
const systemPrompt = `You are a SUPER POSITIVE productivity coach!
Always be extremely encouraging and motivating!
Use lots of emojis and exclamation points!`
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] `.env` file has real API key
- [ ] Dev server restarted after `.env` change
- [ ] App loads without errors
- [ ] AI section visible with 2 buttons
- [ ] Can add tasks
- [ ] Can select mood
- [ ] "Что делать сейчас?" works (with tasks)
- [ ] "Создать квест" works
- [ ] AI responses appear in the text box
- [ ] New quest appears in task list

---

## 📞 Still Not Working?

1. **Check Browser Console** (F12):
   - Look for errors
   - Check network tab for API calls
   - Verify `VITE_AIMLAPI_KEY` is set

2. **Check Terminal**:
   - Any errors when dev server starts?
   - API call errors?

3. **Verify Integration**:
   ```bash
   # Check ai.ts exists
   ls src/ai.ts

   # Check imports in App.tsx
   grep "from './ai'" src/App.tsx
   ```

4. **Test with Mock Data**:
   - Temporarily modify `src/ai.ts`
   - Return fake responses for testing
   - Verify UI displays them correctly

---

## 🎓 Learn More

- [AIMLAPI Documentation](https://docs.aimlapi.com)
- [GPT-4o Guide](https://platform.openai.com/docs/guides/gpt)
- [Prompt Engineering Tips](https://www.promptingguide.ai)

---

**Last Updated**: 2025-10-25
**AI Model**: chatgpt-4o-latest
**API Endpoint**: https://api.aimlapi.com/v1/chat/completions
**Integration Status**: ✅ Complete

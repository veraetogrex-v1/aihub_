# 🎮 LifeQuest Features Documentation

## Core Features

### ✅ Task Management with Toggle

**Feature**: Toggle task completion on/off by clicking the checkbox

**How it works**:
- Click checkbox to mark task as complete → gain XP
- Click again to unmark task → lose XP from that task
- XP and level are recalculated based on **total completed tasks**

**Implementation Details**:

```typescript
// When toggling a task:
1. Task completion status toggles (completed ↔ incomplete)
2. Calculate TOTAL XP from ALL completed tasks
3. Calculate level from total XP:
   - Level 1 requires 100 XP
   - Level 2 requires 200 XP total
   - Level N requires N × 100 XP total
4. Set character XP to remainder after level ups
```

**Example Scenario**:

```
Initial: Level 1, 0 XP, no completed tasks

✅ Complete Task A (10 XP):
   → Total XP: 10
   → Level: 1, XP: 10/100

✅ Complete Task B (90 XP):
   → Total XP: 100
   → Level: 2, XP: 0/200 (leveled up! 🎉)

❌ Uncomplete Task B:
   → Total XP: 10
   → Level: 1, XP: 10/100 (level decreased, no confetti)

✅ Re-complete Task B:
   → Total XP: 100
   → Level: 2, XP: 0/200 (leveled up again! 🎉)
```

### 🎯 Smart XP Calculation

**Key Principle**: Level and XP are **always calculated from total completed task XP**, not incremental changes.

**Benefits**:
- ✅ Uncompleting tasks correctly reduces level if needed
- ✅ No negative XP states
- ✅ No XP bugs from multiple toggles
- ✅ Predictable, transparent progression

**Formula**:
```typescript
totalXP = sum(completedTasks.map(t => t.xp))
level = 1
remainingXP = totalXP

while (remainingXP >= level × 100) {
  remainingXP -= level × 100
  level++
}
```

### 🎊 Confetti Celebration

**Triggers**: Confetti animation plays when:
- ✅ Task is **completed** (not uncompleted)
- ✅ Level **increases** from the completion
- ❌ Does NOT trigger on uncomplete
- ❌ Does NOT trigger if level stays same

**Code**:
```typescript
if (!wasCompleted && newLevel > oldLevel) {
  triggerConfetti()
}
```

---

## 🤖 AI Features

### 1. AI Task Suggestions

**Purpose**: Get personalized recommendations on what to do next

**Inputs**:
- Current mood (1-5)
- List of incomplete tasks
- Task XP values

**Output**: Motivational recommendation in format:
```
🎯 Рекомендую: [task name]. [Reason 1-2 sentences]
```

**Algorithm**:
1. Analyzes task complexity (XP as indicator)
2. Considers user's mood level
3. Recommends easier tasks when mood is low
4. Recommends challenging tasks when mood is high

### 2. AI Quest Generation

**Purpose**: Generate custom tasks based on user context

**Inputs**:
- Completed tasks count
- Recent task history
- Current mood
- Detected categories

**Output**: JSON quest object:
```json
{
  "title": "Quest name (max 50 chars)",
  "description": "Quest description (max 100 chars)",
  "xp": 10-150
}
```

**XP Ranges**:
- 10-30 XP: Simple tasks
- 40-70 XP: Medium tasks
- 80-150 XP: Complex tasks

---

## 💾 Data Persistence

### localStorage Keys

| Key | Data | Format |
|-----|------|--------|
| `lifequest_tasks` | Task list | `Task[]` JSON |
| `lifequest_character` | Character data | `{xp: number, level: number}` |
| `lifequest_mood` | Daily mood | `{date: string, value: number}` |

### Task Interface

```typescript
interface Task {
  id: string          // Unique identifier (timestamp)
  title: string       // Task name
  completed: boolean  // Completion status
  xp: number          // XP reward
  createdAt: Date     // Creation timestamp
}
```

### Character Interface

```typescript
interface Character {
  xp: number    // Current XP towards next level
  level: number // Current level (starts at 1)
}
```

---

## 🎨 UI Components

### Character Card
- **Avatar**: 🦸‍♂️ emoji
- **Level Display**: Bold, yellow text
- **Progress Bar**: Gradient green → blue → purple
- **Stats Grid**: 3 cards (Level, Completed, Total)

### Mood Tracker
- **5 Emoji Buttons**: 😢😕😐😊🎉
- **Visual Feedback**: Active mood gets purple highlight
- **Persistence**: Mood saved per day

### AI Section
- **2 Action Buttons**:
  - "Что делать сейчас?" - Get suggestion
  - "Создать квест" - Generate quest
- **Loading States**: "Думаю..." / "Создаю..."
- **Result Display**: Text box with AI response

### Task List
- **Checkbox**: Toggle completion
- **Title**: Task name (strikethrough when completed)
- **XP Badge**: Purple pill for incomplete, green for completed
- **Delete Button**: Red trash icon

---

## 🔄 State Management

### State Flow

```
User Action (checkbox toggle)
    ↓
toggleTask(taskId)
    ↓
Calculate total XP from all completed tasks
    ↓
Calculate level from total XP
    ↓
Update character state
    ↓
Update tasks state
    ↓
Save to localStorage
    ↓
Trigger confetti if appropriate
    ↓
React re-renders UI
```

### Performance Optimizations

- **useCallback**: All handlers memoized
- **Functional Updates**: `setState(prev => ...)` pattern
- **Efficient Calculations**: O(n) XP totaling
- **localStorage**: Batched writes via useEffect

---

## 🎯 Level Progression Table

| Level | Total XP Required | XP Range for This Level |
|-------|-------------------|-------------------------|
| 1 | 0 | 0-99 |
| 2 | 100 | 100-299 |
| 3 | 300 | 300-599 |
| 4 | 600 | 600-999 |
| 5 | 1000 | 1000-1499 |
| 10 | 5500 | 5500-6099 |
| 20 | 21000 | 21000-22099 |

**Formula**:
- Level N requires: `sum(1..N-1) × 100` total XP
- Which equals: `(N-1) × N × 50` total XP

---

## 🚀 Future Enhancements

### Planned Features
- [ ] Task categories/tags
- [ ] Custom XP values per task
- [ ] Task deadlines with reminders
- [ ] Recurring tasks
- [ ] Task notes/descriptions
- [ ] Dark/light theme toggle

### AI Enhancements
- [ ] Learn from user preferences
- [ ] Multi-language support
- [ ] Voice input for tasks
- [ ] Smart scheduling suggestions
- [ ] Weekly productivity reports

### Gamification
- [ ] Achievements system
- [ ] Daily streaks
- [ ] Multiple characters
- [ ] Character customization
- [ ] Leaderboards (optional)

---

**Last Updated**: 2025-10-25
**Version**: 1.0

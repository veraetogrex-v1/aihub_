# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### ✅ Issue: Tailwind CSS PostCSS Plugin Error

**Error Message**:
```
[plugin:vite:css] [postcss] It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin.
The PostCSS plugin has moved to a separate package...
```

**Cause**: Tailwind CSS v4 changed how it integrates with PostCSS.

**Solution**:

1. Install the new PostCSS plugin:
```bash
npm install -D @tailwindcss/postcss
```

2. Update `postcss.config.js`:
```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},  // Changed from 'tailwindcss'
    autoprefixer: {},
  },
}
```

3. Update `src/index.css`:
```css
@import "tailwindcss";
```

4. Remove old `tailwind.config.js` (no longer needed in v4):
```bash
rm tailwind.config.js
```

5. Restart dev server:
```bash
npm run dev
```

---

### ❌ Issue: Port Already in Use

**Error Message**:
```
Port 5173 is in use, trying another one...
```

**Solution**: Vite automatically finds the next available port. Note the actual port in the terminal output.

**Alternative**: Kill processes using the port:
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5173 | xargs kill -9
```

---

### ❌ Issue: Module Not Found

**Error Message**:
```
Cannot find module 'canvas-confetti'
Cannot find module 'lucide-react'
```

**Solution**:
```bash
npm install
```

---

### ❌ Issue: API Key Not Working

**Symptoms**:
- AI features return error messages
- Console shows 401/403 errors

**Solution**:

1. Check `.env` file exists in project root
2. Verify API key format:
```bash
VITE_AIMLAPI_KEY=sk-proj-...
```
3. Restart dev server (required for env changes)
4. Check API key is valid at https://aimlapi.com

---

### ❌ Issue: TypeScript Errors

**Error Message**:
```
Type 'X' is not assignable to type 'Y'
```

**Solution**:

1. Clear TypeScript cache:
```bash
rm -rf node_modules/.vite
npm run dev
```

2. Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

### ❌ Issue: Styles Not Applying

**Symptoms**:
- Page looks unstyled
- Tailwind classes don't work

**Solution**:

1. Verify `src/index.css` contains:
```css
@import "tailwindcss";
```

2. Check `src/main.tsx` imports CSS:
```tsx
import './index.css'
```

3. Clear Vite cache:
```bash
rm -rf node_modules/.vite
npm run dev
```

---

### ❌ Issue: localStorage Not Persisting

**Symptoms**:
- Data resets on page refresh
- Character progress lost

**Solution**:

1. Check browser privacy settings
2. Ensure cookies/storage is enabled
3. Test in incognito mode
4. Check browser console for storage errors

---

### ❌ Issue: Build Fails

**Error Message**:
```
Error: Build failed
```

**Solution**:

1. Clear build directory:
```bash
rm -rf dist
```

2. Run type check:
```bash
npx tsc --noEmit
```

3. Fix any TypeScript errors

4. Rebuild:
```bash
npm run build
```

---

## 🚀 Quick Fix Commands

### Complete Reset
```bash
# Kill all dev servers
# Windows: Ctrl+C in terminal
# Then:
rm -rf node_modules package-lock.json dist
npm install
npm run dev
```

### Clear All Caches
```bash
rm -rf node_modules/.vite dist
npm run dev
```

### Reinstall Everything
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📞 Still Having Issues?

1. Check the [GitHub Issues](https://github.com/your-repo/issues)
2. Read the [README.md](README.md) for setup instructions
3. Review [AI_USAGE.md](AI_USAGE.md) for AI feature details
4. Open a new issue with:
   - Error message
   - Steps to reproduce
   - Environment details (OS, Node version)

---

## ✅ Verification Checklist

After fixing issues, verify:

- [ ] Dev server starts without errors
- [ ] Page loads in browser
- [ ] Tailwind styles are visible
- [ ] Can add tasks
- [ ] Can complete tasks
- [ ] XP and level work
- [ ] localStorage persists data
- [ ] AI features work (with valid API key)

---

**Last Updated**: 2025-10-25
**Version**: 1.0

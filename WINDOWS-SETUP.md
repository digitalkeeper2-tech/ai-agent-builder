# Windows Setup Guide 🪟

## Prerequisites

### 1. Install Node.js
- Download from: https://nodejs.org/ (LTS version recommended)
- Install and verify:
  ```bash
  node --version
  npm --version
  ```

### 2. Install Git (Optional but recommended)
- Download from: https://git-scm.com/download/win
- Verify:
  ```bash
  git --version
  ```

### 3. Code Editor (Recommended)
- Visual Studio Code: https://code.visualstudio.com/

## Quick Start on Windows

### Step 1: Clone the Repository

```bash
git clone https://github.com/digitalkeeper2-tech/ai-agent-builder.git
cd ai-agent-builder
```

Or manually download and extract the ZIP file.

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages:
- `zod` - Data validation
- `winston` - Logging
- `typescript` - Type safety

### Step 3: Build the Project

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` folder.

### Step 4: Run Examples

#### Basic Agent Creation Example:
```bash
npm run dev
```

Then create a file `examples/basic-example.ts` and run it.

#### Self-Improvement Example:
```bash
npx ts-node examples/self-improvement-example.ts
```

### Step 5: Windows-Specific Notes

✅ **Path Separators**: The code handles both `/` and `\` automatically
✅ **Terminal**: Use PowerShell, CMD, or Git Bash - all work
✅ **Node Modules**: Stored in `node_modules/` folder (may take space)

## Project Structure

```
ai-agent-builder/
├── src/                          # Source code
│   ├── core/
│   │   ├── types.ts             # All schemas & interfaces
│   │   ├── registry.ts          # Component registry
│   │   ├── pipeline.ts          # Pipeline engine
│   │   ├── factory.ts           # Component factories
│   │   ├── logger.ts            # Logging
│   │   ├── feedback.ts          # Feedback system
│   │   └── self-improvement.ts  # Self-improvement engine
│   ├── models/
│   │   ├── order.model.ts
│   │   ├── specification.model.ts
│   │   ├── feedback.model.ts
│   │   └── improvement-suggestion.model.ts
│   ├── modules/
│   │   ├── order.module.ts
│   │   ├── specification.module.ts
│   │   ├── feedback-analyzer.module.ts
│   │   ├── improvement-generator.module.ts
│   │   └── auto-update.module.ts
│   ├── adapters/
│   │   └── order-to-specification.adapter.ts
│   └── index.ts                 # Main exports
├── examples/
│   └── self-improvement-example.ts
├── dist/                         # Compiled JavaScript (after npm run build)
├── node_modules/                 # Dependencies
├── package.json
├── tsconfig.json
└── README.md
```

## Available Commands

```bash
# Build TypeScript
npm run build

# Run in development mode with live reload
npm run dev

# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format

# Clean build files
npm run clean
```

## Common Windows Issues & Solutions

### Issue 1: "npm: The term 'npm' is not recognized"
**Solution**: 
- Restart your terminal after installing Node.js
- Or reinstall Node.js and check "Add to PATH" during installation

### Issue 2: "ts-node command not found"
**Solution**:
```bash
npx ts-node examples/self-improvement-example.ts
```

### Issue 3: "Permission denied" errors
**Solution**:
- Run terminal as Administrator
- Or use: `npm install --force`

### Issue 4: Port already in use (if running server)
**Solution**:
```bash
netstat -ano | findstr :3000
taskkill /PID [PID] /F
```

### Issue 5: TypeScript errors
**Solution**:
```bash
npm run build
```

If still failing, try:
```bash
rm -r node_modules
npm install
```

## Development Workflow on Windows

### In VS Code:

1. **Open Terminal**: `Ctrl + ~`
2. **Run Build**: `npm run build`
3. **Run Example**: `npx ts-node examples/basic-example.ts`
4. **View Logs**: Check `combined.log` and `error.log` files

### Environment Variables

Create `.env` file in project root:

```env
NODE_ENV=development
LOG_LEVEL=debug
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
```

## Next Steps

1. Read the main `README.md` for API documentation
2. Check `examples/self-improvement-example.ts` for usage patterns
3. Modify examples to build your own agents
4. Check logs in `combined.log` for debugging

---

**Need Help?** Check the main README.md or create an issue on GitHub! 🚀

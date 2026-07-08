# Calculus Solver 第三阶段审计与执行计划

> 生成日期：2026-07-08
> 目标：升级到 Symbolab 级结构化体验 + AI 解释能力 + 优秀数学输入体验

---

## 一、Current Architecture（当前架构）

### 技术栈
- Next.js 15 App Router + TypeScript strict + Tailwind CSS + shadcn/ui
- KaTeX（`react-katex`）+ MathLive（公式输入）+ Plotly.js（图像）
- math.js + Nerdamer（本地验证）
- DeepSeek API（Route Handler `/api/solve`）
- localStorage（历史记录）+ Vitest + Playwright E2E

### 核心流程
```
User Input
  → SmartInput (natural / formula / image)
  → /api/solve
    → DeepSeek JSON 或本地 fallback
    → 本地验证 / 一致性检查
  → SolverShell 渲染
    → Problem Recognition（InterpretedProblem）
    → AnswerCard
    → VerificationCard
    → StepsCard
    → GraphCard
```

### 已具备能力
- 单输入框求解、自然语言/公式/LaTeX 输入、题型自动识别
- LaTeX 渲染、分步解答、本地验证、图像生成
- 历史记录、分享链接、SEO 基础、响应式布局
- 50 单元测试 + 5 E2E 测试全部通过

---

## 二、Current Problems（当前问题）

### 1. 首页与品牌
- Hero 标题仍是 "Solve Calculus with One Smart Input"，未突出 Algebra
- 缺少 "How It Works" 独立的可视化流程（当前 AiProcess 已存在但可强化）
- Header 右侧按钮是 "Start Free"，不符合工具感

### 2. 输入体验
- **Natural 模式缺少 Math Keyboard**：用户无法快速插入 ∫、√、π 等符号
- Formula 模式已启用 MathLive 虚拟键盘（当前改动中）
- 占位符静态，缺少轮播示例
- 缺少 Popular shortcuts（∫ Integral、d/dx Derivative 等）
- 输入模式切换为 natural/formula/image，未明确 "Auto Detect"

### 3. 结果页结构
- 当前顺序：InterpretedProblem → AnswerCard → VerificationCard → StepsCard → GraphCard
- 与目标顺序基本一致，但：
  - 缺少 **Problem Recognition 卡片** 的 "Edit" 功能
  - AnswerCard 视觉权重可再强化
  - Verification 文案需按 PDF 要求改为 Verified / Partial / Unknown
  - Steps 缺少 **Explain this step** 按钮
  - 缺少 **Related Examples**

### 4. AI 与 Prompt
- System Prompt 强调安全与 JSON，但未明确要求 "像数学导师一样写解释"
- 未实现 **Explain This Step** 的独立 API/调用
- 未实现 **Check My Answer**
- 未实现 **Practice Mode**

### 5. Graph
- 已有基础 GraphCard，但缺少 Zoom/Reset/Download 按钮
- 移动端高度固定 h-80，未按 PDF 要求 320px

### 6. SEO
- 缺少 /derivative-calculator、/integral-calculator 等落地页矩阵
- 首页元数据刚更新，但内页 SEO 可继续完善

### 7. 测试
- 缺少针对数学输入规范化（x² → x^2 等）的专门测试
- 缺少 375px/1440px 等响应式截图测试

---

## 三、Optimization Plan（优化计划）

按 PDF 要求的 6 个 Phase 执行：

### Phase 1: Input Experience
1. 在 natural 模式集成 SymbolKeyboard（已完成文件，需调整展示逻辑）
2. 添加占位符轮播（Placeholder carousel）
3. 添加 Popular shortcuts 行（∫ Integral、d/dx Derivative 等）
4. 将模式标签改为 Text / Formula / Image，默认 Auto Detect
5. 规范化输入：x² → x^2、√ → sqrt、d/dx → derivative

### Phase 2: Solution Experience
1. 重构结果页顺序：Problem Recognition → Final Answer → Verification → Steps → Graph → Related Examples
2. 新增 ProblemRecognition 卡片，支持 Edit
3. 升级 AnswerCard：最大视觉权重、Answer Type 标签
4. 升级 VerificationCard：Verified / Partial / Unknown 文案与图标
5. 升级 StepsCard：每步显示 Rule / Before / After / Explanation
6. 升级 GraphCard：Zoom / Reset / Download、移动端 320px
7. 新增 RelatedExamples

### Phase 3: Math Rendering
1. 统一 MathDisplay 渲染策略
2. 确保步骤中的 latexBefore / latexAfter 正确显示
3. 移动端公式不溢出

### Phase 4: AI Explanation
1. 升级 System Prompt：更像数学导师、Before/After 结构
2. 新增 Explain This Step 功能（调用 DeepSeek）
3. 新增 Check My Answer 功能
4. 新增 Practice Mode（生成题目、检查、解释）

### Phase 5: SEO
1. 创建 /derivative-calculator、/integral-calculator、/limit-calculator、/equation-solver、/quadratic-solver、/factoring-calculator
2. 每个页面结构：H1 → Tool → Examples → How It Works → FAQ → Related Tools

### Phase 6: Testing
1. 输入规范化测试
2. UI 响应式测试（375px / 1440px）
3. 数学测试（导数、积分、极限、方程）
4. E2E 覆盖 Explain Step、Check My Answer

---

## 四、Files To Change（待改文件清单）

### Phase 1
- `components/solver/smart-input.tsx`（集成 SymbolKeyboard、轮播占位符、Popular shortcuts）
- `components/solver/symbol-keyboard.tsx`（当前文件，继续完善）
- `components/solver/math-field-input.tsx`（已启用虚拟键盘）
- `components/solver/quick-examples.tsx`（Popular shortcuts）
- `lib/math-parser.ts`（输入规范化扩展）

### Phase 2
- `components/solver/solver-shell.tsx`（结果页顺序、新增组件）
- `components/solver/problem-recognition.tsx`（新增）
- `components/solver/answer-card.tsx`（视觉权重、Answer Type）
- `components/solver/verification-card.tsx`（文案/图标）
- `components/solver/steps-card.tsx`（Rule/Before/After/Explain）
- `components/solver/graph-card.tsx`（Zoom/Reset/Download、320px 移动端）
- `components/solver/related-examples.tsx`（新增）

### Phase 3
- `components/math/math-display.tsx`
- `components/solver/latex-render.tsx`

### Phase 4
- `lib/prompts.ts`（System Prompt 升级）
- `app/api/solve/route.ts`（支持 Explain / Check / Practice 新 endpoint 或参数）
- `components/solver/explain-button.tsx`（新增）
- `components/solver/check-answer.tsx`（新增）
- `components/solver/practice-panel.tsx`（新增）
- `hooks/use-solver.ts`（新增调用）

### Phase 5
- `app/derivative-calculator/page.tsx`
- `app/integral-calculator/page.tsx`
- `app/limit-calculator/page.tsx`
- `app/equation-solver/page.tsx`
- `app/quadratic-solver/page.tsx`
- `app/factoring-calculator/page.tsx`
- `lib/seo.ts`

### Phase 6
- `tests/math-parser.test.ts`
- `tests/solver-schema.test.ts`
- `e2e/solver.spec.ts`

---

## 五、下阶段执行顺序

1. 先完成 **Phase 1 Input Experience**（影响最小，且 SymbolKeyboard 已在进行中）
2. 然后 **Phase 2 Solution Experience**（结果页视觉升级）
3. 并行 **Phase 3 Math Rendering** 优化
4. 接着 **Phase 4 AI Explanation**（需要新 API 和 Prompt）
5. 再做 **Phase 5 SEO**（落地页矩阵）
6. 最后 **Phase 6 Testing**

每完成一个 Phase 运行：`typecheck` → `test` → `build` → 必要时 `test:e2e`。

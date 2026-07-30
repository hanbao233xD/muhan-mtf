# 沐涵个人主页 — 跨性别主题完全重构方案

## 概要（Summary）

基于 [richify动画效果总结.md](../../../../richify动画效果总结.md) 中的特效目录，对 `f:\Documents\GitHub\muhan-mtf` 进行完全重构：

- **主题**：跨性别（MTF）个人主页，保留全部现有内容并新增板块
- **设计**：简洁现代风（白色基底 + 大留白 + 卡片化 + 12px 圆角 + 毛玻璃）
- **配色**：跨性别旗帜蓝粉白 —— 蓝 `#5BCEFA`、粉 `#F5A9B8`、白 `#FFFFFF`，深灰蓝 `#334155` 作正文色
- **特效**：用户确认"所有的都要，能加多少加多少"——从 richify 特效库移植 15+ 种效果并蓝粉白化
- **结构**：拆分为 `index.html` + `style.css` + `main.js` 三文件（用户已确认）

## 现状分析（Current State）

- `index.html`（523 行）：单文件，内联样式+脚本。彩虹 45° 渐变背景 + 黑色半透明卡片，风格暗沉不现代
- 内容板块：header、profile（头像+4 个链接按钮）、关于我、发声帖×2、MTF 小测验（selectOption/showResult 两个函数）、MTF 之旅时间线×6、兴趣 grid×6、我想说的话、footer
- 资产：`assets/avatar.jpg`、`favicon.ico`、`CNAME`（GitHub Pages 部署）
- 参考库：`richify动画效果总结.md`（133 个动画的描述与参数，已验证完整）

## 变更内容（Proposed Changes）

### 1. 重写 `index.html`（结构）

保留全部板块并加料，语义化标签：

1. **滚动进度条**（顶部 3px 蓝粉渐变条，新增）
2. **sticky 导航栏**：毛玻璃 `backdrop-filter: blur(12px)`，logo「沐涵」+ 锚点链接（关于我/发声/测验/旅程/兴趣/寄语）
3. **Hero 区**（新增）：超大渐变标题「沐涵 · 活出真我」、副标语、头像（蓝粉双环旋转光环）、CTA 按钮组
4. **个人资料卡**：原 4 个链接按钮（QQ/邮件/GitHub/Download Bat）保留原 URL
5. **关于我**、**发声帖×2**（原文案保留，社交卡片样式重设计）
6. **MTF 知识小测验**（保留题目与 `selectOption`/`showResult` 逻辑，样式重设计）
7. **MTF 之旅时间线**×6（竖轴发光节点样式）
8. **兴趣爱好** grid×6
9. **我想说的话**（引用卡样式）
10. **页脚** + **返回顶部按钮**（新增）+ **本地访问计数器**（localStorage 彩蛋，新增，纯前端自增）
11. **底部旗帜跑马灯丝带**（新增，fixed 底部，蓝粉白渐变流动文字「🏳️‍⚧️ Trans Women Are Women · 活出真我 ·」循环）

板块之间用 `.section-divider` 蓝粉渐变细线分隔。

### 2. 新建 `style.css`（全部样式 + 动画）

**设计规范**：`--trans-blue:#5BCEFA; --trans-pink:#F5A9B8; --trans-white:#FFF; --ink:#334155`；白底浅灰卡片 `#f8fafc`；圆角 12px；正文 16px/1.7；卡片 `box-shadow: 0 4px 24px rgba(91,206,250,.12)`；字体系统栈 + `Noto Sans SC`。

**动画清单（移植自 richify 文档，全部蓝粉白化）**：

| # | 动画 | 参考 | 应用 |
|---|---|---|---|
| 1 | `auroraFloat` 极光漂移 | richify §1 | 3 团蓝/粉/白 blur(60px) 光斑全屏背景，13s alternate，screen 混合 |
| 2 | `pageGradient` | richify §1 | body 浅蓝粉白底渐变 16s 缓慢流动 |
| 3 | `sparklePop` 星点闪烁 | richify §1 | Hero 区 20 个粉蓝星点 |
| 4 | `textGradient` 渐变文字 | richify §8 | 大标题/板块标题 background-clip:text 蓝粉流动 5s |
| 5 | `wordartShine` 高光扫过 | richify §8 | Hero 标题表面高光 2.5s 扫过 |
| 6 | `borderSpin` 锥形边框旋转（`@property --spin`） | richify §7 | 头像双环、发声帖卡片边框 4s 旋转 |
| 7 | `panelShimmer` 微光掠过 | richify §7 | 所有卡片 :after 6s 斜向微光 |
| 8 | 卡片 hover 3D 倾斜 | richify §7 | translateY(-8px) rotateX(4deg) + 蓝粉双色阴影 |
| 9 | `shineSweep` 按钮高光 | richify §6 | 所有按钮 :after 3s 扫光 |
| 10 | `metricPanic` 轻浮动 | richify §7 | 兴趣卡 3s 错峰上下浮动 |
| 11 | `pulseGlow` 节点脉冲 | 改造 | 时间线圆点蓝粉交替发光 2s |
| 12 | `marqueeMove`+`colorShift` 跑马灯 | richify §2 | 底部旗帜丝带 18s 滚动 + 3s 渐变流动 |
| 13 | `revealUp` 滚动渐入 | 常规 | 各板块进入视口时 translateY(24px)→0 + fade，交错延迟 |
| 14 | `fadeIn` 载入 | 常规 | 页面载入整体 0.6s 淡入 |
| 15 | `richPulse` | richify §7 | logo/头像呼吸 3s |

**响应式**：≤768px 导航折叠为精简行、Hero 标题降字号、时间线节点缩小、跑马灯降速。**可访问性**：`@media (prefers-reduced-motion: reduce)` 关闭所有动画与 Canvas（richify 没做，我们补上）。

### 3. 新建 `main.js`（全部交互）

| 模块 | 说明 |
|---|---|
| `flagParticles` | 全屏 Canvas：40 个蓝/粉/白圆点粒子缓缓飘落+左右摆动+透明度呼吸，`requestAnimationFrame`，`resize` 自适应；reduced-motion 时静止 |
| `liquidCursor` | 仅 `pointer:fine` 启用：粉蓝渐变玻璃球跟随（lerp 缓动），hover 按钮/链接时磁吸放大 + `scale` 果冻形变，点击触发 8 粒子蓝粉爆裂（移植 richify §5 简化版） |
| `revealObserver` | IntersectionObserver 给 `.reveal` 元素加 `.in` 类，threshold 0.15 |
| `scrollProgress` | 顶部进度条宽度 = scrollTop/maxScroll |
| `backToTop` | 滚动 >400px 显示按钮，点击 `scrollTo({behavior:'smooth'})` |
| `hitCounter` | localStorage 自增访问计数，页脚展示，数字更新时翻牌小动画 |
| `quiz` | 保留并改进 `selectOption`/`showResult`（挂到 window 供 onclick 使用） |

### 4. 不动的文件

`assets/avatar.jpg`、`favicon.ico`、`CNAME`、`README.md`、`.gitattributes`、`richify动画效果总结.md` 全部保持原样。不引入任何外部图片/字体 CDN，全部效果用 CSS/SVG/Canvas 实现。

## 假设与决策（Assumptions & Decisions）

- 文案一律保留原文（含 emoji、链接 URL），仅 Hero 新增一句标语；「Download Bat」按钮原样保留
- 底部跑马灯 fixed 定位、不遮挡内容（body 加 padding-bottom）
- 液态光标在触屏设备自动禁用，不影响原生光标
- 不做暗色模式开关（白底蓝粉即主题），减少范围蔓延
- 三文件平铺放项目根目录，与现有 GitHub Pages 部署兼容

## 验证步骤（Verification）

1. `node --check main.js`（若环境有 node）确认 JS 语法；无 node 则用浏览器控制台目检
2. 起本地静态服务（`python -m http.server` 或等价）打开页面，确认：三文件 200 加载、无 404、控制台无报错
3. 目检：粒子飘落、光标跟随/磁吸/点击爆裂、滚动 reveal、跑马灯流动、卡片 hover 倾斜、头像光环旋转、测验答题功能正常、移动端宽度无横向滚动
4. Grep 检查 `style.css` 中动画名与 `main.js` 中使用的类名一一对应

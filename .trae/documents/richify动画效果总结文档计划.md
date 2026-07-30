# Richify 网站动画效果总结文档 — 实施计划

## 概要（Summary）

将 `D:\Downloads\richify` 中保存的 richify.net 网页所用的**全部 133 个 CSS @keyframes 动画 + JS/Canvas 动效**完整梳理，输出为一份**完整详细版**中文 Markdown 文档，保存到当前项目 `f:\Documents\GitHub\muhan-mtf` 根目录。

## 现状分析（Current State）

已完成探索，数据源确认充分：

- **HTML**：`D:\Downloads\richify\Richify 富有科技 _ richify.net.html`
  - Astro 群岛架构（`<astro-island>` + RichifyApp 组件水合）
  - Three.js r184：2 个 3D 菱形 canvas（`.marquee-diamond-3d`）
  - 2 个全屏 Canvas 2D：`.hyper-storm-canvas`（粒子风暴）、`.red-packet-canvas`（红包雨）
  - 装饰元素：aurora×3、laser-grid、scanlines、sparkle-field×26、code-rain、disco-beam×4、neon-frame、dvd-bouncer、hit-counter、glitch-strobe、liquid-glass-cursor、blackout-veil、hero-bubble×5、advisor-spark×100+、support-bot 等
- **CSS**：`D:\Downloads\richify\Richify 富有科技 _ richify.net_files\styles.DV6to25q.css`（约 108KB，单行压缩）
  - 共 **133 个 @keyframes**（名单已提取确认）
  - 已验证 128 个可通过 `animation:` 属性直接定位所属选择器；5 个（cheapDepthConflict、heroChromaticPulse、imageSaturate、panelBob、supportPop）由简写/JS 动态类触发，执行时单独人工标注
- **输出要求**（已与用户确认）：
  - 保存位置：`f:\Documents\GitHub\muhan-mtf` 项目根目录
  - 详细程度：完整详细版（每个动画含名称、所属元素、效果描述、关键 CSS 参数）

## 变更内容（Proposed Changes）

### 新建唯一文件：`f:\Documents\GitHub\muhan-mtf\richify动画效果总结.md`

**生成方法**：
1. 用 PowerShell 正则从 CSS 中批量提取每个 `@keyframes` 的完整定义体 + 引用它的选择器及 `animation:` 简写参数（时长/缓动/延迟/次数），导出为中间文本
2. 结合 HTML 元素结构，人工归纳润色为中文描述，写入 md 文档

**文档结构**：

```markdown
# Richify 富有科技网站 — 动画效果全录
- 概览表：技术栈（Astro / Three.js r184 / Canvas 2D / CSS 变量驱动 / PostHog）
- 统计：133 个 @keyframes，按下方 12 组分类

## 1. 全屏氛围层（aurora / 激光网格 / 扫描线 / 星光 / 代码雨 / 页面渐变）
## 2. 底部跑马灯 + Three.js 3D 菱形
## 3. 迪斯科光束 + 霓虹边框
## 4. 复古彩蛋（DVD 弹屏 / hit counter 计数器 / glitch 频闪）
## 5. 液态玻璃光标 + 全局点击爆裂
## 6. 磁吸果冻按钮（new-generation-hitbox / magnet 系列）
## 7. 卡片 hover 3D 倾斜发光
## 8. 文字特效（PPT 艺术字 / 渐变文字 / glitch 发光 / 金色 logo）
## 9. Hero 区（数据气泡爆裂 + 碎片 / 图片边框旋转 / 火花粒子）
## 10. AI 顾问机器人 + 聊天面板特效（粒子组装/溶解/冲击波）
## 11. 老虎机 Jackpot 特效（滚筒/金币雨/横幅）
## 12. 其他（表单脉冲 / 烟花 / 金色特效 / 关灯聚光灯 / 未直接引用组）
## 附：JS Canvas 动效（hyper-storm 粒子风暴 / red-packet 红包雨 / Three.js 菱形 / DVD 弹跳轨迹）
```

**每个动画条目格式**：

```markdown
### `auroraFloat`
- **所属元素**：`.aurora`（3 个彩色光斑）
- **效果**：极光光斑缓慢漂移，营造氛围背景
- **关键参数**：13s ease-in-out infinite alternate；blur(34px)；mix-blend-mode: screen
```

## 假设与决策（Assumptions & Decisions）

- 输出文件名定为 `richify动画效果总结.md`，放项目根目录（用户已确认位置）
- 文档语言为中文，动画名保留英文原名
- 5 个未被 `animation:` 直接引用的 keyframes 归入「未直接引用组」，标注触发方式为 JS 动态类/简写
- 不修改 D:\Downloads\richify 下的任何源文件，纯只读分析
- `immersive-translate` 相关标记是浏览器翻译插件注入，不属于网站本身，文档中会注明排除

## 验证步骤（Verification）

1. 用正则统计最终 md 中出现的 keyframes 条目数 = 133，逐一比对原始名单无遗漏
2. 检查每个条目四项（名称/元素/描述/参数）齐全
3. 通读渲染后的 md，确认分组结构与 HTML 实际元素对应

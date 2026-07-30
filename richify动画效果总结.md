# Richify 富有科技网站 — 动画效果全录

> 数据来源：`D:\Downloads\richify` 保存的 richify.net 页面（HTML + `styles.DV6to25q.css`）
> 统计：CSS 中共有 **133 个 `@keyframes`**，本文按 12 个分组逐一收录；另附 JS/Canvas 驱动的动效说明。
> 说明：页面中 `immersive-translate` 相关标记为浏览器翻译插件注入，不属于网站本身，已排除。

## 技术栈概览

| 层面 | 技术 |
|---|---|
| 框架 | Astro（群岛架构，`<astro-island>` 水合 RichifyApp 组件） |
| 3D | Three.js r184（2 个跑马灯菱形 canvas） |
| 2D 粒子 | Canvas 2D（hyper-storm 粒子风暴、red-packet 红包雨） |
| CSS 特性 | conic-gradient、backdrop-filter、mask-image、mix-blend-mode、clip-path、background-clip:text、`@property --spin` 自定义属性动画 |
| 动效驱动 | CSS 动画 133 个 + JS 逐帧 `translate3d`（光标/DVD/机器人拖拽） |
| 埋点 | PostHog、Cloudflare Insights |

---

## 1. 全屏氛围层（10 个）

### `pageGradient`
- **所属元素**：`body`
- **效果**：页面整体背景渐变色缓慢左右流动
- **关键参数**：11s ease-in-out infinite；background-position 0%→100%→0%

### `auroraFloat`
- **所属元素**：`.aurora`（3 个 42vw 彩色光斑：蓝 #2257ff / 红 #ff6b6b / 青 #15b8a6）
- **效果**：极光光斑漂移并放大，模拟北极光
- **关键参数**：13s ease-in-out infinite alternate；translate3d(12vw,-8vh,0) scale(1.18)；blur(34px)；mix-blend-mode: screen；三团分别延迟 0s/-4s/-7s

### `gridDrift`
- **所属元素**：`.laser-grid`
- **效果**：52px 激光网格背景匀速斜向漂移
- **关键参数**：20s linear infinite；background-position 0→52px；mask-image 上下渐隐

### `scanMove`
- **所属元素**：`.scanlines`
- **效果**：CRT 扫描线上下往复滚动（5px 间隔横纹）
- **关键参数**：5s linear infinite；translateY(-16px→16px)；opacity .32

### `sparklePop`
- **所属元素**：`.sparkle-field i`（26 个星点，位置/尺寸由 `--x/--y/--s` 变量控制）
- **效果**：星点闪烁并上浮 18px 后落下
- **关键参数**：3.4s ease-in-out infinite；scale(.7→1.2)；box-shadow 蓝/青光晕

### `codeRain`
- **所属元素**：`.code-rain`（右侧竖排绿色文字：AI_READY / SaaS++ / 429 等）
- **效果**：整列文字自上而下流动，模拟黑客帝国代码雨
- **关键参数**：7.5s linear infinite；translateY(-24%→38%)；writing-mode: vertical-rl；Comic Sans MS 字体

### `codeRainPulse`
- **所属元素**：`.code-rain span`（每一行代码文字）
- **效果**：文字荧光呼吸，亮度与光晕周期性强弱变化
- **关键参数**：1.8s ease-in-out infinite；brightness(1→1.45)；text-shadow 三层绿/青/金光晕

### `globalRefraction`
- **所属元素**：`body:before`
- **效果**：全屏折射光带左右扫动并扭曲（skew），像水面波纹
- **关键参数**：8.5s linear infinite；translate3d(±12%) skew(∓8deg)；background-position 0→240%

### `technoBreathing`
- **所属元素**：`.flashy-effects:before`
- **效果**：特效层整体透明度/缩放呼吸
- **关键参数**：7s ease-in-out infinite；opacity .18→.3；scale 1→1.015

### `ambientSheetDrift`
- **所属元素**：`.flashy-effects:after`
- **效果**：环境光片缓慢漂移
- **关键参数**：18s ease-in-out infinite alternate；translate3d(-2%,-1%→2%,1%)

---

## 2. 底部跑马灯 + Three.js 3D 菱形（4 个）

### `marqueeMove`
- **所属元素**：`.marquee-ribbon .marquee-copy`
- **效果**：底部横幅文字（"richify.net · 价值中台运行中…"）无缝横向滚动
- **关键参数**：16s linear infinite；translateX(0→-50%)

### `marqueeColorShift`
- **所属元素**：`.marquee-ribbon`
- **效果**：横幅底色（黑→金→粉→青 500% 渐变）流动 + 整圈色相旋转
- **关键参数**：2.4s linear infinite；background-position 0→100%；hue-rotate(0→360deg)

### `diamondDangle`
- **所属元素**：`.marquee-diamond-3d`（Three.js r184 canvas ×2）
- **效果**：3D 菱形挂件上下晃动 + 左右摇摆 + 缩放
- **关键参数**：1.05s ease-in-out infinite alternate；translateY(-10px) rotate(±7deg) scale(.92→1.1)

### `diamondPanic`
- **所属元素**：`.marquee-diamond-3d`
- **效果**：菱形外发光在金/青与粉/金之间闪烁，色相跳动
- **关键参数**：.42s steps(2) infinite；双层 drop-shadow；hue-rotate(0→45deg)

---

## 3. 迪斯科光束 + 霓虹边框（4 个）

### `discoSweep`
- **所属元素**：`.disco-beam`（4 束，clip-path 锥形光，色相 208/318/128/44）
- **效果**：光束以顶部为原点左右摇摆 ±26°
- **关键参数**：`--beam-sway`(4.6~6.1s) ease-in-out infinite alternate；各自负延迟错开相位

### `discoStrobe`
- **所属元素**：`.disco-beam`
- **效果**：光束透明度阶跃频闪
- **关键参数**：1.7s steps(2) infinite；opacity .4→.62

### `neonFramePulse`
- **所属元素**：`.neon-frame`（全屏 inset 5px 霓虹边框）
- **效果**：边框发光强度脉冲
- **关键参数**：1.3s ease-in-out infinite alternate；opacity .66→1；三层 inset box-shadow（白/青/粉）

### `neonFrameHue`
- **所属元素**：`.neon-frame`
- **效果**：边框颜色整圈色相循环
- **关键参数**：3.6s linear infinite；hue-rotate(0→360deg)

---

## 4. 复古彩蛋：DVD 弹屏 / 访问计数器 / Glitch（7 个）

### `dvdWobble`
- **所属元素**：`.dvd-core`（「富」字方块，conic-gradient 变色底）
- **效果**：方块左右摇摆 ±7°（位置由 JS 逐帧驱动撞墙反弹）
- **关键参数**：2.3s ease-in-out infinite；rotate 属性动画

### `dvdPop`
- **所属元素**：`.dvd-core.dvd-pop`（撞墙瞬间由 JS 加类触发）
- **效果**：撞墙时压扁再回弹的果冻形变
- **关键参数**：.46s cubic-bezier(.16,1.5,.3,1) both；scale(1.55,.62)→(.78,1.32)→(1,1)

### `hitCounterBlink`
- **所属元素**：`.hit-counter`（右下角复古访问计数器）
- **效果**：3px ridge 边框在金/青之间阶跃闪烁
- **关键参数**：1.15s steps(2) infinite

### `hitEyeSpin`
- **所属元素**：`.hit-counter-eye`（👁 图标）
- **效果**：眼睛图标持续旋转
- **关键参数**：2.6s linear infinite；rotate 0→360deg

### `hitDigitFlip`
- **所属元素**：`.hit-digit`（9 位数字，JS 更新时触发）
- **效果**：数字翻牌：从 rotateX(120°) 放大高亮翻正
- **关键参数**：.42s cubic-bezier(.2,1.4,.4,1) both；brightness(3)→none

### `strobeFlicker`
- **所属元素**：`.glitch-strobe.on`（全屏故障层，JS 加类触发）
- **效果**：横纹层快速位移 + 色相飞转 + 提亮，一次性强闪
- **关键参数**：.38s steps(3) both；hue-rotate(0→360deg)；mix-blend-mode: screen

### `glitchShakeMargins`
- **所属元素**：`html.glitch-shake body`
- **效果**：通过 margin 抖动整个页面（ glitch 震屏）
- **关键参数**：126ms steps(2) infinite；margin ±4px/±2px

---

## 5. 液态玻璃光标 + 全局点击爆裂（14 个）

### `trailFade`
- **所属元素**：`.cursor-tech-dot`（光标拖尾点）
- **效果**：拖尾点放大 3.4 倍并旋转 45° 淡出
- **关键参数**：.76s ease-out forwards

### `liquidCursorBreath`
- **所属元素**：`.liquid-cursor-fill`
- **效果**：光标填充层呼吸缩放
- **关键参数**：1.8s ease-in-out infinite；scale(1→1.045→.96)

### `liquidCursorMagnetBreath`
- **所属元素**：`.liquid-glass-cursor.magnetized .liquid-cursor-fill`
- **效果**：磁吸到按钮上时非对称呼吸 + 色相微偏
- **关键参数**：1.12s ease-in-out infinite；scale(1.025,.985)；saturate(2.05)

### `liquidCursorLens`
- **所属元素**：`.liquid-cursor-lens`
- **效果**：透镜层持续旋转（`--spin` 自定义属性联动锥形渐变）
- **关键参数**：1.2s linear infinite；rotate 0→360deg

### `liquidCursorSpark`
- **所属元素**：`.liquid-cursor-spark`
- **效果**：光标内火花点旋转闪烁
- **关键参数**：.86s ease-in-out infinite；rotate(0→18deg) scale(1→1.14)

### `liquidCursorSnap`
- **所属元素**：`.cursor-snap-pop .liquid-cursor-fill`（磁吸吸附瞬间）
- **效果**：光标先纵向拉长再横向压扁最后回正的吸附果冻
- **关键参数**：.52s cubic-bezier(.16,1.52,.22,1) both；scale(.72,1.34)→(1.18,.78)→(1)

### `liquidCursorClick`
- **所属元素**：`.cursor-click-pop .liquid-cursor-fill`（点击瞬间）
- **效果**：点击时光标压扁回弹 + 高亮偏色
- **关键参数**：.43s cubic-bezier(.16,1.42,.24,1) both；brightness(1.7) saturate(2.6)

### `magnetEdgeFlash`
- **所属元素**：`.cursor-magnet-burst:before`
- **效果**：磁吸瞬间边缘闪光由模糊到清晰再扩散消失
- **关键参数**：.82s cubic-bezier(.14,.94,.18,1) forwards；blur(10px→0→8px)

### `magnetEdgeOrbit`
- **所属元素**：`.cursor-magnet-burst:after`
- **效果**：磁吸光环旋转 148° 扩散消隐
- **关键参数**：.68s ease-out forwards；scale(.76→1.42)

### `magnetParticlePop`
- **所属元素**：`.cursor-magnet-burst i`（磁吸粒子，角度/距离由 `--magnet-angle/--magnet-distance` 控制）
- **效果**：粒子沿设定角度射出并拉长、模糊消散
- **关键参数**：.76s cubic-bezier(.14,.86,.22,1) forwards；distance×1.46

### `clickShockRing`
- **所属元素**：`.global-click-burst:before`
- **效果**：全局点击冲击波圆环放大 4.4 倍旋转消散
- **关键参数**：.76s cubic-bezier(.12,.88,.2,1) forwards；saturate(2.2→1)

### `clickCorePop`
- **所属元素**：`.global-click-burst:after`
- **效果**：点击核心闪光压扁旋转 90° 收缩消失
- **关键参数**：.52s ease-out forwards；scale(.2→1.8,.74→.1)

### `clickParticleBurst`
- **所属元素**：`.global-click-burst i`（点击粒子，`--click-angle/--click-distance/--click-spin` 驱动）
- **效果**：粒子沿随机角度飞溅、自转、拖尾模糊
- **关键参数**：.88s cubic-bezier(.12,.86,.18,1) forwards；`--click-delay` 错峰

### `lightToastPop`
- **所属元素**：`.light-toast.active`（开/关灯提示条）
- **效果**：提示条从下方弹入、回弹、悬停后上浮淡出
- **关键参数**：2.6s ease forwards；scale(.9→1.08→1→.96)

---

## 6. 磁吸果冻按钮（8 个）

> 按钮采用 `.new-generation-hitbox` 双层结构：`sizer` 隐形撑布局 + `visual` 显示层播动画。

### `magnetButtonJelly`
- **所属元素**：`.cursor-magnet-active`（被液态光标磁吸的按钮）
- **效果**：按钮整体果冻挤压回弹
- **关键参数**：.62s cubic-bezier(.16,1.42,.24,1) both；scale(1.08,.88)→(.96,1.1)→(1)

### `magnetInnerJelly`
- **所属元素**：`.cursor-magnet-active .new-generation-visual`
- **效果**：按钮文字层错位果冻 + 微旋转
- **关键参数**：.62s cubic-bezier(.16,1.42,.24,1) both；translate(±3px) rotate(±1.5deg)

### `magnetButtonAura`
- **所属元素**：`.cursor-magnet-active` 及其 visual 层
- **效果**：磁吸状态光环色相/亮度循环（`--spin` 联动）
- **关键参数**：.88s linear infinite；hue-rotate(0→22→0deg)

### `goldenLogoWheel`
- **所属元素**：所有 `.new-generation-hitbox` hover 的 visual 层、提交中表单
- **效果**：悬停时金色滚轮式亮度/饱和度流转
- **关键参数**：.72~.92s linear infinite；`--spin` 0→360deg

### `goldenLogoHalo`
- **所属元素**：`.new-generation-hitbox:hover .new-generation-visual:after`
- **效果**：悬停时按钮后光环持续旋转
- **关键参数**：.78s linear infinite；rotate 360deg scale(1.08)

### `newGenerationBounce`
- **所属元素**：所有 hitbox 按钮 hover/focus 的 visual 层
- **效果**：文字层剧烈弹跳：位移±24px + 旋转±13° + 挤压拉伸，steps 阶梯感
- **关键参数**：.52~.64s steps(5,end) infinite；6 个关键帧

### `shineSweep`
- **所属元素**：hitbox 按钮 `:after`、`.contact-submit-beam`、`.rationale-card:before`
- **效果**：高光条周期性从左侧扫到右侧
- **关键参数**：2.1~4.8s ease-in-out infinite；left -45%→118%

### `buttonGlow`
- **所属元素**：`.new-generation-visual`
- **效果**：按钮常态饱和度呼吸
- **关键参数**：2.8s ease-in-out infinite；saturate(1→1.28) brightness(1.06)

---

## 7. 卡片 / 导航 / 通用微交互（12 个）

### `glassCardWobble`
- **所属元素**：几乎所有卡片（`.feature-card/.product-card/.case-card/.price-card/.metric-card` 等十余类）
- **效果**：卡片常态下饱和度/色相轻微摇摆
- **关键参数**：3~6.4s ease-in-out infinite；saturate(1.28) hue-rotate(5deg)；另卡片 hover 有 translateY(-13px) rotateX(6deg) rotateY(-5deg) scale(1.025) 3D 倾斜（transition 实现）

### `borderSpin`
- **所属元素**：`.brand-mark`、语言切换器、所有卡片 `:before` 边框、高亮价格卡等
- **效果**：锥形渐变边框持续旋转（`@property --spin` 0→360deg）
- **关键参数**：2.2~5s linear infinite；全站复用率最高的动画

### `panelShimmer`
- **所属元素**：所有卡片 `:after`
- **效果**：斜 12° 微光带周期性掠过卡片表面
- **关键参数**：6s ease-in-out infinite；translate(-90%→120%)

### `dashedGlow`
- **所属元素**：`.requirement-strip`、`.three-loading`
- **效果**：外发光阴影呼吸
- **关键参数**：1.2~1.8s ease-in-out infinite alternate；box-shadow 蓝色光晕 0→26px

### `metricPanic`
- **所属元素**：`.metric-card`（4 个关键数据卡）
- **效果**：数据卡持续上下"躁动"浮动
- **关键参数**：2.4s ease-in-out infinite；translateY(-4px) scale(1.018)

### `headerLiquid`
- **所属元素**：`.site-header`
- **效果**：页头液态呼吸：微位移 + 横向拉伸 + 饱和度变化
- **关键参数**：3.2s ease-in-out infinite；scaleX(1.006)

### `liquidSweep`
- **所属元素**：`.site-header:after`、`.nav-list a:after`
- **效果**：斜 18° 液态光带扫过页头与导航项
- **关键参数**：2.2~2.6s linear infinite；translate(-120%→260%)

### `navMarquee`
- **所属元素**：`.nav-list.is-marquee .nav-list-track`（导航项过多时启用）
- **效果**：导航项无缝横向跑马灯
- **关键参数**：`--nav-marquee-duration`(默认 36s) linear infinite；translateX(-50%)

### `navLiquidFloat`
- **所属元素**：`.nav-list a`、`.language-switcher`
- **效果**：导航链接 3D 浮动（rotateX/rotateY）+ 饱和度呼吸
- **关键参数**：2.5~2.7s ease-in-out infinite；translateY(-3px) rotateX(7deg)

### `navChromatic`
- **所属元素**：`.nav-list a`
- **效果**：导航文字粉/青双色残影脉冲（色差故障风）
- **关键参数**：1.9s linear infinite；text-shadow ±1px

### `richPulse`
- **所属元素**：`.brand-mark`（「富」logo）
- **效果**：logo 缩放脉冲
- **关键参数**：2.2s ease-in-out infinite；scale(1→1.08)

### `languageRainbowScroll`
- **所属元素**：`.language-switcher span/select`
- **效果**：语言切换器彩虹渐变文字流动
- **关键参数**：2.4s linear infinite；background-position→300%

---

## 8. 文字特效（8 个）

### `textGradient`
- **所属元素**：`.brand strong`、`h1`
- **效果**：渐变文字色彩流动（background-clip:text）
- **关键参数**：4~5.5s linear infinite；background-position 0→300%

### `wordartGradient`
- **所属元素**：`.ppt-wordart`、`.compact-wordart`、`.advisor-jackpot-banner`
- **效果**：PPT 艺术字渐变上下流动 + 发光色在金/青/粉间切换 + 色相偏移
- **关键参数**：.9~2.6s linear infinite；drop-shadow + hue-rotate(24deg)

### `wordartWobble`
- **所属元素**：`.ppt-wordart`
- **效果**：艺术字左右倾斜摇摆（skew -7°~-9°）
- **关键参数**：1.8s steps(2,end) infinite

### `wordartCompactWobble`
- **所属元素**：`.compact-wordart`
- **效果**：紧凑版艺术字小幅摇摆
- **关键参数**：1.8s steps(2,end) infinite；skew -5°~-6°

### `wordartShine`
- **所属元素**：`.ppt-wordart:after`
- **效果**：艺术字表面高光层快速扫过
- **关键参数**：1.35s linear infinite；background-position -160%→180%

### `wordartMiniPulse`
- **所属元素**：各类卡片 `h3` 标题
- **效果**：标题色相/饱和度小幅脉冲
- **关键参数**：1.7s steps(2,end) infinite；hue-rotate(18deg)

### `rainbowTextHover`
- **所属元素**：`:where(h1~h4,p,a,button,span,...):hover`（几乎全部文本元素）
- **效果**：悬停任意文字即触发彩虹渐变流动 + 整圈色相旋转
- **关键参数**：.72s linear infinite；saturate(2.8) contrast(1.22)

### `textGlitchGlow`
- **所属元素**：文本 hover、`.metric-card strong`、卡片标题
- **效果**：文字 glitch 色差发光（粉/青残影 + 金色光晕）
- **关键参数**：.52s steps(2) / 2.2~3.1s ease-in-out infinite

---

## 9. Hero 区（12 个）

### `heroBorderGlow`
- **所属元素**：`.hero-visual:before`
- **效果**：主图边框光晕呼吸
- **关键参数**：5.5s ease-in-out infinite；opacity .45→.68

### `visualFloat`
- **所属元素**：`.hero-visual`
- **效果**：主图整体上下浮动 + 微旋转
- **关键参数**：4.2s ease-in-out infinite；translateY(-10px) rotate(.4deg)

### `heroImageFrameRotate`
- **所属元素**：`.hero-visual:after`
- **效果**：主图装饰边框持续旋转
- **关键参数**：1.18s linear infinite；rotate 360deg scale(1.04)

### `bubbleMegaPop`
- **所属元素**：`.hero-bubble`（5 个数据气泡：120% 满意度、9999% ROI 等）
- **效果**：气泡从下方弹入→挤压回弹→悬停→上升压扁爆裂消失（9 个关键帧的完整生命周期）
- **关键参数**：`--bubble-life`(3s) cubic-bezier(.18,1.12,.28,1) infinite both；`--bubble-delay/--bubble-tilt/--bubble-drift` 变量控制每泡差异

### `bubbleShardBurst`
- **所属元素**：`.bubble-shard`（每泡 6 个碎片）
- **效果**：气泡爆裂瞬间碎片沿 `--shard-angle` 射出、翻转 300°、拉伸消散
- **关键参数**：与母泡同步 3s；`--shard-distance`×2.4

### `bubbleChromatic`
- **所属元素**：`.hero-bubble`
- **效果**：气泡透明度微闪（玻璃感）
- **关键参数**：1.8s ease-in-out infinite

### `bubbleShine`
- **所属元素**：`.hero-bubble:after`
- **效果**：气泡表面高光 22° 斜向扫过
- **关键参数**：1.3s linear infinite；translate(-80%→320%)

### `bubbleGlassSweep`
- **所属元素**：`.hero-bubble-burst:before`
- **效果**：整个气泡区玻璃折射片左右扫动
- **关键参数**：3.4s linear infinite；skew(±10deg)

### `sparkleNoiseDrift`
- **所属元素**：`.hero-bubble-burst:after`
- **效果**：气泡区噪点微漂移闪烁
- **关键参数**：6s ease-in-out infinite；translate3d(8px,-6px,0)

### `heroChromaticPulse`
- **所属元素**：未在 CSS 中直接引用（应由 JS 动态加类触发，属 hero 区色差脉冲）
- **效果**：hero 元素粉/青双色 drop-shadow 残影脉冲
- **关键参数**：drop-shadow ±5px

### `imageSaturate`
- **所属元素**：未直接引用（推测为 hero 图片的 JS 触发 saturate 过渡）
- **效果**：图片饱和度/对比度增强
- **关键参数**：saturate(1→1.22) contrast(1.05)

### `panelBob`
- **所属元素**：未直接引用（推测为面板 JS 触发）
- **效果**：面板上下浮动 9px
- **关键参数**：translateY(-9px)

---

## 10. AI 顾问机器人 + 聊天面板（27 个）

### `supportPop`
- **所属元素**：未直接引用（`.support-bot` 入场，JS 驱动）
- **效果**：客服按钮从下方弹入
- **关键参数**：translateY(12px) scale(.96)→1

### `supportPreviewPop`
- **所属元素**：`.support-panel`
- **效果**：聊天面板以 `--support-origin` 为圆心 circle() 展开 + 去模糊
- **关键参数**：.46s cubic-bezier(.12,1.12,.18,1) both；clip-path circle(0→145%)

### `supportPanelExpand`
- **所属元素**：`.support-panel-expanded`
- **效果**：面板从 inset 裁切态展开放大 + 高亮饱和
- **关键参数**：.62s cubic-bezier(.12,.92,.18,1) both；clip-path inset(28%→0 round 22px)

### `supportPanelReturn`
- **所属元素**：`.support-panel-closing`
- **效果**：面板关闭：3D 翻转 90°、星形 clip-path 收缩、模糊高亮消散（5 段式华丽退场）
- **关键参数**：.76s cubic-bezier(.18,.9,.2,1) forwards；rotateX(82deg) scale(.02)

### `supportPreviewGlobe`
- **所属元素**：`.support-preview-globe`
- **效果**：预览球体持续旋转
- **关键参数**：2.6s linear infinite

### `floatingGlow`
- **所属元素**：`.support-panel` 系列
- **效果**：面板投影光晕呼吸
- **关键参数**：3.6s ease-in-out infinite；box-shadow 蓝光增强

### `panelGradient`
- **所属元素**：`.support-head`
- **效果**：聊天头部渐变流动
- **关键参数**：4s ease-in-out infinite

### `chipPulse`
- **所属元素**：`.quick-questions button`（快捷问题 chips）
- **效果**：按钮上下轻浮动
- **关键参数**：2.5s ease-in-out infinite；translateY(-2px)

### `appleAiEdgeWake`
- **所属元素**：`.ai-startup-edge`（启动时的 Apple Intelligence 风边框）
- **效果**：彩色霓虹边框从透明唤醒→多向 drop-shadow 轮换→渐隐
- **关键参数**：5.6s cubic-bezier(.16,.9,.22,1) both；三色 drop-shadow ±12~16px

### `appleAiAuraWake`
- **所属元素**：`.ai-startup-aura`
- **效果**：配套光晕缩放呼吸后淡出
- **关键参数**：5.4s ease-out both

### `advisorSparkBurst`
- **所属元素**：`.advisor-spark`（100+ 个火花粒子）
- **效果**：火花沿"闪现点→中间点→终点"三段贝塞尔轨迹飞行、自旋、变亮再模糊消散
- **关键参数**：`--spark-duration`(约 1~1.45s) forwards；8 个 `--spark-*` 变量定义轨迹/旋转/尺寸/延迟

### `chatScrollImpact`
- **所属元素**：`.support-messages.bottom-bursting`
- **效果**：消息列表到底时撞击抖动（6 段 skew 震颤）
- **关键参数**：.72s steps(5,end)

### `chatBottomColorBurn`
- **所属元素**：`.support-messages.bottom-bursting`
- **效果**：触底时颜色"灼烧"：饱和度×3.2 + 色相绕场一周
- **关键参数**：.98s linear；hue-rotate(0→360deg)

### `chatBottomPortal`
- **所属元素**：`.support-messages.bottom-bursting:before`
- **效果**：底部"传送门"光片压扁弹出、旋转上升消散
- **关键参数**：1.08s cubic-bezier(.17,.84,.3,1) forwards

### `chatBottomSpikes`
- **所属元素**：`.support-messages.bottom-bursting:after`
- **效果**：底部尖刺状能量条窜起回落
- **关键参数**：.76s cubic-bezier(.2,.7,.2,1) forwards；scaleY(.16→1.34)

### `chatImpactRing`
- **所属元素**：`.chat-bottom-impact:before`
- **效果**：冲击环放大 2.35 倍 + 旋转 420° 消散
- **关键参数**：.9s cubic-bezier(.1,.82,.24,1) forwards

### `chatImpactCore`
- **所属元素**：`.chat-bottom-impact:after`
- **效果**：冲击核心高亮模糊→聚焦→旋转 520° 扩散
- **关键参数**：.82s ease-out forwards

### `chatShardLaunch`
- **所属元素**：`.chat-bottom-impact i`
- **效果**：碎片沿 `--chat-shard-angle` 发射、附加 220° 翻转、纵向拉长消散
- **关键参数**：1.12s cubic-bezier(.16,.78,.24,1) forwards

### `botParticleBodyAssemble`
- **所属元素**：`.new-bot-message`（新机器人消息气泡）
- **效果**：消息体 3D 粒子组装：clip-path 波浪边逐段拼合 + rotateX/Y 回正 + 去模糊（6 个关键帧）
- **关键参数**：1.68s cubic-bezier(.16,.9,.18,1) both

### `botParticleBackgroundWash`
- **所属元素**：`.bot-background-particle-cloud`
- **效果**：消息背景粒子云渐显后"冲洗"淡出
- **关键参数**：1.68s both

### `botBackgroundParticleAssemble`
- **所属元素**：`.bot-background-particle`
- **效果**：背景粒子从 `--particle-from-*` 三维坐标飞入、旋转 360°、缩放回稳
- **关键参数**：1.46s both；`--particle-delay` 错峰

### `botParticleAssemble`
- **所属元素**：`.bot-particle`
- **效果**：前景粒子 3D 飞入组装（rotateX 76°→0）
- **关键参数**：1.28s cubic-bezier(.12,.9,.18,1) both

### `botTextParticleAssemble`
- **所属元素**：`.new-bot-message .message-text`
- **效果**：消息文字从模糊 + 粉/青/金三色残影中聚合显影
- **关键参数**：1.68s cubic-bezier(.14,1.12,.22,1) both；text-shadow ±10px→none

### `botHoloSettle`
- **所属元素**：`.new-bot-message`
- **效果**：全息投影阴影从夸张青/粉光收敛为常规投影
- **关键参数**：2.2s ease-out both

### `botDissolveSweep`
- **所属元素**：`.new-bot-message:before`
- **效果**：溶解扫片斜向掠过消息
- **关键参数**：.94s both

### `botDissolveParticles`
- **所属元素**：`.new-bot-message:after`
- **效果**：溶解粒子流斜向上飘散（background-position 联动）
- **关键参数**：1.12s both

### `botDissolveField`
- **所属元素**：`.bot-dissolve-field`
- **效果**：3D 溶解力场翻转掠过
- **关键参数**：.92s both；rotateY(68°→-54°)

---

## 11. 老虎机 Jackpot 特效（11 个）

### `advisorJackpotIn`
- **所属元素**：`.advisor-jackpot`
- **效果**： jackpot 面板从 1.15 倍缩放到位的入场
- **关键参数**：.32s cubic-bezier(.16,1.4,.3,1) both

### `advisorSunshaftSpin`
- **所属元素**：`.advisor-jackpot-sunshafts`
- **效果**：放射状阳光束持续旋转
- **关键参数**：8s linear infinite

### `advisorSunshaftPulse`
- **所属元素**：`.advisor-jackpot-sunshafts i`
- **效果**：每根光束透明度交替脉冲
- **关键参数**：1.1s ease-in-out infinite alternate；`--shaft-delay` 错峰

### `advisorReelSlam`
- **所属元素**：`.advisor-jackpot-reel`（滚筒）
- **效果**：滚筒从 -140% 高处砸落、过冲 12% 回弹到位
- **关键参数**：.52s cubic-bezier(.16,1.6,.3,1) both；`--reel-delay` 逐筒延迟

### `advisorReelSpin`
- **所属元素**：`.advisor-jackpot-reel b`
- **效果**：滚筒内符号快速上下跳动模拟转动
- **关键参数**：.18s steps(2) infinite

### `advisorMarqueeBg`
- **所属元素**：`.advisor-jackpot-marquee`
- **效果**：跑马灯背景流动
- **关键参数**：1.4s linear infinite；background-position→300%

### `advisorMarqueeScroll`
- **所属元素**：`.advisor-jackpot-marquee span`
- **效果**：跑马灯文字无缝滚动
- **关键参数**：6s linear infinite；translateX(-50%)

### `advisorBannerSlam`
- **所属元素**：`.advisor-jackpot-banner`
- **效果**：横幅斜切砸入：scale(.2)→1.35 过冲→回正
- **关键参数**：.7s cubic-bezier(.16,1.5,.3,1) both；skew(-14°) rotate(-18°)

### `advisorJackpotFlash`
- **所属元素**：`.advisor-jackpot-flash`
- **效果**：全屏闪光三次递减后熄灭
- **关键参数**：4.2s ease-out both

### `advisorCoinRain`
- **所属元素**：`.advisor-jackpot-coins i`
- **效果**：金币雨下落 110vh + 旋转 540°，逐枚负延迟循环
- **关键参数**：1.6s linear infinite；`--coin-i`×-.08s

### `advisorJackpotShake`
- **所属元素**：`html.advisor-jackpot-shake body`
- **效果**：中奖时整页剧烈震屏（±16px + 旋转）
- **关键参数**：85ms steps(2) infinite

---

## 12. 表单 / 烟花 / 金色特效 / 其他（16 个）

### `contactFormPulse`
- **所属元素**：`.contact-form.is-submitting`
- **效果**：表单提交中整体缩放脉冲
- **关键参数**：.72s ease-in-out infinite；scale(1.012)

### `contactOrbSpin`
- **所属元素**：`.contact-submit-orb`
- **效果**：提交按钮光球旋转 + 放大
- **关键参数**：1.1s linear infinite

### `contactOrbPing`
- **所属元素**：`.contact-submit-fx:after`
- **效果**：雷达式扩散光圈（box-shadow 0→28px 透明）
- **关键参数**：.9s ease-out infinite；scale(.85→2.2)

### `contactRingSpin`
- **所属元素**：`.contact-submit-ring`（含 .delay 双环）
- **效果**：加载圆环旋转
- **关键参数**：1.4s linear infinite

### `contactSparksTwinkle`
- **所属元素**：`.contact-submit-sparks`
- **效果**：火花闪烁
- **关键参数**：.48s steps(2,end) infinite

### `fireworksRainbowSpin`
- **所属元素**：`.fireworks-rainbow-border`
- **效果**：烟花彩虹边框旋转（`--spin` 0→360deg）
- **关键参数**：1.2s linear infinite

### `fireworksRainbowPulse`
- **所属元素**：`.fireworks-rainbow-border`
- **效果**：彩虹边框亮度阶跃脉冲
- **关键参数**：.45s steps(2) infinite；saturate(1.9) brightness(1.25)

### `fireworksScreenShake`
- **所属元素**：`html.fireworks-shake body`
- **效果**：烟花绽放时页面震屏
- **关键参数**：90ms steps(2) infinite；±12px + rotate ±.7deg

### `fireworksWordartIn`
- **所属元素**：`.fireworks-wordart`
- **效果**：烟花艺术字从下方歪斜弹入、1.22 倍过冲回正
- **关键参数**：.7s cubic-bezier(.16,1.2,.24,1) both

### `fireworksWordartSpin`
- **所属元素**：`.advisor-jackpot-banner`（复用烟花艺术字摇摆）
- **效果**：艺术字 skew/rotate 四段式扭动
- **关键参数**：1.1s steps(3,end) infinite

### `fireworksFlash`
- **所属元素**：`.fireworks-flash`
- **效果**：烟花闪光由亮渐隐
- **关键参数**：10s ease-out both；opacity .9→0

### `goldFxFlow`
- **所属元素**：`.gold-fx-type-core`
- **效果**：金色文字渐变流动
- **关键参数**：2.2s linear infinite；background-position→280%

### `goldFxShine`
- **所属元素**：`.gold-fx-type-shine`
- **效果**：金色高光层扫过
- **关键参数**：1.6s linear infinite

### `goldFxFloat`
- **所属元素**：`.fireworks-wordart`（入场后接续）
- **效果**：金字歪斜浮动呼吸
- **关键参数**：2.4s ease-in-out infinite；translateY(-6px) scale(1.04)

### `goldFxPulse`
- **所属元素**：`.gold-fx-type:before`
- **效果**：金字光晕模糊脉冲
- **关键参数**：1.8s ease-in-out infinite；blur(.2→.45px)

### `cheapDepthConflict`
- **所属元素**：未在 CSS 中直接引用（JS 动态类触发）
- **效果**：廉价景深冲突感：透明度 + 1px 上移抖动
- **关键参数**：opacity .92→1；translate3d(0,-1px,0)

---

## 附录：JS / Canvas 驱动的动效（非 @keyframes）

| 元素 | 实现 | 效果 |
|---|---|---|
| `.hyper-storm-canvas` | Canvas 2D 全屏 | 粒子风暴，filter: saturate(1.35) + 白色辉光 |
| `.red-packet-canvas` | Canvas 2D 全屏 | 红包雨粒子下落 |
| `.marquee-diamond-3d canvas` | Three.js r184 WebGL | 2 个旋转 3D 菱形（92px/96px） |
| `.dvd-bouncer` | JS 逐帧 `translate3d` | DVD 屏保式撞墙反弹，撞墙改变 `--dvd-hue` 变色并加 `.dvd-pop` 类 |
| `.liquid-glass-cursor` | JS 逐帧 transform + `--spot-x/--spot-y` | 液态玻璃光标：跟随、旋转、磁吸按钮时非均匀 scale 形变，含 fill/lens/spark 三层 |
| `.blackout-veil` | JS + radial-gradient 蒙版 | 「关灯」模式：全屏 99.5% 黑，仅鼠标处 60px 聚光灯圆孔，跟随 `--spot-x/--spot-y` |
| `.hit-digit` | JS 定时更新数字 | 访问计数器数字递增时触发翻牌动画 |
| `.support-bot` | JS `translate3d` 拖拽 | AI 顾问按钮可拖拽，`.motion-ready` 后可见 |
| `.advisor-spark`（100+） | JS 生成随机 `--spark-*` 变量 | 火花粒子轨迹全部随机化 |
| glitch / fireworks / jackpot 震屏 | JS 切换 `html.*-shake` 类 | 按需触发整页抖动 |

## 备注

- **未直接引用组**（5 个）：`cheapDepthConflict`、`heroChromaticPulse`、`imageSaturate`、`panelBob`、`supportPop` 在 CSS 中无 `animation:` 直接引用，应由 JS 动态类或内联样式触发，已分别归入对应分组并标注。
- 全站动画大量使用 CSS 自定义属性（`--bubble-*`、`--spark-*`、`--click-*`、`--magnet-*`、`--particle-*`、`--beam-*` 等）做参数化，同一段 keyframes 复用于几十上百个粒子实例。
- `borderSpin`/`liquidCursorLens` 等利用 `@property --spin` 注册自定义属性实现纯 CSS 锥形渐变旋转。
- CSS 中未声明 `prefers-reduced-motion` 降级（0 处），可访问性有提升空间。

/* ==========================================================
   沐涵个人主页 — main.js
   包含 Canvas 跨性别旗帜粒子、液态玻璃光标、滚动渐入、
   访问计数器、测验交互、小助手与烟花效果等
   ========================================================== */

(function () {
    'use strict';

    // 预设 prefers-reduced-motion 检查
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ==========================================================
       1. 全屏 Canvas 蓝粉白粒子背景
       ========================================================== */
    const canvas = document.getElementById('flag-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const colors = ['#5BCEFA', '#F5A9B8', '#FFFFFF'];
        const particleCount = 45;
        const particles = [];

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 4 + 1.5,
                color: colors[Math.floor(Math.random() * colors.length)],
                speedY: -(Math.random() * 0.6 + 0.2),
                swaySpeed: Math.random() * 0.02 + 0.005,
                swayOffset: Math.random() * Math.PI * 2,
                swayAmplitude: Math.random() * 1.5 + 0.5,
                alpha: Math.random() * 0.6 + 0.2
            });
        }

        function renderParticles() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                p.y += p.speedY;
                p.swayOffset += p.swaySpeed;
                p.x += Math.sin(p.swayOffset) * p.swayAmplitude * 0.3;

                // 边界重置
                if (p.y < -10) {
                    p.y = height + 10;
                    p.x = Math.random() * width;
                }

                ctx.save();
                ctx.globalAlpha = p.alpha;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.shadowBlur = 10;
                ctx.shadowColor = p.color;
                ctx.fill();
                ctx.restore();
            });

            requestAnimationFrame(renderParticles);
        }

        renderParticles();

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });
    }

    /* ==========================================================
       2. 液态玻璃光标与点击爆裂粒子
       ========================================================== */
    const cursor = document.getElementById('liquid-cursor');
    const trailLayer = document.getElementById('cursor-trail-layer');
    const burstLayer = document.getElementById('click-burst-layer');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    // 仅在支持精细指针（如鼠标）且非减弱动画下启用
    if (cursor && matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // 生成拖尾点
            if (Math.random() < 0.3 && trailLayer) {
                createTrailDot(mouseX, mouseY);
            }
        });

        function animateCursor() {
            // Lerp 缓动
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;

            cursor.style.transform = `translate3d(${cursorX - 16}px, ${cursorY - 16}px, 0)`;

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // 磁吸与点击效果
        const interactables = document.querySelectorAll('a, button, .quiz-option, .post-action');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('magnet'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('magnet'));
        });

        document.addEventListener('mousedown', (e) => {
            cursor.classList.add('pressed');
            createClickBurst(e.clientX, e.clientY);
        });

        document.addEventListener('mouseup', () => {
            cursor.classList.remove('pressed');
        });
    } else if (cursor) {
        cursor.style.display = 'none';
    }

    function createTrailDot(x, y) {
        const dot = document.createElement('div');
        dot.className = 'cursor-tech-dot';
        dot.style.left = `${x}px`;
        dot.style.top = `${y}px`;
        trailLayer.appendChild(dot);
        setTimeout(() => dot.remove(), 760);
    }

    function createClickBurst(x, y) {
        if (!burstLayer) return;
        const container = document.createElement('div');
        container.className = 'global-click-burst';
        container.style.left = `${x - 45}px`;
        container.style.top = `${y - 45}px`;

        // 生成爆裂粒子
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('i');
            const angle = (i * 45) + (Math.random() * 20 - 10);
            const dist = 30 + Math.random() * 25;
            particle.style.setProperty('--click-angle', `${angle}deg`);
            particle.style.setProperty('--click-distance', `${dist}px`);
            particle.style.animation = 'clickParticleBurst 0.88s cubic-bezier(0.12, 0.86, 0.18, 1) forwards';
            container.appendChild(particle);
        }

        burstLayer.appendChild(container);
        setTimeout(() => container.remove(), 900);
    }

    /* ==========================================================
       3. 滚动进度条与返回顶部
       ========================================================== */
    const progressBar = document.getElementById('scroll-progress');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

        if (backToTopBtn) {
            if (scrollTop > 350) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ==========================================================
       4. IntersectionObserver 视口渐入 (Reveal)
       ========================================================== */
    const revealElements = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                }
            });
        }, { threshold: 0.12 });

        revealElements.forEach(el => observer.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('in'));
    }

    /* ==========================================================
       5. 本地访问计数器 (Hit Counter)
       ========================================================== */
    const hitDigitEl = document.getElementById('hit-digit');
    if (hitDigitEl) {
        let count = parseInt(localStorage.getItem('muhan_visit_count') || '0', 10);
        count++;
        localStorage.setItem('muhan_visit_count', count.toString());

        hitDigitEl.textContent = count;
        hitDigitEl.style.animation = 'hitDigitFlip 0.42s cubic-bezier(0.2, 1.4, 0.4, 1) both';
    }

    /* ==========================================================
       6. MTF 小测验逻辑 (Quiz)
       ========================================================== */
    window.selectOption = function (el) {
        const parent = el.closest('.quiz-options');
        if (parent) {
            parent.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
        }
        el.classList.add('selected');
    };

    window.showResult = function (resultId) {
        const resBox = document.getElementById(resultId);
        if (resBox) {
            resBox.style.display = 'block';
            resBox.style.animation = 'fadeIn 0.5s ease-out';
        }

        // §11 Jackpot 彩蛋：检测是否选对了正确答案
        const quizContainer = document.getElementById(resultId)?.closest('.quiz-container');
        if (quizContainer) {
            const selected = quizContainer.querySelector('.quiz-option.selected');
            const isCorrect = selected && selected.hasAttribute('data-correct');
            if (isCorrect) {
                triggerJackpot();
            }
        }
    };

    /* ==========================================================
       7. Jackpot 庆祝彩蛋（11 个动画全部触发）
       ========================================================== */
    const jackpotOverlay = document.getElementById('jackpot-overlay');

    function triggerJackpot() {
        if (!jackpotOverlay) return;
        jackpotOverlay.hidden = false;
        jackpotOverlay.classList.add('show');
        document.documentElement.classList.add('jackpot-shake');

        // 3.2 秒后自动关闭
        setTimeout(() => {
            jackpotOverlay.classList.remove('show');
            document.documentElement.classList.remove('jackpot-shake');
            setTimeout(() => { jackpotOverlay.hidden = true; }, 400);
        }, 3200);
    }

    if (jackpotOverlay) {
        // 点击覆盖层背景关闭
        jackpotOverlay.addEventListener('click', (e) => {
            if (e.target === jackpotOverlay) {
                jackpotOverlay.classList.remove('show');
                document.documentElement.classList.remove('jackpot-shake');
                setTimeout(() => { jackpotOverlay.hidden = true; }, 400);
            }
        });
    }

    /* ==========================================================
       7. 骄傲签名墙表单与烟花庆祝
       ========================================================== */
    const prideForm = document.getElementById('pride-form');
    const fireworksLayer = document.getElementById('fireworks-layer');

    if (prideForm) {
        prideForm.addEventListener('submit', (e) => {
            e.preventDefault();

            prideForm.classList.add('is-submitting');

            setTimeout(() => {
                prideForm.classList.remove('is-submitting');

                // 播放烟花
                if (fireworksLayer) {
                    fireworksLayer.classList.add('show');
                    document.documentElement.classList.add('fireworks-shake');

                    setTimeout(() => {
                        document.documentElement.classList.remove('fireworks-shake');
                    }, 500);

                    setTimeout(() => {
                        fireworksLayer.classList.remove('show');
                    }, 3500);
                }

                prideForm.reset();
            }, 1200);
        });
    }

    /* ==========================================================
       8. 暖心小助手 (AI Advisor Chat)
       ========================================================== */
    const botToggle = document.getElementById('support-toggle');
    const botPanel = document.getElementById('support-panel');
    const botClose = document.getElementById('support-close');
    const botClear = document.getElementById('support-clear');
    const botForm = document.getElementById('support-form');
    const botInput = document.getElementById('support-input');
    const botMessages = document.getElementById('support-messages');
    const quickBtns = document.querySelectorAll('.quick-questions button');

    if (botToggle && botPanel) {
        botToggle.addEventListener('click', () => {
            const isHidden = botPanel.hidden;
            if (isHidden) {
                botPanel.hidden = false;
                botPanel.classList.remove('support-panel-closing');
                botToggle.setAttribute('aria-expanded', 'true');
            } else {
                closeBotPanel();
            }
        });

        if (botClose) {
            botClose.addEventListener('click', closeBotPanel);
        }

        function closeBotPanel() {
            botPanel.classList.add('support-panel-closing');
            botToggle.setAttribute('aria-expanded', 'false');
            setTimeout(() => {
                botPanel.hidden = true;
                botPanel.classList.remove('support-panel-closing');
            }, 750);
        }

        if (botClear && botMessages) {
            botClear.addEventListener('click', () => {
                botMessages.innerHTML = `
                    <div class="bot-msg">
                        <div class="message-text">对话已清空喵～ 有什么想问沐涵的吗？ <i class="trans-flag"></i></div>
                    </div>
                `;
            });
        }

        function appendMessage(text, isUser = false) {
            if (!botMessages) return;
            const msgDiv = document.createElement('div');
            msgDiv.className = isUser ? 'user-msg' : 'bot-msg new-bot-message';

            const textDiv = document.createElement('div');
            textDiv.className = 'message-text';
            textDiv.innerHTML = text;
            msgDiv.appendChild(textDiv);

            botMessages.appendChild(msgDiv);
            botMessages.scrollTop = botMessages.scrollHeight;
        }

        function replyToUser(input) {
            let response = "沐涵收到啦喵～ 每个人都值得勇敢做自己，为你加油！ 🏳️‍⚧️✨";

            if (input.includes('什么是MTF') || input.includes('MTF')) {
                response = "MTF (Male-to-Female) 指跨性别女性，即出生指定性别为男性，但内心性别认同为女性的人喵～ 🏳️‍⚧️";
            } else if (input.includes('支持') || input.includes('如何')) {
                response = "尊重她们的姓名和代词，倾听她们的心声，就是最大的支持和鼓励喵！💙💖🤍";
            } else if (input.includes('鼓励') || input.includes('加油')) {
                response = "“成为自己是一个过程，而不是终点。” 愿你无论经历什么，都能活出最闪耀的自己喵！✨";
            } else if (input.includes('骄傲')) {
                response = "🏳️‍⚧️ Trans Women Are Women! 骄傲做自己，彩虹因你而美丽喵！";
            }

            setTimeout(() => {
                appendMessage(response, false);
            }, 600);
        }

        if (botForm && botInput) {
            botForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const val = botInput.value.trim();
                if (!val) return;

                appendMessage(val, true);
                botInput.value = '';
                replyToUser(val);
            });
        }

        quickBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const text = btn.textContent;
                appendMessage(text, true);
                replyToUser(text);
            });
        });
    }

    /* ==========================================================
       9. 双击 Logo 彩蛋 (Glitch)
       ========================================================== */
    const navLogo = document.getElementById('nav-logo');
    const glitchStrobe = document.getElementById('glitch-strobe');

    if (navLogo && glitchStrobe) {
        navLogo.addEventListener('dblclick', (e) => {
            e.preventDefault();
            triggerGlitch();
        });
    }

    function triggerGlitch() {
        if (!glitchStrobe) return;
        glitchStrobe.classList.add('on');
        document.documentElement.classList.add('glitch-shake');

        setTimeout(() => {
            glitchStrobe.classList.remove('on');
            document.documentElement.classList.remove('glitch-shake');
        }, 400);
    }

    /* ==========================================================
       10. DVD 弹屏（JS 逐帧驱动撞墙反弹 + 变色）
       ========================================================== */
    const dvdBouncer = document.getElementById('dvd-bouncer');
    if (dvdBouncer) {
        let dvdX = Math.random() * (window.innerWidth - 80);
        let dvdY = Math.random() * (window.innerHeight - 80);
        let dvdVX = 2.2 + Math.random() * 1.5;
        let dvdVY = 1.8 + Math.random() * 1.5;
        let dvdHue = Math.random() * 360;
        const dvdW = 72, dvdH = 72;
        let popTimer = null;

        dvdBouncer.style.setProperty('--dvd-hue', dvdHue);
        dvdBouncer.style.transform = `translate3d(${dvdX}px, ${dvdY}px, 0)`;

        function animateDVD() {
            dvdX += dvdVX;
            dvdY += dvdVY;

            let hitWall = false;
            if (dvdX <= 0) { dvdX = 0; dvdVX = Math.abs(dvdVX); hitWall = true; }
            if (dvdX >= window.innerWidth - dvdW) { dvdX = window.innerWidth - dvdW; dvdVX = -Math.abs(dvdVX); hitWall = true; }
            if (dvdY <= 0) { dvdY = 0; dvdVY = Math.abs(dvdVY); hitWall = true; }
            if (dvdY >= window.innerHeight - dvdH) { dvdY = window.innerHeight - dvdH; dvdVY = -Math.abs(dvdVY); hitWall = true; }

            dvdBouncer.style.transform = `translate3d(${dvdX}px, ${dvdY}px, 0)`;

            if (hitWall) {
                dvdHue = (dvdHue + 60 + Math.random() * 60) % 360;
                dvdBouncer.style.setProperty('--dvd-hue', dvdHue);
                dvdBouncer.querySelector('.dvd-core')?.classList.add('dvd-pop');
                if (popTimer) clearTimeout(popTimer);
                popTimer = setTimeout(() => {
                    dvdBouncer.querySelector('.dvd-core')?.classList.remove('dvd-pop');
                }, 460);

                // 随机微调速度
                dvdVX += (Math.random() - 0.5) * 0.6;
                dvdVY += (Math.random() - 0.5) * 0.6;
                dvdVX = Math.max(1.5, Math.min(4, Math.abs(dvdVX))) * Math.sign(dvdVX);
                dvdVY = Math.max(1.5, Math.min(4, Math.abs(dvdVY))) * Math.sign(dvdVY);
            }

            requestAnimationFrame(animateDVD);
        }
        animateDVD();

        window.addEventListener('resize', () => {
            dvdX = Math.min(dvdX, window.innerWidth - dvdW);
            dvdY = Math.min(dvdY, window.innerHeight - dvdH);
        });
    }

    /* ==========================================================
       11. 页面加载欢迎特效（开机就触发！）
       ========================================================== */

    // 欢迎金币雨生成器
    function triggerWelcomeRain() {
        const container = document.getElementById('welcome-rain');
        if (!container) return;
        container.innerHTML = '';
        container.classList.add('active');

        const avatarSrc = document.querySelector('.avatar')?.src || './assets/avatar.jpg';
        const items = [];
        const flagEmojis = ['🏳️‍⚧️', '💖', '💙', '🤍', '✨', '🌈', '💜', '🦋'];

        // 生成 35 个飘落项：旗帜 emoji + 头像圆片
        for (let i = 0; i < 35; i++) {
            const isAvatar = i < 8; // 8 个头像
            const item = document.createElement(isAvatar ? 'img' : 'span');
            item.className = 'welcome-rain-item' + (isAvatar ? ' avatar-rain' : ' flag');

            const left = Math.random() * 94 + 2; // 2% ~ 96%
            const size = 20 + Math.random() * 35; // 20~55px
            const duration = 2.5 + Math.random() * 2.5; // 2.5~5s
            const delay = Math.random() * 1.8; // 0~1.8s
            const rotate = 200 + Math.random() * 520; // 200~720deg
            const sway = (Math.random() - 0.5) * 80; // 左右飘摆

            item.style.cssText = `
                --rain-dur:${duration}s;
                --rain-delay:${delay}s;
                --rain-size:${size}px;
                --rain-rotate:${rotate}deg;
                left:${left}%;
            `;

            if (isAvatar) {
                item.src = avatarSrc;
                item.alt = '';
            } else {
                item.textContent = flagEmojis[Math.floor(Math.random() * flagEmojis.length)];
            }

            container.appendChild(item);
            items.push(item);
        }

        // 3.5s 后开始淡出，5s 后完全清除
        setTimeout(() => {
            container.style.opacity = '0';
            container.style.transition = 'opacity 1.5s ease-out';
        }, 3500);

        setTimeout(() => {
            container.classList.remove('active');
            container.innerHTML = '';
            container.style.opacity = '';
            container.style.transition = '';
        }, 5200);
    }

    // 11a. 光标立即显示（cursor 已在 §2 声明，直接复用）
        if (cursor) {
            cursor.classList.add('ready');
        }

        // 11b. 0.8s 后触发 Jackpot 欢迎庆祝
        setTimeout(() => {
            const overlay = document.getElementById('jackpot-overlay');
            if (overlay && overlay.hidden) {
                overlay.hidden = false;
                overlay.classList.add('show');
                document.documentElement.classList.add('jackpot-shake');
                setTimeout(() => {
                    overlay.classList.remove('show');
                    document.documentElement.classList.remove('jackpot-shake');
                    setTimeout(() => { overlay.hidden = true; }, 400);
                }, 3200);
            }
        }, 800);

        // 11c. 1.5s 后触发一次欢迎 Glitch 闪屏
        setTimeout(() => {
            triggerGlitch();
        }, 1500);

        // 11d. Hero 气泡立即启动（确保 CSS animation 在 Safari 等浏览器正确启动）
        document.querySelectorAll('.hero-bubble').forEach((b) => {
            b.style.animation = 'none';
            b.offsetHeight; // force reflow
            b.style.animation = '';
        });

        // 11e. 欢迎金币雨：跨性别旗帜 + 头像飘落
        triggerWelcomeRain();

    /* ==========================================================
       12. 头像鼠标跟随特效（光斑 + 3D 环倾斜 + 粒子吸引）
       ========================================================== */
    const avatarWrap = document.querySelector('.avatar-wrap');
    const avatarGlow = document.getElementById('avatar-glow');
    const avatarSparkles = document.querySelectorAll('.avatar-sparkle');

    if (avatarWrap) {
        let avatarRect = avatarWrap.getBoundingClientRect();
        let avatarCX = avatarRect.left + avatarRect.width / 2;
        let avatarCY = avatarRect.top + avatarRect.height / 2;
        let targetTiltX = 0, targetTiltY = 0;
        let currentTiltX = 0, currentTiltY = 0;
        let floatPhase = 0;

        function updateAvatarRect() {
            avatarRect = avatarWrap.getBoundingClientRect();
            avatarCX = avatarRect.left + avatarRect.width / 2;
            avatarCY = avatarRect.top + avatarRect.height / 2;
        }

        document.addEventListener('mousemove', (e) => {
            updateAvatarRect();
            const dx = e.clientX - avatarCX;
            const dy = e.clientY - avatarCY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxDist = 350;

            // --- 光斑跟随鼠标 ---
            if (avatarGlow) {
                if (dist < avatarRect.width * 1.6) {
                    const clampR = avatarRect.width / 2 - 10;
                    const angle = Math.atan2(dy, dx);
                    const clampedDist = Math.min(dist, clampR);
                    const glowX = avatarRect.width / 2 + Math.cos(angle) * clampedDist;
                    const glowY = avatarRect.height / 2 + Math.sin(angle) * clampedDist;
                    avatarGlow.style.left = glowX + 'px';
                    avatarGlow.style.top = glowY + 'px';
                    avatarGlow.classList.add('active');
                } else {
                    avatarGlow.classList.remove('active');
                }
            }

            // --- 3D 倾斜 ---
            if (dist < maxDist) {
                const strength = Math.max(0, 1 - dist / maxDist);
                targetTiltX = (dy / maxDist) * 30 * strength;
                targetTiltY = -(dx / maxDist) * 30 * strength;
            } else {
                targetTiltX = 0;
                targetTiltY = 0;
            }

            // --- 粒子吸引 ---
            avatarSparkles.forEach(sparkle => {
                const angle = parseFloat(sparkle.style.getPropertyValue('--as-angle'));
                const baseDist = parseFloat(sparkle.style.getPropertyValue('--as-dist-base') || sparkle.style.getPropertyValue('--as-dist'));
                const rad = angle * Math.PI / 180;
                const sx = avatarCX + Math.cos(rad) * baseDist;
                const sy = avatarCY + Math.sin(rad) * baseDist;
                const sdx = e.clientX - sx;
                const sdy = e.clientY - sy;
                const sdist = Math.sqrt(sdx * sdx + sdy * sdy);
                if (sdist < 180) {
                    const pull = Math.max(0, 1 - sdist / 180) * 35;
                    sparkle.style.setProperty('--as-dist', (baseDist - pull) + 'px');
                    sparkle.style.filter = 'brightness(2) saturate(3)';
                } else {
                    sparkle.style.setProperty('--as-dist', baseDist + 'px');
                    sparkle.style.filter = '';
                }
            });
        });

        // 合体动画：visualFloat 浮动 + 鼠标倾斜
        function animateAvatarTilt(ts) {
            currentTiltX += (targetTiltX - currentTiltX) * 0.07;
            currentTiltY += (targetTiltY - currentTiltY) * 0.07;
            floatPhase += 0.001;

            // 合并 visualFloat 的上下浮动 + 鼠标倾斜
            const floatY = Math.sin(floatPhase * 2.5) * 8; // visualFloat: translateY(-10px→0)
            const floatR = Math.sin(floatPhase * 2.5) * 0.3; // visualFloat: rotate(.4deg)
            avatarWrap.style.transform =
                `translateY(${floatY.toFixed(1)}px) rotate(${floatR.toFixed(2)}deg) rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg)`;

            requestAnimationFrame(animateAvatarTilt);
        }
        requestAnimationFrame(animateAvatarTilt);

        document.addEventListener('mouseleave', () => {
            targetTiltX = 0;
            targetTiltY = 0;
            if (avatarGlow) avatarGlow.classList.remove('active');
            avatarSparkles.forEach(sparkle => {
                const baseDist = sparkle.style.getPropertyValue('--as-dist-base');
                if (baseDist) sparkle.style.setProperty('--as-dist', baseDist);
                sparkle.style.filter = '';
            });
        });

        // 保存基础距离
        avatarSparkles.forEach(sparkle => {
            const dist = sparkle.style.getPropertyValue('--as-dist');
            sparkle.style.setProperty('--as-dist-base', dist);
        });

        window.addEventListener('resize', updateAvatarRect);
    }

})();

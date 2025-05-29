// ========== 轮播核心逻辑 ==========
let currentSlide = 0;
const slides = document.querySelectorAll('.slider img');
let slideInterval = null;
const indicatorsContainer = document.querySelector('.indicators');

// ========== 功能函数 ==========
// 统一跳转方法
function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    updateIndicators();
    resetAutoPlay();
}

// 下一张
function nextSlide() {
    goToSlide(currentSlide + 1);
}

// 上一张
function prevSlide() {
    goToSlide(currentSlide - 1);
}

// 更新指示器
function updateIndicators() {
    document.querySelectorAll('.indicator').forEach((indicator, i) => {
        indicator.classList.toggle('active', i === currentSlide);
    });
}

// 动态生成指示器
function createIndicators() {
    slides.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.classList.add('indicator');
        if (index === currentSlide) indicator.classList.add('active');
        indicator.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.appendChild(indicator);
    });
}

// ========== 自动播放控制 ==========
function startAutoPlay() {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
}

function resetAutoPlay() {
    startAutoPlay();
}

// ========== 事件处理 ==========
// 滚轮切换
function handleWheelScroll(e) {
    e.preventDefault();
    e.stopPropagation();
    clearInterval(slideInterval);
    const direction = Math.sign(e.deltaY);
    direction > 0 ? nextSlide() : prevSlide();
    resetAutoPlay();
}

// 导航栏透明度
let isScrolling = false;
window.addEventListener('scroll', () => {
    if (!isScrolling) {
        requestAnimationFrame(() => {
            const nav = document.querySelector('.main-nav');
            nav.style.background = window.scrollY > 100
                ? 'rgba(0,0,0,0.9)'
                : 'rgba(0,0,0,0.8)';
            isScrolling = false;
        });
    }
    isScrolling = true;
});

// 键盘控制
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
});

// ========== 箭头按钮事件处理 ==========
function initArrows() {
    const prevArrow = document.querySelector('.arrow.prev');
    const nextArrow = document.querySelector('.arrow.next');

    if (prevArrow && nextArrow) {
        prevArrow.addEventListener('click', prevSlide);
        nextArrow.addEventListener('click', nextSlide);
    }
}

// ========== 初始化 ==========
function initSlider() {
    createIndicators();
    initArrows(); // 初始化箭头事件
    startAutoPlay();
}

// 绑定事件并初始化
document.querySelector('.slider-container').addEventListener('wheel', handleWheelScroll);
initSlider(); // 关键！必须调用初始化函数
// Объединяем весь JavaScript код в один блок
document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.horizontal-scroll-container');
    const header = document.querySelector('.header');
    const dots = document.querySelectorAll('.dot');
    const sections = document.querySelectorAll('.section');
    const customScrollbar = document.querySelector('.custom-scrollbar');
    const scrollThumb = document.getElementById('scrollThumb');
    const scrollTrack = document.getElementById('scrollTrack');
    
    // Элементы, которые нужно сдвигать
    const keycapUp = document.querySelector('.scroll-element-second__keycap-up');
    const keycapDown = document.querySelector('.scroll-element-second__keycap-down');
    const smileUp = document.querySelector('.scroll-element-fifth__wow');
    const smileDown = document.querySelector('.scroll-element-fifth__cry');
    const keycapUpSecond = document.querySelector('.scroll-element-third__keycap-up');
    const keycapDownSecond = document.querySelector('.scroll-element-third__keycap-down');
    
    // Функция для проверки видимости элемента в горизонтальном viewport
    function isElementInHorizontalViewport(el) {
        const rect = el.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        return (
            rect.left >= containerRect.left &&
            rect.right <= containerRect.right
        );
    }
    
    // Функция для управления видимостью скроллбара
    function toggleScrollbarVisibility() {
        const scrollPosition = container.scrollLeft;
        const windowWidth = window.innerWidth;
        
        // Показываем скроллбар только начиная со второй секции (индекс 1)
        if (scrollPosition >= windowWidth * 0.7) { // Небольшой отступ для плавности
            customScrollbar.classList.add('active');
        } else {
            customScrollbar.classList.remove('active');
        }
    }
    
    // Обновление позиции ползунка
    function updateScrollThumb() {
        const scrollableWidth = container.scrollWidth - container.clientWidth;
        if (scrollableWidth <= 0) return;
        
        const scrollPosition = container.scrollLeft;
        const thumbPosition = (scrollPosition / scrollableWidth) * 100;
        
        scrollThumb.style.left = thumbPosition + '%';
    }
    
    // Hide header on sections other than intro
    function toggleHeaderVisibility() {
        const scrollPosition = container.scrollLeft;
        const windowWidth = window.innerWidth;
        
        if (scrollPosition < windowWidth * 0.5) {
            header.classList.remove('hidden');
        } else {
            header.classList.add('hidden');
        }
        
        // Update active dot
        const activeIndex = Math.round(scrollPosition / windowWidth);
        dots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // Проверяем, активна ли вторая секция (индекс 1)
        const secondSection = sections[2];
        
        if (isElementInHorizontalViewport(secondSection)) {
            keycapUp.classList.add('shift-right');
            keycapDown.classList.add('shift-right-sec');
        } else {
            keycapUp.classList.remove('shift-right');
            keycapDown.classList.remove('shift-right-sec');
        }

        const thirdSection = sections[5];
        
        if (isElementInHorizontalViewport(thirdSection)) {
            smileUp.classList.add('shift-up');
            smileDown.classList.add('shift-down');
        } else {
            smileUp.classList.remove('shift-up');
            smileDown.classList.remove('shift-down');
        }

        const fourthSection = sections[3];
        
        if (isElementInHorizontalViewport(fourthSection)) {
            keycapUpSecond.classList.add('shift-right__second');
            keycapDownSecond.classList.add('shift-right-sec__second');
        } else {
            keycapUpSecond.classList.remove('shift-right__second');
            keycapDownSecond.classList.remove('shift-right-sec__second');
        }
        
        // Управляем видимостью скроллбара
        toggleScrollbarVisibility();
    }
    
    // Handle wheel event for horizontal scrolling
    container.addEventListener('wheel', function(e) {
        e.preventDefault();
        
        const delta = Math.sign(e.deltaY);
        const currentScroll = container.scrollLeft;
        const windowWidth = window.innerWidth;
        let targetScroll;
        
        if (delta > 0) {
            targetScroll = Math.min(currentScroll + windowWidth, container.scrollWidth - windowWidth);
        } else {
            targetScroll = Math.max(currentScroll - windowWidth, 0);
        }
        
        container.scrollTo({
            left: targetScroll,
            behavior: 'smooth'
        });
    });
    
    // Клик по треку для перехода к позиции
    scrollTrack.addEventListener('click', function(e) {
        const trackRect = scrollTrack.getBoundingClientRect();
        const clickPosition = e.clientX - trackRect.left;
        const trackWidth = trackRect.width;
        const percentage = Math.max(0, Math.min(clickPosition / trackWidth, 1));
        
        const scrollableWidth = container.scrollWidth - container.clientWidth;
        const targetScroll = percentage * scrollableWidth;
        
        container.scrollTo({
            left: targetScroll,
            behavior: 'smooth'
        });
    });
    
    // Перетаскивание ползунка
    let isDragging = false;
    let startX;
    let startScrollLeft;
    
    scrollThumb.addEventListener('mousedown', function(e) {
        // Разрешаем перетаскивание только когда скроллбар активен
        if (!customScrollbar.classList.contains('active')) return;
        
        isDragging = true;
        startX = e.clientX;
        startScrollLeft = container.scrollLeft;
        e.preventDefault();
        
        document.body.style.userSelect = 'none';
        scrollThumb.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        const trackRect = scrollTrack.getBoundingClientRect();
        const trackWidth = trackRect.width;
        const deltaX = e.clientX - startX;
        const percentageDelta = deltaX / trackWidth;
        
        const scrollableWidth = container.scrollWidth - container.clientWidth;
        const newScroll = startScrollLeft + (percentageDelta * scrollableWidth);
        
        container.scrollLeft = Math.max(0, Math.min(newScroll, scrollableWidth));
    });
    
    document.addEventListener('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            document.body.style.userSelect = '';
            scrollThumb.style.cursor = 'grab';
        }
    });
    
    // Touch events для мобильных устройств
    scrollThumb.addEventListener('touchstart', function(e) {
        if (!customScrollbar.classList.contains('active')) return;
        
        isDragging = true;
        startX = e.touches[0].clientX;
        startScrollLeft = container.scrollLeft;
        e.preventDefault();
    });
    
    document.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        
        const trackRect = scrollTrack.getBoundingClientRect();
        const trackWidth = trackRect.width;
        const deltaX = e.touches[0].clientX - startX;
        const percentageDelta = deltaX / trackWidth;
        
        const scrollableWidth = container.scrollWidth - container.clientWidth;
        const newScroll = startScrollLeft + (percentageDelta * scrollableWidth);
        
        container.scrollLeft = Math.max(0, Math.min(newScroll, scrollableWidth));
    });
    
    document.addEventListener('touchend', function() {
        isDragging = false;
    });
    
    // Handle dot navigation
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            container.scrollTo({
                left: index * window.innerWidth,
                behavior: 'smooth'
            });
        });
    });
    
    // Обновление при скролле
    container.addEventListener('scroll', function() {
        toggleHeaderVisibility();
        updateScrollThumb();
    });
    
    // Обновление при изменении размера окна
    window.addEventListener('resize', function() {
        toggleHeaderVisibility();
        updateScrollThumb();
        toggleScrollbarVisibility();
    });
    
    // Инициализация
    toggleHeaderVisibility();
    updateScrollThumb();
    toggleScrollbarVisibility();
});
document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.horizontal-scroll-container');
    const header = document.querySelector('.header');
    const dots = document.querySelectorAll('.dot');
    const sections = document.querySelectorAll('.section');
    
    // Элементы, которые нужно сдвигать
    const keycapUp = document.querySelector('.scroll-element-second__keycap-up');
    const keycapDown = document.querySelector('.scroll-element-second__keycap-down');
    const smileUp = document.querySelector('.scroll-element-fifth__wow');
    const smileDown = document.querySelector('.scroll-element-fifth__cry');
    
    // Функция для проверки видимости элемента в горизонтальном viewport
    function isElementInHorizontalViewport(el) {
        const rect = el.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        // Проверяем, находится ли элемент в видимой области контейнера
        return (
            rect.left >= containerRect.left &&
            rect.right <= containerRect.right
        );
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
            // Добавляем класс для сдвига элементов
            keycapUp.classList.add('shift-right');
            keycapDown.classList.add('shift-right-sec');
        } else {
            // Убираем класс, если секция не активна
            keycapUp.classList.remove('shift-right');
            keycapDown.classList.remove('shift-right-sec');
        }

        const thirdSection = sections[5];
        
        if (isElementInHorizontalViewport(thirdSection)) {
            // Добавляем класс для сдвига элементов
            smileUp.classList.add('shift-up');
            smileDown.classList.add('shift-down');
        } else {
            // Убираем класс, если секция не активна
            smileUp.classList.remove('shift-up');
            smileDown.classList.remove('shift-down');
        }
    }
    
    // Handle wheel event for horizontal scrolling
    container.addEventListener('wheel', function(e) {
        e.preventDefault();
        
        // Determine scroll direction
        const delta = Math.sign(e.deltaY);
        
        // Calculate target scroll position
        const currentScroll = container.scrollLeft;
        const windowWidth = window.innerWidth;
        let targetScroll;
        
        if (delta > 0) {
            // Scroll right
            targetScroll = Math.min(currentScroll + windowWidth, container.scrollWidth - windowWidth);
        } else {
            // Scroll left
            targetScroll = Math.max(currentScroll - windowWidth, 0);
        }
        
        // Smooth scroll to target position
        container.scrollTo({
            left: targetScroll,
            behavior: 'smooth'
        });
    });
    
    // Update header visibility on scroll
    container.addEventListener('scroll', toggleHeaderVisibility);
    
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
    
    // Initial header visibility check
    toggleHeaderVisibility();
    
    // Also check on resize
    window.addEventListener('resize', toggleHeaderVisibility);
});
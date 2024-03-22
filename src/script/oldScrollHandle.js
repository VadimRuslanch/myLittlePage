export const initSlideController = (options) => {
    const {
        scrollDelay = 800, // Задержка между пролистываниями, мс
        transitionSpeed = 1000, // Скорость перехода между слайдами, мс
        minWidth = 0, // Минимальная ширина окна для активации библиотеки
    } = options;

    let isEnabled = true; // Состояние активности библиотеки

    // Функция для проверки разрешения экрана

    document.addEventListener('DOMContentLoaded', () => {
        const sections = document.querySelectorAll('.section');
        let currentSection = 0;
        const footer = document.querySelector('.footer');
        const totalSections = sections.length + 1;
        let isScrollingAllowed = true;

        // Проверяем размер окна при загрузке

        const easeInOutQuad = (t, b, c, d) => {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        };

        const scrollToSection = (sectionIndex) => {
            if (!isScrollingAllowed || !isEnabled) return;
            isScrollingAllowed = false;
            setTimeout(() => isScrollingAllowed = true, scrollDelay);

            let targetPosition;
            if (sectionIndex < sections.length) {
                const section = sections[sectionIndex];
                targetPosition = section.offsetTop;
            } else {
                targetPosition = footer.offsetTop;
            }

            performScroll(targetPosition);
        };

        const performScroll = (targetPosition) => {
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            let startTime = null;

            const animation = currentTime => {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const nextScrollPosition = easeInOutQuad(timeElapsed, startPosition, distance, transitionSpeed);

                window.scrollTo(0, nextScrollPosition);
                if (timeElapsed < transitionSpeed) requestAnimationFrame(animation);
            };

            requestAnimationFrame(animation);
        };

        const debounce = (func, delay) => {
            let inDebounce;
            return function () {
                const context = this;
                const args = arguments;
                clearTimeout(inDebounce);
                inDebounce = setTimeout(() => func.apply(context, args), delay);
            };
        };

        const handleScroll = debounce((e) => {
            if (!isScrollingAllowed || !isEnabled) return;

            const sensitivity = 5; // Минимальное значение deltaY для реакции на прокрутку
            if (Math.abs(e.deltaY) < sensitivity) return;

            if (e.deltaY < 0 && currentSection > 0) {
                currentSection--;
            } else if (e.deltaY > 0 && currentSection < totalSections - 1) {
                currentSection++;
            }
            scrollToSection(currentSection);
        }, 50);

        document.addEventListener('wheel', handleScroll, {passive: false});
    });
};
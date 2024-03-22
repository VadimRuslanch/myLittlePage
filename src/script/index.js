import '../styles/index.css';
import {getState, setState} from "./state";

// import * as utils from './utils'
// import {EventEmitter} from './eventEmitter'
// import {events} from './events.js';
// import {scrollPage} from "./scrollPage";
// import {doc} from "./constants";
// import {scrollHandler} from "./scrollHandler";
// import {moveSectionDown} from "./moveSectionDown";
// import {moveSectionUp} from "./moveSectionUp";

//
// EventEmitter.on(events.bindEvents, bindEvents);
// EventEmitter.on(events.onDestroy, onDestroy);

<<<<<<< HEAD
// EventEmitter.on(events.bindEvents, bindEvents);
// EventEmitter.on(events.onDestroy, onDestroy);
//
=======
>>>>>>> 1f06bba431f8197d651a5a0cace788ec9b20d69c
// function onDestroy() {
//     utils.windowRemoveEvent('scroll', scrollHandler);
// }
//
// function bindEvents() {
//     console.log('work')
//     utils.windowAddEvent('scroll', scrollHandler);
//     doc.body.addEventListener('scroll', scrollHandler);
//
//     EventEmitter.on(events.onMenuClick, function (params) {
//         moveTo(params.anchor, undefined);
//     });
//
//     EventEmitter.on(events.onScrollOverflowScrolled, function (params) {
//         let scrollSection = (params.direction === 'down') ? moveSectionDown : moveSectionUp;
//         scrollSection();
//     });
//
//     EventEmitter.on(events.scrollPage, function (params) {
//         scrollPage(params.destination);
//     });
// }


document.addEventListener('DOMContentLoaded', init);

function init() {
    const sections = document.querySelectorAll('.section');
    const footer = document.querySelector('.footer');
    const totalSections = sections.length + 1;
    let currentSection = 0;
<<<<<<< HEAD
    let isScrollingAllowed = true;

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
=======

    const handleScroll = (e) => {
        console.log(e)
    }
    document.addEventListener('scroll', handleScroll)
>>>>>>> 1f06bba431f8197d651a5a0cace788ec9b20d69c
}

function getDestinationPosition(element) {
    const elementHeight = element.offsetHeight;
    const elementTop = element.offsetTop;
    const windowHeight = utils.getWindowHeight();
    const isScrollingDown = elementTop > getState().previousDestTop;
    let position = elementTop;

    if (elementHeight > windowHeight) {
        if (!isScrollingDown && getOptions().bigSectionsDestination !== 'bottom') {
            position = elementTop; // Секция больше viewport и прокрутка вверх
        } else {
            position = elementTop + elementHeight - windowHeight; // Секция больше viewport и прокрутка вниз
        }
    } else if (isScrollingDown) {
        position = elementTop + elementHeight - windowHeight; // Секция меньше или равна viewport, прокрутка вниз
    }

    setState({previousDestTop: position});
    return position;
}

function performMovement(v) {
    const transitionLapse = getOptions().scrollingSpeed < 700 ? 700 : getOptions().scrollingSpeed;
    setState({scrollY: Math.round(v.dtop)});

    // Генерация стандартного события
    document.dispatchEvent(new CustomEvent('onPerformMovement', {detail: v}));

    if (getOptions().css3 && getOptions().autoScrolling && !getOptions().scrollBar) {
        const translate3d = `translate3d(0px, -${Math.round(v.dtop)}px, 0px)`;
        transformContainer(translate3d, true);
    } else {
        // Альтернативная логика анимации прокрутки, если CSS3 не используется
    }

    setTimeout(() => setState({canScroll: true}), transitionLapse);
}

export function scrollPage(section, callback, isMovementUp) {
    const element = section.item;
    if (!element) return;

    const dtop = getDestinationPosition(element);
    if (getState().activeSection.item === element && !getState().isResizing) return;

    utils.addClass(element, 'active');
    utils.removeClass(utils.siblings(element), 'active');
    setState({canScroll: false});

    performMovement({
        element,
        callback,
        isMovementUp,
        dtop,
        anchorLink: section.anchor,
        sectionIndex: section.index(),
        activeSlide: section.activeSlide ? section.activeSlide.item : null,
    });

    setTimeout(() => {
        setState({canScroll: true, lastScrolledDestiny: section.anchor});

        // Генерация стандартного события
        document.dispatchEvent(new CustomEvent('afterSectionLoads', {
            detail: {
                anchorLink: section.anchor,
                index: section.index(),
                item: element
            }
        }));

        if (typeof callback === 'function') callback();
    }, getOptions().scrollingSpeed || 400);
}

// Пример добавления слушателя для события 'onPerformMovement'
document.addEventListener('onPerformMovement', (e) => {
    console.log('Событие onPerformMovement сработало', e.detail);
});

// Пример добавления слушателя для события 'afterSectionLoads'
document.addEventListener('afterSectionLoads', (e) => {
    console.log('Событие afterSectionLoads сработало', e.detail);
});
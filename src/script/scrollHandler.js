import * as utils from './utils.js';
import {getOptions} from './options.js';
import {getState, setState, state} from './state.js';
import {$body} from './cache.js';
import {getYmovement} from './utilsFP.js';
import {
    COMPLETELY,
    ACTIVE
} from './selectors.js';
import {EventEmitter} from './eventEmitter.js';
import {events} from './events.js';

let lastScroll = 0;
let g_scrollId;
let g_scrollId2;

// EventEmitter.on(events.onDestroy, onDestroy);



//when scrolling...
export function scrollHandler(e) {
    let currentSection;
    let currentSectionElem;

    if (state.isResizing || !getState().activeSection) {
        return;
    }

    let lastSection = utils.getLast(getState().sections);
    if (getState().isBeyondFullpage || getState().isAboutToScrollToFullPage) {
        return;
    }

    if (!getOptions().autoScrolling || getOptions().scrollBar) {
        let currentScroll = utils.getScrollTop();
        let scrollDirection = getScrollDirection(currentScroll);
        let visibleSectionIndex = 0;
        let screen_mid = currentScroll + (utils.getWindowHeight() / 2.0);
        let isAtBottom = $body.scrollHeight - utils.getWindowHeight() === currentScroll;
        let sections = getState().sections;

        setState({scrollY: currentScroll});

        // при использовании `auto-height` для небольшого последнего раздела он не будет центрироваться в окне просмотра.
        //when using  for a small last section it won't be centered in the viewport

        if (isAtBottom) {
            visibleSectionIndex = sections.length - 1;
        }
            //наверху? при использовании «автовысоты» для небольшого первого раздела он не будет центрироваться в окне просмотра.
        //is at top? when using `auto-height` for a small first section it won't be centered in the viewport
        else if (!currentScroll) {
            visibleSectionIndex = 0;
        }

            //берем раздел, в котором отображается больше контента в области просмотра
        //taking the section which is showing more content in the viewport

        else {
            for (let i = 0; i < sections.length; ++i) {
                let section = sections[i].item;

                // Pick the the last section which passes the middle line of the screen.
                if (section.offsetTop <= screen_mid) {
                    visibleSectionIndex = i;
                }
            }
        }

        if (isCompletelyInViewPort(scrollDirection)) {
            if (!utils.hasClass(getState().activeSection.item, COMPLETELY)) {
                utils.addClass(getState().activeSection.item, COMPLETELY);
                utils.removeClass(utils.siblings(getState().activeSection.item), COMPLETELY);
            }
        }

        // получаем последний, текущий на экране
        currentSection = sections[visibleSectionIndex];
        currentSectionElem = currentSection.item;

        // установим видимый раздел как активный при ручной прокрутке
        // выполнение только один раз при первом попадании в раздел
        if (!currentSection.isActive) {
            setState({isScrolling: true});
            let leavingSection = getState().activeSection.item;
            let leavingSectionIndex = getState().activeSection.index() + 1;
            let yMovement = getYmovement(getState().activeSection, currentSectionElem);
            let anchorLink = currentSection.anchor;
            let sectionIndex = currentSection.index() + 1;
            let activeSlide = currentSection.activeSlide;
            let slideIndex;
            let slideAnchorLink;
            let callbacksParams = {
                activeSection: leavingSection,
                sectionIndex: sectionIndex - 1,
                anchorLink: anchorLink,
                element: currentSectionElem,
                leavingSection: leavingSectionIndex,
                direction: yMovement,

                items: {
                    origin: getState().activeSection,
                    destination: currentSection
                }
            };

            if (activeSlide) {
                slideAnchorLink = activeSlide.anchor;
                slideIndex = activeSlide.index();
            }

            if (state.canScroll) {
                utils.addClass(currentSectionElem, ACTIVE);
                utils.removeClass(utils.siblings(currentSectionElem), ACTIVE);

                if (getOptions().anchors.length) {
                    //needed to enter in hashChange event when using the menu with anchor links
                    setState({lastScrolledDestiny: anchorLink});
                }
                // updateState();
            }

            //small timeout in order to avoid entering in hashChange event when scrolling is not finished yet
            clearTimeout(g_scrollId);
            g_scrollId = setTimeout(function () {
                setState({isScrolling: false});
            }, 100);

        }

    }
}

function onDestroy() {
    clearTimeout(g_scrollId);
    clearTimeout(g_scrollId2);
}

/**
 * Получает направление прокрутки, запускаемой событием прокрутки.
 */
function getScrollDirection(currentScroll) {
    let direction = currentScroll > lastScroll ? 'down' : 'up';

    lastScroll = currentScroll;

    //needed for auto-height sections to determine if we want to scroll to the top or bottom of the destination
    setState({previousDestTop: currentScroll});

    return direction;
}


/**
 * Определяет, просмотрен ли активный раздел целиком или нет.
 */
function isCompletelyInViewPort(movement) {
    let top = getState().activeSection.item.offsetTop;
    let bottom = top + utils.getWindowHeight();

    if (movement == 'up') {
        return bottom >= (utils.getScrollTop() + utils.getWindowHeight());
    }
    return top <= utils.getScrollTop();
}
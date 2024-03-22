import '../styles/index.css';

import * as utils from './utils'
import {EventEmitter} from './eventEmitter'
import {events} from './events.js';
import {scrollPage} from "./scrollPage";
import {doc} from "./constants";
import {scrollHandler} from "./scrollHandler";
import {moveSectionDown} from "./moveSectionDown";
import {moveSectionUp} from "./moveSectionUp";


// EventEmitter.on(events.bindEvents, bindEvents);
// EventEmitter.on(events.onDestroy, onDestroy);
//
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
}


import '../styles/index.css';

import * as utils from './utils'
import {EventEmitter} from './eventEmitter'
import {events} from './events.js';
import {scrollPage} from "./scrollPage";
import {doc} from "./constants";
import {scrollHandler} from "./scrollHandler";
import {moveSectionDown} from "./moveSectionDown";
import {moveSectionUp} from "./moveSectionUp";


// Функция для добавления обработчиков событий
function bindEvents() {
    // Заменяем utils.windowAddEvent на стандартный addEventListener
    window.addEventListener('scroll', scrollHandler);
    doc.body.addEventListener('scroll', scrollHandler);

    document.addEventListener('scrollOverflowScrolled', function(event) {
        let scrollSection = (event.detail.direction === 'down') ? moveSectionDown : moveSectionUp;
        scrollSection();
    });

    document.addEventListener('scrollPage', function(event) {
        scrollPage(event.detail.destination);
    });
}

function onDestroy() {
    window.removeEventListener('scroll', scrollHandler);
    doc.body.removeEventListener('scroll', scrollHandler);

    // Также очистите другие обработчики событий, если это необходимо
}

bindEvents();

// EventEmitter.on(events.bindEvents, bindEvents);
// EventEmitter.on(events.onDestroy, onDestroy);
//
// function onDestroy() {
//     utils.windowRemoveEvent('scroll', scrollHandler);
// }
//
// function bindEvents() {
//     console.log(utils)
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
//
// bindEvents()

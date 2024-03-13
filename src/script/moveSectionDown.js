import {getContainer, getOptions} from "./options.js";
import {getState} from "./state.js";
import {EventEmitter} from './eventEmitter.js';
import {FP} from './constants';
import {$body} from "./cache.js";
import {scrollPage} from "./scrollPage.js";
import {events} from "./events.js";

FP.moveSectionDown = moveSectionDown;

/**
 * Moves the page down one section.
 */
export function moveSectionDown() {
    var next = getState().activeSection.next();

    //looping to the top if there's no more sections below
    if (!next &&
        (getOptions().loopBottom || getOptions().continuousVertical)) {
        next = getState().sections[0];
    }

    if (next != null) {
        scrollPage(next, null, false);
    } else if (hasContentBeyondFullPage()) {
        EventEmitter.emit(events.scrollBeyondFullpage);
    }
}

function hasContentBeyondFullPage() {
    return getContainer().scrollHeight < $body.scrollHeight &&
        getOptions().scrollBar &&
        getOptions().scrollBeyondFullpage;
}
import * as utils from './utils.js';
import { getOptions } from "./options.js";
import { getState } from "./state.js";
import { FP } from './constants';
import { scrollPage } from './scrollPage.js';

FP.moveSectionUp = moveSectionUp;

/**
 * Moves the page up one section.
 */
export function moveSectionUp(){
    var prev = getState().activeSection.prev();

    //looping to the bottom if there's no more sections above
    if (!prev && (getOptions().loopTop || getOptions().continuousVertical)) {
        prev = utils.getLast(getState().sections);
    }

    if (prev != null) {
        scrollPage(prev, null, true);
    }
}
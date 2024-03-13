import * as utils from './utils';
import { doc, FP } from './constants.js';
import {getOptions} from './options';
import {getState, setState, state} from './state.js';
import {EventEmitter} from './eventEmitter.js';
import {events} from './events';
import {transformContainer} from "./transformContainer";
import {getScrollSettings} from "./utilsFP";

let g_afterSectionLoadsId;
let g_transitionLapseId;

export function scrollPage(section, callback, isMovementUp) {
    var element = section.item;
    if (element == null) return; // No element to scroll to

    var dtop = getDestinationPosition(element);
    var slideAnchorLink;
    var slideIndex;

    var v = {
        element: element,
        callback: callback,
        isMovementUp: isMovementUp,
        dtop: dtop,
        anchorLink: section.anchor,
        sectionIndex: section.index(),
        activeSlide: section.activeSlide ? section.activeSlide.item : null,
    };

    // Checking if the active section is the target section
    if (getState().activeSection.item === element && !getState().isResizing) {
        return;
    }

    // Updating classes and states
    utils.addClass(element, 'active');
    utils.removeClass(utils.siblings(element), 'active');

    setState({canScroll: false});


    performMovement(v);

    // After movement actions
    setTimeout(() => {
        setState({canScroll: true, lastScrolledDestiny: v.anchorLink});
        EventEmitter.emit(events.afterSectionLoads, v);

        if (typeof v.callback === 'function') {
            v.callback();
        }
    }, getOptions().scrollingSpeed || 400); // Use default scrolling speed or a custom one
}

function getDestinationPosition(element) {
    var elementHeight = element.offsetHeight;
    var elementTop = element.offsetTop;

    //top of the desination will be at the top of the viewport
    var position = elementTop;
    var isScrollingDown = elementTop > state.previousDestTop;
    var sectionBottom = position - utils.getWindowHeight() + elementHeight;
    var bigSectionsDestination = getOptions().bigSectionsDestination;

    //is the destination element bigger than the viewport?
    if (elementHeight > utils.getWindowHeight()) {
        //scrolling up?
        if (!isScrollingDown && !bigSectionsDestination || bigSectionsDestination === 'bottom') {
            position = sectionBottom;
        }
    }

    //sections equal or smaller than the viewport height && scrolling down? ||  is resizing and its in the last section
    else if (isScrollingDown || (state.isResizing && utils.next(element) == null)) {
        //The bottom of the destination will be at the bottom of the viewport
        position = sectionBottom;
    }

    /*
    Keeping record of the last scrolled position to determine the scrolling direction.
    No conventional methods can be used as the scroll bar might not be present
    AND the section might not be active if it is auto-height and didnt reach the middle
    of the viewport.
    */
    setState({previousDestTop: position});
    return position;
}

function performMovement(v) {
    var isFastSpeed = getOptions().scrollingSpeed < 700;
    var transitionLapse = isFastSpeed ? 700 : getOptions().scrollingSpeed;
    setState({
        touchDirection: 'none',
        scrollY: Math.round(v.dtop)
    });

    EventEmitter.emit(events.onPerformMovement);

    // using CSS3 translate functionality
    if (getOptions().css3 && getOptions().autoScrolling && !getOptions().scrollBar) {

        // The first section can have a negative value in iOS 10. Not quite sure why: -0.0142822265625
        // that's why we round it to 0.
        var translate3d = 'translate3d(0px, -' + Math.round(v.dtop) + 'px, 0px)';
        transformContainer(translate3d, true);

        //even when the scrollingSpeed is 0 there's a little delay, which might cause the
        //scrollingSpeed to change in case of using silentMoveTo();ç
        // if (getOptions().scrollingSpeed) {
        //     clearTimeout(g_afterSectionLoadsId);
        //     g_afterSectionLoadsId = setTimeout(function () {
        //         afterSectionLoads(v);
        //
        //         //disabling canScroll when using fastSpeed
        //         setState({canScroll: !isFastSpeed || FP.test.isTesting});
        //     }, getOptions().scrollingSpeed);
        // } else {
        //     afterSectionLoads(v);
        // }
    }

    // using JS to animate
    else {
        var scrollSettings = getScrollSettings(v.dtop);
        FP.test.top = -v.dtop + 'px';

        clearTimeout(g_afterSectionLoadsId);

        // scrollTo(scrollSettings.element, scrollSettings.options, getOptions().scrollingSpeed, function () {
        //     if (getOptions().scrollBar) {
        //
        //         /* Hack!
        //         The timeout prevents setting the most dominant section in the viewport as "active" when the user
        //         scrolled to a smaller section by using the mousewheel (auto scrolling) rather than draging the scroll bar.
        //
        //         When using scrollBar:true It seems like the scroll events still getting propagated even after the scrolling animation has finished.
        //         */
        //         g_afterSectionLoadsId = setTimeout(function () {
        //             afterSectionLoads(v);
        //         }, 30);
        //     } else {
        //
        //         afterSectionLoads(v);
        //
        //         //disabling canScroll when using fastSpeed
        //         setState({canScroll: !isFastSpeed || FP.test.isTesting});
        //     }
        // });
    }

    // enabling canScroll after the minimum transition laps
    if (isFastSpeed) {
        clearTimeout(g_transitionLapseId);
        g_transitionLapseId = setTimeout(function () {
            setState({canScroll: true});
        }, transitionLapse);
    }
}

EventEmitter.on(events.onDestroy, () => {
    clearTimeout(g_afterSectionLoadsId);
    clearTimeout(g_transitionLapseId);
});

import * as utils from './utils.js';

export let $body = null;
export let $html = null;
export let $htmlBody = null;

export function setCache() {
    $body = document.querySelector('body');
    $html = document.querySelector('html');
    $htmlBody = document.querySelectorAll('html, body');
}

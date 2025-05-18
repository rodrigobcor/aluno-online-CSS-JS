// Não está sendo utilizada. Mover depois para um projeto próprio de reutilização.
/**
 * Fonte: adaptado de https://gomakethings.com/converting-the-jquery-next-method-to-vanilla-js/
 */
var next = function (elem, selector) {
  // Get the next element
  var nextElem = elem.nextElementSibling;
  // If there's no selector, return the next element
  if (!selector) {
    return nextElem;
  }
  // Otherwise, check if the element matches the selector
  if (nextElem && nextElem.matches(selector)) {
    return nextElem;
  }
  // if it's not a match, return null
  return null;
};

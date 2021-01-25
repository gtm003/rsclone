const createElement = (tagName, classList, attributes, textContent) => {
  // tagName - string
  // classList - array of string
  // attributes - object
  // dataAttributes - object - пока без дата-атрибутов
  // textContent - string

  classList = Array.isArray(classList) ?  classList : false;
  attributes = typeof attributes !== undefined ? attributes : false;
  textContent = typeof textContent === 'string' ? textContent : false;

  const element = document.createElement(tagName);
  if (classList) classList.forEach(item => element.classList.add(item));
  if (attributes) {
    for (let prop in attributes) {
      element.setAttribute(prop, attributes[prop])
    }
  }
  if (textContent) element.textContent = textContent;

  return element;
}

export {createElement};

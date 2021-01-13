//import {ToolsTop} from './ToolsTop';
//import {ToolsBottom} from './ToolsBottom';
import { SVG, extend as SVGextend, Element as SVGElement } from '../../vendor/svg.js';

import { Controller } from "../controllers/Controller";

const toolsBottomBtnName = ['red', 'green', 'blue'];
const toolsLeftBtnName = ['select', 'rect', 'circle', 'line', 'polyline', 'text', 'path', 'color'];

export class appView {
    constructor(rootElement) {
      this.rootElement = rootElement;
      this.headerElement = null;
      this.headerContainer = null;
      this.footerElement = null;
      this.footerContainer = null;
      this.contentElement = null;
      this.contentContainer = null;

      this.toolsTopContainer = null;
      this.toolsBottomContainer = null;
      this.toolsLeftContainer = null;
      this.workAreaContainer = null;
      this.menuContainer = null;
      this.functionalAreaContainer = null;
      
      this.sheet = null;
    }
  
    init() {
      const wrapper = this.createWrapper();
      this.renderHeader();
      this.renderContent();
      this.renderFooter();
      this.rootElement.appendChild(wrapper);
      wrapper.append(this.headerElement, this.contentElement, this.footerElement);
      
      const controller = new Controller(this, this.sheet);
      controller.init();
    }

    sendMessage() {
      console.log('privet');
    }

    createMenuContainer() {
      const menuContainer = document.createElement('div');
      menuContainer.classList.add('tools-top__menu-area');

      return menuContainer;
    }

    createFunctionalArea() {
      const functionalArea = document.createElement('div');
      functionalArea.classList.add('tools-top__functional-area');

      return functionalArea;
    }

    createToolsTop() {
      const toolsTop = document.createElement('div');
      toolsTop.classList.add('tools-top');
      this.menuContainer = this.createMenuContainer();
      this.functionalAreaContainer = this.createFunctionalArea();
      toolsTop.append(this.menuContainer, this.functionalAreaContainer);

      return toolsTop;
    }

    createWorkArea() {
      const workAreaContainer = document.createElement('div');
      workAreaContainer.className = 'work-area';

      const field = document.createElement('div');
      field.id = 'field';
      workAreaContainer.append(field);

      this.sheet = document.createElement('div');
      this.sheet.className = 'sheet';
      field.append(this.sheet);

      return workAreaContainer;
    }

    createToolsBottom() {
      const toolsBottomContainer = document.createElement('div');
      toolsBottomContainer.className = 'tools-bottom';

      toolsBottomBtnName.forEach((item) => {
          let btn = document.createElement('button');
          btn.id = `${item}`;
          btn.style.background = item;
          toolsBottomContainer.append(btn);
      })

      return toolsBottomContainer;
    }

    createToolsLeft() {
      const toolsLeftContainer = document.createElement('div');
      toolsLeftContainer.className = 'tools-left';

      toolsLeftBtnName.forEach((item) => {
        let btn = document.createElement('button');
        btn.id = `${item}`;
        btn.innerHTML = item;
        toolsLeftContainer.append(btn);
      })

      return toolsLeftContainer;
    }
  
    createWrapper() {
      const wrapper = document.createElement('div');
      wrapper.classList.add('wrapper');
      return wrapper;
    }
  

    renderHeader() {
      this.headerElement = document.createElement('header');
      this.headerElement.classList.add('header');
      this.headerContainer = document.createElement('div');
      this.headerContainer.classList.add('container');
      this.headerContainer.textContent = 'SVG EDITOR';
      this.headerElement.appendChild(this.headerContainer);
    }
  
    renderContent() {
      this.toolsTopContainer = this.createToolsTop();
      this.toolsBottomContainer = this.createToolsBottom();
      this.toolsLeftContainer = this.createToolsLeft();
      this.workAreaContainer = this.createWorkArea();

      this.contentElement = document.createElement('main');
      this.contentElement.classList.add('main');
      this.contentContainer = document.createElement('div');
      this.contentContainer.classList.add('container');
      this.contentElement.appendChild(this.contentContainer);
  
      this.toolsRightContainer = document.createElement('div');

      this.toolsRightContainer.className = 'tools-right';

      this.contentContainer.append(this.toolsTopContainer, this.toolsLeftContainer, this.toolsRightContainer, this.toolsBottomContainer, this.workAreaContainer);
    }
  
    renderFooter() {
      const yearSpan = document.createElement('span');
      yearSpan.classList.add('copyright__year');
      yearSpan.textContent = '2020 ©';
  
      const by = document.createElement ('span');
      by.textContent = 'by';
  
      const student1Link = document.createElement('a');
      student1Link.classList.add('copyright__student-link');
      student1Link.setAttribute('href', 'https://github.com/alexk08');
      student1Link.setAttribute('target', '__blank');
      student1Link.textContent = 'Aleksandr Krasinikov';
  
      const student2Link = document.createElement('a');
      student2Link.classList.add('copyright__student-link');
      student2Link.setAttribute('href', 'https://github.com/11alexey11');
      student2Link.setAttribute('target', '__blank');
      student2Link.textContent = 'Alexey Yanvarev';
  
      const student3Link = document.createElement('a');
      student3Link.classList.add('copyright__student-link');
      student3Link.setAttribute('href', 'https://github.com/gtm003');
      student3Link.setAttribute('target', '__blank');
      student3Link.textContent = 'Tatyana Grigorovich';
  
      const logo = document.createElement('img');
      logo.classList.add('copyright__logo-rs');
      logo.setAttribute('src', 'img/svg/rs_school_js.svg');
      logo.setAttribute('alt', 'Logo RS School');
      logo.setAttribute('width', '100px');
  
      const courseLink = document.createElement('a');
      courseLink.classList.add('copyright__course-link');
      courseLink.setAttribute('href', 'https://rs.school/js/');
      courseLink.setAttribute('target', '__blank');
      courseLink.appendChild(logo);
  
      const copyrightElement = document.createElement('div');
      copyrightElement.classList.add('copyright');
      copyrightElement.append(yearSpan, by, student1Link, student2Link, student3Link, courseLink);

      this.footerElement = document.createElement('footer');
      this.footerElement.classList.add('footer');
      this.footerContainer = document.createElement('div');
      this.footerContainer.classList.add('container');
      this.footerContainer.append(copyrightElement);
      this.footerElement.appendChild(this.footerContainer);
    }
}


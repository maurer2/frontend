import _ from 'lodash';
import './style.css';
import './style-postcss.css';
import test from './typescript.ts';

function component() {
    const t = new test();
    let element = document.createElement('div');

    element.innerHTML = _.join(['Test', t.className], ' ');
    element.classList.add('test');

    return element;
}

document.body.appendChild(component());
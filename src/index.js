import Character from './character';
import {envVar} from './config/node.env';

import {getRandomCharacters} from './services/characters.service';



const somebodySayHello = () => {
    const character = new Character(getRandomCharacters());
    document.getElementById('hello-area').innerText = character.sayHello();
};

window.somebodySayHello = somebodySayHello;

document.getElementById('version').innerText = envVar.NODE_ENV;


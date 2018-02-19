import Character from './character';

import {getRandomCharacters} from './services/characters.service';



const somebodySayHello = () => {
    const character = new Character(getRandomCharacters());
    document.getElementById('hello-area').innerText = character.sayHello();
};

window.somebodySayHello = somebodySayHello;
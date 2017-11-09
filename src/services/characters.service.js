import {characters} from '../config/characters';

export const getRandomCharacters = () => characters[randomNumber(0, characters.length -1 )];

const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
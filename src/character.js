export default class Character {

    constructor({first_name, last_name}) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.helloWord = 'Hello';
    }

    sayHello() {
        const {first_name,last_name} = this;
        return `${this.helloWord} ${this.first_name}`;
    }

}
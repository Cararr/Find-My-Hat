const prompt = require('prompt-sync')({ sigint: true });
const term = require('terminal-kit').terminal;
let shouldContinue = true;
const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

function randomFieldGenerator(length, height, difficult) {
	let arrayField = [];
	for (let i = 0; i < height; i++) {
		let secondDimensArray = [];
		for (let k = 0; k < length; k++) {
			Math.random() > difficult
				? (secondDimensArray[k] = fieldCharacter)
				: (secondDimensArray[k] = hole);
		}
		arrayField.push(secondDimensArray);
	}
	arrayField[Math.floor(Math.random() * (height - 1)) + 1][
		Math.floor(Math.random() * (length - 1)) + 1
	] = hat;
	arrayField[0][0] = pathCharacter;
	return arrayField;
}

class Field {
	constructor(fieldArrary) {
		this._fieldArrary = fieldArrary;
		this._currentX = 0;
		this._currentY = 0;
	}
	get fieldArrary() {
		return this._fieldArrary;
	}
	get currentX() {
		return this._currentX;
	}
	get currentY() {
		return this._currentY;
	}
	moveTop() {
		this._currentY -= 1;
	}
	moveDown() {
		this._currentY += 1;
	}
	moveLeft() {
		this._currentX -= 1;
	}
	moveRight() {
		this._currentX += 1;
	}
	logField() {
		for (let i = 0; i < this._fieldArrary.length; i++) {
			console.log(this._fieldArrary[i].join(''));
		}
	}
	makeMove(move) {
		move.toLowerCase();
		switch (move) {
			case 't':
				this.moveTop();
				break;
			case 'd':
				this.moveDown();
				break;
			case 'l':
				this.moveLeft();
				break;
			case 'r':
				this.moveRight();
				break;
			default:
				console.log(
					`wrong input! must be: 'd' for down, 't' for top, 'r' for right or 'l' for left`
				);
				return;
		}
		if (
			this.currentY < 0 ||
			this.currentX < 0 ||
			this.currentX > this.fieldArrary[0].length - 1 ||
			this.currentY > this.fieldArrary.length - 1
		) {
			term.red(
				'Where are you going soldier? you have left the battlefield! Game Over.\n'
			);
			shouldContinue = false;
		} else if (this._fieldArrary[this.currentY][this.currentX] === hole) {
			term.red('you fell into a hole...GAME OVER\n');
			shouldContinue = false;
		} else if (this._fieldArrary[this.currentY][this.currentX] === hat) {
			console.clear();
			this._fieldArrary[this.currentY][this.currentX] = '!';
			this.logField();
			term.green('You won!\n');
			shouldContinue = false;
		} else {
			this._fieldArrary[this.currentY][this.currentX] = pathCharacter;
			console.clear();
			this.logField();
		}
	}
}
let x = prompt('How wide should be the map? 1-100(default will be 15): ');
let y = prompt('How high should be the map? 1-35(default will be 10): ');
let diff = prompt('How hard should it be? .1 - .5(default will be .2): ');
if (x === '') x = 15;
if (y === '') y = 10;
if (diff === '') diff = 0.2;
const gameField = new Field(randomFieldGenerator(x, y, diff));
gameField.logField();
term.blue(`type 'd' for down, 't' for top, 'r' for right or 'l' for left \n`);
while (shouldContinue) {
	const playerMove = prompt(`What's your next move? `);
	gameField.makeMove(playerMove);
}

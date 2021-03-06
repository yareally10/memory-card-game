const Card = props => (
	<div 
		className={props.matched || props.clicked ? 'card ' + props.type : 'card X'}
		id={'card' + props.id}
		onClick={() => props.click(props.id)}
	>
		<span>{props.matched || props.clicked ? props.type : 'X'}</span>
	</div>
);

class Game extends React.Component {
	constructor(props) {
		super(props);

		this.hasWon = false;
		this.numColumns = 4;
		this.numRows = 4;
		this.numCards = this.numColumns * this.numRows;

		this.state = {
			cards: this.initCards(this.numCards),
			cardPicked: null,
			score: 0,
			columns: this.numColumns,
			cardsRemain: this.numCards
		};

		this.click = this.click.bind(this)

		document.documentElement.style.setProperty("--colNum", this.numColumns);
		document.documentElement.style.setProperty("--rowNum", this.numRows);
	}

	reset() {
		this.numColumns = this.state.columns;
		this.numCards = this.numColumns * this.numRows;
		this.hasWon = false;

		this.setState({
			cards: this.initCards(this.numCards),
			cardPicked: null,
			score: 0,
			cardsRemain: this.numCards
		});

		document.documentElement.style.setProperty("--colNum", this.numColumns);
		document.documentElement.style.setProperty("--rowNum", this.numRows);
	}

	handleColumnChange({target}) {
		let val = parseInt(target.value);
		if (isNaN(val) || val <= 0) {
			val = 4;
		}
		this.setState({columns: val});
	}

	click(id) {
		const currCard = this.state.cards[id];
		//console.log(currCard);

		//validate input
		if (currCard.matched || currCard.clicked) {
			return;
		}

		//show current card
		this.showCard(currCard);

		//check current card
		if (this.state.cardPicked === null) {
			this.setState({cardPicked: currCard});
		} else {
			if (currCard.type === this.state.cardPicked.type) {
				const newState = {
					cards: this.cardsMatched(this.state.cardPicked, currCard),
					score: this.state.score + 1,
					cardsRemain: this.state.cardsRemain - 2,
					cardPicked: null
				}
				this.hasWon = newState.cardsRemain === 0;
				this.setState(newState);
			} else {
				//wait half a second to hide cards
				setTimeout(() => {
						const newState = {
							cards: this.hideCards(this.state.cardPicked, currCard),
							score: this.state.score + 1,
							cardPicked: null
						}
						this.setState(newState);
					}, 
					500
				);
			}
		}
	}

	showCard(card) {
		const newCards = this.state.cards.slice();
		newCards[card.id].clicked = true;
		this.setState({cards: newCards});
	}

	hideCards(card1, card2) {
		const newCards = this.state.cards.slice();
		newCards[card1.id].clicked = false;
		newCards[card2.id].clicked = false;
		return newCards;
	}

	cardsMatched(card1, card2) {
		const newCards = this.state.cards.slice();
		newCards[card1.id].matched = true;
		newCards[card2.id].matched = true;
		return newCards;
	}

	initCards(num) {
		const possibleCards = ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
					cards = [];
		for(let i=0; i<num; i+=2) {
			let card1 = {}, 
					card2 = {}, 
					type = Math.floor(Math.random()*possibleCards.length);
			card1.type = possibleCards[type];
			card1.matched = false;
			card1.clicked = false;
			card2.type = possibleCards[type];
			card2.matched = false;
			card2.clicked = false;
			card1.id = i;
			card2.id = i+1;
			cards.push(card1);
			cards.push(card2);
		}
		return this.randomizeCards(cards);
	}

	//shuffle cards 100 times
	randomizeCards(cards) {
		for(let i=0; i<100; i++) {
			let index1 = Math.floor(Math.random()*cards.length),
					index2 = Math.floor(Math.random()*cards.length),
					temp;
			temp = cards[index1];
			cards[index1] = cards[index2];
			cards[index2] = temp;
			cards[index1].id = index1;
			cards[index2].id = index2;
		}
		return cards;
	}

	render() {
		const cards = this.state.cards.map(card => {
						return (
							<Card 
							  click={this.click} 
							  id={card.id} 
							  key={card.id} 
							  type={card.type} 
							  matched={card.matched}
							  clicked={card.clicked}
							 />
						)
					});

		return (
			<div className="container">
				<h1>Welcome to card memory game!</h1>
				<h1>Moves: {this.state.score}</h1>
				<h1>{this.hasWon ? 'You have won!' : ''}</h1>
				<div>
					<span>Columns: </span>
					<input type="text" value={this.state.columns} onChange={() => this.handleColumnChange(event)}/>
					<button onClick={() => this.reset()}>reset</button>
				</div>
				<div className="cardsContainer">
					{cards}
				</div>
			</div>
		)
	}
}

ReactDOM.render(<Game />, document.getElementById("root"));

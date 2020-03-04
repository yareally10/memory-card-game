const Card = props => (
	<div 
		className={props.matched || props.clicked ? 'card ' + props.type : 'card X'}
		id={'card ' + props.id}
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
		let cards = this.initCards(this.numCards);

		this.state = {
			cards: cards,
			cardPicked: null,
			score: 0,
			columns: this.numColumns,
			cardsRemain: this.numCards
		};

		this.click = this.click.bind(this)
	}

	reset() {
		this.numColumns = this.state.columns;
		this.numCards = this.numColumns * this.numRows;
		let cards = this.initCards(this.numCards);

		this.hasWon = false;

		this.setState({
			cards: cards,
			cardPicked: null,
			score: 0,
			columns: this.numColumns,
			cardsRemain: this.numCards
		});

		document.documentElement.style.setProperty("--colNum", this.numColumns);
		document.documentElement.style.setProperty("--rowNum", this.numRows);
	}

	handleColumnChange({target}) {
		let val = target.value;
		this.setState({columns: val});
	}

	click(id) {
		const currCard = this.state.cards[id];
		//console.log(currCard);

		//validate input
		if (currCard.matched || (this.state.cardPicked != null && currCard.id === this.state.cardPicked.id)) {
			return;
		}
		this.showCard(currCard);

		if (this.state.cardPicked == null) {
			this.setState({cardPicked: currCard});
		} else {
			let newScore = this.state.score;
			newScore++;
			if (currCard.type === this.state.cardPicked.type) {
				const newCards = this.cardMatched(this.state.cardPicked, currCard);
				let newCardsRemain = this.state.cardsRemain;
				newCardsRemain -= 2;
				this.hasWon = newCardsRemain === 0;
				this.setState({cards: newCards, score: newScore, cardsRemain: newCardsRemain, cardPicked: null});
			} else {
				setTimeout(() => {
						this.hideCards(this.state.cardPicked, currCard);
						this.setState({cardPicked: null, score: newScore});
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
		this.setState({cards: newCards});
	}

	cardMatched(card1, card2) {
		const newCards = this.state.cards.slice();
		newCards[card1.id].matched = true;
		newCards[card2.id].matched = true;
		return newCards;
	}

	initCards(num) {
		const possibleCards = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
		const cards = [];
		for(let i=0; i<num; i+=2) {
			let card1 = {}, card2 = {}, temp = Math.floor(Math.random()*possibleCards.length);
			card1.type = possibleCards[temp];
			card1.matched = false;
			card1.clicked = false;
			card2.type = possibleCards[temp];
			card2.matched = false;
			card2.clicked = false;
			cards.push(card1);
			cards.push(card2);
		}

		return this.randomizeCards(cards);
	}

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
					<span>Size</span><input type="text" value={this.state.columns} onChange={() => this.handleColumnChange(event)}/>
				</div>
				<button onClick={() => this.reset()}>reset</button>
				<div className="cardsContainer">
					{cards}
				</div>
			</div>
		)
	}
}

ReactDOM.render(<Game />, document.getElementById("root"));

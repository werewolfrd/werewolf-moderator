import React, {cloneElement} from 'react';
import { browserHistory } from 'react-router';
import werewolfService from '../services/werewolf';

const DEFAULT_GAME_MODE = 'balanced';

export default class Wizard extends React.Component {
  constructor(){
    super();
    this.state = {
      players: 0,
      currentDeck: 'basic', //todo: proper initialization with deck ' * '
      currentCards: werewolfService.getCardsInDeck('basic'), // same as ^
      mode: DEFAULT_GAME_MODE,
    };
  }

  componentWillMount() {
    this.setCurrentDeck(this.state.currentDeck);
  }

  setPlayers(players) {
    this.setState(Object.assign({}, this.state, {players}));
  }

  setCurrentDeck(currentDeck) {
    const currentCards = werewolfService.getCardsInDeck(currentDeck)
    .map(c => {
      return {
        key: c.key,
        visible: werewolfService.isInDeck(c.key, currentDeck),
        value: 1,
      }
    });

    this.setState(Object.assign({}, this.state, {currentDeck}, {currentCards}));
  }

  setCardVisibility(cardKey, visible) {
    const currentCards = this.state.currentCards;
    
    if(visible) {
      const card = werewolfService.getCards().find(c => c.key === cardKey);
      card.visible = true;
      card.value = 1;
      currentCards.push(card);
    }
    else {
      const cardIndex = currentCards.findIndex(c => c.key === cardKey);
      currentCards.splice(cardIndex, 1);
    }

    this.setState(Object.assign({}, this.state, {currentCards}, {currentDeck: 'custom'}));
  }

  changeCardValue(cardKey, value) {
    const currentCards = this.state.currentCards;
    const cardIndex = currentCards.findIndex(c => c.key === cardKey);

    currentCards[cardIndex].value = value;

    this.setState(Object.assign({}, this.state, {currentCards}, {currentDeck: 'custom'}));
  }

  getDecks() {
    return Object.keys(werewolfService.getDecks());
  }

  getCardsInGame() {
    return this.state.currentCards;
  }
  
  startGame(mode = DEFAULT_GAME_MODE) {
    this.setState(Object.assign({}, this.state, {mode}));
    localStorage.setItem('currentState', JSON.stringify(this.state));
    browserHistory.push('/game');
  }

  render() {
    return(
      <div>
        {
          this.props.children && 
          cloneElement(this.props.children, { 
            setPlayers: this.setPlayers.bind(this),
            setCurrentDeck: this.setCurrentDeck.bind(this),
            setCardVisibility: this.setCardVisibility.bind(this),
            getDecks: this.getDecks.bind(this),
            getAllCards: werewolfService.getCards.bind(this),
            getCardsInGame: this.getCardsInGame.bind(this),
            changeCardValue: this.changeCardValue.bind(this),
            startGame: this.startGame.bind(this),
            state: this.state,
            })
        }
      </div>
    );
  }
}
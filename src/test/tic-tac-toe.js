import React, { Component } from 'react';
import './tic-tac-toe.css';

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    var rows = [];
    for (var i=0; i<3 ; i++){
      var row = [];
      for (var j=3*i; j<3*i+3;j++){
        row.push(this.renderSquare(j));
      }
      rows.push(<div className="board-row" key={i}>{row}</div>)
    }
    return (
      <div>{rows}</div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        lastStep: 'Game start'
      }],
      xIsNext: true,
      stepNumber: 0,
      isReverse: false,
    };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const location = '(' + (parseInt(i / 3) + 1) + ',' + (parseInt(i % 3) + 1) + ')';
    const desc = squares[i] + ' move to ' + location;
    this.setState({
      history: history.concat([{
        squares: squares,
        lastStep: desc
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length
    });
  }
  reverseHistory(){
    let lastStep = this.state.history[this.state.stepNumber].lastStep;    
    this.setState({
      isReverse:!this.state.isReverse,
    })
    this.state.history.reverse();
    for (var i = 0; i < this.state.history.length; i++) {
      if(this.state.history[i].lastStep == lastStep)
        this.jumpTo(i);
        this.jumpTo(i);
    }
  }  
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
    });
  }
  render() {
    let history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    
    const moves = history.map((step,move) => {
     const desc = step.lastStep;
      if (move == this.state.stepNumber) {
        return (
          <li key={move}>
            <a href="#" onClick={() => this.jumpTo(move)}><strong>{desc}</strong></a>
         </li>
        );
      }
      return (
        <li key={move}>
          <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
         </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.reverseHistory()}>Reverse</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

export default App;

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.json());

app.use(express.static( __dirname + '/../public/dist/public' ));

mongoose.connect('mongodb://localhost/ninjagold');
mongoose.Promise = global.Promise;

const GameSchema = new mongoose.Schema({
  totalGold: {type: Number, default: 0},
  gameLog: {type: [String], default: []},
  leaderBoard: {type: [Number], default: []}
})

mongoose.model('Game', GameSchema);
const Game = mongoose.model('Game')

app.get('/game', (req, res) => {
  Game.findOne().then(game => {
    if (!game) {
      res.redirect('/game/new')
      return;
    }
    res.json({status: "success", result: game})
  }).catch(err => {
    res.json({status: "error", result: err})
  })
})

app.get('/game/new', (req, res) => {
  const game = new Game();
  game.save().then(game => {
    res.json({status: "success", result: game})
  }).catch(err => {
    res.json({status: "error", result: err})
  })
})

app.get('/game/reset', (req, res) => {
  let resetData = {
    totalGold: 0,
    gameLog: [],
    leaderBoard: []
  }
  Game.findOneAndUpdate({}, resetData).then(game => {
    res.json({status: "success", result: game})
  }).catch(err => {
    res.json({status: "error", result: err})
  })
})

app.post('/game', (req, res) => {
  console.log(req.body)
  Game.findOneAndUpdate({}, req.body).then(game => {
    res.json({status: "success", result: game})
  }).catch(err => {
    res.json({status: "error", result: err})
  })
})

app.listen(8000, () => {
  console.log("LISTENING AT PORT 8000");
})
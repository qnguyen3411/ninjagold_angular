import { OnInit, Component } from '@angular/core';
import { HttpService } from './http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'public';
  totalGold = 0;
  gameLog = [];
  leaderBoard:Array<number> = [];
  goldLocations = [
    new GoldLocation("Farm", 2, 5),
    new GoldLocation("Cave", 5, 10),
    new GoldLocation("House", 7, 15),
    new GoldLocation("Casino", -100, 100, "Earn of lose up to 100 gold")
  ]
  
  constructor(private _httpService: HttpService){}

  ngOnInit(){
    this.getGameData()
  }

  getGameData(){
    const observable = this._httpService.getGame();
    observable.subscribe(response => {
      if (response['status'] == "success") {
        this.initializeGameWithData(response['result'])
      }
    })
  }

  initializeGameWithData(data) {
    this.totalGold = data['totalGold'];
    this.gameLog = data['gameLog'];
    this.leaderBoard = data['leaderBoard'] as Array<number>;
  }

  saveGame() {
    const data = {
      "totalGold": this.totalGold,
      "gameLog": this.gameLog,
      "leaderBoard": this.leaderBoard
    }
    const observable = this._httpService.postToServer(data)
    observable.subscribe(response => {
      console.log(response)
    })
  }

  resetGame() {
    this.totalGold = 0;
    this.gameLog = [];
    this.leaderBoard = [];
    const observable = this._httpService.resetGame();
    observable.subscribe();
  }

  getGoldOutcome(location: GoldLocation) {
    const goldResult = location.rollForGold(this.totalGold);
    this.totalGold += goldResult;
    this.gameLog.unshift(`You entered the ${location.name} and ${goldResult < 0 ? "lost" : "gained"} ${Math.abs(goldResult)} gold.`);
    this.updateLeaderboard();
  }

  updateLeaderboard() {
    if(this.leaderBoard.length < 5) {
      this.leaderBoard.push(this.totalGold);
      this.leaderBoard.sort((a, b) => a > b ? -1 : 1);
      return;
    }
    if (this.totalGold > this.leaderBoard[this.leaderBoard.length - 1]) {
      this.leaderBoard.pop();
      this.leaderBoard.push(this.totalGold);
      this.leaderBoard.sort((a, b) => a > b ? -1 : 1);
    }
  }

}

class GoldLocation {
  name: string;
  minGold: number;
  maxGold: number;
  description: string;
  constructor(name: string, minGold: number, maxGold: number, description: string=null){
    this.name = name;
    this.minGold = minGold;
    this.maxGold = maxGold;
    this.description = description || `Earns ${minGold}-${maxGold} gold`;
  }

  rollForGold(currGold) {
    let goldRoll = Math.trunc(Math.random() * (this.maxGold - this.minGold)) + this.minGold;
    const goldResult = (currGold + goldRoll < 0) ? (currGold * -1) : goldRoll;
    return goldResult;
  }
}
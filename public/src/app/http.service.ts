import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private _http: HttpClient){}

  getGame() {
    return this._http.get('/game')
  }

  resetGame() {
    return this._http.get('/game/reset')
  }

  postToServer(data) {
    return this._http.post('/game', data);
  }

}

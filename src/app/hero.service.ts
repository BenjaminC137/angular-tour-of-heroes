import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root',
})
export class HeroService {

	private heroesUrl = 'api/heroes';



  constructor(
	private http: HttpClient,
	private messageService: MessageService) { }

  getHeroes(): Observable<Hero[]> {
    // TODO: send the message _after_ fetching the heroes
	  this.log('fetched heroes');
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      catchError(this.handleError('getHeroes', []))
    );
  }

	getHero(id: number): Observable<Hero> {
  // TODO: send the message _after_ fetching the hero
		this.log(`fetched hero id=${id}`)
  return of(HEROES.find(hero => hero.id === id));
}

	private log(message: string) {
  		this.messageService.add(`HeroService: ${message}`);
	}


	/** PUT: update the hero on the server */
updateHero (hero: Hero): Observable<any> {
  return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
    tap(_ => this.log(`updated hero id=${hero.id}`)),
    catchError(this.handleError<any>('updateHero'))
  );
}

	private handleError<T> (operation = 'operation', result?: T) {
  		return (error: any): Observable<T> => {
			console.error(error);
			this.log(`${operation} failed: ${error.message}`);
			return of(result as T);
		};
	}
}

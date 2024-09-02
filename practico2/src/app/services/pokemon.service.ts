import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Pokemon } from 'src/models/pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon/';
  private team: Pokemon[] = [];
  constructor(private http: HttpClient) { }

  getPokemon(id: number) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  }

  getPokemonDetails(pokemonId: string) {
    return this.http.get<any>(`${this.apiUrl}${pokemonId}`);
  }

  getPokemonTypes(id: number) {
    return this.http.get<any>(`${this.apiUrl}${id}`).pipe(
      map((data: any) => data.types.map((type: any) => type.type.name))
    );
  }

  getPokemonAbilities(id: number) {
    return this.http.get<any>(`${this.apiUrl}${id}`).pipe(
      map((data: any) => data.abilities.map((ability: any) => ability.ability.name))
    );
  }

  getPokemonStats(id: number) {
    return this.http.get<any>(`${this.apiUrl}${id}`).pipe(
      map((data: any) => data.stats.map((stat: any) => ({ name: stat.stat.name, base_stat: stat.base_stat })))
    );
  }

  getPokemonMoves(id: number) {
    return this.http.get<any>(`${this.apiUrl}${id}`).pipe(
      map((data: any) => data.moves.map((move: any) => move.move.name))
    );
  }

  addToTeam(pokemon: Pokemon) {
    console.log('Adding to team:', pokemon);
    this.team.push(pokemon);

  }

  getTeam(): Pokemon[] {
    return this.team;
  }

  getItem(itemId: number) {
    return this.http.get<any>(`${this.apiUrl}${itemId}`);
  }
}
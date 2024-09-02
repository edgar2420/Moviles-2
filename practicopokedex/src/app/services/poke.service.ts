import { Injectable } from '@angular/core';
import { Pokemon } from '../models/Pokemon';
import { HttpClient } from '@angular/common/http';
import { Pokedex } from '../models/Pokedex';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { PokemonWeaknesses } from '../models/PokemonWeaknesses';
import { switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokeService {

  constructor(private http: HttpClient) { }
  getListaPokemon() {
    return this.http.get<Pokedex>('https://pokeapi.co/api/v2/pokemon?limit=200');
  }

  getPokemonIndividual(url: string) {
    return this.http.get<Pokemon>(url);
  }

  getWeaknesses(url: string) {
    return this.http.get<PokemonWeaknesses>(url);
  }

  getPokemonGeneration(pokemon: Pokemon): Observable<string> {
    return this.http.get(pokemon.species.url).pipe(
      switchMap((species: any) => {
        return this.http.get(species.generation.url).pipe(
          map((generation: any) => {
            return generation.name;
          }));
      }));
  }

  getPokemonById(pokemonId: string) {
    return this.http.get<Pokemon>('https://pokeapi.co/api/v2/pokemon/' + pokemonId);
  }

  getPokemonData(id: string) {
    return this.http.get<Pokemon>('https://pokeapi.co/api/v2/pokemon/' + id);
  }

  getPokemonSpeciesData(speciesUrl: string) {
    return this.http.get(speciesUrl);
  }

  getEvolutionChainData(evolutionChainUrl: string) {
    return this.http.get(evolutionChainUrl);
  }

  getPokemonEvolutionChain(pokemon: Pokemon): Observable<any> {
    return this.http.get(pokemon.species.url).pipe(
      switchMap((species: any) => {
        return this.http.get(species.evolution_chain.url);
      }));
  }
  





  

  // Función para obtener la generación de un pokémon
  // async getPokemonGeneration(pokemonUrl: string) {
  //   const data = await this.http.get(pokemonUrl).toPromise();
  //   const speciesUrl = data['species']['url'];
  //   const speciesData = await this.http.get(speciesUrl).toPromise();
  //   const generationUrl = speciesData['generation']['url'];
  //   const generationData = await this.http.get(generationUrl).toPromise();
  //   return generationData['name'];
  // }
}



import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PokemonService } from 'src/app/services/pokemon.service';


@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.page.html',
  styleUrls: ['./pokemon.page.scss'],
})
export class PokemonPage implements OnInit {
  pokemons: any[] = [];
  filteredPokemons: any[] = []; 

  constructor(private pokemonService: PokemonService, private router: Router) { }

  ngOnInit() {
    this.loadPokemonDetails();
  }

  loadPokemonDetails() {
    for (let i = 1; i <= 105; i++) {
      this.pokemonService.getPokemonDetails(i.toString()).subscribe((data) => {
        const pokemon = {
          id: data.id,
          name: data.name,
          types: data.types.map((type: any) => type.type.name),
          abilities: data.abilities.map((ability: any) => ability.ability.name),
          stats: {
            hp: data.stats.find((stat: any) => stat.stat.name === 'hp').base_stat,
            atk: data.stats.find((stat: any) => stat.stat.name === 'attack').base_stat,
            def: data.stats.find((stat: any) => stat.stat.name === 'defense').base_stat,
            spa: data.stats.find((stat: any) => stat.stat.name === 'special-attack').base_stat,
            spd: data.stats.find((stat: any) => stat.stat.name === 'special-defense').base_stat,
            bst: data.stats.reduce((total: number, stat: any) => total + stat.base_stat, 0)
          }
        };
        this.pokemons.push(pokemon);
      });
    }
    this.filteredPokemons = this.pokemons;
  }

  searchPokemon(keyword: string | null | undefined) {
    if (keyword) {
      this.filteredPokemons = this.pokemons.filter(pokemon =>
        pokemon.name.toLowerCase().includes(keyword.toLowerCase())
      );
    } else {
      this.filteredPokemons = this.pokemons;
    }
  }

  getPokemonImageUrl(id: number) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  }

  getBackgroundColor(type: string): string {
    switch(type) {
      case 'normal':
        return '#A8A77A';
      case 'fire':
        return '#EE8130';
      case 'water':
        return '#6390F0';
      case 'electric':
        return '#F7D02C';
      case 'grass':
        return '#7AC74C';
      case 'ice':
        return '#96D9D6';
      case 'fighting':
        return '#C22E28';
      case 'poison':
        return '#A33EA1';
      case 'ground':
        return '#E2BF65';
      case 'flying':
        return '#A98FF3';
      case 'psychic':
        return '#F95587';
      case 'bug':
        return '#A6B91A';
      case 'rock':
        return '#B6A136';
      case 'ghost':
        return '#735797';
      case 'dragon':
        return '#6F35FC';
      case 'dark':
        return '#705746';
      case 'steel':
        return '#B7B7CE';
      case 'fairy':
        return '#D685AD';
      default:
        return '#ffffff'; 
    }
  }

  agregarteam(pokemon: any) {
    if (pokemon && pokemon.id !== undefined) {
      this.router.navigate(['/agregarteam', pokemon.id]);
    } else {
      console.error('ID de Pokémon no definido:', pokemon);
    }
}
}

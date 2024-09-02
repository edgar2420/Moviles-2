import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { PokeService } from 'src/app/services/poke.service';
import { Pokemon } from 'src/app/models/Pokemon';
import { HttpClientModule } from '@angular/common/http';
import { Type } from '../../models/Pokemon';

@Component({
  selector: 'app-detallepokemon',
  templateUrl: './detallepokemon.page.html',
  styleUrls: ['./detallepokemon.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, CommonModule, HttpClientModule],
  providers: [PokeService]
})
export class DetallepokemonPage implements OnInit {
  
  pokemon: Pokemon | any = {};
  // pokemon: Pokemon | any = null;
  // Definir una lista de tipos
  tipos = ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 
  'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'];
  typeDefenses: any = {};
  evolutionChain: any = {};
  pokemonEvolutions: any[] = [];
  about: boolean = true;
  stats: boolean = false;
  evolution: boolean = false;
  nombre: string = '';
  imagen: string = '';
  tipo: string = '';
  numberId: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private route: ActivatedRoute, 
    private api: PokeService) { 
  }

  ngOnInit() {
    const pokemonId = this.route.snapshot.paramMap.get('id');
    if (pokemonId) {
      this.getPokemonById(pokemonId);
    }

    this.activatedRoute.params.subscribe((params) => {
      const id = params['id'];
      this.api.getPokemonData(id).subscribe((data: any) => {
        this.pokemon = data;
        this.nombre = this.pokemon.name;
        this.imagen = this.pokemon.sprites.front_default;
        this.tipo = this.pokemon.types[0].type.name;
        this.numberId = this.pokemon.id;
        this.getPokemonEvolutions(this.pokemon.species.url);
      });
    });
  }

  getPokemonEvolutions(speciesUrl: string) {
    this.api.getPokemonSpeciesData(speciesUrl).subscribe((data: any) => {
      const evolutionChainUrl = data.evolution_chain.url;
      this.api.getEvolutionChainData(evolutionChainUrl).subscribe((data: any) => {
        const chain = data.chain;
        const pokemonEvolutions = [];
        let currentEvolution = chain;
        while (currentEvolution) {
          pokemonEvolutions.push({
            species: currentEvolution.species,
            trigger: currentEvolution.evolution_details[0],
            min_level: currentEvolution.evolution_details[0]?.min_level || null,
          });
          currentEvolution = currentEvolution.evolves_to[0];
        }
        this.pokemonEvolutions = pokemonEvolutions;
      });
    });
  }

  getEvolutionChain() {
    this.api.getPokemonEvolutionChain(this.pokemon.species.url).subscribe((data) => {
      let level = data.chain;
      this.evolutionChain.push({
        species: {
          name: level.species.name,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${level.species.url.split('/')[6]}.png`
        }
      });
      while (level.evolves_to.length > 0) {
        level = level.evolves_to[0];
        this.evolutionChain.push({
          species: {
            name: level.species.name,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${level.species.url.split('/')[6]}.png`
          }
        });
      }
    });
  }


  getPokemonById(pokemonId: string) {
    this.api.getPokemonById(pokemonId).subscribe((data) => {
      this.pokemon = data;
      console.log(this.pokemon);
      this.calcularAtaquesHaciaElPoquemon();
    });
  }

  calculateMinHpStatValue(base: number) {
    return Math.floor((((2 * base + 0 + Math.floor(0 / 4)) * 100) / 100) + 100 + 10);
  }

  calculateMaxHpStatValue(base: number) {
    return Math.floor((((2 * base + 31 + Math.floor(252 / 4)) * 100) / 100) + 100 + 10);
  }

  calculateMinStatValue(base: number) {
    return Math.floor((Math.floor(((2 * base + 0 + Math.floor(0 / 4)) * 100) / 100 + 5) * 1) * 0.9);
  }

  calculateMaxStatValue(base: number) {
    return Math.floor((((2 * base + 31 + Math.floor(252 / 4)) * 100) / 100 + 5) * 1.1);
  }

  calcularAtaquesHaciaElPoquemon() {
    this.pokemon.types.forEach((type: Type) => {
      this.api.getWeaknesses(type.type.url).subscribe((data) => {
        this.tipos.forEach((tipo) => {
          if (data.damage_relations.double_damage_from.find((t: any) => t.name === tipo)) {
            this.typeDefenses[tipo] = 2;
          } else if (data.damage_relations.half_damage_from.find((t: any) => t.name === tipo)) {
            this.typeDefenses[tipo] = 0.5;
          } else if (data.damage_relations.no_damage_from.find((t: any) => t.name === tipo)) {
            this.typeDefenses[tipo] = 0;
          } else {
            this.typeDefenses[tipo] = 1;
          }
        });
      });
    });
    // convertir valores a 0, 1, 1/2, 2
    // 
    console.log(this.typeDefenses);
  }

  showAbout() {
    this.about = true;
    this.stats = false;
    this.evolution = false;
  }
  showStats() {
    this.about = false;
    this.stats = true;
    this.evolution = false;
  }
  showEvolution() {
    this.about = false;
    this.stats = false;
    this.evolution = true;
  }
}





































  // getEvolutionChain() {
  //   this.api.getPokemonEvolutionChain(this.pokemon.species.url).subscribe((data: any) => {
  //     const chain = data.chain;
  //     const pokemonEvolutions = [];
  //     let currentEvolution = chain;
  //     while (currentEvolution) {
  //       pokemonEvolutions.push({
  //         species: currentEvolution.species,
  //         trigger: currentEvolution.evolution_details[0],
  //         min_level: currentEvolution.evolution_details[0].min_level,
  //       });
  //       currentEvolution = currentEvolution.evolves_to[0];
  //     }
  //     this.pokemon.evolutions = pokemonEvolutions;
  //   });
  // }
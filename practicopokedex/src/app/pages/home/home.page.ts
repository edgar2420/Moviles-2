import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { Pokedex, Result } from 'src/app/models/Pokedex';
import { Pokemon } from 'src/app/models/Pokemon';
import { PokeService } from 'src/app/services/poke.service';
import { Generation, PokemonWeaknesses } from '../../models/PokemonWeaknesses';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HttpClientModule],
  providers: [PokeService]
})
export class HomePage {
  pokedex: Pokedex | any = null;
  pokedexResults: Result[] | any = null;
  listaPokemon: Pokemon[] | any = null;
  weaknesses: PokemonWeaknesses | any = null;

  tipos: string[] = [];
  debilidades: string[] = [];
  altura: string = "";
  peso: string = "";
  rangeValue = { lower: 0, upper: 100 };

  generacionSeleccionada: string = "";


  constructor(
    private api: PokeService, 
    private modalController: ModalController,
    private router: Router) {
    this.getListaPokemon();
  }

  getListaPokemon() {
    this.api.getListaPokemon().pipe( // pipe es como un then que sirve para encadenar observables, esto hace que se ejecute el siguiente observable cuando el anterior se complete
      // switchMap es como un map pero con un observable
      // esto es para que cuando se obtenga la lista de pokemon
      // se haga un forkJoin para obtener los datos de cada pokemon
      switchMap(data => {
        this.pokedex = data;
        this.pokedexResults = data.results;
        return forkJoin(data.results.map(pokemon => {
          return this.api.getPokemonIndividual(pokemon.url);
        }));
      })
    ).subscribe(data => {
      this.listaPokemon = data;
      console.log(this.listaPokemon);
    });
  }

  updateRangeValue(event: any) {
    this.rangeValue = {
      lower: event.detail.value.lower,
      upper: event.detail.value.upper
    };
    console.log(this.rangeValue);
  }

  // SECCIONES DE FILTROS

  getPokemonesByTypes(tipos: string[]) {
    if (tipos.length === 0) {
      return;
    }
    this.listaPokemon = this.listaPokemon.filter((pokemon: Pokemon) => {
      const pokemonTypes = pokemon.types.map((type) => type.type.name);
      return tipos.every((type) => pokemonTypes.includes(type));
    });
  }

  getPokemonByWeaknesses(debilidades: string[]) {
    if (debilidades.length === 0) {
      return;
    }
    // filtrar la lista de pokemon por debilidades
    const listaPokemonFiltrada: Pokemon[] = [];

    const observables = this.listaPokemon.map((pokemon: Pokemon) => {
      const misDebilidades: string[] = [];
      const misResistencias: string[] = [];

      return forkJoin(
        pokemon.types.map((type) => this.api.getWeaknesses(type.type.url))
      ).pipe(
        map((data: any) => {
          data.forEach((weaknesses: PokemonWeaknesses) => {
            const doubleDamageFrom = weaknesses.damage_relations.double_damage_from;
            doubleDamageFrom.forEach((weakness: Generation) => {
              if (!misResistencias.includes(weakness.name)) {
                if (!misDebilidades.includes(weakness.name)) {
                  misDebilidades.push(weakness.name);
                }
              }
            });

            const halfDamageFrom = weaknesses.damage_relations.half_damage_from;
            halfDamageFrom.forEach((weakness: Generation) => {
              if (misDebilidades.includes(weakness.name)) {
                misDebilidades.splice(misDebilidades.indexOf(weakness.name), 1);
              }

              if (!misResistencias.includes(weakness.name)) {
                misResistencias.push(weakness.name);
              }
            });
          });
          // console.log('---------------------');
          // if(pokemon.name === 'gastly'){
          // console.log(pokemon.name);
          // console.log(misDebilidades);
          // }
          return { pokemon, misDebilidades };
        })
      );
    });

    forkJoin(observables).subscribe((result: any) => {
      result.forEach((pokemon: any) => {
        // esto es para que solo se agreguen los pokemon que tengan todas las debilidades
        if (debilidades.every((type) => pokemon.misDebilidades.includes(type))) {
          listaPokemonFiltrada.push(pokemon.pokemon);
        }
      }
      );
      this.listaPokemon = listaPokemonFiltrada;
    });
  }

  getPokemonesByHeight(altura: string) {
    if (altura === "") {
      return;
    }
    this.listaPokemon = this.listaPokemon.filter((pokemon: Pokemon) => {
      switch (altura) {
        case "height_short":
          return pokemon.height <= 66;
        case "height_medium":
          return pokemon.height > 66 && pokemon.height <= 133;
        case "height_tall":
          return pokemon.height > 133;
        default:
          return false;
      }
    });
  }

  getPokemonByWeight(peso: string) {
    if (peso === "") {
      return;
    }
    this.listaPokemon = this.listaPokemon.filter((pokemon: Pokemon) => {
      switch (peso) {
        case "weight_light":
          return pokemon.weight / 10 <= 94.9;
        case "weight_medium":
          return pokemon.weight / 10 > 94.9 && pokemon.weight / 10 <= 237.5;
        case "weight_heavy":
          return pokemon.weight / 10 > 237.5;
        default:
          return false;
      }
    });
  }

  getPokemonesByRange(rangeValue: any) {
    const listaTemporal = [...this.listaPokemon]; // Crear una copia de la lista original
    const filteredList = listaTemporal.filter((pokemon: Pokemon) => {
      return pokemon.order >= rangeValue.lower && pokemon.order <= rangeValue.upper;
    });

    console.log('rangos');
    console.log(filteredList);

    this.listaPokemon = filteredList;
  }

  // BUSCADOR
  buscarPokemon(event: any) {
    const value = event.target.value;
    if (value && value.trim() !== '') {
      this.listaPokemon = this.listaPokemon.filter((pokemon: Pokemon) => {
        return (pokemon.name.toLowerCase().indexOf(value.toLowerCase()) > -1);
      });
    } else {
      this.getListaPokemon();
    }
  }

  // BOTONES DE FILTROS
  resetFilters() {
    this.getListaPokemon();
    // quitar el fondo de los elementos seleccionados
    const element = document.getElementById(this.altura);
    if (element) {
      element.style.backgroundColor = 'transparent';
    }
    const element2 = document.getElementById(this.peso);
    if (element2) {
      element2.style.backgroundColor = 'transparent';
    }
    // recorrer el arreglo de tipos y quitar el fondo de los elementos seleccionados
    this.tipos.forEach((tipo) => {
      const element = document.getElementById('type_' + tipo);
      if (element) {
        element.style.backgroundColor = 'transparent';
      }
    });
    // recorrer el arreglo de debilidades y quitar el fondo de los elementos seleccionados
    this.debilidades.forEach((debilidad) => {
      const element = document.getElementById('weakness_' + debilidad);
      if (element) {
        element.style.backgroundColor = 'transparent';
      }
    });
    this.tipos = [];
    this.debilidades = [];
    this.altura = '';
    this.peso = '';
    this.rangeValue = { lower: 1, upper: 100 };
    this.closeModal();
  }

  applyFilters() {
    this.getPokemonesByTypes(this.tipos);
    this.getPokemonByWeaknesses(this.debilidades);
    this.getPokemonesByHeight(this.altura);
    this.getPokemonByWeight(this.peso);
    this.getPokemonesByRange(this.rangeValue);
    //this.resetFilters();
    this.closeModal();
  }

  // PARA CERRAR MODAL
  async closeModal() {
    const modal = await this.modalController.getTop();
    if (modal && modal.id === 'modal-filters') {
      modal.dismiss();
    }
  }

  // SELECCIONADOS
  tipoSeleccionado(tipo: string) {
    // esta este tipo en mi arreglo de tipos?
    // extrae del texto type_ y solo deja el nombre del tipo
    const index = this.tipos.indexOf(tipo.substring(5));
    if (index > -1) {
      console.log('eliminado ' + tipo);
      // si está, lo elimino
      this.tipos.splice(index, 1);
      console.log(this.tipos);
      // quito el fondo del elemento seleccionado
      const element = document.getElementById(tipo);
      // element background-color: transparent;
      if (element) {
        element.style.backgroundColor = 'transparent';
      }
    } else {
      console.log('agregado ' + tipo);
      // si no está, lo agrego
      this.tipos.push(tipo.substring(5));
      console.log(this.tipos);
      // le pongo el fondo al elemento seleccionado
      const element = document.getElementById(tipo);
      // haz un switch para cambiar el color de fondo
      if (element) {
        switch (tipo) {
          case 'type_grass':
            element!.style.backgroundColor = '#78C850';
            break;
          case 'type_poison':
            element!.style.backgroundColor = '#A040A0';
            break;
          case 'type_fire':
            element!.style.backgroundColor = '#F08030';
            break;
          case 'type_flying':
            element!.style.backgroundColor = '#A890F0';
            break;
          case 'type_water':
            element!.style.backgroundColor = '#6890F0';
            break;
          case 'type_bug':
            element!.style.backgroundColor = '#A8B820';
            break;
          case 'type_normal':
            element!.style.backgroundColor = '#A8A878';
            break;
          case 'type_electric':
            element!.style.backgroundColor = '#F8D030';
            break;
          case 'type_ground':
            element!.style.backgroundColor = '#E0C068';
            break;
          case 'type_fairy':
            element!.style.backgroundColor = '#EE99AC';
            break;
          case 'type_fighting':
            element!.style.backgroundColor = '#C03028';
            break;
          case 'type_psychic':
            element!.style.backgroundColor = '#F85888';
            break;
          case 'type_rock':
            element!.style.backgroundColor = '#B8A038';
            break;
          case 'type_ghost':
            element!.style.backgroundColor = '#705898';
            break;
          case 'type_ice':
            element!.style.backgroundColor = '#98D8D8';
            break;
          case 'type_dragon':
            element!.style.backgroundColor = '#7038F8';
            break;
          case 'type_dark':
            element!.style.backgroundColor = '#705848';
            break;
          case 'type_steel':
            element!.style.backgroundColor = '#B8B8D0';
            break;
        }
      }
    }
  }

  weaknesseSeleccionada(weakness: string) {
    // esta esta debilidad en mi arreglo de debilidades?
    // extrae del texto weakness_ y solo deja el nombre de la weakness
    const index = this.debilidades.indexOf(weakness.substring(9));
    if (index > -1) {
      console.log('eliminado ' + weakness);
      // si está, lo elimino
      this.debilidades.splice(index, 1);
      console.log(this.debilidades);
      // quito el fondo del elemento seleccionado
      const element = document.getElementById(weakness);
      // element background-color: transparent;
      if (element) {
        element.style.backgroundColor = 'transparent';
      }
    } else {
      console.log('agregado ' + weakness);
      // si no está, lo agrego
      this.debilidades.push(weakness.substring(9));
      console.log(this.debilidades);
      // le pongo el fondo al elemento seleccionado
      const element = document.getElementById(weakness);
      // haz un switch para cambiar el color de fondo
      if (element) {
        switch (weakness) {
          case 'weakness_grass':
            element!.style.backgroundColor = '#78C850';
            break;
          case 'weakness_poison':
            element!.style.backgroundColor = '#A040A0';
            break;
          case 'weakness_fire':
            element!.style.backgroundColor = '#F08030';
            break;
          case 'weakness_flying':
            element!.style.backgroundColor = '#A890F0';
            break;
          case 'weakness_water':
            element!.style.backgroundColor = '#6890F0';
            break;
          case 'weakness_bug':
            element!.style.backgroundColor = '#A8B820';
            break;
          case 'weakness_normal':
            element!.style.backgroundColor = '#A8A878';
            break;
          case 'weakness_electric':
            element!.style.backgroundColor = '#F8D030';
            break;
          case 'weakness_ground':
            element!.style.backgroundColor = '#E0C068';
            break;
          case 'weakness_fairy':
            element!.style.backgroundColor = '#EE99AC';
            break;
          case 'weakness_fighting':
            element!.style.backgroundColor = '#C03028';
            break;
          case 'weakness_psychic':
            element!.style.backgroundColor = '#F85888';
            break;
          case 'weakness_rock':
            element!.style.backgroundColor = '#B8A038';
            break;
          case 'weakness_ghost':
            element!.style.backgroundColor = '#705898';
            break;
          case 'weakness_ice':
            element!.style.backgroundColor = '#98D8D8';
            break;
          case 'weakness_dragon':
            element!.style.backgroundColor = '#7038F8';
            break;
          case 'weakness_dark':
            element!.style.backgroundColor = '#705848';
            break;
          case 'weakness_steel':
            element!.style.backgroundColor = '#B8B8D0';
            break;
        }
      }
    }
  }

  heightSeleccionado(height: string) {
    let element;
    if (this.altura !== '') {
      element = document.getElementById(this.altura);
      if (element) {
        element.style.backgroundColor = 'transparent';
      }
    }
    this.altura = height;
    element = document.getElementById(height);
    if (height === 'height_short') {
      element!.style.backgroundColor = '#78C850';
    } else if (height === 'height_medium') {
      element!.style.backgroundColor = '#F85888';
    } else if (height === 'height_tall') {
      element!.style.backgroundColor = '#7038F8';
    }
  }

  weightSeleccionado(weight: string) {
    let element;
    if (this.peso !== '') {
      element = document.getElementById(this.peso);
      if (element) {
        element.style.backgroundColor = 'transparent';
      }
    }
    this.peso = weight;
    element = document.getElementById(weight);
    if (weight === 'weight_light') {
      element!.style.backgroundColor = '#78C850';
    } else if (weight === 'weight_medium') {
      element!.style.backgroundColor = '#F85888';
    } else if (weight === 'weight_heavy') {
      element!.style.backgroundColor = '#7038F8';
    }
  }

  selectSort(sort: string) {
    // obtener todos los que tengan button_sort
    const elements = document.getElementsByClassName('button_sort');
    // recorrer todos los elementos
    for (let i = 0; i < elements.length; i++) {
      // quitarles el background-color
      const element = elements[i] as HTMLElement;
      element.style.backgroundColor = 'transparent';
    }
    // ponerle el background-color al seleccionado
    const element = document.getElementById(sort);
    if (element) {
      element.style.backgroundColor = '#F85888';
    }
    if (sort === 'smallest_number_first') {
      this.getPokemonListSmallesNumberFirst();
    } else if (sort === 'highest_number_first') {
      this.getPokemonListHighestNumberFirst();
    } else if (sort === 'a-z') {
      this.getPokemonListAZ();
    } else if (sort === 'z-a') {
      this.getPokemonListZA();
    }
  }

  generationSeleccionada(generacion: string) {
    let element;
    if (this.generacionSeleccionada !== '') {
      element = document.getElementById(this.generacionSeleccionada);
      if (element) {
        element.style.backgroundColor = 'transparent';
      }
    }
    this.generacionSeleccionada = generacion;
    element = document.getElementById(generacion);
    if (element) {
      element.style.backgroundColor = '#F85888';
    }
    this.getPokemonListGeneration();
  }

  // GET POKEMON ORDENADO
  getPokemonListSmallesNumberFirst() {
    this.listaPokemon.sort((a: Pokemon, b: Pokemon) => {
      return a.id - b.id;
    });
    console.log('lista ordenada smallest number first');
    console.log(this.listaPokemon.map((pokemon: Pokemon) => pokemon.id));
  }

  getPokemonListHighestNumberFirst() {
    this.listaPokemon.sort((a: Pokemon, b: Pokemon) => {
      return b.id - a.id;
    });
    console.log('lista ordenada highest number first');
    console.log(this.listaPokemon.map((pokemon: Pokemon) => pokemon.id));
  }

  getPokemonListAZ() {
    this.listaPokemon.sort((a: Pokemon, b: Pokemon) => {
      return a.name.localeCompare(b.name);
    });
    console.log('lista ordenada A-Z');
    console.log(this.listaPokemon.map((pokemon: Pokemon) => pokemon.name));
  }

  getPokemonListZA() {
    this.listaPokemon.sort((a: Pokemon, b: Pokemon) => {
      return b.name.localeCompare(a.name);
    });
    console.log('lista ordenada Z-A');
    console.log(this.listaPokemon.map((pokemon: Pokemon) => pokemon.name));
  }

  // POKEMON GENERACIONES
  getPokemonListGeneration() {
    var listaPokemonGeneracion: Pokemon[] = [];
    this.listaPokemon.forEach((pokemon: Pokemon) => {
      var generationActual;
      this.api.getPokemonGeneration(pokemon).subscribe(data => {
        generationActual = data;
        if (generationActual === this.generacionSeleccionada) {
          console.log('agregando pokemon ' + pokemon.name + ' ' + generationActual);
          listaPokemonGeneracion.push(pokemon);
        }
      });
    });
    this.listaPokemon = listaPokemonGeneracion;
  }

  verPokemon(id: number) {
    this.router.navigate(['/detallepokemon/', id]);
  }
}












































  // getPokemonGeneration(generation: string) {
  //   this.api.getPokemonGeneration(generation).subscribe(data => {
  //     this.generation = data;
  //     this.listaPokemon = this.generation.pokemon_species;
  //     console.log(this.listaPokemon);
  //   });
  // }

  // getPokemonByWeaknesses(debilidades: string[]) {
  //   // filtrar la lista de pokemon por debilidades
  //   var listaPokemonFiltrada: Pokemon[] = [];

  //   this.listaPokemon.forEach((pokemon: Pokemon) => {

  //     var misDebilidades: string[] = [];
  //     var misResistencias: string[] = [];

  //     pokemon.types.forEach((type) => {

  //       this.api.getWeaknesses(type.type.url).subscribe(data => {
  //         this.weaknesses = data;

  //         const doubleDamageFrom = this.weaknesses.damage_relations.double_damage_from;
  //         doubleDamageFrom.forEach((weakness: Generation) => {
  //           // si esta debilidad ya esta en mi lista de resistencias no la agregues
  //           if (!misResistencias.includes(weakness.name)) {
  //             // si ya tengo esta debilidad en mi lista, no la agregue
  //             if (!misDebilidades.includes(weakness.name)) {
  //               misDebilidades.push(weakness.name);
  //             }
  //           }
  //         });

  //         const halfDamageFrom = this.weaknesses.damage_relations.half_damage_from;
  //         halfDamageFrom.forEach((weakness: Generation) => {
  //           // si esta resistencia ya esta en mi lista de debilidades quitala
  //           if (misDebilidades.includes(weakness.name)) {
  //             misDebilidades.splice(misDebilidades.indexOf(weakness.name), 1);
  //           }

  //           // si ya tengo esta debilidad en mi lista, no la agregue
  //           if (!misResistencias.includes(weakness.name)) {
  //             misResistencias.push(weakness.name);
  //           }
  //         });

  //       });
  //     });

  //     console.log(misDebilidades);

  //     debilidades.forEach((debilidad: string) => {
  //       if (misDebilidades.includes(debilidad)) {
  //         // agregar nuevo pokemon al vector
  //         listaPokemonFiltrada.push(pokemon);
  //       }
  //     });

  //   });

  //   this.listaPokemon = listaPokemonFiltrada;
  // }
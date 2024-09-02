import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonService } from 'src/app/services/pokemon.service';
import { Pokemon } from 'src/models/pokemon';

@Component({
  selector: 'app-agregarteam',
  templateUrl: './agregarteam.page.html',
  styleUrls: ['./agregarteam.page.scss'],
})
export class AgregarteamPage implements OnInit {
  addDisabled: boolean = false; 
  selectedPokemon: any;
  selectedAbility: string = ''; 
  selectedMoves: string[] = []; 
  abilityDisabled = false;
  movesDisabled = false; 
  type: any; 
  team: Pokemon[] = []; 
  popularItems: string[] = []; 

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService,
    private router: Router
  ) { }

  ngOnInit() {
 
    const pokemonId = this.route.snapshot.paramMap.get('id');
    const id = pokemonId ? +pokemonId : 1;
    this.getPokemonDetails(id);
    this.getItem(id);
  }

  getItem(itemId: number) {

    this.pokemonService.getItem(itemId).subscribe((item: any) => {
      console.log(item);
    });
  }

  getPokemonDetails(pokemonId: number) {

    this.pokemonService.getPokemonDetails(pokemonId.toString()).subscribe(data => {

      this.selectedPokemon = {
        id: data.id,
        imageUrl: this.pokemonService.getPokemon(data.id),
        nickname: data.name,
        abilities: [],
        moves: [],
        stats: [],
        types: []
      };


      this.pokemonService.getPokemonAbilities(data.id).subscribe(abilities => {
        this.selectedPokemon.abilities = abilities;
      });


      this.pokemonService.getPokemonMoves(data.id).subscribe(moves => {
        this.selectedPokemon.moves = moves;
      });


      this.pokemonService.getPokemonStats(data.id).subscribe(stats => {
        this.selectedPokemon.stats = stats.map((stat: any) => ({ name: stat.name, value: stat.base_stat / 100 }));
      });


      this.pokemonService.getPokemonTypes(data.id).subscribe(types => {
        this.selectedPokemon.types = types;
      });
    });
  }

  selectAbility() {

    if (this.selectedAbility) {
      this.abilityDisabled = true;
    }
  }

  selectMoves() {
    if (this.selectedMoves.length > 4) {
      alert("Solo puedes seleccionar hasta 4 movimientos.");
      this.selectedMoves.pop();
    } else if (this.selectedMoves.length === 4) {
      this.movesDisabled = true;
    } else {
      this.movesDisabled = false;
    }
  }

  addPokemonToTeam() {

    if (this.selectedPokemon) {
      
      const pokemonToAdd: any = { ...this.selectedPokemon };
  

      if (this.selectedAbility) {
        pokemonToAdd.ability = this.selectedAbility;
      }
  

      pokemonToAdd.moves = pokemonToAdd.moves.filter((move: string) => {
        return this.selectedMoves.includes(move);
      });
  

      let team: any[] = JSON.parse(localStorage.getItem('team') || '[]');
  

      team.push(pokemonToAdd);
  
    
      localStorage.setItem('team', JSON.stringify(team));
  
    
      this.router.navigateByUrl('/team');
    }
  }
  
  actualizar() {
  
    if (this.selectedPokemon) {
      
      const selectedAbility = this.selectedPokemon.abilities.find((ability: any) => {
        return ability.name === this.selectedAbility;
      });
  
    
      const updatedPokemon: any = { ...this.selectedPokemon };
      updatedPokemon.abilities = selectedAbility ? [selectedAbility] : [];
      updatedPokemon.moves = this.selectedMoves;
  

      let team: Pokemon[] = JSON.parse(localStorage.getItem('team') || '[]');
  

      const index = team.findIndex((pokemon: Pokemon) => pokemon.id === updatedPokemon.id);
  
      if (index !== -1) {
  
        team[index] = updatedPokemon;
  

        localStorage.setItem('team', JSON.stringify(team));
  

        this.router.navigateByUrl('/team');
      }
    }
  }

  clearSelection() {

    this.selectedPokemon = null;
    this.selectedAbility = '';
    this.selectedMoves = [];
    this.abilityDisabled = false;
    this.movesDisabled = false;
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
}

import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Pokemon } from 'src/models/pokemon';

@Component({
  selector: 'app-team',
  templateUrl: './team.page.html',
  styleUrls: ['./team.page.scss'],
})
export class TeamPage {
  team: Pokemon[] = []; 
  pokemons: any[] = []; 
  filteredPokemons: any[] = [];  

  constructor(
    private navCtrl: NavController 
  ) { }

  ionViewWillEnter(): void {
    this.loadTeam(); 
  }

  loadTeam(): void {
    const storedTeam = localStorage.getItem('team'); 
    if (storedTeam) {
      this.team = JSON.parse(storedTeam); 
    }
  }

  addPokemon() {
    this.navCtrl.navigateForward('/pokemon').then(() => {
      this.loadTeam();
    });
  }

  editPokemon(pokemon: Pokemon) {
    this.navCtrl.navigateForward(`/agregarteam/${pokemon.id}`, { state: { editMode: true, editedPokemon: pokemon } });
  }

  deletePokemon(pokemon: Pokemon) {
    const index = this.team.indexOf(pokemon); 
    if (index > -1) {
      this.team.splice(index, 1); 
      this.saveTeam(); 
    }
  }

  saveTeam(): void {
  
    localStorage.setItem('team', JSON.stringify(this.team));
  }
}

import { Component, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { PokeApiService } from '../services/pokeAPI.service';
import { Observable } from 'rxjs';

interface Pokemon {
  name: string;
  image: string;
  type: string;
  id: number;
}

@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class PokedexComponent implements OnInit {

  pokemons: Pokemon[] = [];

  constructor(private pokeApiService: PokeApiService) {}

  ngOnInit(): void {
    this.pokeApiService.fetchPokemon().subscribe((data: Pokemon[]) => {
      this.pokemons = data;
    });
  }

  trackByPokemonId(index: number, pokemon: Pokemon): number {
    return pokemon.id;
  }
}

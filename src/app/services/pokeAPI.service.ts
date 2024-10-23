import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, forkJoin } from "rxjs";
import { map, switchMap } from 'rxjs/operators';

interface Pokemon {
    name: string;
    image: string;
    type: string;
    id: number;
}

interface PokemonListResponse {
    results: { name: string; url: string }[];
}

@Injectable({
    providedIn: 'root'
})
export class PokeApiService {

    private apiUrl = 'https://pokeapi.co/api/v2/pokemon';

    constructor(private http: HttpClient) { }

    fetchPokemon(): Observable<Pokemon[]> {
        // Busca na lista de pokemons na api
        return this.http.get<PokemonListResponse>(`${this.apiUrl}?limit=150`).pipe(
            // Requisição individual de pokemon
            switchMap((response: PokemonListResponse) => {
                const pokemonRequests = response.results.map((pokemon: { name: string; url: string }, index: number) => {
                    // Detalhes do pokemon por url
                    return this.http.get<any>(pokemon.url).pipe(
                        map(details => ({
                            name: details.name,
                            image: details.sprites.front_default,
                            type: details.types.map((type: any) => type.type.name).join(', '),
                            id: details.id
                        }))
                    );
                });

                // Espera todas as requisições terminarem
                return forkJoin(pokemonRequests);
            })
        );
    }
}

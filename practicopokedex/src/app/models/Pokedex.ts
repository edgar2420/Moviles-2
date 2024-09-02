// lo que obtiene en general de la api
export interface Pokedex {
    flat(): import("./Pokemon").Pokemon[];
    count:    number;
    next:     string;
    previous: null;
    results:  Result[];
}

export interface Result {
    name: string;
    url:  string;
}
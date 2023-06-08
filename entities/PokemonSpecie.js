class PokemonSpecie {
    constructor(specie_json) {
        this.id = specie_json.id
        this.string_id = specie_json.name
        for (let nameObj of specie_json.names) {
            if (nameObj.language.name == 'fr')
                this.name = nameObj.name
        }
    }
}
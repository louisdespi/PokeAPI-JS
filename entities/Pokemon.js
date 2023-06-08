class Pokemon {
    constructor(pokemon_json) {
        this.id = pokemon_json.id
        this.string_id = pokemon_json.name
        this.sprite_url = pokemon_json.sprites.front_default
        this.order = pokemon_json.order
        this.height = pokemon_json.height
        this.weight = pokemon_json.weight
        this.abilities = []
        for (let abilityObj of pokemon_json.abilities) {
            this.abilities.push(abilityObj.ability.name)
        }
        this.types = []
        for (let typeObj of pokemon_json.types) {
            this.types.push(typeObj.type.name)
        }
        this.specie = pokemon_json.species.name
    }
}
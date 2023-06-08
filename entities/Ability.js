class Ability {
    constructor(ability_json) {
        this.id = ability_json.id
        this.string_id = ability_json.name
        for (let nameObj of ability_json.names) {
            if (nameObj.language.name == 'fr')
                this.name = nameObj.name
        }
    }
}

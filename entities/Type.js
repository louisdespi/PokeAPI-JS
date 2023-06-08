class Type {
    constructor(type_json) {
        this.id = type_json.id
        this.string_id = type_json.name
        for (let nameObj of type_json.names) {
            if (nameObj.language.name == 'fr')
                this.name = nameObj.name
        }
    }
}

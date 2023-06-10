class Manager extends EventEmitter {
    constructor() {
        super()
        this.is_init = false
        this.collections = {}
    }
    initialize() {
        let items = []
        for (let [key, value] of Object.entries(Loader.entities)) {
            this.collections[key] = {
                collection : {},
                load_count : value.count - 1
            }
            items.push(key)
        }
        Loader.instance().on('item_loaded', (p) => {
            if ('loaded_count' in this.collections[p.entity.name])
                this.collections[p.entity.name].loaded_count++
            else
                this.collections[p.entity.name].loaded_count = 0
            this.trigger('collection_update', {
                'name' : p.entity.name,
                'collection' : this.collections[p.entity.name],
                'item' : p.item,
                'loading' : this.collections[p.entity.name].loaded_count/this.collections[p.entity.name].load_count
            })
        })
        let promise_chain = Promise.resolve()
        items.forEach((item) => {
            promise_chain = promise_chain
            .then(() => {
                return Loader.instance().geta(Loader.entities[item])
                .then((collection) => {
                    this.collections[item].collection = collection
                    return Promise.resolve(true)
                })
            })
        })
        return promise_chain
        .then(() => {
            this.interpolate()
            this.is_init = true
        })
    }
    interpolate() {
        let dict = {
            'type' : {},
            'ability' : {},
            'pokemon-specie' : {}
        }
        for (let type of this.collections['type'].collection) {
            dict['type'][type.string_id] = type
        }
        for (let ability of this.collections['ability'].collection) {
            dict['ability'][ability.string_id] = ability
        }
        for (let specie of this.collections['pokemon-specie'].collection) {
            dict['pokemon-specie'][specie.string_id] = specie
        }
        for (let pokemon of this.collections['pokemon'].collection) {
            for (let i = 0; i < pokemon.abilities.length; i++) {
                pokemon.abilities[i] = dict['ability'][pokemon.abilities[i]]
            }
            for (let i = 0; i < pokemon.types.length; i++) {
                pokemon.types[i] = dict['type'][pokemon.types[i]]
            }
            pokemon.specie = dict['pokemon-specie'][pokemon.specie]
        }
    }
    where(filter_funcs) {
        let ret = [...this.collections['pokemon'].collection]
        for (let func of filter_funcs) {
            ret = ret.filter((p) => {
                return func(p)
            })
        }
        return ret
    }
}
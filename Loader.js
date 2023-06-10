class Loader extends EventEmitter {
    static _instance = null
    static CHUNK_SIZE = 100
    static entities = {
        'pokemon' : {
            name : 'pokemon',
            endpoint : 'https://pokeapi.co/api/v2/pokemon',
            class_type : Pokemon,
            count : 1010
        },
        'pokemon-specie' : {
            name : 'pokemon-specie',
            endpoint : 'https://pokeapi.co/api/v2/pokemon-species',
            class_type : PokemonSpecie,
            count : 1010
        },
        'type' : {
            name : 'type',
            endpoint : 'https://pokeapi.co/api/v2/type',
            class_type : Type,
            count : 18
        },
        'ability' : {
            name : 'ability',
            endpoint : 'https://pokeapi.co/api/v2/ability',
            class_type : Ability,
            count : 298
        },
        'stat' : {
            name : 'stat',
            endpoint : 'https://pokeapi.co/api/v2/stat',
            class_type : Stat,
            count : 8
        },
    }
    constructor() {
        super()
    }
    static instance() {
        if (Loader._instance == null)
            Loader._instance = new Loader()
        return Loader._instance
    }
    get(entity, id) {
        return new Promise((resolve, reject) => {
            console.log(`Requesting : [${entity.endpoint}/${id}]`)
            $.get(`${entity.endpoint}/${id}`)
            .done((result) => {
                let item = new entity.class_type(result)
                this.trigger('item_loaded', {
                    item : item,
                    entity : entity
                })
                resolve(item)
            })
            .fail((err) => {
                reject(err)
            })
        })
    }
    getl(entity, ids) {
        let chunk_ids = Utils.chunkify(ids, Loader.CHUNK_SIZE);
        let promise_chain = Promise.resolve([]);

        chunk_ids.forEach((chunk) => {
            promise_chain = promise_chain.then((results) => {
                const promises = chunk.map((id) => {
                    return new Promise((resolve, reject) => {
                        this.get(entity, id)
                        .then((p) => {
                            resolve(p)
                        })
                        .catch((err) => {
                            reject(err)
                        })
                    })
                })
                return Promise.allSettled(promises)
                .then((r) => {
                    return [...results, ...r.filter(_r => _r.status == 'fulfilled').map((__r) => __r.value)]
                })
            })
        });
        return promise_chain
    }
    getr(entity, from, to) {
        return this.getl(entity, Utils.get_range(from, to))
    }
    geta(entity) {
        return this.getr(entity, 1, entity.count)
    }
}
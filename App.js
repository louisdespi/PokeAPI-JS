class App {
    constructor($parent, id) {
        this.$root = $(`
            <div class="app app-${id}">
                <div class="nav"></div>
                <div class="main">
                    <div class="display">
                        <div class="grid"></div>
                    </div>
                    <div class="pager"></div>
                </div>
                <div class="loading-bar layer hidden">
                    <div class="loading-bar outter">
                        <span class="loading-bar collection"></span>
                        <span class="loading-bar last-loaded"></span>
                        <span class="loading-bar percentage"></span>
                        <div class="loading-bar inner">
                        </div>
                    </div>
                </div>
            </div>
        `)
        this.$parent = $parent
        this.$parent.append(this.$root)
        this.$nav = this.$root.find('.nav')
        this.$main = this.$root.find('.main')
        this.$display = this.$root.find('.display')
        this.$grid = this.$root.find('.display .grid')
        this.$pager = this.$root.find('.pager')
        this.$loading_bar = {
            $layer : this.$root.find('.loading-bar.layer'),
            $outter : this.$root.find('.loading-bar.outter'),
            $inner : this.$root.find('.loading-bar.inner'),
            $percentage : this.$root.find('.loading-bar.percentage'),
            $collection : this.$root.find('.loading-bar.collection'),
            $last_loaded : this.$root.find('.loading-bar.last-loaded')
        }
        this.manager = new Manager()
        this.manager.on('collection_update', (p) => {
            let percentage = Math.round(p.loading * 100)
            this.$loading_bar.$inner.css('width', `${percentage}%`)
            this.$loading_bar.$percentage.html(`${percentage}%`)
            this.$loading_bar.$collection.html(`${p.name}`)
            this.$loading_bar.$last_loaded.html(`${p.item.string_id}`)
        })
        this.current_page = 0
    }

    initialize() {
        if (this.manager.is_init) return Promise.resolve()
        this.$loading_bar.$layer.removeClass('hidden')
        return this.manager.initialize()
        .then(() => {
            this.$loading_bar.$layer.addClass('hidden')
            this.search([])
            return Promise.resolve(this.pokemon_pages)
        })
    }

    search(filter_funcs) {
        this.pokemon_pages = Utils.chunkify(this.manager.where(filter_funcs), 60)
        this.page_max = this.pokemon_pages.length - 1
        this.refresh()
    }

    refresh() {
        this.$grid.empty()
        this.$pager.empty()
        if (this.pokemon_pages.length > 0) {
            for (let pokemon of this.pokemon_pages[this.current_page]) {
                let $pokemon_block = $(`
                    <div class="pokemon-block block-${pokemon.id}">
                        <span class="id"># ${pokemon.id}</span>
                        <span class="name">${pokemon.specie.name.toLowerCase()}</span>
                        <div class="sprite">
                            <img src="${pokemon.sprite_url}" />
                        </div>
                        <div class="shiny_sprite">
                            <img src="${pokemon.shiny_sprite_url}" />
                        </div>
                        <span class="weight">${pokemon.weight} Hg</span>
                        <span class="height">${pokemon.height} Dc</span>
                        <div class="types">
                        </div>
                        <div class="abilities">
                        </div>
                        <div class="stats">
                            <div class="stat hp">
                                <span class="stat-name"></span>
                                <div class="stat-gauge outter">
                                    <div class="stat-gauge inner"></div>
                                </div>
                            </div>
                            <div class="stat attack">
                                <span class="stat-name"></span>
                                <div class="stat-gauge outter">
                                    <div class="stat-gauge inner"></div>
                                </div>
                            </div>
                            <div class="stat defense">
                                <span class="stat-name"></span>
                                <div class="stat-gauge outter">
                                    <div class="stat-gauge inner"></div>
                                </div>
                            </div>
                            <div class="stat special-attack">
                                <span class="stat-name"></span>
                                <div class="stat-gauge outter">
                                    <div class="stat-gauge inner"></div>
                                </div>
                            </div>
                            <div class="stat special-defense">
                                <span class="stat-name"></span>
                                <div class="stat-gauge outter">
                                    <div class="stat-gauge inner"></div>
                                </div>
                            </div>
                            <div class="stat speed">
                                <span class="stat-name"></span>
                                <div class="stat-gauge outter">
                                    <div class="stat-gauge inner"></div>
                                </div>
                            </div>
                            <!--<div class="stat accuracy">
                                <span class="stat-name"></span>
                                <div class="stat-gauge outter">
                                    <div class="stat-gauge inner"></div>
                                </div>
                            </div>
                            <div class="stat evasion">
                                <span class="stat-name"></span>
                                <div class="stat-gauge outter">
                                    <div class="stat-gauge inner"></div>
                                </div>
                            </div>-->
                        </div>
                    </div>
                `)
                /* BLOCK DEGUEU */
                if (pokemon.types.length == 2) {
                    let c1 = Type.colors[pokemon.types[0].string_id]
                    let c2 = Type.colors[pokemon.types[1].string_id]
                    $pokemon_block.css('background',`linear-gradient(135deg, rgba(${c1.rgb}, 0.65) 5%, rgba(${c2.rgb}, 0.65))`)
                    $pokemon_block.css('color',`(${c1['text-color']}`)
                } else {
                    $pokemon_block.css('background-color',`rgba(${Type.colors[pokemon.types[0].string_id].rgb}, 0.5)`)
                }
                /* FIN BLOCK DEGUEU */
                this.$grid.append($pokemon_block)
                let $types = $pokemon_block.find('.types')
                let $abilities = $pokemon_block.find('.abilities')
                for (let type of pokemon.types) {
                    $types.append(`
                        <span class="type type-${type.id}">
                            <img alt="${type.name}" title="${type.name}" src="assets/types/${type.id}c.png">
                        </span>
                    `)
                    /*
                        <img src="assets/types/${type.id}.png">
                    */
                }
                let $stats = $pokemon_block.find('.stats')
                for (let [key, stat] of Object.entries(pokemon.stats)) {
                    let s = $stats.find(`.${stat.stat.string_id}`)
                    s.find('.stat-name').html(`${stat.stat.name.toLowerCase()}`)
                    s.find('.stat-gauge.inner').css('width', `${Math.round((stat.base_stat / 255) * 100)}%`)
                }
                for (let ability of pokemon.abilities) {
                    $abilities.append(`
                        <span class="ability">${ability.name.toLowerCase()}</span>
                    `)
                }
            }
            for (let i in this.pokemon_pages) {
                let $page = $(`<div class="page page-${i}"></div>`)
                this.$pager.append($page)
            }
        }
    }
}
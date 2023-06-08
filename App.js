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
        }
        this.manager = new Manager()
        this.manager.on('collection_update', (p) => {
            let percentage = Math.round(p.loading * 100)
            this.$loading_bar.$inner.css('width', `${percentage}%`)
            this.$loading_bar.$percentage.html(`${percentage}%`)
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
                        <span class="weight">${pokemon.weight} hg</span>
                        <span class="height">${pokemon.height} dc</span>
                        <div class="types">
                        </div>
                        <div class="abilities">
                        </div>
                    </div>
                `)
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
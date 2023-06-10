class Type {
    static colors = {
        normal: {
          hex: '#a0a2a0', // 1
          rgb: '160, 162, 160',
          'text-color': '#000000', // Convenient text color for normal background
        },
        fighting: {
          hex: '#ff8100', // 2
          rgb: '255, 129, 0',
          'text-color': '#ffffff', // Convenient text color for fighting background
        },
        flying: {
          hex: '#82baef', // 3
          rgb: '130, 186, 239',
          'text-color': '#000000', // Convenient text color for flying background
        },
        poison: {
          hex: '#923fcc', // 4
          rgb: '146, 63, 204',
          'text-color': '#ffffff', // Convenient text color for poison background
        },
        ground: {
          hex: '#92501b', // 5
          rgb: '146, 80, 27',
          'text-color': '#ffffff', // Convenient text color for ground background
        },
        rock: {
          hex: '#b0aa82', // 6
          rgb: '176, 170, 130',
          'text-color': '#000000', // Convenient text color for rock background
        },
        bug: {
          hex: '#91a112', // 7
          rgb: '145, 161, 18',
          'text-color': '#000000', // Convenient text color for bug background
        },
        ghost: {
          hex: '#703f70', // 8
          rgb: '112, 63, 112',
          'text-color': '#ffffff', // Convenient text color for ghost background
        },
        steel: {
          hex: '#60a2b9', // 9
          rgb: '96, 162, 185',
          'text-color': '#000000', // Convenient text color for steel background
        },
        fire: {
          hex: '#e72324', // 10
          rgb: '231, 35, 36',
          'text-color': '#ffffff', // Convenient text color for fire background
        },
        water: {
          hex: '#2481ef', // 11
          rgb: '36, 129, 239',
          'text-color': '#ffffff', // Convenient text color for water background
        },
        grass: {
          hex: '#3da224', // 12
          rgb: '61, 162, 36',
          'text-color': '#ffffff', // Convenient text color for grass background
        },
        electric: {
          hex: '#fac100', // 13
          rgb: '250, 193, 0',
          'text-color': '#000000', // Convenient text color for electric background
        },
        psychic: {
          hex: '#ef3f7a', // 14
          rgb: '239, 63, 122',
          'text-color': '#ffffff', // Convenient text color for psychic background
        },
        ice: {
          hex: '#3dd9ff', // 15
          rgb: '61, 217, 255',
          'text-color': '#000000', // Convenient text color for ice background
        },
        dragon: {
          hex: '#4f60e2', // 16
          rgb: '79, 96, 226',
          'text-color': '#ffffff', // Convenient text color for dragon background
        },
        dark: {
          hex: '#4f3f3c', // 17
          rgb: '79, 63, 60',
          'text-color': '#ffffff', // Convenient text color for dark background
        },
        fairy: {
          hex: '#ef70ef', // 18
          rgb: '239, 112, 239',
          'text-color': '#000000', // Convenient text color for fairy background
        },
      };
      
    constructor(type_json) {
        this.id = type_json.id
        this.string_id = type_json.name
        for (let nameObj of type_json.names) {
            if (nameObj.language.name == 'fr')
                this.name = nameObj.name
        }
    }
}

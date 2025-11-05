export class Places {
    
    private static readonly DEFAULT_PLACES:Array<string> = [
        "Matriz","Água Boa","Cap. Cristo Ressucitado",
        "Cap. S. Judas Tadeu",
        "Cap. S. José Operário", "Cap. S. Rita", "Cap N. S. Carmo"
    ]
    private static places:Array<string> = this.DEFAULT_PLACES.slice()


    public static getPlaces():Array<string> { return this.places }
    public static setPlaces(places:Array<string>) { this.places = places }
    
    /**
     * Adiciona um novo local,
     * fazendo também as atualizações necessárias em todos os membros.
     * @param place Nome do local
     */

    static AddPlace(place:string):void{
        this.places.push(place)
    }

    /**
     * Remove determinado local pelo seu nome,
     * fazendo também as atualizações necessárias em todos os membros.
     * @param place Nome do local a remover
     * @returns 
     */
    static RemovePlace(place:string):void{
        let index = this.places.indexOf(place)
        if(index == -1){console.error("Place not found!");return}

        this.places.splice(index,1)
    }

    /**
     * Renomeia um determinado local,
     * fazendo também as atualizações necessárias em todos os membros.
     * @param place Local
     * @param newPlace Novo nome
     * @returns 
     */
    static RenamePlace(place:string,newPlace:string):void{
        let index = this.places.indexOf(place)
        if(index == -1){console.error("Place not found!");return}
        
        this.places[index] = newPlace
    }

    /**
     * Renomeia o local com o determinado índice,
     * fazendo também as atualizações necessárias em todos os membros.
     * @param placeIndex Índice alvo
     * @param newPlace Novo nome
     * @returns 
     */
    static RenamePlaceIndex(placeIndex:number,newPlace:string):void{
        if(placeIndex > this.places.length){console.error("Place index out of range.");return}
        this.places[placeIndex] = newPlace
    }

    /**
     * Retorna uma lista com os nomes dos locais padrão.
     * @returns Array<string>
     */
    static PlacesArray():Array<string>{
        return this.places.slice()
    }

    /**
     * Retorna um objeto padrão para armazenar o rodízio de locais.
     * @returns object
     */
    static PlacesRotationMap():object{
        let array:Array<string> = this.PlacesArray()
        let map = {}
        
        array.forEach((place)=>{
            map[place] = 0
        })

        return map
    }

    /**
     * Retorna um objeto padrão para armazenar as disponibilidades de locais
     * @returns 
     */
    static PlacesDispMap():object{
        let array:Array<string> = this.PlacesArray()
        let map = {}
        
        array.forEach((place)=>{
            map[place] = true
        })

        return map
    }

    /**
     * Reinicia os locais para o padrão, fazendo também as atualizações necessárias em todos os membros.
     */
    static ResetToDefault(){
        this.places = this.PlacesArray()
        this.VerifyPlacesIntegrity()
    }

    /**
     * Verifica a integridade da lista de locais.
     */
    static VerifyPlacesIntegrity(){
        if(this.places == null){
            this.places = []
        }
    }

    /**
     * Organiza uma lista de locais de acordo com a ordem disposta
     * na array original que armazena todos os locais.
     * @param places Lista de locais a organizar
     * @returns 
     */
    static OrganizePlaceArray(places:Array<string>):Array<string>{
        let organized = []
        for(let i = 0; i < Places.places.length; i++){
            let cur = Places.places[i]
            for(let j = 0; j < places.length; j++){
                if(places[j] == cur){
                    organized.push(cur)
                    break
                }
            }
        }

        return organized
    }
}
export class Places {
    static allPlaces:Array<string>
    static defaultPlaces:Array<string> = [
        "Matriz","Água Boa","Cap. Cristo Ressucitado",
        "Cap. S. Judas Tadeu",
        "Cap. S. José Operário", "Cap. S. Rita"
    ]

    static AddPlace(place:string):void{
        this.allPlaces.push(place)
    }

    static RemovePlace(place:string):void{
        let index = this.allPlaces.indexOf(place)
        if(index == -1){console.error("Place not found!");return}

        this.allPlaces.splice(index,1)
    }

    static RenamePlace(place:string,newPlace:string):void{
        let index = this.allPlaces.indexOf(place)
        if(index == -1){console.error("Place not found!");return}

        this.allPlaces[index] = newPlace
    }

    static RenamePlaceIndex(placeIndex:number,newPlace:string):void{
        if(placeIndex > this.allPlaces.length){console.error("Place index out of range.");return}
        this.allPlaces[placeIndex] = newPlace
    
    }

    static PlacesArray():Array<string>{
        return this.defaultPlaces.slice()
    }

    static PlacesRotationMap():object{
        let array:Array<string> = this.PlacesArray()
        let map = {}
        
        array.forEach((place)=>{
            map[place] = 0
        })

        return map
    }
    static PlacesDispMap():object{
        let array:Array<string> = this.PlacesArray()
        let map = {}
        
        array.forEach((place)=>{
            map[place] = true
        })

        return map
    }
}
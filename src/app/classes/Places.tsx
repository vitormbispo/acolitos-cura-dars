import AsyncStorage from "@react-native-async-storage/async-storage"
import { MemberData } from "./MemberData"
import { SaveAcolyteData, SaveCoroinhaData, SaveData } from "./Methods"

export class Places {
    static allPlaces:Array<string>
    static defaultPlaces:Array<string> = [
        "Matriz","Água Boa","Cap. Cristo Ressucitado",
        "Cap. S. Judas Tadeu",
        "Cap. S. José Operário", "Cap. S. Rita", "Cap N. S. Carmo"
    ]

    static AddPlace(place:string):void{
        this.allPlaces.push(place)
        MemberData.allAcolytes.forEach((acolyte)=>{
            acolyte.placeDisp[place] = true
            acolyte.placeRotation[place] = 0
        })

        MemberData.allCoroinhas.forEach((coroinha)=>{
            coroinha.placeDisp[place] = true
            coroinha.placeRotation[place] = 0
        })

        SaveData("AllPlaces",this.allPlaces)
        SaveAcolyteData()
        SaveCoroinhaData()
    }

    static RemovePlace(place:string):void{
        let index = this.allPlaces.indexOf(place)
        if(index == -1){console.error("Place not found!");return}

        this.allPlaces.splice(index,1)

        MemberData.allAcolytes.forEach((acolyte)=>{
            delete acolyte.placeDisp[place]
            delete acolyte.placeRotation[place]
        })

        MemberData.allCoroinhas.forEach((coroinha)=>{
            delete coroinha.placeDisp[place]
            delete coroinha.placeRotation[place]
        })

        SaveData("AllPlaces",this.allPlaces)
        SaveAcolyteData()
        SaveCoroinhaData()
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

    static VerifyPlacesIntegrity(){
        if(this.allPlaces == null){
            this.allPlaces = []
        }
        SaveData("AllPlaces",this.allPlaces)
    }
    
    static async LoadPlaceData(){
        let data = await AsyncStorage.getItem("AllPlaces")
        this.allPlaces = JSON.parse(data)
    }
}
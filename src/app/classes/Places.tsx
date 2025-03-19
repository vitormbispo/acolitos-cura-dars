import AsyncStorage from "@react-native-async-storage/async-storage"
import { MemberData } from "./MemberData"
import { SaveData } from "./Methods"

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
        MemberData.SaveMemberData()
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
        MemberData.SaveMemberData()
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

    static ResetToDefault(){
        this.allPlaces = this.PlacesArray()
        let allMembers = MemberData.GetAllMembers()

        this.VerifyPlacesIntegrity()
        
        
        allMembers.forEach((member)=>{
            let memberPlaces:Array<string> = Object.keys(member.placeDisp)
            
            // Deletar locais
            memberPlaces.forEach((place=>{
                if(!this.allPlaces.includes(place)){ // Caso exista um local que não é padrão
                    delete member.placeDisp[place]
                    delete member.placeRotation[place]
                }
            }))
            
            // Adicionar locais padrão
            this.allPlaces.forEach((place)=>{
                if(!memberPlaces.includes(place)){ // Caso não exista um dos locais padrão
                    member.placeDisp[place] = true
                    member.placeRotation[place] = 0
                }
            })
        })
            
        MemberData.SaveMemberData()
        
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
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

    /**
     * Adiciona um novo local,
     * fazendo também as atualizações necessárias em todos os membros.
     * @param place Nome do local
     */
    static AddPlace(place:string):void{
        this.allPlaces.push(place)

        let allMembers = MemberData.GetAllMembers()
        allMembers.forEach((member)=>{
            member.placeDisp[place] = true
            member.placeRotation[place] = 0
        })

        SaveData("AllPlaces",this.allPlaces)
        MemberData.SaveMemberData()
    }

    /**
     * Remove determinado local pelo seu nome,
     * fazendo também as atualizações necessárias em todos os membros.
     * @param place Nome do local a remover
     * @returns 
     */
    static RemovePlace(place:string):void{
        let index = this.allPlaces.indexOf(place)
        if(index == -1){console.error("Place not found!");return}

        this.allPlaces.splice(index,1)

        let allMembers = MemberData.GetAllMembers()
        allMembers.forEach((member)=>{
            delete member.placeDisp[place]
            delete member.placeRotation[place]
        })

        SaveData("AllPlaces",this.allPlaces)
        MemberData.SaveMemberData()
    }

    /**
     * Renomeia um determinado local,
     * fazendo também as atualizações necessárias em todos os membros.
     * @param place Local
     * @param newPlace Novo nome
     * @returns 
     */
    static RenamePlace(place:string,newPlace:string):void{
        let index = this.allPlaces.indexOf(place)
        if(index == -1){console.error("Place not found!");return}

        let allMembers = MemberData.GetAllMembers()
        allMembers.forEach((member)=>{
            // Cria a chave com os dados da antiga
            member.placeDisp[newPlace] = member.placeDisp[place]
            member.placeRotation[newPlace] = member.placeRotation[place]

            // Deleta as chaves antigas
            delete member.placeDisp[place]
            delete member.placeRotation[place]
        })
        
        this.allPlaces[index] = newPlace

        SaveData("AllPlaces",this.allPlaces)
        MemberData.SaveMemberData()
    }

    /**
     * Renomeia o local com o determinado índice,
     * fazendo também as atualizações necessárias em todos os membros.
     * @param placeIndex Índice alvo
     * @param newPlace Novo nome
     * @returns 
     */
    static RenamePlaceIndex(placeIndex:number,newPlace:string):void{
        if(placeIndex > this.allPlaces.length){console.error("Place index out of range.");return}
        
        let allMembers = MemberData.GetAllMembers()
        let place = this.allPlaces[placeIndex]

        allMembers.forEach((member)=>{
            // Cria a chave com os dados da antiga
            member.placeDisp[newPlace] = member.placeDisp[place]
            member.placeRotation[newPlace] = member.placeRotation[place]

            // Deleta as chaves antigas
            delete member.placeDisp[place]
            delete member.placeRotation[place]
        })

        this.allPlaces[placeIndex] = newPlace

        SaveData("AllPlaces",this.allPlaces)
        MemberData.SaveMemberData()
    }

    /**
     * Retorna uma lista com os nomes dos locais padrão.
     * @returns Array<string>
     */
    static PlacesArray():Array<string>{
        return this.defaultPlaces.slice()
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

    /**
     * Verifica a integridade da lista de locais.
     */
    static VerifyPlacesIntegrity(){
        if(this.allPlaces == null){
            this.allPlaces = []
        }
        SaveData("AllPlaces",this.allPlaces)
    }

    /**
     * Carrega os dados de locais do AsyncStorage
     */
    static async LoadPlaceData(){
        let data = await AsyncStorage.getItem("AllPlaces")
        this.allPlaces = JSON.parse(data)
    }

    /**
     * Organiza uma lista de locais de acordo com a ordem disposta
     * na array original que armazena todos os locais.
     * @param places Lista de locais a organizar
     * @returns 
     */
    static OrganizePlaceArray(places:Array<string>):Array<string>{
        let organized = []
        for(let i = 0; i < Places.allPlaces.length; i++){
            let cur = Places.allPlaces[i]
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
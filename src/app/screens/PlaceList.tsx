import { Pressable, ScrollView, View, Text, Image, Modal } from "react-native";
import { uiStyles } from "../styles/GeneralStyles";
import { RowImageButton, TextButton, TextInputBox, UpperBar } from "../classes/NewComps";
import { ICONS } from "../classes/AssetManager";
import { Places } from "../classes/Places";
import { useRef, useState } from "react";
import { menuStore } from "../store/store";
import { ImageButton } from "../components/ImageButton";

export default function PlaceList(){
    const {theme} = menuStore()
    const [places,setPlaces] = useState(Places.allPlaces.slice())
    const [modalVisible,setModalVisible] = useState(false)
    const [renameModalVisible,setRenameModalVisible] = useState(false)
    const renamingPlace = useRef("")
    let comps = []
    
    for(let i = 0; i < places.length; i++){
        let curPlace = places[i]
        let newComp = <RowPlace name={curPlace} index={i} key={i} 
        deleteAction={()=>{
            Places.RemovePlace(curPlace)
            setPlaces(Places.allPlaces.slice())
        }}
        editAction={()=>{
            renamingPlace.current = curPlace
            setRenameModalVisible(true)
        }}
        />
        comps.push(newComp)
    }
    return(
        <View style={{flex:1,backgroundColor:theme.backgroundColor}}>
            <UpperBar icon={ICONS.home} screenName={"Locais"}/>
            <ScrollView style={{flex:1}}>
                <RowImageButton img={ICONS.home} text={"Adicionar novo local"} press={()=>{
                    setModalVisible(!modalVisible)}}/>
                <RowImageButton img={ICONS.home} text={"Restaurar ao padrão"} press={()=>{
                    Places.ResetToDefault()
                    setPlaces(Places.allPlaces.slice())}}
                    />
                {comps} 
            </ScrollView>
            <AddModal visible={modalVisible} places={Places.allPlaces} requestClose={()=>{setModalVisible(false)}} 
                onSubmit={()=>{
                    setModalVisible(false)
                    setPlaces(Places.allPlaces.slice())
                    }}/>

            <RenameModal visible={renameModalVisible} places={places} place={renamingPlace.current} requestClose={()=>{setRenameModalVisible(false)}} 
                onSubmit={()=>{
                    setRenameModalVisible(false)
                    setPlaces(Places.allPlaces.slice())
                }}/>
        </View>  
    )
}

type RowPlaceProps = {
    name:string
    index:number
    deleteAction: (...args:any) => any
    editAction: (...args:any) => any
}

function RowPlace(props:RowPlaceProps){
    return(
        <Pressable style={{alignContent:"center",alignItems:"center",flexDirection:"row",width:"100%",backgroundColor:"#FFFFFF"}} onPress={()=>{

        }}>
            <Image style={uiStyles.buttonIcon} source={ICONS.home}/>
            <Text>{props.name}</Text>
            <View style={{flex:1}}/>
            
            <ImageButton buttonStyle={{alignSelf:"center"}}imgStyle={[uiStyles.buttonIcon]} img={ICONS.delete} press={()=>{
                props.deleteAction()
            }}/>

            <ImageButton buttonStyle={{alignSelf:"center"}}imgStyle={[uiStyles.buttonIcon]} img={ICONS.edit} press={()=>{
                props.editAction()
            }}/>
            
        </Pressable>
    )
}

type AddModalProps = {
    visible:boolean
    places:Array<string>
    requestClose?:(...args:any) => any
    onSubmit?:(...args:any) => any
}
function AddModal(props:AddModalProps){
    const {theme} = menuStore()
    
    let placeName = ""
    return(
        <Modal visible={props.visible} animationType="fade" transparent={true} onRequestClose={()=>{props.requestClose != undefined ? props.requestClose() : null}}>
            <Pressable style={{flex:1,justifyContent:"center"}} onPress={()=>{props.requestClose()}}>
                <View style={{alignSelf:"center",justifyContent:"center",height:"40%",width:"80%",backgroundColor:theme.accentColor,borderRadius:50}}>
                    
                    <TextInputBox title={"Nome do local: "} boxBelow={true} placeholder="Local..." onChangeText={(text)=>{placeName=text}}/>
                    <TextButton text={"Concluir"} press={()=>{;
                        if(placeName != "" && placeName != undefined && placeName != null){
                            Places.AddPlace(placeName)
                            props.visible = false
                            placeName = ""
                        }
                        else{
                            console.error("Invalid place name.")
                        }
                        props.onSubmit != undefined ? props.onSubmit() : null
                    }}/>
                </View>
            </Pressable>
            
        </Modal>
    )
}

type RenameModalProps = {
    visible:boolean
    places:Array<string>
    place:string
    requestClose?:(...args:any) => any
    onSubmit?:(...args:any) => any
}
function RenameModal(props:RenameModalProps){
    const {theme} = menuStore()
    
    let placeName = props.place
    return(
        <Modal visible={props.visible} animationType="fade" transparent={true} onRequestClose={()=>{props.requestClose != undefined ? props.requestClose() : null}}>
            <Pressable style={{flex:1,justifyContent:"center"}} onPress={()=>{props.requestClose()}}>
                <View style={{alignSelf:"center",justifyContent:"center",height:"40%",width:"80%",backgroundColor:theme.accentColor,borderRadius:50}}>
                    
                    <TextInputBox title={"Novo nome: "} boxBelow={true} default={props.place} onChangeText={(text)=>{placeName=text}}/>
                    <TextButton text={"Concluir"} press={()=>{;
                        if(placeName != "" && placeName != undefined && placeName != null){
                            Places.RenamePlace(props.place,placeName)
                        }
                        else{
                            console.error("Invalid place name.")
                        }
                        props.onSubmit != undefined ? props.onSubmit() : null
                    }}/>
                </View>
            </Pressable>
            
        </Modal>
    )
}
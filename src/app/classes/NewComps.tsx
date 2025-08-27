import { useEffect, useRef, useState } from "react";
import { View,Text,Image, Pressable, TextInput, KeyboardTypeOptions, Modal, ScrollView, ActivityIndicator, Dimensions, FlatList, Button} from "react-native"
import { Href, router} from "expo-router"
import { textStyles, uiStyles } from "../styles/GeneralStyles";
import { contextStore, menuStore } from "../store/store";
import { Member, MemberIDList, MembersFromIDs, MemberType } from "./MemberData";
import { ICONS } from "./AssetManager";
import { Lineup } from "./Lineup";
import { GetLineupUnvailableMembers, GetMemberArray } from "./Methods";
import Rive from 'rive-react-native'
import { ImageButton } from "../components/buttons/ImageButton";
import { TextButton } from "../components/buttons/TextButton";
import { CheckBox } from "../components/input/CheckBox";
const USER_ICONS = [require("@/src/app/item_icons/acolito_ico.png"),require("@/src/app/item_icons/coroinha_ico.png")]
const ADD_ICONS = [require("@/src/app/item_icons/add_acolito_ico.png"),require("@/src/app/item_icons/add_coroinha_ico.png")]

/** Retorna o ícone de usuário referente ao tipo de menu atual contido
 * na menuStore: acólito ou coroinha
* 
* @returns Ícone de usuário
*/
export function GetMemberIcon() {
  const {type} = menuStore()
  return USER_ICONS[type]
}

/** Retorna o ícone de adicionar usuário referente ao tipo de menu atual contido
 * na menuStore: acólito ou coroinha
* 
* @returns Ícone de adicionar usuário
*/
export function GetMemberAddIcon(){
  const {type} = menuStore()
  return ADD_ICONS[type]
}




















            
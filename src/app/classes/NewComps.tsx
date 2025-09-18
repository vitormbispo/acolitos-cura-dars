import { menuStore } from "../store/store";

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




















            
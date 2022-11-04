import {get, limitToFirst, query, ref} from "firebase/database";
import {db} from "./initialize";
import {Chats, Message} from "../types";
import {TreeNode} from "react-dropdown-tree-select";

export function getUser(uid: string, setUser: (user: any) => void) {
    get(ref(db, '/users/' + uid))
        .then(snap => snap.val() && setUser(snap.val()))
}

export function getChats(interests: string[], setChats: (chats: Chats) => void) {
    get(ref(db, '/chats'))
        .then(snap => {
            let chats = snap.val()
            let currChats: Chats = {}
            Object.keys(chats).map(key => {
                if (interests.includes(chats[key].interest)) {
                    currChats[key] = chats[key]
                }
            })

            setChats(currChats)
        })
}

export function getChat(uid: string, setChats: (chat: any, uid: string) => void) {
    get(ref(db, '/chats/' + uid))
        .then(snap => snap.val() && setChats(snap.val(), uid))
        .catch(error => console.log(error))
}

export function getFirstMessage(chatUid: string, setMessage: (message: any) => void) {
    const chatMessageRef = ref(db, '/messages/' + chatUid)
    get(query(chatMessageRef, limitToFirst(1)))
        .then(snap => snap.val() && setMessage(Object.values(snap.val())))
}

export function getMessages(uid: string, setMessages: (messages: Message[]) => void) {
    get(ref(db, '/messages/' + uid))
        .then(snap => snap.val() && setMessages(Object.values(snap.val())))
}

export function getSecondaryInterests(key: string, setInterests: (interests: TreeNode[]) => void) {
    get(ref(db, '/Interests/' + key))
        .then(snap => {
            if (snap.val())
                setInterests((snap.val() as string[]).map(value => ({value, label: value})))
        })
}

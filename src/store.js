import { get, writable } from "svelte/store"
import io from 'socket.io-client'

const defaultSettings = {
    chatEnabled: false,
    chatNotifications: false,
    mute: false,
}

export const socketStore = writable(io({transports: ['websocket'], upgrade: false}))
const localSession = localStorage.getItem("sessionId")
export const sessionStore = writable(localSession)
sessionStore.subscribe(value => localStorage.setItem("sessionId", value))
const localSettings = JSON.parse(localStorage.getItem("settings"))
export const settingsStore = writable(localSettings || defaultSettings)
settingsStore.subscribe(value => localStorage.setItem("settings", JSON.stringify(value)))
export const userStore = writable({})
export const roomStore = writable({})

roomStore.getUserTeam = (userId) => {
    return get(roomStore).players.find(player => player.userId === userId).team
}

roomStore.getTeamPlayers = (teamId) => {
    return get(roomStore).players.filter((player) => (player.team === teamId))
}

roomStore.getTeamColors = () => {
    return Object.assign({}, ...get(roomStore).teams.map((team) => ({[team.id]: team.color})))
}

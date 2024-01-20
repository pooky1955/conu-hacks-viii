export class RoomStore {
    constructor() {
        this.rooms = [];
    }

    findRoom(id) {
        return this.rooms.find(room => room.id == id);
    }

    findRoomByPlayer(id) {
        return this.rooms.find(room => room.players.find(player => player.userId == id));
    }

    findPlayerTeamId(id, room = null) {
        room = room ? this.findRoomByPlayer(id) : room
        if (room) {
            return room.players.find(player => player.userId == id).team;
        }
    }

    createRoom(room) {
        this.rooms.push(room);
    }

    updateRoom(roomId, room) {  
        const index = this.rooms.findIndex(room => room.id == roomId);
        this.rooms[index] = room;
    }
    
    deleteRoom(roomId) {
        const index = this.rooms.findIndex(room => room.id == roomId);
        this.rooms.splice(index, 1);
    }

    findAllRooms() {
        return this.rooms;
    }
}
export class SessionStore {
    constructor() {
        this.sessions = new Map();
    }

    findSession(id) {
        return this.sessions.get(id);
    }

    findUser(id) {
        return this.findAllSessions().find(session => session.userId == id);
    }

    createSession(id, session) {
        this.sessions.set(id, session);
    }

    findAllSessions() {
        return [...this.sessions.values()];
    }
}
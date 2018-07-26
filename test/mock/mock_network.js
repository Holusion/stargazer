class MockPlaylistItem{
    constructor({active = false, rank = 0, path = "", name = "", current = false}){
        this.active = active;
        this.rank = rank;
        this.path = path;
        this.name = name;
        if(current) this.current = true;
    }
}

class MockNetwork {
    constructor(playlist) {
        this.playlist = playlist
    }

    
    async getPlaylist() {
        return Promise.resolve(this.playlist);
    }

    async getCurrent() {
        return Promise.resolve(this.playlist.filter(e => e.hasOwnProperty('current'))[0]);
    }
    
    synchronize() {
        return true;
    }
    
    endSynchronize() {
        return true;
    }
    
    async toggleActivation(elem) {
        let e = this.playlist.filter(n => n.name == elem.name)[0];
        e.active = !e.active;
        return true;
    }
    
    async play(elem) {
        for(let e of this.playlist) {
            delete e.current;
        }

        let e = this.playlist.filter(n => n.name == elem.name)[0];
        e.current = true;
        return true;
    }
    
    async remove(elem) {
        let e = this.playlist.filter(n => n.name == elem.name)[0];
        delete this.playlist[this.playlist.indexOf(e)];
        this.playlist = this.playlist.filter(n => n != undefined);
        this.playlist[0].current = true;
        
        return true;
    }
}


module.exports = {MockNetwork, MockPlaylistItem}
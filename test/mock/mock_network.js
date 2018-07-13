class MockNetwork {
    constructor() {
        this.playlist = [
            {
                active: false,
                rank: 1,
                path: '/foo/foo.mp4',
                name: 'foo'
            },
            {
                active: true,
                current: true,
                rank: 2,
                path: '/foo/bar.mp4',
                name: 'bar'
            },
            {
                active: true,
                rank: 3,
                path: '/foo/baz.mp4',
                name: 'baz'
            }
        ]
    }

    
    getPlaylist() {
        return Promise.resolve(this.playlist);
    }

    getCurrent() {
        let current = this.playlist.filter(e => e.current)[0];
        return Promise.resolve(current);
    }
    
    synchronize() {
        return true;
    }
    
    endSynchronize() {
        return true;
    }
    
    toggleActivation(elem) {
        let e = this.playlist.filter(n => n.name == elem.name)[0];
        e.active = !e.active;
        return true;
    }
    
    play(elem) {
        let e = this.playlist.filter(n => n.name == elem.name)[0];
        e.current = true;
        return true;
    }
    
    remove(elem) {
        let e = this.playlist.filter(n => n.name == elem.name)[0];
        delete this.playlist[this.playlist.indexOf(e)];
        this.playlist = this.playlist.filter(n => n != undefined);
        return true;
    }
}


module.exports = {MockNetwork}
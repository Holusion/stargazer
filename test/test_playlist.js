'use strict'

const {Playlist} = require('../lib/components/Playlist');
const {MockNetwork, MockPlaylistItem} = require('./mock/mock_network');

describe('Playlist', () => {
    beforeEach(function () {
        this.network = new MockNetwork([
            new MockPlaylistItem({
                active: false,
                rank: 1,
                path: '/foo/foo.mp4',
                name: 'foo'
            }),
            new MockPlaylistItem({
                active: true,
                current: true,
                rank: 2,
                path: '/foo/bar.mp4',
                name: 'bar'
            }),
            new MockPlaylistItem({
                active: true,
                rank: 3,
                path: '/foo/baz.mp4',
                name: 'baz'
            })
        ]);
        this.playlist = new Playlist(this.network, {render: (list) => console.log(''), updateCurrent: () => console.log('')});
        this.playlist.current = 'bar';
    })

    describe('Playlist - network', function() {
        it('.toggleActiveItem', async function() {
            await this.playlist.toggleActiveItem(this.network.playlist[0]);
            expect(this.playlist.medias[0].active).to.equal(true);
    
            await this.playlist.toggleActiveItem(this.network.playlist[1]);
            expect(this.playlist.medias[1].active).to.equal(false);
        })
    
        it('.playItem', async function() {
            await this.playlist.playItem(this.network.playlist[2]);
            expect(this.playlist.current).to.equal('baz');
        })
    
        it('.removeItem', async function() {
            await this.playlist.removeItem(this.network.playlist[0]);
            expect(this.playlist.medias.length).to.equal(2);
        })
    })

    describe('Playlist - medias', function() {
        it('.selectItem', async function() {
            await this.playlist.selectItem(this.network.playlist[0]);
            await this.playlist.selectItem(this.network.playlist[1]);
            expect(this.playlist.medias[0]).to.have.property('selected');
            expect(this.playlist.medias[1]).to.have.property('selected');
        })
    
        it('.unselectItem', async function() {
            await this.playlist.selectItem(this.network.playlist[0]);
            expect(this.playlist.medias[0]).to.have.property('selected');
            await this.playlist.unselectItem(this.network.playlist[0]);
            expect(this.playlist.medias[0]).to.not.have.property('selected');
        })

        it('.filter', async function() {
            this.playlist.filterOption = {active: (e) => e.active == true};
            let res = this.network.playlist.filter(info => this.playlist.filter(info));
            expect(res.length).to.equal(2);
        })
    })
    
})
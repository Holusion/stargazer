'use strict'

const {Playlist} = require('../lib/components/Playlist');
const {MockNetwork} = require('./mock/mock_network');

describe('Playlist - network', () => {
    beforeEach(function () {
        this.network = new MockNetwork();
        this.playlist = new Playlist(this.network, {render: (list) => console.log(''), updateCurrent: () => console.log('')});
        this.playlist.current = 'bar';
    })
    
    it('.toggleActiveItem', async function() {
        await this.playlist.toggleActiveItem(this.network.playlist[0]);
        await expect(this.network.playlist[0].active).to.equal(true);
        await expect(this.playlist.medias[0].active).to.equal(true);

        await this.playlist.toggleActiveItem(this.network.playlist[1]);
        await expect(this.network.playlist[1].active).to.equal(false);
        await expect(this.playlist.medias[1].active).to.equal(false);
    })

    it('.playItem', async function() {
        await this.playlist.playItem(this.network.playlist[2]);
        await expect(this.network.playlist[1]).to.not.have.property('current');
        await expect(this.network.playlist[2].current).to.equal(true);
        await expect(this.network.playlist[2].start).to.equal('false');
        await expect(this.playlist.current).to.equal('baz');
    })

    it('.removeItem', async function() {
        await this.playlist.removeItem(this.network.playlist[0]);
        await expect(this.playlist.medias.length).to.equal(2);
    })
})
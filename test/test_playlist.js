'use strict'

const {Playlist} = require('../lib/components/Playlist');
const {MockNetwork} = require('./mock/mock_network');

describe('Playlist', () => {
    beforeEach(async function () {
        this.network = await new MockNetwork();
        this.playlist = await new Playlist(this.network, {render: (list) => console.log(''), updateCurrent: () => console.log('')});
        this.playlist.current = 'bar';
    })

    describe('Playlist - network', function() {
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

    describe('Playlist - medias', function() {
        it('.selectItem', async function() {
            await this.playlist.selectItem(this.network.playlist[0]);
            await this.playlist.selectItem(this.network.playlist[1]);
            await expect(this.playlist.medias[0]).to.have.property('selected');
            await expect(this.playlist.medias[1]).to.have.property('selected');
        })
    
        it('.unselectItem', async function() {
            await this.playlist.selectItem(this.network.playlist[0]);
            await expect(this.playlist.medias[0]).to.have.property('selected');
            await this.playlist.unselectItem(this.network.playlist[0]);
            await expect(this.playlist.medias[0]).to.not.have.property('selected');
        })

        it('.filter', async function() {
            this.playlist.filterOption = {active: (e) => e.active == true};
            let res = this.network.playlist.filter(info => this.playlist.filter(info));
            await expect(res.length).to.equal(2);
        })
    })
    
})
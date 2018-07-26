'use strict'

const {MockNetwork, MockPlaylistItem} = require('./mock/mock_network');

describe('MockNetwork', () => {
    beforeEach(function () {
        this.playlist = [
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
        ];
        this.network = new MockNetwork(this.playlist);
    })

    it('.toggleActivation', async function() {
        await this.network.toggleActivation(this.network.playlist[0]);
        expect(this.network.playlist[0].active).to.equal(true);

        await this.network.toggleActivation(this.network.playlist[1]);
        expect(this.network.playlist[1].active).to.equal(false);
    })

    it('.play', async function() {
        await this.network.play(this.network.playlist[2]);
        expect(this.network.playlist[1]).to.not.have.property('current');
        expect(this.network.playlist[2].current).to.equal(true);
    })

    it('.remove', async function() {
        await this.network.remove(this.network.playlist[0]);
        expect(this.network.playlist.length).to.equal(2);
    })

    it('.getCurrent', async function() {
        let res = await this.network.getCurrent();
        expect(res.current).to.equal(true);
    })
})
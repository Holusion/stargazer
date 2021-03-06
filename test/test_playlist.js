'use strict'

const {Playlist} = require('../lib/components/Playlist');
const {MediaNotFound} = require('../lib/errors/MediaNotFound');
const {MockNetwork, MockPlaylistItem} = require('./mock/mock_network');

const playlistSandbox = sandbox();
const networkSandbox = sandbox();

// To check method calling : http://www.chaijs.com/plugins/chai-spies/

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
        this.playlist = new Playlist(this.network);
        this.playlist.current = 'bar';

        playlistSandbox.on(this.playlist, ['updatePlaylist', 'updateCurrent']);
        networkSandbox.on(this.network, ['remove', 'play', 'toggleActivation', 'getPlaylist', 'getCurrent']);
    })
    afterEach(function() {
        playlistSandbox.restore();
        networkSandbox.restore();
    })

    describe('Playlist - network', function() {
        describe('.toggleActiveItem', function() {
            it('Check medias', async function() {
                await this.playlist.toggleActiveItem(this.network.playlist[0]);
                expect(this.playlist.medias[0].active).to.equal(true);
        
                await this.playlist.toggleActiveItem(this.network.playlist[1]);
                expect(this.playlist.medias[1].active).to.equal(false);
            })
            it('Check network function call', async function() {
                await this.playlist.toggleActiveItem(this.network.playlist[0]);
                expect(this.network.toggleActivation).to.have.been.called.with(this.network.playlist[0]);
            })
        })

        describe('.playItem', function() {
            it('Check medias', async function() {
                await this.playlist.playItem(this.network.playlist[2]);
                expect(this.playlist.current).to.equal('baz');
            })

            it('Check playlist function call', async function() {
                await this.playlist.playItem(this.network.playlist[2]);
                expect(this.playlist.updateCurrent).to.have.been.called.with(this.network.playlist[2]);
            })

            it('Check network function call', async function() {
                await this.playlist.playItem(this.network.playlist[2]);
                expect(this.network.play).to.have.been.called.with(this.network.playlist[2]);
            })
        })

        describe('.remoevItem', function() {
            it('Check medias', async function() {
                await this.playlist.removeItem(this.network.playlist[0]);
                expect(this.playlist.medias.length).to.equal(2);
            })
            
            it('Check playlist function call', async function() {
                await this.playlist.removeItem(this.network.playlist[0]);
                expect(this.playlist.updatePlaylist).to.have.been.called();
            })

            it('Check network function call', async function() {
                let e = this.network.playlist[0];
                await this.playlist.removeItem(this.network.playlist[0]);
                expect(this.network.remove).to.have.been.called.with(e);
            })
        })
    })

    describe('Playlist - medias', function() {
        describe('.updatePlaylist', function() {
            it('Check network.getPlaylist called', async function() {
                await this.playlist.updatePlaylist();
                expect(this.network.getPlaylist).to.have.been.called();
            })
            it('Check network.getCurrent called', async function() {
                await this.playlist.updatePlaylist();
                expect(this.network.getCurrent).to.have.been.called();
            })
            it('Check playlist.updateCurrent called', async function() {
                let current = this.network.playlist[1];
                await this.playlist.updatePlaylist();
                expect(this.playlist.updateCurrent).to.have.been.called.with(current);
            })
            it('Check playlist.updateCurrent called with no current', async function() {
                this.network.playlist = [new MockPlaylistItem({
                    active: false,
                    rank: 1,
                    path: '/foo/foo.mp4',
                    name: 'foo'
                })];
                await this.playlist.updatePlaylist();
                expect(this.playlist.updateCurrent).to.not.have.been.called();
            })
        })

        describe('._getMediaByName', function() {
            it('get the media when exists', function() {
                const media = this.playlist._getMediaByName('foo');
                expect(media).to.equal(this.network.playlist[0]);
            })
            it('throw MediaNotFound if the media not exists', function () {
                expect(() => this.playlist._getMediaByName('error')).to.throw(MediaNotFound);
            })
        })

        describe(".selectItem", function() {
            it('when items exists', function() {
                this.playlist.selectItem(this.network.playlist[0]);
                this.playlist.selectItem(this.network.playlist[1]);
                expect(this.playlist.medias[0]).to.have.property('selected');
                expect(this.playlist.medias[1]).to.have.property('selected');
            })

            it('when items not exists', function() {
                expect(() => this.playlist.selectItem({name: 'error'})).to.throw(MediaNotFound);
            })
        })
        
        describe('.unselectItem', function() {
            it('when items exists', function() {
                this.playlist.selectItem(this.network.playlist[0]);
                expect(this.playlist.medias[0]).to.have.property('selected');
                this.playlist.unselectItem(this.network.playlist[0]);
                expect(this.playlist.medias[0]).to.not.have.property('selected');
            })

            it('when items not exists', function() {
                expect(() => this.playlist.unselectItem({name: 'error'})).to.throw(MediaNotFound);
            })
        })

        describe('.selectAllItem', function() {
            it('basic usage', function() {
                this.playlist.selectAllItem();
                for(let m of this.playlist.medias) {
                    expect(m).to.have.property('selected');
                }
            })
        })

        describe('.unselectAllItem', function() {
            it('when all selected', function() {
                this.playlist.selectAllItem();
                this.playlist.unselectAllItem();
                for(let m of this.playlist.medias) {
                    expect(m).to.not.have.property('selected');
                }
            })

            it('when not all selected', function() {
                this.playlist.selectItem(this.network.playlist[0]);
                this.playlist.unselectAllItem();
                for(let m of this.playlist.medias) {
                    expect(m).to.not.have.property('selected');
                }
            })
        })

        describe(".filter", function() {
            it('when property exists', function() {
                this.playlist.filterOption = {active: (e) => e.active == true};
                let res = this.network.playlist.filter(info => this.playlist.filter(info));
                expect(res.length).to.equal(2);
            })
            it('when property not exists', function() {
                this.playlist.filterOption = {foo: (e) => e.foo == 'bar'};
                let res = this.network.playlist.filter(info => this.playlist.filter(info));
                expect(res.length).to.equal(0);
            })
        })
    })
    
})
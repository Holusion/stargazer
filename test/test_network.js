'use strict'

const {Network} = require('../lib/network')
const {ErrorWrapper} = require('../lib/errors/ErrorWrapper')

const fetchMock = require("fetch-mock");

const playlist = [
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

const badUrl = (promise, arg) => async () => {
    let network = new Network("192.168.1.2");
    try {
        await network[promise](arg);
        expect.fail();
    } catch(err) {
        expect(err).to.be.an.instanceof(ErrorWrapper);
    }
}

describe("Network", () => {
    beforeEach(async () => {
        fetchMock
            .mock("http://192.168.1.1/playlist", playlist)
            .mock("http://192.168.1.1/control/current", playlist.filter(e => e.current)[0])
            .mock("http://192.168.1.1/playlist", 200, {method: "put", overwriteRoutes: false})
            .mock("http://192.168.1.1/control/current/bar", 200, {method: "put"})
            .mock("http://192.168.1.1/medias/bar", 200, {method: "delete"})
    })
    
    afterEach(() => {
        fetchMock.restore();
    })
    
    describe(".getPlaylist", () => {
        it("when url exists", async () => {
            let network = new Network("192.168.1.1");
            let res = await network.getPlaylist();
            expect(res).to.deep.equal(playlist);
        });

        it("when bad url", badUrl("getPlaylist"))
    })

    describe('.toggleActivation', () => {
        it('when good url', async () => {
            let network = new Network("192.168.1.1");
            let res = await network.toggleActivation({name: "foo"});
            expect(res.url).to.equal("http://192.168.1.1/playlist");
            expect(res.status).to.equal(200);
        })

        it("when bad url", async () => {
            badUrl("toggleActivation", {name: 'foo'});
        })
    })

    describe('.play', () => {
        it('when good url', async () => {
            let network = new Network("192.168.1.1");
            let res = await network.play({name: "bar"});
            expect(res.url).to.equal("http://192.168.1.1/control/current/bar");
            expect(res.status).to.equal(200);
        })

        it("when bad url", async () => {
            badUrl("play", "bar");
        })
    })

    describe('.remove', () => {
        it('when good url', async () => {
            let network = new Network("192.168.1.1");
            let res = await network.remove({name: "bar"});
            expect(res.url).to.equal("http://192.168.1.1/medias/bar");
            expect(res.status).to.equal(200);
        })

        it("when bad url", async () => {
            badUrl("remove", "bar");
        })
    })

    describe('.getCurrent', () => {
        it("when good url", async () => {
            let network = new Network("192.168.1.1");
            let res = await network.getCurrent();
            expect(res).to.deep.equal({active: true, current: true, rank: 2, path: '/foo/bar.mp4', name: 'bar'});
        })

        it("when bad url", async () => {
            badUrl("getCurrent");
        })
    })
})

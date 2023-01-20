import { WordVectorProvider } from './word-vector.provider';

describe('WordVectorProvider', () => {
    let wordVectorProvider: WordVectorProvider;

    beforeEach(() => {
        wordVectorProvider = new WordVectorProvider();
    });

    describe('extractWords', () => {
        it('should extract all words from a simple object', () => {
            const obj = {
                key1: "Hello world",
                key2: "foo bar baz",
                key3: "qux quux quuz"
            };
            const expected = [ 'world', 'foo', 'bar', 'baz', 'qux', 'quux', 'quuz'];
            expect(wordVectorProvider.extractWords(obj)).toEqual(expected);
        });

        it('should extract all words from a complex object', () => {
            const obj = {
                _id: 3853,
                films: [],
                shortFilms: [],
                tvShows: [
                    "Pickle and Peanut"
                ],
                videoGames: [],
                parkAttractions: [],
                allies: [],
                enemies: [],
                name: "Lazer",
                imageUrl: "https://static.wikia.nocookie.net/disney/images/6/6c/Lazer.png",
                url: "https://api.disneyapi.dev/characters/3853"
            };
            const expected = ['Pickle', 'Peanut', 'Lazer',  '3853'];
            expect(wordVectorProvider.extractWords(obj)).toEqual(expected);
        });

        it('should filter out duplicates and stop words', () => {
            const obj = {
                key1: "Hello world",
                key2: "Hello world"
            };
            const expected = [ 'world'];
            expect(wordVectorProvider.extractWords(obj)).toEqual(expected);
        });

        it('should split the words by "." and "/" and remove words like https', () => {
            const obj = {
                key1: "Hello world.foo/bar https://example.com",
                key2: "Hello world.foo/bar https://example.com"
            };
            const expected = [ 'world', 'foo', 'bar'];
            expect(wordVectorProvider.extractWords(obj)).toEqual(expected);
        });

    });
});

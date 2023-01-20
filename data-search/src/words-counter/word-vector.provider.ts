import { Injectable } from '@nestjs/common';

const stopwords = require('stopwords').english;
const additionalStopWords = ["the","disney","images","api","disneyapi","characters","dev","net","nocookie","wikia","static","jpg","png","jpeg"]
stopwords.push(...additionalStopWords);
@Injectable()
export class WordVectorProvider {
    extractWords(obj: object): string[] {
        let wordVector = [];
        for (let key in obj) {
            if (typeof obj[key] === "string") {
                let value = obj[key].replace(/https:\/\/|http:\/\/|\(|\)/gi, '');
                let words = value.split(/[\s\/.]+/);
                words.forEach(word => {
                    if (!stopwords.includes(word.toLowerCase())&&word.length>2&&!Number.isInteger(word)) {
                        wordVector.push(word);
                    }
                });
            } else if (typeof obj[key] === "object") {
                wordVector = [...wordVector, ...this.extractWords(obj[key])];
            }
        }
        return [...new Set(wordVector)];
    }
}

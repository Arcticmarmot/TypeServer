/*
export interface Sentence{
    state;
}
export interface Word{
    value: string;
    state: 'typing' | 'untyped' | 'typed-right' | 'typed-error' | unknown;
}
*/

const canEnter = /[\w,./;'\[\]\\=\-_+{}|":?><)(*&^%$#@!~` ]/;
const endSpace = /\s*$/g;
exports.transFile = (data)=>{
    let sentences = getSentence(deleteSpace(transChar(data)));
    const words = getWords(sentences);
    return {sentences:sentences.map(s=> {
            return {state:s.state}
        }),words:words}
};
deleteSpace = (data)=>{
    const sentences = data.split('\n').filter(e => e.trim()).map(e=>e.replace(endSpace,''));
    return sentences.join('\n');
};
//同时也会替换掉代码原意中的 \t \r
transChar = (data) => {
    data = data.replace(/\t/g,'    ').replace(/\r/g,'');
    return data;
};
getSentence = (data)=>{
    const st = [];
    const sentences = data.split('\n');
    for(const s in sentences){
        st.push({content: sentences[s],state: "untyped"})
    }
    st[0].state = 'typing';
    return st;
};
ifUnknown = (w)=>{
    return !w.match(canEnter);
};
getWords = (st)=>{
    const words = [];
    for(const s in st){
        const sentence = st[s].content.split('');
        const sentenceWords = [];
        for(const w in sentence){
            if(ifUnknown(sentence[w])){
                sentenceWords.push({value: sentence[w], state: 'unknown'});
            }else{
                sentenceWords.push({value: sentence[w], state: 'untyped'});
            }
        }
        words.push(sentenceWords);
    }
    words[0][0].state = 'typing';
    return words;
};


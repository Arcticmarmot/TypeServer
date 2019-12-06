const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
let db = null;

MongoClient.connect(url, { useNewUrlParser: true }).then(client => {
    console.log('connected...');
    const type_ = client.db("Type");
    type_.createCollection('auth_documents').then(res=>{
        db = type_.collection('auth_documents');
    }).catch(err=>{
        throw err;
    })
}).catch(err=>{
    throw err;
});

class AuthDocument{
    constructor(obj){
        for(let key in obj){
            this[key] = obj[key];
        }
    }

    insert(cb){
        db.insertOne(this,{w:1}).then((data)=>{
            console.log('insert succeeded');
            cb(null,data);
        }).catch(err=>{
            cb(err);
        });
    }
    static find_all(){
        return db.find({},{projection:{_id:1,title:1,language:1,public:1,auth:1},sort:{createDate:-1}});
    }
    static find_by_id(id,cb){
        db.findOne({_id: id}).then((doc)=>{
            cb(null,doc)
        }).catch(err=>{
            cb(err);
        })
    }



}
module.exports = AuthDocument;

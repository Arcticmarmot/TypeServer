const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
let db = null;

MongoClient.connect(url, { useNewUrlParser: true }).then(client => {
    console.log('connected...');
    const type_ = client.db("Type");
    type_.createCollection('documents').then(res=>{
        db= type_.collection('pins');
        db.createIndex({ "createdAt": 1 },{expireAfterSeconds:600}).then(data=>{
            console.log('ttl succeed')
        }).catch(err=>{
            throw err;
        });
    }).catch(err=>{
        throw err;
    })
}).catch(err=>{
    throw err;
});

class Pin{
    constructor(obj){
        for(let key in obj){
            this[key] = obj[key];
        }
    }
    insert(cb){
        db.insertOne(this,{w:1}).then((data)=>{
            cb(null,data);
        }).catch(err=>{
            cb(err);
        });
    }
    static get_pin_by_email(email,cb){
        db.findOne({email:email}).then((data)=>{
            cb(null,data)
        }).catch((err)=>{
            cb(err);
        });
    }
    static update(email,pin,cb){
        db.updateOne({email:email},{$set:{pin:pin}}).then((data)=>{
            cb(null,data);
        }).catch((err)=>{
            cb(err);
        });
    }
}
module.exports = Pin;

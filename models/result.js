const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
let db = null;
const user = require('./user');
MongoClient.connect(url, { useNewUrlParser: true }).then(client => {
    console.log('connected...');
    const type_ = client.db("Type");
    type_.createCollection('documents').then(res=>{
        db= type_.collection('results');
    }).catch(err=>{
        throw err;
    })
}).catch(err=>{
    throw err;
});

class Result{
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
    static find_by_ids_twenty(arr){
        return db.find({_id:{$in:arr}},{sort:{createDate:-1},limit:20})
    }
    static find_by_ids(arr){
        return db.find({_id:{$in:arr}},{sort:{createDate:-1}})
    }
    static remove_expired(cb){
        const deleteIds = [];
        user.find().toArray().then(data=>{
            let recs = data.map(e=>e.records);
            for(const i in recs){
                deleteIds.push(...(recs[i].slice(10)));
            }
            Result.remove(deleteIds,(err,data)=>{
                if(err) return cb(err);
                cb(data);
            })
        }).catch(err=>{
            cb(err)
        })
    }
    static remove(ids,cb){
        db.removeMany({_id:{$in:ids}},(err,data)=>{
            if(err) return cb(err);
            cb(null,data);
        })
    }

}
module.exports = Result;

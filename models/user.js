const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
let db = null;

MongoClient.connect(url, { useNewUrlParser: true }).then(client => {
    console.log('connected...');
    const type_ = client.db("Type");
    type_.createCollection('documents').then(res=>{
        db= type_.collection('users');
    }).catch(err=>{
        throw err;
    })
}).catch(err=>{
    throw err;
});

class User{
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
    static find(){
        return db.find({},{projection:{records:1},sort:{createDate:-1}});
    }
    static find_by_email(email,cb){
        db.findOne({email:email}).then((doc)=>{
            cb(null,doc)
        }).catch((err)=>{
            cb(err);
        });
    }
    static find_by_email_records(email,cb){
        db.findOne({email:email},{projection:{records: 1}}).then((doc)=>{
            cb(null,doc)
        }).catch((err)=>{
            cb(err);
        });
    }
    static find_by_email_documents(email,cb){
        db.findOne({email:email},{projection:{documents: 1}}).then((doc)=>{
            cb(null,doc)
        }).catch((err)=>{
            cb(err);
        });
    }
    static insert_record(email,recordID,cb){
        db.updateOne({email:email},{$addToSet:{records:recordID}}).then((data)=>{
            cb(null,data);
        }).catch((err)=>{
            cb(err);
        })
    }
    static insert_document(email,documentID,cb){
        db.updateOne({email:email},{$addToSet:{documents:documentID}}).then((data)=>{
            cb(null,data);
        }).catch((err)=>{
            cb(err);
        })
    }
    static update_username(email,value,cb){
        db.updateOne({email:email},{$set:{username:value}}).then((data)=>{
            cb(null,data);
        }).catch((err)=>{
            cb(err);
        })
    }
    static update_password(email,value,cb){
        db.updateOne({email:email},{$set:{password:value}}).then((data)=>{
            cb(null,data);
        }).catch((err)=>{
            cb(err);
        })
    }
    static countTypingTime(email,t,cb){
        db.updateOne({email:email},{$set:{typingTime:t}}).then((data)=>{
            cb(null,data);
        }).catch(err=>{
            cb(err)
        })
    }
    static get_typing_time(email,cb){
        db.findOne({email:email},{projection:{typingTime: 1}}).then((data)=>{
            cb(null,data);
        }).catch(err=>{
            cb(err);
        })
    }
}
module.exports = User;

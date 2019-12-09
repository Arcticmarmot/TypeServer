const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const user = require('./user');
let db = null;

MongoClient.connect(url, { useNewUrlParser: true }).then(client => {
    console.log('connected...');
    const type_ = client.db("Type");
    type_.createCollection('documents').then(res=>{
        db = type_.collection('documents');
    }).catch(err=>{
        throw err;
    })
}).catch(err=>{
    throw err;
});

class Document{
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
    static find_by_ids(arr){
        return db.find({_id:{$in:arr}},{projection:{_id:1,title:1,language:1,public:1,auth:1},sort:{createDate:-1}})
    }
    static find_all_for_open(uploader){
        return db.find({uploader:uploader},{projection:{_id:1,title:1,language:1,public:1,auth:1},sort:{createDate:-1}});
    }
    static find_all(uploader){
        return db.find({uploader:uploader},{sort:{createData:-1}})
    }
    static find_by_title(title,cb){
        db.findOne({title:title}).then((doc)=>{
            cb(null,doc)
        }).catch((err)=>{
            cb(err);
        });
    }
    static find_by_id(id,cb){
        db.findOne({_id: id}).then((doc)=>{
            cb(null,doc)
        }).catch(err=>{
            cb(err);
        })
    }
    static find_by_title_in_arr(title,data,cb){
        let isDup = false;
        for(const i in data){
            if(data[i].title === title){
                isDup = true;
            }
        }
        if(isDup){
            Document.find_by_title(title,cb);
        }else{
            cb(null,null);
        }
    }
    static no_duplicated_insert_by_uploader(title,language,privacy,content,uploader,cb) {
        user.find_by_email_documents(uploader, (err, data) => {
            if (err) return cb(err);
            const cursor = Document.find_by_ids(data.documents);
            cursor.toArray().then((data) => {
                Document.find_by_title_in_arr(title,data, (err, doc) => {
                    if (err) return cb(err);
                    if (doc) {
                        incr_duplicate(title, 1, (err, result) => {
                            if (err) return cb(err);
                            title = title + `(${doc.duplicate})`;
                            new Document({
                                title: title, content: content,
                                language: language, public: privacy,auth:false,
                                uploader: uploader, duplicate: 0, createDate: new Date()
                            }).insert((err, result) => {
                                if (err) return cb(err);
                                cb(null, result);
                            });
                        })
                    } else {
                        new Document({
                            title: title, content: content,
                            language: language, public: privacy,auth:false,
                            uploader: uploader, duplicate: 0, createDate: new Date()
                        }).insert((err, result) => {
                            if (err) return cb(err);
                            cb(null, result);
                        });
                    }
                });
            }).catch(err => {
                return cb(err);
            });
        })
    }
    static delete(id,cb){
        db.deleteOne({_id:id}).then(data=>{
            cb(null,data);
        }).catch(err=>{
            cb(err);
        })
    }


}
function incr_duplicate(title,value,cb){
    db.updateOne({title:title},{$inc:{duplicate:value}}).then((result)=>{
        cb(null,result);
    }).catch((err)=>{
        cb(err);
    })
}
module.exports = Document;

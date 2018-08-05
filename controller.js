const models=require('./models.js');
const Op=models.sequelize.Op;


function returnMessages(from, to)
{   
    return new Promise((resolve, reject)=>{

        todb=models.defineModel(to);
        todb.sync().then(()=>{

            todb.findAll(
                {
                    where: {
        
                      [Op.or] : {from:from,
                             to: from} //All messages from from and to from
                    }
        
                }    
                ).then((messages)=>{
        
                    // console.log(messages);
                    resolve(messages);
                })
        })
        
    })
}

function updateDB(db, from, to, message)
{
    db.create({from: from, to: to, messages: message});
}


module.exports={returnMessages, updateDB}
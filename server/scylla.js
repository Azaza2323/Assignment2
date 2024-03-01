const cassandra = require("cassandra-driver");
const cluster=new cassandra.Client({
    contactPoints: ['localhost:1'],
    localDataCenter: 'datacenter1',
    keyspace:'my_keyspace'
})
async function saveLog(ip,logLevel,message,route){
    try{
        const timestamp = new Date();
        const query='INSERT INTO log_data (timestamp, log_level, message, route, ip) VALUES (?, ?, ?, ?, ?)';
        const params = [timestamp, logLevel, message, route, ip];
        await cluster.execute(query,params);
    }
    catch (error){
        console.log(error)
    }
}

module.exports = { saveLog };
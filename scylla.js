const cassandra = require("cassandra-driver");
const cluster=new cassandra.Client({
    contactPoints: ["node-0.aws-us-east-1.537d41f47666f3b0eea7.clusters.scylla.cloud", "node-1.aws-us-east-1.537d41f47666f3b0eea7.clusters.scylla.cloud", "node-2.aws-us-east-1.537d41f47666f3b0eea7.clusters.scylla.cloud"],
    localDataCenter: 'AWS_US_EAST_1',
    credentials: {username: 'scylla', password: 'GM0Whja9JQAx6Uz'},
    keyspace:'logs'
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
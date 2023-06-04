const { MongoClient } = require('mongodb');
async function main() {
    const uri = "mongodb://localhost:27017";
    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB cluster
        await client.connect();
        let db = client.db("chatroom");
        await db.collection("user").deleteOne({ name: 'ss' });

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

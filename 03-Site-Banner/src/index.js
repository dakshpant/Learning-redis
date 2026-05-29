import express from 'express';
import Redis from 'ioredis';

const app = express();

app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const BANNER_KEY = "app:banner";

app.post("/banner", async(req, res) => {
    await redis.set(BANNER_KEY, req.body.message || "Welcome to My Banner!");
    res.json({success: true});
 })

 app.get("/banner", async(req, res) => {
    const banner = await redis.get(BANNER_KEY);
    res.json({banner});
 })

 app.delete("/banner", async(req, res) => {
    await redis.del(BANNER_KEY);
    res.json({success: true});
 })

 app.get("/banner/exists", async(req, res) => {
    const exists = await redis.exists(BANNER_KEY);
    res.json({exists: !!exists}); //!! to convert to boolean the flow is it first check if teh value if exists then return true
    /*
    redis.exists() returns 1 if the key exists and 0 otherwise. Using !!exists converts that numeric result into a proper boolean value (true or false) before sending it in the API response
     */
    // res.json({exists: Boolean(exists)}); //same as above
 })

app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
})
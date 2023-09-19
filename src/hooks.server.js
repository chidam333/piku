import postgres from 'postgres'
import Redis from "ioredis";
import {PGURL,REDIS_URL} from '$env/static/private';
/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    if(!event.url.pathname.startsWith('/create')){
        const sql = postgres(PGURL);
        let redis;
        if(event.locals.redis == undefined) redis = new Redis(REDIS_URL);
        const session = event.cookies.get("sessionid");
        const username = await redis.get(session)
        // const data = await sql `select * from pikuusers`;
        // console.log({data})
        // console.log({sql,session,username,redis})
        event.locals = {
            username:username,
            sql:sql,
            redis:redis,
        }
        // console.log("came debug area")
    }
    let response = await resolve(event);
    if (event.url.pathname.startsWith('/create')) {
        response.headers.append('Cross-Origin-Embedder-Policy', `require-corp`);
        response.headers.append('Cross-Origin-Opener-Policy', `same-origin`);
    }
    return response;
}
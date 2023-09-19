import {error, redirect} from '@sveltejs/kit';
const MMI_CLIENT_ID = import.meta.env.VITE_MMI_CLIENT_ID;
const MMI_CLIENT_SEC = import.meta.env.VITE_MMI_CLIENT_SEC;
/** @type {import('./$types').PageServerLoad} */
export async function load({locals,cookies}) {
    const sessionid = cookies.get("sessionid");
    const {redis} =locals;
    const {username} = locals;
    // console.log(username)
    // console.log("session id is : ",sessionid)
    const redsid = await redis.get(`${username}`)
    if(username===null){
        throw redirect(302,"/")
    }else{
        // console.log({MMI_CLIENT_ID},{MMI_CLIENT_SEC})
        const data={
            "grant_type": "client_credentials",
            "client_id": MMI_CLIENT_ID,
            "client_secret": MMI_CLIENT_SEC
        };
        const request = await fetch('https://outpost.mapmyindia.com/api/security/oauth/token', {
            method: 'POST',
            body: new URLSearchParams(data),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        const response = await request.json()
        // console.log({response})
        if(response){
            // console.log(response)
            // console.log(response.access_token)
            const maxAge= response.expires_in
            cookies.set("mmitk",response.access_token,{path:"/",maxAge})
            return {
            status: 302
            }
        }
        if(response.error){
            // console.log("shit happens")
            throw error(302,'it is what it it is')
        }
    }
}

/** @type {import('./$types').Actions} */
export const actions = {
    logout: async({locals,cookies})=>{
        const temp = cookies.get("sessionid")
        cookies.delete("sessionid")
        const {redis} =locals
        // console.log(temp)
        const reddel = await redis.del(temp)
        throw redirect(302,'/')
    }
}
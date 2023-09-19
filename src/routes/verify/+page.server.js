/** @type {import('./$types').PageLoad} */
import {json} from '@sveltejs/kit';

const r = "https://piku.chidam.xyz/";
export function load({ url,locals }){
	const {sql} = locals;
	const {redis} = locals;
	let token=url.searchParams.get('verify')
	let data;
	const fetch = async()=>{
		data=await redis.lrange(token,0,-1)
		// console.log({data})
		try{
			try{
				await sql `insert into pikuusers(username,email,password) values(${data[2]},${data[1]},${data[0]})`
			}catch(err){
				// console.log({err})
			}
			redis.del(token)
			return {name:data[2]};
		}catch(err){
			// console.log({err})
			return {name:"unverfied"}
		}
	}
	const result = fetch()
	return result;
}
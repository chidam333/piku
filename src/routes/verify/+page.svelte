<script>
    import { onMount } from "svelte";
    let name,realdata;
    let verified = "verified"
    onMount(async()=>{
        // console.log({data})
        // try{
        //     const response = await fetch(data.fetchurl)
        //     realdata = await response.json()
            
        // }catch(e){
        //     verified="unverified"
        //     console.log({e})
        // }
        verified = (JSON.stringify(data)=="{}")? "unverified" : "verified";
        // console.log({verified})
        if(verified=="verified"){
            name=data.name
        }
    })
    /** @type {import('./$types').PageData} */
    export let data;
</script>
<main>
    <div>
        <div> Your profile is successfully {verified} .</div>
        {#if verified=="verified"}
            <div>Your username is {name}</div>
        {/if}
        <div class="grid justify-center"><a href="/" class="bg-amber-700 text-amber-200 px-4 py-2 my-2 hover:bg-amber-200 hover:text-amber-700 hover:border-2 border-black">Login</a></div>
    </div>
</main>
<style>
    main{
        width: 100vw;
        height: 100vh;
        display: grid;
        place-items: center;
    }
</style>
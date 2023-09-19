
<script>
  import Logout from "../../logout.svelte";
    let city,city1,city2,city3 = Array(4).fill("")
    let len = 0
    let settledcity=""
    let data ={}
    let state=false
    let hasElements=false
    let citylist=[]
    const change = async(hmm)=>{
        state=false
        hasElements=false
        citylist=[]
        let response;
        if(hmm.length>0){
            response= await fetch(`/api/city?address=${hmm}`)
        }
        if(response.status!=200){return;}
        const data = await response.json()
        len=data.copResults.length
        if(len==1){
            city1=data.copResults[0].formattedAddress
            citylist.push(city1)
        }
        else if(len==2){
            city1=data.copResults[0].formattedAddress
            city2=data.copResults[1].formattedAddress
            citylist.push(city1,city2)
        }
        else if(len==3){
            city1=data.copResults[0].formattedAddress
            city2=data.copResults[1].formattedAddress
            city3=data.copResults[2].formattedAddress
            citylist.push(city1,city2,city3)
        }
        hasElements=true
        return citylist
    }
    let promise = change();
    const handlechange = (hmm)=>{
        promise = change(hmm)
    }
    const selected =(name)=>{
        state=true
        city=name
        settledcity=city.split(",")[0]
    }
    const prompt =()=>{
        state=true
        if(citylist===[]){
        alert("big mostache")
        }
        city=citylist[0]
        settledcity=city.split(",")[0]
    }
</script>
<main>
    <div class="pihead absolute flex w-screen justify-center">Piku your city now <Logout/></div>
    <div class="piku absolute text-8xl text-center w-screen mt-24 text-amber-200">piku</div>
    <div class="hmm">
            <div class="search" >
                <form on:submit|preventDefault={prompt}>
                        <input type="text" class="kuch md:left-1/4 lg:left-1/3 w-2/3 md:w-1/2 lg:w-1/3" class:haselements={hasElements} class:instate={state} placeholder="Your primary city" bind:value={city} on:input|preventDefault={handlechange(city)}> 
                        {#await promise}
                            🔃Loading ...
                        {:then citylist} 
                            <ul class:hide={state} class="kuch md:left-1/4 lg:left-1/3 w-2/3 md:w-1/2 lg:w-1/3">
                                {#each citylist as name}
                                    <li on:click={selected(name)}>{name}</li> 
                                {/each}
                            </ul>                  
                        {/await}
                </form>
            </div>
        {#if state}
            <div class="state kuch md:left-1/4 lg:left-1/3 w-2/3 md:w-1/2 lg:w-1/3" class:selectedsec={state}>
                <div class="cityname">{settledcity}</div>
                <a class="letsgo" href="/city/{settledcity}">Lesgooo</a>
            </div>            
        {/if}
    </div>
</main>
<style>
    .piku{
        font-family: "Rochester";
    }
    .pihead{
        font-family: 'Inconsolata';
        font-weight: 900;
        background: linear-gradient(to right,transparent,rgb(255, 99, 2),red,transparent);
    }
    @media screen and (max-width:767px){
        .kuch{
            left: 16.6%;
        }
    }

    main{
        font-family: 'Roboto', sans-serif;
    }
    .state,.hide{display: none;}
    .selectedsec{
        padding-left: 0.7%;
        position: absolute;
        top: 65vh;
        display: flex;
    }
    .cityname{
        border-radius: 17px 0px 0px 17px; 
        width: 80%;
        border: 3px 3px 3px #fe8b18 solid;
        box-shadow: 0 0 .2rem #fff,
              0 0 .2rem #fff,
              0 0 2rem #fea813,
              0 0 0.3rem #ff2d2d,
              inset 0 0 0.2rem #ff6f00;
        height: 2rem;
        background: white;
        color: navy;
        display: grid;
        place-items: center;
    }
    .letsgo{
        cursor: pointer;
        box-shadow: 0 0 .2rem #fff,
              0 0 .2rem #fff,
              0 0 2rem #8de611,
              0 0 0.3rem #0e3400,
              inset 0 0 0.2rem #99fe5f;
        background: #39FF14;
        display: grid;
        place-items: center;
        width: 30%;
    }
    .haselements{
        border-radius: 17px 17px 0px 0px;
        border-bottom: 2px rgb(247, 179, 52) solid;
        background: rgba(30, 30, 30);
    }
    .search{
        position: relative;
    }
    li:hover{
        cursor:pointer;
    }
    ul{
        z-index: 0;
        position: absolute;
        top: 50vh;
        list-style: none;
        margin: 0%;
        padding: 2rem 0rem 0rem 0rem;
        border-radius: 17px;
        background: rgba(30, 30, 30, 0.6);
        backdrop-filter: blur(5px);
    }
    li{
        color: wheat;
        border-top: 2px black solid ;
        padding: 1rem 0rem 1rem 2%;
    }
    li:hover{
        background: rgba(79, 78, 78, 0.6);
    }
    .instate{
        box-shadow: 0 0 .2rem #fff,
              0 0 .2rem #fff,
              0 0 2rem #fea813,
              0 0 0.8rem #419c00,
              0 0 2.8rem #ff2d2d,
              inset 0 0 1.3rem #ff6f00;
        border: #f48210;
        border-radius: 17px;
    }
    input{
        min-height: 2rem;
        padding-left: 2%;
        border-radius: 17px;
        background: rgb(0, 0, 0,0.8);
        color: wheat;
        border: 0ch;
        position: absolute;
        z-index: 1;
        top: 50vh;
    }
    input:focus{
        outline: none;
    }
    .hmm{
        background: url("../../city.svg");
        width: 100vw;
        height: 100vh;
    }
</style>

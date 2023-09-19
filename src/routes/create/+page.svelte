<script>
	import { browser } from '$app/environment';
    import maplibregl from 'maplibre-gl'; // or "const maplibregl = require('maplibre-gl');"
    import { onMount } from 'svelte';
    import {createFFmpeg,fetchFile} from "@ffmpeg/ffmpeg";
    import html2canvas from 'html2canvas';
    import 'maplibre-gl/dist/maplibre-gl.css';
    let availableFeatures = ["zooming","panning","rotate","create-itinerary"]
    $: active="panning"
    $: aspect="16/9"
    let map=null,ffmpeg;
    let providers=[
        {tileProvider:"cartoDB.Voyager (nolabel)",links:"https://b.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",type:"raster"},
        {tileProvider:"cartoDB.Dark (noLabel)",links:"https://b.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",type:"raster"},
        {tileProvider:"watercolor (stamen)",links:"https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg",type:"raster"},
        {tileProvider:"satellite",links:"https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",type:"raster"},
        {tileProvider:"demoVector",links:"https://demotiles.maplibre.org/style.json",type:"vector"},
    ]
    let lon=80.28,lat=13.077,minz=3,maxOnX,maxOnY,realAngle,maxz=6,lonFrom=80.28,latFrom=13.077,lonTo=-73.9808,latTo=40.7648,pitch=0,providerSelection=providers[3],ffmpegLoaded=false,bearing=0,generating=false;
    onMount(async()=>{
        ffmpeg = createFFmpeg({ log: true });
        await ffmpeg.load().then(()=>{
            ffmpegLoaded=true
        })
        let satelliteStyle = {
                "version": 8,
                "sources": {
                    "raster-tile-source": {
                    "type": "raster",
                    "tiles": [providers[3].links],
                    "tileSize": 256
                    }
                },
                "layers": [
                    {
                    "id": "raster-tile-layer",
                    "type": "raster",
                    "source": "raster-tile-source"
                    }
                ]
            };
        map = new maplibregl.Map({
            container: 'map',
            style: satelliteStyle, // stylesheet location
            center: [80.28,13.077], // starting position [lng, lat]
            zoom: 3,
            preserveDrawingBuffer: true // starting zoom
        });
        let mapContain = document.querySelector("#map")
        const maprect = mapContain.getClientRects()
        let [centerX,centerY] = [maprect[0].left+(maprect[0].width/2),maprect[0].top+maprect[0].height/2]
        let bottomEdge = maprect[0].bottom-centerY
        let zero = document.querySelector("span")
        zero.textContent="0"
        zero.style.position = "absolute"
        zero.style.top=`${maprect[0].bottom}px`
        zero.style.left=`${centerX}px`
        zero.style.marginTop=`.5rem`
        let maxOnX = Math.atan((maprect[0].width/2)/(maprect[0].height/2))*(180/Math.PI)
        let maxOnY = Math.atan((maprect[0].height/2)/(maprect[0].width/2))*(180/Math.PI)
        // console.log({maxOnX})
        // console.log({maxOnY})
        document.addEventListener("mousemove", (event)=>{
            let mapContain = document.querySelector("#map")
            let tracker = document.querySelector(".bearingTracker")
            const maprect = mapContain.getClientRects()
            let [centerX,centerY] = [maprect[0].left+(maprect[0].width/2),maprect[0].top+maprect[0].height/2]
            const mouseX = event.clientX;
            const mouseY = event.clientY;
            if(mouseX>=centerX && mouseY<=centerY){
                const angle = Math.atan((centerY-mouseY)/(mouseX-centerX))*(180/Math.PI)
                // console.log({angle})
                realAngle=90+angle
                tracker.textContent=Math.round(realAngle)
                if(angle>maxOnY && angle<=90){
                    tracker.style.top=maprect[0].top+'px'
                    // console.log({centerY,value:centerY+Math.tan((90-angle)*(Math.PI/180))*maprect[0].height/2+'px'})
                    tracker.style.left=centerX+Math.tan((90-angle)*(Math.PI/180))*maprect[0].height/2+'px';
                    tracker.style.marginTop=-tracker.clientHeight+'px'
                }else if(angle<maxOnY){
                    tracker.style.left=maprect[0].right+'px'
                    // console.log({angle})
                    tracker.style.top=centerY-Math.tan((angle)*(Math.PI/180))*maprect[0].width/2+'px';
                }
            }else if(mouseX>centerX && mouseY>centerY){
                const angle = Math.atan((mouseY-centerY)/(mouseX-centerX))*(180/Math.PI)
                realAngle=angle
                tracker.textContent=Math.round(realAngle)
                if(angle<maxOnY && angle<=90){
                    tracker.style.left=maprect[0].right+'px'
                    tracker.style.top = centerY+Math.tan((angle)*(Math.PI/180))*maprect[0].width/2+'px'
                }else if(angle>maxOnY && angle<=90){
                    tracker.style.top = maprect[0].bottom+'px'
                    tracker.style.left = centerX+Math.tan((90-angle)*(Math.PI/180))*maprect[0].height/2+'px'
                    tracker.style.marginTop = '0px'
                }
            }else if(mouseX<=centerX && mouseY>=centerY){
                const angle =Math.atan((mouseY-centerY)/(centerX-mouseX))*(180/Math.PI)
                realAngle=270+angle
                tracker.textContent=Math.round(realAngle)
                if(angle<maxOnY && angle<=90){
                    tracker.style.left=maprect[0].left+'px'
                    tracker.style.marginRight=tracker.clientWidth
                    tracker.style.top = centerY+Math.tan((angle)*Math.PI/180)*maprect[0].width/2+'px'
                }else if(angle>maxOnY && angle<=90){
                    tracker.style.top=maprect[0].bottom+'px'
                    tracker.style.left=maprect[0].left+maprect[0].width/2-Math.tan((90-angle)*Math.PI/180)*maprect[0].height/2+'px'
                    // tracker.style.marginTop
                }
            }else if(mouseX<=centerX && mouseY<=centerY){
                const angle = Math.atan((centerX-mouseX)/(centerY-mouseY))*(180/Math.PI)
                // console.log({wowangle:angle})
                realAngle=180+angle
                tracker.textContent=Math.round(realAngle)
                if(angle>maxOnX && angle<=90){
                    tracker.style.left = maprect[0].left+'px'
                    tracker.style.marginLeft = -tracker.clientWidth+'px'
                    tracker.style.top = maprect[0].top+maprect[0].height/2-Math.tan((90-angle)*(Math.PI/180))*maprect[0].width/2+'px'
                }else if(angle<maxOnX && angle<=90){
                    tracker.style.top = maprect[0].top + 'px'
                    tracker.style.left = centerX-Math.tan((angle)*Math.PI/180)*maprect[0].height/2+'px'
                }
            }
        });
    })
    const mergeVideo = async(canvasarr)=>{
                // console.log({len:canvasarr.length})
                let filesWritten,i=0;
                for(i=0;i<canvasarr.length;i++){
                    await ffmpeg.FS('writeFile', `temp.${i}.png`, new Uint8Array(canvasarr[i]));
                    // console.log(`Wrote ${i} file`)
                    filesWritten=i
                }
                filesWritten=i;
                await ffmpeg.run('-i','temp.%d.png','-c:v', 'libx264','-vf', "scale=trunc(iw/2)*2:trunc(ih/2)*2",'-r','30', '-pix_fmt', 'yuv420p', 'out.mp4')
                const data = await ffmpeg.FS('readFile', 'out.mp4');
                // console.log({data})
                // console.log({canvasarrLen:canvasarr.length})
                for(let i=0;i<filesWritten;i++){
                    await ffmpeg.FS('unlink', `temp.${i}.png`);
                }
                const video = document.getElementById('output-video');
                video.style.display= "block"
                video.src = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
                this.canvasarr=[]
                generating=false
            }
    class panner{
        constructor(map,latFrom,lonFrom,latTo,lonTo,zoom){
            this.map=map
            this.latFrom=latFrom
            this.lonFrom=lonFrom
            this.latTo=latTo
            this.lonTo=lonTo
            this.canvasarr=[]
            this.skip=false
            this.zoom=zoom
            this.time=2000
            this.factor=30
        }
        setView(){
            map.flyTo({
                center:[this.lonFrom,this.latFrom],
                zoom:this.zoom,
                duration:0
            })
        }
        pan(){
            generating=true
            let xDist,yDist;
            let isLeft,isDown;
            let xStep,yStep;
            let skip= this.skip,lonFrom=this.lonFrom,lonTo=this.lonTo,latFrom=this.latFrom,latTo=this.latTo,map=this.map,zoom=this.zoom,canvasarr=this.canvasarr;
            if(lonFrom>lonTo){
                isLeft=true
                xDist=this.lonFrom-this.lonTo
            }else{
                isLeft=false
                xDist=this.lonTo-this.lonFrom
            }
            if(latFrom>latTo){
                isDown=true
                yDist=this.latFrom-this.latTo
            }else{
                isDown=false
                yDist=this.latTo-this.latFrom
            }
            xStep = xDist/(this.time/this.factor)
            yStep = yDist/(this.time/this.factor)
            this.setView()
            let looper = setInterval(()=>{
                if(skip==false){
                    if(isLeft && lonFrom<=lonTo){
                        clearInterval(looper)
                        mergeVideo(canvasarr)
                    }
                    if(!isLeft && lonFrom>=lonTo){
                        clearInterval(looper)
                        mergeVideo(canvasarr)
                    }
                    map.flyTo({
                        center:[lonFrom,latFrom],
                        zoom:zoom,
                        duration:0
                    })
                    skip=true
                    setTimeout(async()=>{
                        await map.loaded()
                        await html2canvas(document.getElementById('map'),{allowTaint:true,useCORS:true}).then(
                            async function(canvas){
                                canvas.toBlob(async(blob)=>{
                                    const arrayBuffer=await blob.arrayBuffer();
                                    canvasarr.push(arrayBuffer)
                                })
                                if(isLeft){lonFrom-=xStep;}
                                else{lonFrom+=xStep;}
                                if(isDown){latFrom-=yStep;}
                                else{
                                    latFrom+=yStep;
                                }
                                skip=false
                            }
                        )
                    })
                }
            },200)
            mergeVideo(canvasarr)
        }
        reset(latFrom,lonFrom,latTo,lonTo){
            this.latFrom=latFrom
            this.lonFrom=lonFrom
            this.latTo=latTo
            this.lonTo=lonTo
            this.pan()
        }
    }
    class rotate{
        constructor(map,lat,lon,pitch,zoom){
            this.map=map
            this.lat=lat
            this.lon=lon
            this.pitch=pitch
            this.skip=false
            this.zoom = zoom
            this.canvasarr=[]
            this.setView()
        }
        setView(){
            map.flyTo({
                center: [this.lon, this.lat],
                zoom: this.zoom,
                duration: 0
            });
        }
        rotate(){
            generating=true
            let canvasarr = this.canvasarr
            let zoom = this.zoom
            let lng = this.lon
            let lat = this.lat
            let skip = false
            let angle =0;
            let looper = setInterval(()=>{
                if(skip==false){
                    if(angle>=360){
                        clearInterval(looper)
                        merge(canvasarr)
                    }
                    map.setBearing(angle)
                    skip=true
                    setTimeout(()=>{
                        map.loaded()
                        html2canvas(document.getElementById("map"),{allowTaint:true,useCORS:true}).then(
                            async(canvas)=>{
                                canvas.toBlob((blob)=>{
                                    const arrayBuffer = blob.arrayBuffer()
                                    canvasarr.push(arrayBuffer)
                                })
                                angle+=1
                                // console.log({angle})
                                skip=false
                            }
                        )
                    },200)
                }
            },200)
            mergeVideo(canvasarr)
        }
        reset(lat,lon,pitch,zoom){
            this.lat=lat
            this.lon=lon
            this.pitch=pitch
            this.zoom=zoom
            this.setView()
            this.rotate()
        }
    }
    class zoomer{
        constructor(map,min,max,lat,lon){
            this.min=min
            this.max=max
            this.lat=lat
            this.lon=lon
            this.skip=false
            this.map=map
            this.canvasarr = []
            this.zoomRate=0.1
        }
        setView(){
            map.flyTo({
                center: [this.lon, this.lat],
                zoom: this.min,
                duration: 0
            });
        }
        zoom(){
            generating=true
            let canvasarr = this.canvasarr
            let min = this.min
            let max = this.max
            let skip = false
            let zoomRate = this.zoomRate
            this.setView()
            let looper = setInterval(()=>{
                if(skip==false){
                    if(min>=max){
                        clearInterval(looper)
                        merge(canvasarr)
                    }
                    map.setZoom(min)
                    skip=true
                    setTimeout(()=>{
                        map.loaded()
                        html2canvas(document.getElementById('map'),{allowTaint:true,useCORS:true}).then(
                        async function(canvas){
                            canvas.toBlob(async(blob)=>{
                                const arrayBuffer = await blob.arrayBuffer();
                                canvasarr.push(arrayBuffer)
                            });
                            min+=zoomRate
                            skip=false
                        }
                    )},200)
                }
            },200)
            mergeVideo(canvasarr)
        }
        reset(minz,maxz,lat,lon){
            this.min=minz
            this.max=maxz
            this.lat=lat
            this.lon=lon
            this.zoom()
        }
    }
    const zoomObjInit=()=>{
        let zoomObj;
        if(zoomObj==null || zoomObj==undefined){
            zoomObj = new zoomer(map,minz,maxz,lat,lon)
            zoomObj.zoom()
        }else{
            zoomObj.reset(minz,maxz,lat,lon)
        }
    }
    const rotateInit=()=>{
        let rotateObj
        if(rotateObj==undefined){
            rotateObj = new rotate(map,lat,lon,pitch,minz)
            rotateObj.rotate()
        }else{
            rotateObj.reset(lat,lon,pitch,minz)
        }
    }
    const PanObjInit=()=>{
        let panObj
        if(panObj==undefined){
            panObj = new panner(map,latFrom,lonFrom,latTo,lonTo,minz)
            panObj.pan()
        }else{
            panObj.reset(latFrom,lonFrom,latTo,lonTo,minz)
        }
    }
    const changeMap = (link,type)=>{
        if(type=="raster"){
            let newStyle = {
                "version": 8,
                "sources": {
                    "raster-tile-source": {
                    "type": "raster",
                    "tiles": [link],
                    "tileSize": 256
                    }
                },
                "layers": [
                    {
                    "id": "raster-tile-layer",
                    "type": "raster",
                    "source": "raster-tile-source"
                    }
                ]
            };
            map.setStyle(newStyle)
        }else{
            map.setStyle(link)
        }
    }
    const changePitch = ()=>{
        map.setPitch(pitch)
    }
    const changeBearing = ()=>{
        map.setBearing(bearing)
    }
    const updateLatLan = ()=>{
        map.flyTo({
                center: [lon,lat],
                zoom: 4,
                duration: 0
        });
    }
    const updateZoom = ()=>{
        map.setZoom(minz)
    }
    const reroute = (type) =>{
        if(type=="shorts"){
            const map = document.querySelector("#map")
            const maprect = map.getClientRects()
        }
    }
</script>
<div class="layout flex">
    <div class="side-bar h-[100vh] w-[12vw] bg-black border-r-2 border-amber-400">
        <div class="storage flex">
            <span class="text-amber-200 ml-4">storage</span>
            <span class="text-amber-200 my-auto ml-auto mr-4 text-4xl cursor-pointer -mt-4">...</span>
        </div>
    </div>
    <nav class="bg-black h-[4vh] flex border-b-2 border-zinc-300">
        {#each availableFeatures as feature}
        <div class="box text-amber-200 px-8 border-r-2 border-amber-400 cursor-pointer" class:active={active==feature} on:click={()=>{active=feature}}>
            {feature}
        </div>
        {/each}
    </nav>
    <div class="black-bar absolute top-0 left-0 h-[4vh] -z-10 bg-black w-[100vw]"></div>
    <div class="inp-out ml-56 mt-14 absolute">
        <div class="params bg-black max-w-[900px] h-32 mb-4">
            <div class="params-nav flex">
                <h3 class="text-amber-200 font-mono pl-6 py-2">params</h3>
                <div class="ml-auto">
                    <label for="pitch" class="text-amber-200 font-mono">pitch (0-60) :&nbsp;<input type="number" class="pitchBearInput pl-2 rounded-xl" step="0.01" id="pitch" bind:value={pitch} on:input={()=>{changePitch()}} ></label>
                    <label for="bearing" class="text-amber-200 font-mono">bearing (0-360) :&nbsp;<input type="number" class="pitchBearInput pl-2 rounded-xl" step="0.01" id="bearing" bind:value={bearing} on:input={()=>{changeBearing()}} ></label>
                </div>
            </div>
            <div class="inp-flex flex gap-4">
                {#if active=="zooming"}
                    <div class="grid gap-2 ml-4">
                        <label for="lat" class="text-amber-200 font-mono">lat :&nbsp;<input type="number" class="text-black" step="0.01" id="lat" bind:value={lat} on:input={()=>{updateLatLan()}}></label>
                        <label for="lon" class="text-amber-200 font-mono">lon :&nbsp;<input type="number" class="text-black" step="0.01" id="lon" bind:value={lon} on:input={()=>{updateLatLan()}}></label>
                    </div>
                    <div class="grid gap-2 ml-4">
                        <label for="min-zoom" class="text-amber-200 font-mono">min-zoom :&nbsp;<input type="number" class="text-black" id="min-zoom" bind:value={minz} on:input={()=>{updateZoom()}}></label>
                        <label for="max-zoom" class="text-amber-200 font-mono">max-zoom :&nbsp;<input type="number" class="text-black" id="max-zoom" bind:value={maxz}></label>
                    </div>
                    {/if}
                    {#if active=="panning"}
                    <div class="grid gap-2 ml-4">
                        <label for="latPanfrom" class="text-amber-200 font-mono">lat-from :&nbsp;<input type="number" class="text-black" step="0.01" id="latPanfrom" bind:value={lat} on:input={()=>{updateLatLan()}}></label>
                        <label for="lonPAnfrom" class="text-amber-200 font-mono">lon-from :&nbsp;<input type="number" class="text-black" step="0.01" id="lonPanfrom" bind:value={lon} on:input={()=>{updateLatLan()}}></label>
                    </div>
                    <div class="grid gap-2 ml-4">
                        <label for="latPanto" class="text-amber-200 font-mono">lat-to :&nbsp;<input type="number" class="text-black" step="0.01" id="latPanto" bind:value={latTo}></label>
                        <label for="lonPAnto" class="text-amber-200 font-mono">lon-to :&nbsp;<input type="number" class="text-black" step="0.01" id="lonPanto" bind:value={lonTo}></label>
                    </div>
                    <div class="grid gap-2 ml-4">
                        <label for="zoom" class="text-amber-200 font-mono">zoom :&nbsp;<input type="number" class="text-black" id="zoom" bind:value={minz} on:input={()=>{updateZoom()}}></label>
                    </div>
                {/if}
                {#if active=="rotate"}
                <div class="grid gap-2 ml-4">
                        <label for="lat" class="text-amber-200 font-mono">lat :&nbsp;<input type="number" class="text-black" step="0.01" id="lat" bind:value={lat} on:input={()=>{updateLatLan()}}></label>
                        <label for="lon" class="text-amber-200 font-mono">lon :&nbsp;<input type="number" class="text-black" step="0.01" id="lon" bind:value={lon} on:input={()=>{updateLatLan()}}></label>
                    </div>
                    {/if}
            </div>
        </div>
        <div class="aspectTiler flex mb-10">
            <select bind:value={providerSelection} class="select text-amber-200 bg-black rounded-lg p-2 " on:change={()=>{changeMap(providerSelection.links,providerSelection.type)}}>
                {#each providers as provider}
                    <option value={provider}>{provider.tileProvider}</option>
                {/each}
            </select>
            <label>Video<input type="radio" name="aspect" bind:group={aspect} id="videoAspect" class="bg-green-200" value={"16/9"} on:change={()=>{reroute("video")}}></label>
            <label>Shorts<input type="radio" name="aspect" bind:group={aspect} id="shortsAspect" value={"9/16"} on:change={()=>{reroute("shorts")}}></label>
        </div>
        {#key aspect}
        <div class="map-contain grid grid-flow-col gap-6 w-[80vw] grid-cols-2">
                {#if aspect="16/9"}
                    <div id="map" class="border-2 border-black aspect-video"></div>
                    <video src="" id="output-video" class="border-2 border-black aspect-video" style="display:none" controls></video>
                {:else if aspect="9/16"}
                    <div id="map" class="border-2 border-black aspect-square"></div>
                    <video src="" id="output-video" class="border-2 border-black aspect-square" style="display:none" controls></video>
                {/if}
            </div>
        {/key}
        {#if ffmpegLoaded}
        {#if generating}
        <div class="wait px-4 py-2 bg-red-500 text-2xl font-serif mt-6 max-w-fit">rendering</div>
        {:else}
        <button on:click={()=>{
            if(active=="zooming"){zoomObjInit()}
            if(active=="panning"){PanObjInit()}
            if(active=="rotate"){rotateInit()}
        }} class="generate px-4 py-2 bg-lime-500 text-2xl font-serif mt-6">
            generate
        </button>
        {/if}
        {:else}
        <div class="loading text-red-900">ffmpeg loading (don't fret it happens only the first time you open our web app in your device)</div>
        {/if}
    </div>
</div>
<!-- {realAngle} -->
<span class="bearingTracker bg-black border-2 border-amber-500 text-amber-200 absolute p-1"></span>
<style>
    .active{
        background: rgb(59, 59, 59);
        border-top: 3px solid wheat;
    }
    .storage span{
        font-family: "ROboto";
    }
    .pitchBearInput{
        background: rgb(245, 222, 179,0.3);
    }
</style>
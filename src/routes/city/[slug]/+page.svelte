<script>
  import Citynav from "../../../components/Citynav.svelte";
  export let data;
  let city = data.city
</script>
<Citynav {city}/>
<div class="background bg-zinc-900 h-[900px]">
  <form action="">
    <div class="content-editor flex ml-4 pt-4">
      <textarea name="content" id="content" rows="1" class="bg-zinc-700 w-[70vw] text-amber-100 text-xl px-4 ">
        lol
      </textarea>
      <div class="add-img px-4 py-2 bg-amber-600 ml-2 cursor-pointer rounded-l-md hover:bg-amber-500"> add img </div>
      <button class="bg-black text-amber-200 text-3xl px-2 border-r-2 border-y-2 rounded-r-md border-amber-900 " > &gt; </button>
    </div>
  </form>
  <div class="content-list">

  </div>
</div>
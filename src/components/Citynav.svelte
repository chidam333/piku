<script>
    export let city;
</script>
<main>
    <nav>
        <div class="nav h-16 bg-black w-[100%] flex">
            <div class="logo text-amber-200 ml-12 text-4xl my-auto max-w-fit">
                <span>piku/{city}</span>
            </div>
            <a href="/create" class="create bg-amber-600 hover:bg-amber-500 ml-auto my-auto px-4 py-2 border-2 rounded-md border-amber-800 mr-2 cursor-pointer">
                create
            </a>
        </div>
    </nav>
</main>
<style> 
    .logo{
        font-family: "Rochester";
    }
</style>
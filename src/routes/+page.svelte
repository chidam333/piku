<script>
  import { onMount } from 'svelte';
  let minHeight;
  onMount(()=>{
    const vp = document.querySelector("main");
    vp.style.minHeight=window.innerHeight;
  })
  /** @type {import('./$types').ActionData} */
  export let form;
//   console.log({form})
</script>
<main class="h-screen relative overflow-hidden bg-amber-200">
    <nav class="bg-amber-900 h-72 md:h-40 lg:h-20 w-screen grid grid-rows-3 lg:grid-cols-4 gap-4">
        <div class="logo text-amber-200 text-4xl lg:text-6xl lg:ml-10 text-center h-10 lg:h-full row-span-1 lg:col-span-1">piku</div>
        <div class="form lg:col-span-3 lg:relative h-full row-span-2">
            <form method="POST" action="?/login" class="lg:right-5 grid justify-center grid-rows-2 md:flex md:justify-center md:mt-5 lg:absolute z-33 lg:block font-extrabold">
                <label for="user" class="text-indigo-300 text-2xl font-semibold ">Username:</label>
                <input type="text" name="loguser" id="user" class="md:mr-5 pl-2 h-7" required>
                <label for="logpass" class="text-indigo-300 text-2xl font-semibold">Password:</label>
                <input type="password" name="logpass" id="logpass" class="pl-2 h-7" required>
                <input  type="submit" value="Login" class="bg-lime-300 md:ml-5 md:-mt-1 w-fit mt-4 mx-0 cursor-pointer text-black text-xl font-extrabold px-2 md:mx-2">
            </form>
        </div>
    </nav>
    <section class="grid grid-cols-6 h-screen w-screen absolute top-0 left-0 mt-72 md:mt-40 lg:mt-20">
        <div class="hidden lg:block imgover col-span-4 w-full relative bg-stone-900">
            <img class="w-full" src="https://images.unsplash.com/photo-1599831069477-b2acdc0bcb91?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80" alt="">
            <div class="dar w-full h-full absolute top-0 left-0 ">
                <div class="t mt-52 text-orange-300 grid tracking-widest text-3xl"><div class="p">Explore</div><p>Cities</p><p>Now</p></div>
            </div>
        </div>
        <div class="signup col-span-6 lg:col-span-2 bg-amber-200">
            <div class="head text-center mt-24 font-extrabold mb-10">Sign up</div>
            <form method="POST" action="?/signup" class="grid gap-8 text-center">
                <label for="email">Email : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input type="email" class="pl-2" placeholder="dev@chidam.xyz" id="email" name="email">
                </label>
                <label for="pass">Password :
                <input type="password" class="pl-2" id="pass" name="pass" placeholder="*********" required>
                </label>
                <label for="pass1">Re-enter: &nbsp;&nbsp;&nbsp;
                <input type="password" class="pl-2" id="pass1" name="pass1" placeholder="*********" required>
                </label>
                <div class="wrap">
                    <input type="submit" value="Signup" class="leading-2 bg-lime-300 font-extrabold w-fit text-center px-10 py-2 border-2 cursor-pointer border-black">
                </div>
            </form>
            {#if form?.success}
                <div class="scsmsg bg-lime-300 text-lime-900 text-center mx-4 py-2 border-2 border-black my-4">A verification link is sent ^_~ <div class="s">to&nbsp;<span class="ok text-black" >{form?.email}</span>, find your username there</div></div>
            {/if}
            {#if form?.cred}
                <div class="scsmsg bg-red-300 text-red-900 text-center mx-4 py-2 border-2 border-black my-4">Your password is wrong or your username doesn't exist</div>
            {/if}
            {#if form?.exist}
                <div class="scsmsg bg-red-300 text-red-900 text-center mx-4 py-2 border-2 border-black my-4">Your profile exists {form?.name}</div>
            {/if}
            {#if form?.missing}
                <div class="scsmsg bg-red-300 text-red-900 text-center mx-4 py-2 border-2 border-black my-4">The password doesn't match</div>
            {/if}
        </div>
        {#if form?.postgres}
            <div class="postgres-err absolute top-0 left-0 w-[100vw] text-center z-50 bg-red-300">Sorry facing postgres server errors</div>
        {/if}
    </section>
    <footer class="bg-stone-900 text-stone-600 grid grid-flow-col justify-center leading-loose w-screen absolute bottom-0">Build by &nbsp;<a href="https://www.chidam.xyz" target="_blank">@chidam333</a></footer>
</main>
<style>
    .p,p{
        width: fit-content;
        margin-left: 42%;
    }
    .dar{
        background: rgb(0, 0, 0,0.7);
    }
    nav,.signup input,.scsmsg {
        font-weight: 900;
        font-family: 'Inconsolata'
    }
    .t,.head,.signup label{
        font-family: "Orbitron";
    }
    nav .logo{
        font-family: "Rochester";
    }
    footer{
        font-family: "Roboto";
        font-size: large;
    }
    footer a:hover{
        color: wheat;
    }
</style>
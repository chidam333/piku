import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
 
export const load = (({ params }):PageLoad => {
    let city = (params.slug).toLowerCase();
    // console.log({city})
    return {
        city
    }; 
})

/*
import { supabase } from "@/app/supabase/initiliaze";

export const fetchMentors = async (query?: string) => {
    let request = supabase.from("mentors").select("*");

    const { data, error } = await request;

    if (error) {
        throw new Error(`Error fetching mentors: ${error.message}`);
    }

    return data; // array of mentors
};

 */

import { supabase } from "@/app/supabase/initiliaze";


export const fetchMentors = async (query?: string) => {
    let request = supabase.from("mentors").select("*");

    if (query && query.trim()) {
        request = request.or(`name.ilike.%${query}%`);
    }

    const { data, error } = await request;

    if (error) {
        throw new Error(`Error fetching mentors: ${error.message}`);
    }

    return data;
};

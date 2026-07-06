"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from 'next/cache';
import { redirect } from "next/navigation";

export type AuthState = {
    error: string | null;
};

export async function signup(prevState: AuthState, formData: FormData): Promise<AuthState> {
    const supabase = await createClient();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const username = formData.get("username") as string;

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { username }
        }
    });
    console.log("Signup error:", error);
    if (error) {
        if (error.message.includes('Database error saving new user')) {
            return { error: 'Username already taken. Please choose another.' };
        }
        if (error.message.includes('User already registered')) {
            return { error: 'An account with this email already exists.' };
        }
        // Fallback safely to a string string
        return { error: error.message || 'Signup failed. Please try again.' };
    }

    revalidatePath('/', 'layout');
    redirect('/');
}

export async function signin(prevState: AuthState, formData: FormData): Promise<AuthState> {
    const supabase = await createClient();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        if (error.message.includes('Invalid login credentials')) {
            return { error: 'Incorrect email or password.' };
        }
        if (error.message.includes('Email not confirmed')) {
            return { error: 'Please verify your email before logging in.' };
        }
        return { error: error.message || 'Login failed. Please try again.' };
    }

    revalidatePath('/', 'layout');
    redirect('/');
}

export async function signout(): Promise<AuthState> {
    const supabase = await createClient();
    
    const { error } = await supabase.auth.signOut();

    if (error) {
        return { error: error.message || 'Signout failed.' };
    }

    revalidatePath('/', 'layout');
    redirect('/login');
}
"use client"
import { createAuthClient } from "better-auth/react"
import { useEffect, useState } from "react"

export const authClient = createAuthClient({
   baseURL: typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL,
  fetchOptions: {
      headers: {
        Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("bearer_token") : ""}`,
      },
      onSuccess: (ctx) => {
          const authToken = ctx.response.headers.get("set-auth-token")
          // Store the FULL token - don't split it!
          if(authToken){
            localStorage.setItem("bearer_token", authToken);
          }
      }
  }
});

type SessionData = ReturnType<typeof authClient.useSession>
const SESSION_CACHE_TTL_MS = 10000;
let cachedSession: any = null;
let cachedAt = 0;
let sessionRequestInFlight: Promise<any> | null = null;

async function requestSession(force = false) {
   const now = Date.now();
   if (!force && cachedAt > 0 && now - cachedAt < SESSION_CACHE_TTL_MS) {
      return cachedSession;
   }

   if (sessionRequestInFlight) {
      return sessionRequestInFlight;
   }

   sessionRequestInFlight = authClient.getSession({
      fetchOptions: {
         auth: {
            type: "Bearer",
            token: typeof window !== 'undefined' ? localStorage.getItem("bearer_token") || "" : "",
         },
      },
   })
      .then((res) => {
         cachedSession = res.data;
         cachedAt = Date.now();
         return res.data;
      })
      .finally(() => {
         sessionRequestInFlight = null;
      });

   return sessionRequestInFlight;
}

export function useSession(): SessionData {
   const [session, setSession] = useState<any>(null);
   const [isPending, setIsPending] = useState(true);
   const [error, setError] = useState<any>(null);

   const refetch = () => {
      setIsPending(true);
      setError(null);
      fetchSession(true);
   };

   const fetchSession = async (force = false) => {
      try {
         const data = await requestSession(force);
         setSession(data);
         setError(null);
      } catch (err) {
         setSession(null);
         setError(err);
      } finally {
         setIsPending(false);
      }
   };

   useEffect(() => {
      fetchSession();
   }, []);

   return { data: session, isPending, error, refetch };
}

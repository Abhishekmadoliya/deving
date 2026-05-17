"use client"
import StudioSession from "@/components/session/studioSessio";
import { getDesignSession } from "@/services/design/service.design";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function StudioPage() {
    const { id } = useParams();
    const [session, setSession] = useState<any>(null);


    useEffect(() => {
        if (id) {
            const sessionDesigns = getDesignSession(id as string);
            setSession(sessionDesigns);
        }
    }, [id]);


    // console.log("sessionDesigns", session);



    return <StudioSession session={session} />
}
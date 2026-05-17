"use client";

import StudioSession from "@/components/session/studioSessio";
import { getDesignSession } from "@/services/design/service.design";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";

export interface SessionImage {
    imageUrl: string;
    variantIndex: number;
    status: string;
    error: string | null;
}

const POLL_INTERVAL_MS = 2000;

/**
 * Check if all images in the session are ready (have a valid imageUrl and status "success").
 */
function areAllImagesReady(images: SessionImage[]): boolean {
    if (!images || images.length === 0) return false;
    return images.every(
        (img) => img.status === "success" && img.imageUrl && img.imageUrl.length > 0
    );
}

export default function StudioPage() {
    const { id } = useParams();
    const [session, setSession] = useState<SessionImage[] | null>(null);
    const [loading, setLoading] = useState(true);
    const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const isMountedRef = useRef(true);

    const stopPolling = useCallback(() => {
        if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
        }
    }, []);

    const fetchSession = useCallback(
        async (sessionId: string, isInitial = false) => {
            try {
                const data = await getDesignSession(sessionId);

                if (!isMountedRef.current) return;

                setSession(data);

                if (isInitial) {
                    setLoading(false);
                }

                // If all images are ready, stop polling
                if (Array.isArray(data) && areAllImagesReady(data)) {
                    stopPolling();
                }
            } catch (err) {
                console.error("Failed to load session:", err);
                if (isInitial && isMountedRef.current) {
                    setLoading(false);
                }
            }
        },
        [stopPolling]
    );

    useEffect(() => {
        isMountedRef.current = true;

        if (!id) return;

        const sessionId = id as string;

        // Initial fetch
        fetchSession(sessionId, true);

        // Start polling every 2s — will auto-stop when all images are ready
        pollingRef.current = setInterval(() => {
            fetchSession(sessionId);
        }, POLL_INTERVAL_MS);

        return () => {
            isMountedRef.current = false;
            stopPolling();
        };
    }, [id, fetchSession, stopPolling]);

    return <StudioSession session={session} loading={loading} />;
}
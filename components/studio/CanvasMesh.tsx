"use client";

import { useState } from "react";
import Image from "next/image";
import { useDesignStore } from "@/store/useDesignStore";
import { Sparkles, ImageIcon, ZoomIn, X } from "lucide-react";

export interface SessionImage {
    imageUrl: string;
    variantIndex: number;
    status: string;
    error: string | null;
}

// Staggered card positions matching the Stitch scattered layout
const CARD_LAYOUTS = [
    { top: "5%", left: "22%", width: 340, rotate: -0.8 },
    { top: "12%", left: "5%", width: 360, rotate: 0.4 },
    { top: "3%", left: "52%", width: 320, rotate: 0.6 },
    { top: "38%", left: "30%", width: 300, rotate: -0.3 },
    { top: "32%", left: "60%", width: 280, rotate: 1.0 },
    { top: "55%", left: "10%", width: 320, rotate: -0.5 },
];

const SKELETON_COUNT = 3;

/* ─── Skeleton Card (shown while polling) ─── */
function SkeletonCard({
    position,
    index,
}: {
    position: (typeof CARD_LAYOUTS)[0];
    index: number;
}) {
    return (
        <div
            className="stitch-canvas__card stitch-canvas__card--skeleton"
            style={{
                position: "absolute",
                top: position.top,
                left: position.left,
                width: position.width,
                transform: `rotate(${position.rotate}deg)`,
                animationDelay: `${index * 0.15}s`,
                zIndex: index + 1,
            }}
        >
            {/* Skeleton header */}
            <div className="stitch-canvas__card-header">
                <div className="stitch-canvas__card-header-left">
                    <ImageIcon style={{ width: 12, height: 12, color: "#444" }} />
                    <span className="stitch-skeleton__text" style={{ width: 80 }} />
                </div>
            </div>
            {/* Skeleton body */}
            <div className="stitch-canvas__card-body stitch-canvas__card-body--skeleton">
                <div className="stitch-skeleton__shimmer" />
            </div>
        </div>
    );
}

/* ─── Image Card (shown when image is ready) ─── */
function ImageCard({
    image,
    position,
    index,
    isSelected,
    onSelect,
    onExpand,
}: {
    image: SessionImage;
    position: (typeof CARD_LAYOUTS)[0];
    index: number;
    isSelected: boolean;
    onSelect: () => void;
    onExpand: () => void;
}) {
    const [hovered, setHovered] = useState(false);
    const label = `design-${image.variantIndex + 1}.png`;


    console.log("image", image);
    return (
        <div
            className={`stitch-canvas__card ${isSelected ? "stitch-canvas__card--selected" : ""}`}
            style={{
                position: "absolute",
                top: position.top,
                left: position.left,
                width: position.width,
                transform: `rotate(${position.rotate}deg)`,
                animationDelay: `${index * 0.12}s`,
                zIndex: isSelected ? 10 : index + 1,
            }}
            onClick={onSelect}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Card header — mimics the Stitch "image.png" label */}
            <div className="stitch-canvas__card-header">
                <div className="stitch-canvas__card-header-left">
                    <ImageIcon style={{ width: 12, height: 12, color: "#888" }} />
                    <span>{label}</span>
                </div>
                {hovered && (
                    <button
                        className="stitch-canvas__card-expand"
                        onClick={(e) => {
                            e.stopPropagation();
                            onExpand();
                        }}
                        aria-label="Expand image"
                    >
                        <ZoomIn style={{ width: 13, height: 13, color: "#aaa" }} />
                    </button>
                )}
            </div>
            {/* Card body — Next.js Image */}
            <div className="stitch-canvas__card-body stitch-canvas__card-body--image">
                <Image
                    src={image.imageUrl}
                    alt={`Design variant ${image.variantIndex + 1}`}
                    width={position.width}
                    height={280}
                    draggable={false}
                    className="stitch-canvas__card-img"
                    priority={index < 2}
                />
            </div>
        </div>
    );
}

/* ─── Expanded Overlay ─── */
function ExpandedOverlay({
    image,
    onClose,
}: {
    image: SessionImage;
    onClose: () => void;
}) {
    return (
        <div className="stitch-canvas__overlay" onClick={onClose}>
            <button
                className="stitch-canvas__overlay-close"
                onClick={onClose}
                aria-label="Close"
            >
                <X style={{ width: 20, height: 20 }} />
            </button>
            <div
                className="stitch-canvas__overlay-content"
                onClick={(e) => e.stopPropagation()}
            >
                <Image
                    src={image.imageUrl}
                    alt={`Design variant ${image.variantIndex + 1}`}
                    width={1200}
                    height={800}
                    className="stitch-canvas__overlay-img"
                    priority
                />
            </div>
        </div>
    );
}

/* ─── Main CanvasMesh ─── */
export function CanvasMesh({
    sessionImages,
    loading,
}: {
    sessionImages: SessionImage[] | null;
    loading: boolean;
}) {
    const { isGenerating } = useDesignStore();
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [expandedImage, setExpandedImage] = useState<SessionImage | null>(null);

    const readyImages =
        sessionImages?.filter(
            (img) => img.status === "success" && img.imageUrl
        ) ?? [];
    const pendingImages =
        sessionImages?.filter(
            (img) => img.status !== "success" || !img.imageUrl
        ) ?? [];

    const hasReadyImages = readyImages.length > 0;
    const hasPending = pendingImages.length > 0;

    // Show skeletons: either still loading initial data, or some images are pending
    const showSkeletons = loading || hasPending;

    // How many skeletons to show
    const skeletonCount = loading && !sessionImages
        ? SKELETON_COUNT  // Initial load — show 3 placeholder skeletons
        : pendingImages.length; // Partial — show one skeleton per pending image

    return (
        <div className="stitch-canvas">
            {/* Dot grid mesh background */}
            <div className="stitch-canvas__mesh" />

            {/* Ready image cards */}
            {readyImages.map((image, i) => (
                <ImageCard
                    key={`${image.imageUrl}-${image.variantIndex}`}
                    image={image}
                    position={CARD_LAYOUTS[i % CARD_LAYOUTS.length]}
                    index={i}
                    isSelected={selectedIndex === i}
                    onSelect={() => setSelectedIndex(i)}
                    onExpand={() => setExpandedImage(image)}
                />
            ))}

            {/* Skeleton cards for pending images */}
            {showSkeletons &&
                Array.from({ length: skeletonCount }).map((_, i) => {
                    const layoutIndex = (readyImages.length + i) % CARD_LAYOUTS.length;
                    return (
                        <SkeletonCard
                            key={`skeleton-${i}`}
                            position={CARD_LAYOUTS[layoutIndex]}
                            index={readyImages.length + i}
                        />
                    );
                })}

            {/* Expanded image overlay */}
            {expandedImage && (
                <ExpandedOverlay
                    image={expandedImage}
                    onClose={() => setExpandedImage(null)}
                />
            )}

            {/* Empty state — no images AND done loading */}
            {!hasReadyImages && !loading && !isGenerating && !hasPending && (
                <div className="stitch-canvas__empty">
                    <div className="stitch-canvas__empty-icon">
                        <Sparkles style={{ width: 32, height: 32, color: "#333" }} />
                    </div>
                    <p className="stitch-canvas__empty-text">
                        Describe what you want to design
                    </p>
                    <p className="stitch-canvas__empty-sub">
                        Your generated designs will appear here as floating cards
                    </p>
                </div>
            )}
        </div>
    );
}

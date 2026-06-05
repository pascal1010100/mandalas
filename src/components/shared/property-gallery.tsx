"use client"

import Image from "next/image"

import { FadeIn } from "@/components/animations/fade-in"

type GalleryImage = {
    src: string
    alt: string
    label: string
}

type PropertyGalleryProps = {
    eyebrow: string
    title: string
    description: string
    images: GalleryImage[]
    accent: "amber" | "lime"
}

const accentStyles = {
    amber: "text-amber-700 dark:text-amber-300",
    lime: "text-lime-700 dark:text-lime-300",
}

export function PropertyGallery({ eyebrow, title, description, images, accent }: PropertyGalleryProps) {
    const accentClass = accentStyles[accent]

    return (
        <section className="bg-background py-24">
            <div className="container mx-auto px-4">
                <FadeIn>
                    <div className="mb-12 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
                        <div>
                            <p className={`mb-4 text-xs font-semibold uppercase tracking-[0.24em] ${accentClass}`}>
                                {eyebrow}
                            </p>
                            <h2 className="font-heading text-3xl font-light uppercase leading-tight tracking-[0.16em] text-foreground md:text-5xl">
                                {title}
                            </h2>
                        </div>
                        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground lg:justify-self-end">
                            {description}
                        </p>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-12 lg:grid-rows-[18rem_18rem]">
                        {images.map((image, index) => (
                            <figure
                                key={image.src}
                                className={[
                                    "group relative overflow-hidden bg-stone-900",
                                    index === 0 ? "min-h-[24rem] lg:col-span-7 lg:row-span-2" : "",
                                    index === 1 ? "min-h-[18rem] lg:col-span-5" : "",
                                    index > 1 ? "min-h-[18rem] lg:col-span-5" : "",
                                ].join(" ")}
                            >
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill
                                    sizes={index === 0 ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 42vw, 100vw"}
                                    className="object-cover transition duration-[1400ms] ease-out group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                                <figcaption className="absolute bottom-0 left-0 right-0 p-5">
                                    <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/75">
                                        {image.label}
                                    </span>
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                </FadeIn>
            </div>
        </section>
    )
}

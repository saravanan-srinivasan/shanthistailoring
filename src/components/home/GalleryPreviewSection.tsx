"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const galleryItems = [
  { src: "/images/bridal.png",    label: "Bridal Collection",  tag: "Bridal"     },
  { src: "/images/blouse.png",    label: "Designer Blouse",    tag: "Couture"    },
  { src: "/images/aari.png",      label: "Aari Embroidery",    tag: "Heritage"   },
  { src: "/images/chudidhar.png", label: "Anarkali Suit",      tag: "Fusion"     },
  { src: "/images/kids.png",      label: "Pattu Pavadai",      tag: "Kids Wear"  },
];

export default function GalleryPreviewSection() {
  return (
    <section className="bg-[#0A0A0A] py-24 md:py-36 overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div>
            <p className="section-label mb-4">The Collection</p>
            <h2
              className="text-5xl md:text-6xl text-white leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
            >
              A Glimpse Into<br />
              <span className="italic text-[#C9A84C]">Our World.</span>
            </h2>
          </div>
          <Link href="/gallery" className="shrink-0 group">
            <span className="text-[#C9A84C] text-xs tracking-[0.25em] uppercase inline-flex items-center gap-2 group-hover:gap-3 transition-all duration-300 cursor-pointer">
              View Full Gallery <span>→</span>
            </span>
          </Link>
        </motion.div>

        {/* Masonry-style Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">

          {/* Large Feature — spans 2 rows on md+ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative col-span-2 md:col-span-1 md:row-span-2 overflow-hidden group cursor-pointer"
            style={{ minHeight: "320px", height: "100%" }}
          >
            <div className="relative w-full" style={{ minHeight: "320px", height: "100%" }}>
              <Image
                src={galleryItems[0].src}
                alt={galleryItems[0].label}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-[8s] group-hover:scale-105"
              />
              {/* Tag */}
              <span className="absolute top-4 left-4 text-[9px] tracking-[0.3em] uppercase text-white bg-black/40 backdrop-blur-md px-3 py-1.5 border border-white/20 z-10">
                {galleryItems[0].tag}
              </span>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-5 z-10">
                <span className="text-white text-xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {galleryItems[0].label}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right-side 4 items */}
          {galleryItems.slice(1).map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (i + 1) * 0.08, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden group cursor-pointer"
              style={{ height: "240px" }}
            >
              <Image
                src={item.src}
                alt={item.label}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-[8s] group-hover:scale-105"
              />
              {/* Tag */}
              <span className="absolute top-3 left-3 text-[9px] tracking-[0.3em] uppercase text-white bg-black/40 backdrop-blur-md px-2.5 py-1 border border-white/20 z-10">
                {item.tag}
              </span>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-4 z-10">
                <span className="text-white text-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {item.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 flex justify-center"
        >
          <Link href="/gallery">
            <button className="btn-ghost">View All Collections</button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

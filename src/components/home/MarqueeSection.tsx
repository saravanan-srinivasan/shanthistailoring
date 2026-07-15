"use client";

const marqueeItems = [
  "Bridal Wear", "Designer Blouses", "Aari Work", "Embroidery",
  "Custom Stitching", "Kids Wear", "Anarkali Suits", "Pattu Pavadai",
  "Maggam Work", "Zardosi",
];

const track = [...marqueeItems, ...marqueeItems, ...marqueeItems];

export default function MarqueeSection() {
  return (
    <div
      className="bg-[#C9A84C] py-[14px] overflow-hidden w-full"
      aria-hidden="true"
    >
      <div className="flex items-center gap-10 marquee-track w-max">
        {track.map((item, i) => (
          <span key={i} className="flex items-center gap-10 flex-shrink-0">
            <span
              className="text-[#0A0A0A] text-[11px] font-medium tracking-[0.3em] uppercase whitespace-nowrap"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              {item}
            </span>
            <span className="text-[#0A0A0A]/30 text-sm leading-none flex-shrink-0">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";

function IconArrowRight() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth={2} 
      stroke="currentColor" 
      className="w-4 h-4"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  );
}

const CITIES = [
  {
    name: "Mumbai",
    count: "42,300+ Properties",
    img: "https://images.unsplash.com/photo-1660145416818-b9a2b1a1f193?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    large: true,
  },
  {
    name: "Delhi NCR",
    count: "38,900+ Properties",
    img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80",
  },
  {
    name: "Bengaluru",
    count: "35,600+ Properties",
    img: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=927&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Hyderabad",
    count: "29,100+ Properties",
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
  },
  {
    name: "Pune",
    count: "21,400+ Properties",
    img: "https://images.unsplash.com/photo-1567880905822-56f8e06fe630?w=600&q=80",
  },
  {
    name: "Lucknow",
    count: "18,200+ Properties",
    img: "https://images.unsplash.com/photo-1688287580970-70fe8e0f4bef?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export default function CityGrid() {
  return (
    <section className="py-16 md:py-20 bg-surface">
      <div className="max-w-container mx-auto px-6">
        <div className="flex items-end justify-between mb-10 w-full">
          <div>
            <p className="text-[13px] font-semibold tracking-wider uppercase text-primary mb-1.5">
              Explore India
            </p>
            <h2 className="font-display font-bold text-ink text-[clamp(24px,3vw,34px)]">
              Browse by City
            </h2>
          </div>
          
          <Link
            href="/listings"
            className="text-sm font-semibold text-primary flex items-center gap-1.5 hover:gap-2.5 transition-all whitespace-nowrap pb-1"
          >
            View all <IconArrowRight />
          </Link>
        </div>
        

        {/* Cleaned up parent grid tracks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CITIES.map((city) => (
            <div
              key={city.name}
              className={`relative rounded overflow-hidden cursor-pointer group h-[200px] sm:h-[240px] ${
                city.large ? "sm:col-span-2 lg:col-span-1 lg:row-span-2 lg:h-[496px]" : ""
              }`}
            >
              <Image
                src={city.img}
                alt={city.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={city.large} // Added priority for above-the-fold image
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-bold mb-0.5">{city.name}</h3>
                <p className="text-xs opacity-80">{city.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
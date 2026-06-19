import Image from "next/image";

const CITIES = [
  {
    name: "Mumbai",
    count: "42,300+ Properties",
    img: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80",
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
    img: "https://images.unsplash.com/photo-1580581096469-c6b51ab56d9d?w=600&q=80",
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
    img: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80",
  },
];

export default function CityGrid() {
  return (
    <section className="py-16 md:py-20 bg-surface">
      <div className="max-w-container mx-auto px-6">
        <div className="mb-10">
          <p className="text-[13px] font-semibold tracking-wider uppercase text-primary mb-1.5">
            Explore India
          </p>
          <h2 className="font-display font-bold text-ink text-[clamp(24px,3vw,34px)]">
            Browse by City
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 gap-4">
          {CITIES.map((city, i) => (
            <div
              key={city.name}
              className={`relative rounded overflow-hidden cursor-pointer group h-[200px] lg:h-auto ${
                city.large ? "lg:row-span-2 sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <Image
                src={city.img}
                alt={city.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
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
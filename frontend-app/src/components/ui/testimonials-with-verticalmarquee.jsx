import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const defaultTestimonials = [
  {
    quote:
      "Our support floor went from three language teams to one. Customers hear their own language, agents hear theirs — no handoffs, no queues.",
    name: "Ananya Rao",
    role: "VP, Customer Support",
    org: "Finvera",
    rating: 5,
    gradient: "from-[#6C3CE1] to-[#9B6DFF]",
  },
  {
    quote:
      "We cloned the clinic's front-desk voice once. Every appointment reminder now goes out in the patient's own language — reminder pickup rose 41% in a month.",
    name: "Dr. Kiran Mehta",
    role: "Head of Operations",
    org: "CarePoint Hospitals",
    rating: 5,
    gradient: "from-[#FF6B35] to-[#FF9F6B]",
  },
  {
    quote:
      "Latency was the dealbreaker everywhere else. Under 300ms is the difference between a conversation and a waiting room.",
    name: "Rahul Iyer",
    role: "Engineering Lead",
    org: "Streamly",
    rating: 5,
    gradient: "from-[#00D4AA] to-[#6C3CE1]",
  },
  {
    quote:
      "A doctor speaks Telugu, the patient hears English, and nobody in the room realizes there was a translation in the middle of it.",
    name: "Priya Menon",
    role: "Telemedicine Director",
    org: "Swasthya Care",
    rating: 5,
    gradient: "from-[#9B6DFF] to-[#FF6B35]",
  },
  {
    quote:
      "12,000 voice-agent calls a week in Hindi, Tamil and Bengali. The clean handoff to a human when confidence drops is what sold our team.",
    name: "Vikram Shah",
    role: "Director of CX",
    org: "ZapSupport",
    rating: 5,
    gradient: "from-[#6C3CE1] to-[#00D4AA]",
  },
  {
    quote:
      "Live captions in 22 languages for our state assembly stream. We were on air with it the same afternoon we signed up.",
    name: "Meera Krishnan",
    role: "Broadcast Head",
    org: "NewsLoop",
    rating: 5,
    gradient: "from-[#FF6B35] to-[#6C3CE1]",
  },
  {
    quote:
      "Thirty seconds of my recorded voice and it reads my newsletter in Spanish and Japanese. Slightly eerie, completely useful.",
    name: "Daniel Okafor",
    role: "Creator, 180k subscribers",
    org: "The Long Form",
    rating: 5,
    gradient: "from-[#00D4AA] to-[#9B6DFF]",
  },
  {
    quote:
      "The analytics view finally answered what finance kept asking: what does one minute of translation actually cost us?",
    name: "Sara D'Souza",
    role: "Head of Platform",
    org: "Kite Labs",
    rating: 5,
    gradient: "from-[#9B6DFF] to-[#00D4AA]",
  },
  {
    quote:
      "I'm hard of hearing. Live captions in meetings meant I stopped asking people to repeat themselves — nobody even noticed the change.",
    name: "Anushka Bose",
    role: "Accessibility Tester",
    org: "Inclusive Web Collective",
    rating: 5,
    gradient: "from-[#6C3CE1] to-[#FF6B35]",
  },
  {
    quote:
      "The JS SDK was in our codebase before the coffee went cold. Webhooks, docs, sane errors — it felt built by people who ship.",
    name: "Tomas Lindqvist",
    role: "Founding Engineer",
    org: "Norrland",
    rating: 5,
    gradient: "from-[#FF6B35] to-[#00D4AA]",
  },
  {
    quote:
      "SOC 2, GDPR and no training on our audio without consent. That last line is what got it past our security review on the first pass.",
    name: "Nandini Verma",
    role: "CISO",
    org: "Ledgerworks",
    rating: 5,
    gradient: "from-[#9B6DFF] to-[#6C3CE1]",
  },
  {
    quote:
      "Our agents used to repeat everything twice for non-English callers. Deflection went up eleven points and CSAT followed it.",
    name: "Imran Qureshi",
    role: "Support Operations Manager",
    org: "Bharat Mobility",
    rating: 5,
    gradient: "from-[#00D4AA] to-[#FF6B35]",
  },
];

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={cn(
            "size-3.5",
            i < rating ? "fill-[#FF6B35] text-[#FF6B35]" : "text-white/20",
          )}
          strokeWidth={2}
        />
      ))}
    </div>
  );
}

function initials(name) {
  return name
    .replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.)\s+/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function TestimonialCard({ testimonial }) {
  const { quote, name, role, org, rating, gradient } = testimonial;
  return (
    <figure className="mb-4 rounded-[20px] bg-white/[0.02] border border-white/[0.07] p-5 sm:p-6 transition-colors duration-300 hover:border-white/[0.16] hover:bg-white/[0.04]">
      <Stars rating={rating} />
      <blockquote className="mt-4 font-light text-[15px] leading-relaxed text-white/85">
        <span className="text-[#FF6B35] mr-0.5">&ldquo;</span>
        {quote}
        <span className="text-[#FF6B35] ml-0.5">&rdquo;</span>
      </blockquote>
      <figcaption className="mt-5 pt-4 border-t border-white/[0.08] flex items-center gap-3">
        <div
          aria-hidden="true"
          className={cn(
            "size-9 shrink-0 rounded-full bg-gradient-to-br flex items-center justify-center text-[12px] font-semibold text-white",
            gradient,
          )}
        >
          {initials(name)}
        </div>
        <div className="min-w-0">
          <div className="text-[13px] text-white truncate">{name}</div>
          <div className="text-[12px] text-gray-500 truncate">
            {role}, {org}
          </div>
        </div>
      </figcaption>
    </figure>
  );
}

function MarqueeColumn({ items, reverse = false, duration = 45, className }) {
  const loop = [...items, ...items];
  return (
    <div
      className={cn(
        "group vertical-marquee relative h-[460px] overflow-hidden sm:h-[560px] [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]",
        className,
      )}
    >
      <div
        className="flex flex-col will-change-transform group-hover:[animation-play-state:paused]"
        style={{
          animation: `marquee-vertical ${duration}s linear infinite ${reverse ? "reverse" : "normal"}`,
        }}
      >
        {loop.map((t, i) => (
          <TestimonialCard key={`${t.name}-${i}`} testimonial={t} />
        ))}
      </div>
    </div>
  );
}

function splitColumns(items, count) {
  const cols = Array.from({ length: count }, () => []);
  items.forEach((item, i) => cols[i % count].push(item));
  return cols;
}

export function TestimonialsVerticalMarquee({
  testimonials = defaultTestimonials,
  kicker = "Testimonials",
  heading = "Don't just take our word.",
  accent = "Hear theirs.",
  subheading = "Support floors, clinics, newsrooms and indie builders running voice, chat and live translation on ClearSpeak.",
  columns = 3,
  className,
}) {
  const cols = splitColumns(testimonials, columns);
  const directions = [false, true, false];

  return (
    <section className={cn("relative px-5 sm:px-8 py-20 sm:py-28", className)}>
      <div className="max-w-7xl mx-auto">
        <header className="max-w-2xl mb-12 sm:mb-16">
          <span className="block text-[11px] tracking-[0.3em] uppercase text-gray-500 font-mono mb-5">
            {kicker}
          </span>
          <h2 className="font-light text-white text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] tracking-[-0.03em]">
            {heading}{" "}
            <span className="gradient-text-alt">{accent}</span>
          </h2>
          {subheading ? (
            <p className="mt-5 text-[15px] leading-relaxed text-gray-400">
              {subheading}
            </p>
          ) : null}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          <div className="md:hidden">
            <MarqueeColumn items={testimonials} />
          </div>
          {cols.map((col, i) => (
            <MarqueeColumn
              key={i}
              items={col}
              reverse={directions[i % directions.length]}
              className="hidden md:block"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsVerticalMarquee;

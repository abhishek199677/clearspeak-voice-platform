import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import confetti from "canvas-confetti";
import NumberFlow from "@number-flow/react";
import { useState, useRef } from "react";

interface PricingPlan {
  name: string;
  price: string | null;
  yearlyPrice: string | null;
  period: string;
  features: string[];
  description: string;
  buttonText: string;
  href: string;
  isPopular: boolean;
}

interface PricingProps {
  plans: PricingPlan[];
  title?: string;
  description?: string;
}

const defaultPlans: PricingPlan[] = [
  {
    name: "Starter",
    price: "0",
    yearlyPrice: "0",
    period: "month",
    features: [
      "1,000 API calls/month",
      "Speech to Text",
      "Text to Speech",
      "5 languages",
      "Community support",
      "Basic analytics",
    ],
    description: "Perfect for individuals and small projects",
    buttonText: "Start Free",
    href: "#/voice",
    isPopular: false,
  },
  {
    name: "Professional",
    price: "49",
    yearlyPrice: "39",
    period: "month",
    features: [
      "50,000 API calls/month",
      "Everything in Starter",
      "Voice Agents",
      "200+ languages",
      "Real-time streaming",
      "Priority support",
      "Advanced analytics",
      "Custom voice cloning",
    ],
    description: "For growing teams and production apps",
    buttonText: "Get Started",
    href: "#/voice",
    isPopular: true,
  },
  {
    name: "Enterprise",
    price: null,
    yearlyPrice: null,
    period: "month",
    features: [
      "Unlimited API calls",
      "Everything in Professional",
      "Dedicated infrastructure",
      "SLA guarantee (99.99%)",
      "SOC 2 & HIPAA compliance",
      "Custom integrations",
      "Dedicated account manager",
      "On-premise deployment",
    ],
    description: "For organizations that need scale and security",
    buttonText: "Contact Sales",
    href: "#/enterprise",
    isPopular: false,
  },
];

export function Pricing({
  plans = defaultPlans,
  title = "Simple, Transparent Pricing",
  description = "Choose the plan that works for you\nAll plans include access to our platform, lead generation tools, and dedicated support.",
}: PricingProps) {
  const [isMonthly, setIsMonthly] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const switchRef = useRef<HTMLButtonElement>(null);

  const handleToggle = (checked: boolean) => {
    setIsMonthly(!checked);
    if (checked && switchRef.current) {
      const rect = switchRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      confetti({
        particleCount: 50,
        spread: 60,
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
        colors: ["#6C3CE1", "#9B6DFF", "#00D4AA", "#FF6B35", "#FFFFFF"],
        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["circle"],
      });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8 py-20">
      <div className="text-center space-y-4 mb-12">
        <span className="text-[#00D4AA] font-semibold tracking-wider uppercase text-[11px]">
          Pricing
        </span>
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {title}
        </h2>
        <p className="text-muted-foreground text-lg whitespace-pre-line">
          {description}
        </p>
      </div>

      <div className="flex justify-center items-center mb-10">
        <Label className="relative inline-flex items-center cursor-pointer">
          <Switch
            ref={switchRef as any}
            checked={!isMonthly}
            onCheckedChange={handleToggle}
            className="relative"
          />
        </Label>
        <span className="ml-2 font-semibold">
          Annual billing <span className="text-primary">(Save 20%)</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ y: 50, opacity: 1 }}
            whileInView={
              isDesktop
                ? {
                    y: plan.isPopular ? -20 : 0,
                    opacity: 1,
                    x: index === 2 ? -30 : index === 0 ? 30 : 0,
                    scale: index === 0 || index === 2 ? 0.94 : 1.0,
                  }
                : { y: 0, opacity: 1 }
            }
            viewport={{ once: true }}
            transition={{
              duration: 1.6,
              type: "spring",
              stiffness: 100,
              damping: 30,
              delay: 0.4,
              opacity: { duration: 0.5 },
            }}
            className={cn(
              `rounded-2xl border-[1px] p-6 bg-background text-center lg:flex lg:flex-col lg:justify-center relative`,
              plan.isPopular ? "border-primary border-2" : "border-border",
              "flex flex-col",
              !plan.isPopular && "mt-5",
              index === 0 || index === 2
                ? "z-0 transform translate-x-0 translate-y-0 -translate-z-[50px] rotate-y-[10deg]"
                : "z-10",
              index === 0 && "origin-right",
              index === 2 && "origin-left"
            )}
          >
            {plan.isPopular && (
              <div className="absolute top-0 right-0 bg-primary py-0.5 px-2 rounded-bl-xl rounded-tr-xl flex items-center">
                <Star className="text-primary-foreground h-4 w-4 fill-current" />
                <span className="text-primary-foreground ml-1 font-sans font-semibold">
                  Popular
                </span>
              </div>
            )}
            <div className="flex-1 flex flex-col">
              <p className="text-base font-semibold text-muted-foreground">
                {plan.name}
              </p>
              <div className="mt-6 flex items-center justify-center gap-x-2">
                {plan.price === null ? (
                  <span className="text-5xl font-bold tracking-tight text-foreground">
                    Custom
                  </span>
                ) : (
                  <>
                    <span className="text-5xl font-bold tracking-tight text-foreground">
                      <NumberFlow
                        value={
                          isMonthly
                            ? Number(plan.price)
                            : Number(plan.yearlyPrice)
                        }
                        format={{
                          style: "currency",
                          currency: "USD",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }}
                        formatter={(value) => `$${value}`}
                        transformTiming={{
                          duration: 500,
                          easing: "ease-out",
                        }}
                        willChange
                        className="font-variant-numeric: tabular-nums"
                      />
                    </span>
                    {plan.period !== "Next 3 months" && (
                      <span className="text-sm font-semibold leading-6 tracking-wide text-muted-foreground">
                        / {plan.period}
                      </span>
                    )}
                  </>
                )}
              </div>

              <p className="text-xs leading-5 text-muted-foreground">
                {plan.price === null
                  ? "Tailored to your organisation"
                  : isMonthly
                    ? "billed monthly"
                    : "billed annually"}
              </p>

              <ul className="mt-5 gap-2 flex flex-col">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <span className="text-left">{feature}</span>
                  </li>
                ))}
              </ul>

              <hr className="w-full my-4 border-border" />

              <a
                href={plan.href}
                className={cn(
                  buttonVariants({
                    variant: "outline",
                  }),
                  "group relative w-full gap-2 overflow-hidden text-lg font-semibold tracking-tighter",
                  "transform-gpu ring-offset-current transition-all duration-300 ease-out hover:ring-2 hover:ring-primary hover:ring-offset-1 hover:bg-primary hover:text-primary-foreground",
                  plan.isPopular
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground"
                )}
              >
                {plan.buttonText}
              </a>
              <p className="mt-6 text-xs leading-5 text-muted-foreground">
                {plan.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Pricing;

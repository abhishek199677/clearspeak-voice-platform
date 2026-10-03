import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const AccordionStyleContext = React.createContext({
  variant: "default",
  indicator: "chevron",
})

const rootStyles = {
  default: "divide-y divide-white/[0.08]",
  card: "space-y-3",
  filled: "space-y-2",
  ghost: "space-y-1",
}

const itemStyles = {
  default: "border-b border-white/[0.08]",
  card: "overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0E0E15]/90 backdrop-blur-md transition-colors data-[state=open]:border-violet-500/50 hover:border-white/20",
  filled:
    "overflow-hidden rounded-xl bg-white/[0.03] transition-colors data-[state=open]:bg-white/[0.06]",
  ghost: "",
}

const triggerStyles = {
  default:
    "gap-4 py-4 text-[15px] font-medium text-white/90 hover:text-white [&[data-state=open]]:text-white",
  card: "gap-4 px-5 py-4 text-[15px] font-medium text-white/90 hover:text-white",
  filled:
    "gap-4 px-4 py-3.5 text-[15px] font-medium text-white/90 hover:text-white",
  ghost:
    "gap-3 rounded-lg py-3 text-[15px] font-medium text-white/90 hover:text-white",
}

const contentStyles = {
  default: "pb-5 pr-8",
  card: "px-5 pb-5 pr-10",
  filled: "px-4 pb-4 pr-10",
  ghost: "pb-4 pr-8",
}

const Accordion = ({
  className,
  variant = "default",
  indicator = "chevron",
  ...props
}) => (
  <AccordionStyleContext.Provider value={{ variant, indicator }}>
    <AccordionPrimitive.Root
      className={cn(rootStyles[variant] || rootStyles.default, className)}
      {...props}
    />
  </AccordionStyleContext.Provider>
)
Accordion.displayName = "Accordion"

const AccordionItem = React.forwardRef(({ className, ...props }, ref) => {
  const { variant } = React.useContext(AccordionStyleContext)
  return (
    <AccordionPrimitive.Item
      ref={ref}
      className={cn(itemStyles[variant] || itemStyles.default, className)}
      {...props}
    />
  )
})
AccordionItem.displayName = "AccordionItem"

const PlusIndicator = () => (
  <span
    aria-hidden="true"
    className="relative size-4 shrink-0 transition-transform duration-300 ease-out group-data-[state=open]:rotate-180"
  >
    <span className="absolute left-0 top-1/2 h-[1.5px] w-4 -translate-y-1/2 rounded-full bg-current" />
    <span className="absolute left-1/2 top-0 h-4 w-[1.5px] -translate-x-1/2 rounded-full bg-current transition-transform duration-300 ease-out group-data-[state=open]:scale-y-0" />
  </span>
)

const AccordionTrigger = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    const { variant, indicator } = React.useContext(AccordionStyleContext)
    return (
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
          ref={ref}
          className={cn(
            "group flex flex-1 items-center justify-between text-left font-medium text-neutral-200 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-violet-500/40",
            triggerStyles[variant] || triggerStyles.default,
            className,
          )}
          {...props}
        >
          {children}
          {indicator === "chevron" && (
            <ChevronDown
              aria-hidden="true"
              className="size-4 shrink-0 text-neutral-400 transition-transform duration-300 ease-out group-data-[state=open]:rotate-180"
              strokeWidth={2}
            />
          )}
          {indicator === "plus" && <PlusIndicator />}
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
    )
  },
)
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    const { variant } = React.useContext(AccordionStyleContext)
    return (
      <AccordionPrimitive.Content
        ref={ref}
        className="overflow-hidden text-sm leading-relaxed text-neutral-400 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
        {...props}
      >
        <div className={cn(contentStyles[variant] || contentStyles.default, className)}>
          {children}
        </div>
      </AccordionPrimitive.Content>
    )
  },
)
AccordionContent.displayName = AccordionPrimitive.Content.displayName

const usePrefersReducedMotion = () =>
  React.useSyncExternalStore(
    (onChange) => {
      if (typeof window === "undefined") return () => {}
      const query = window.matchMedia("(prefers-reduced-motion: reduce)")
      query.addEventListener("change", onChange)
      return () => query.removeEventListener("change", onChange)
    },
    () => (typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false),
    () => false,
  )

const useIsOpen = (node) => {
  const [isOpen, setIsOpen] = React.useState(true)

  React.useEffect(() => {
    if (!node) return
    const update = () => {
      const state = node.getAttribute("data-state")
      setIsOpen(state === "open" || state === null)
    }
    update()
    const observer = new MutationObserver(update)
    observer.observe(node, {
      attributes: true,
      attributeFilter: ["data-state"],
    })
    return () => observer.disconnect()
  }, [node])

  return isOpen
}

const StreamShell = ({
  text,
  label,
  icon,
  streaming,
  children,
}) => (
  <>
    <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-400 dark:text-neutral-500">
      {icon}
      <span>{label}</span>
      {streaming && (
        <span aria-hidden="true" className="flex items-center gap-0.5">
          <span className="size-1 animate-pulse rounded-full bg-violet-400 [animation-duration:1s]" />
          <span className="size-1 animate-pulse rounded-full bg-violet-400 [animation-delay:200ms] [animation-duration:1s]" />
          <span className="size-1 animate-pulse rounded-full bg-violet-400 [animation-delay:400ms] [animation-duration:1s]" />
        </span>
      )}
    </div>
    <div className="relative">
      <p aria-hidden="true" className="invisible whitespace-pre-wrap">
        {text}
        <span className="inline-block w-1" />
      </p>
      {children}
      <span className="sr-only">{text}</span>
    </div>
  </>
)

const StreamedAnswer = ({
  text,
  speed,
  startDelay,
  streamingLabel,
  doneLabel,
  icon,
}) => {
  const reducedMotion = usePrefersReducedMotion()
  const [revealed, setRevealed] = React.useState(
    reducedMotion ? text.length : 0,
  )
  const [thinking, setThinking] = React.useState(!reducedMotion)

  React.useEffect(() => {
    if (reducedMotion) return

    let index = 0
    let timer

    const tick = () => {
      const chunk = 1 + (index % 3)
      index = Math.min(text.length, index + chunk)
      setRevealed(index)
      if (index >= text.length) return
      const pause = /[.,!?;:]\s?$/.test(text.slice(0, index)) ? 5 : 1
      timer = setTimeout(tick, speed * chunk * pause)
    }

    timer = setTimeout(() => {
      setThinking(false)
      tick()
    }, startDelay)

    return () => clearTimeout(timer)
  }, [text, speed, startDelay, reducedMotion])

  const done = revealed >= text.length

  return (
    <StreamShell
      text={text}
      icon={icon}
      label={done ? doneLabel : streamingLabel}
      streaming={!done}
    >
      <p aria-hidden="true" className="absolute inset-0 whitespace-pre-wrap text-neutral-300">
        {thinking ? (
          <span className="inline-block h-[1em] w-24 animate-pulse rounded bg-violet-500/20 align-middle [animation-duration:1.2s]" />
        ) : (
          text.slice(0, revealed)
        )}
        {!done && !thinking && (
          <span className="ml-0.5 inline-block h-[0.95em] w-[3px] translate-y-[1px] animate-pulse rounded-full bg-violet-400 align-middle [animation-duration:1s]" />
        )}
      </p>
    </StreamShell>
  )
}

const AccordionStreamingContent = React.forwardRef(
  (
    {
      className,
      text,
      speed = 14,
      startDelay = 420,
      streamingLabel = "Generating",
      doneLabel = "Generated answer",
      icon,
      ...props
    },
    ref,
  ) => {
    const { variant } = React.useContext(AccordionStyleContext)
    const [node, setNode] = React.useState(null)
    const open = useIsOpen(node)

    const assignRef = React.useCallback(
      (el) => {
        setNode(el)
        if (typeof ref === "function") ref(el)
        else if (ref) ref.current = el
      },
      [ref],
    )

    return (
      <AccordionPrimitive.Content
        ref={assignRef}
        className="overflow-hidden text-sm leading-relaxed text-neutral-400 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
        {...props}
      >
        <div className={cn(contentStyles[variant] || contentStyles.default, className)}>
          {open ? (
            <StreamedAnswer
              text={text}
              speed={speed}
              startDelay={startDelay}
              streamingLabel={streamingLabel}
              doneLabel={doneLabel}
              icon={icon}
            />
          ) : (
            <StreamShell text={text} label={doneLabel} icon={icon} />
          )}
        </div>
      </AccordionPrimitive.Content>
    )
  },
)
AccordionStreamingContent.displayName = "AccordionStreamingContent"

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  AccordionStreamingContent,
}

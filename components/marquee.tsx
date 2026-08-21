import clsx from "clsx";

type MarqueeProps = {
  items: readonly string[];
  className?: string;
  itemClassName?: string;
};

export default function Marquee({
  items,
  className,
  itemClassName,
}: MarqueeProps) {
  return (
    <div className={clsx("overflow-hidden", className)} aria-hidden>
      <div className="flex w-max animate-marquee">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center">
            {items.map((item) => (
              <li
                key={item}
                className={clsx("flex items-center", itemClassName)}
              >
                <span className="whitespace-nowrap">{item}</span>
                <span className="mx-6 text-accent">✦</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

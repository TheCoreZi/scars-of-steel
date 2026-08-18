import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  PropsWithChildren,
} from "react";

interface BadgeProps extends PropsWithChildren {
  className?: string;
}

interface MeterProps {
  label: string;
  max?: number;
  value: number;
}

interface PanelProps extends PropsWithChildren {
  className?: string;
  labelledBy?: string;
}

export function Badge({ children, className = "" }: BadgeProps) {
  return <span className={`badge ${className}`.trim()}>{children}</span>;
}

export function Button({
  children,
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`button ${className}`.trim()} type={type} {...props}>
      {children}
    </button>
  );
}

export function Meter({ label, max = 100, value }: MeterProps) {
  return (
    <div className="meter">
      <span className="meter__heading">
        <span className="meter__label">{label}</span>
        <span className="meter__number">{value}</span>
      </span>
      <div
        aria-label={label}
        aria-valuemax={max}
        aria-valuemin={0}
        aria-valuenow={value}
        className="meter__track"
        role="progressbar"
      >
        <span
          className="meter__value"
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
    </div>
  );
}

export function Panel({ children, className = "", labelledBy }: PanelProps) {
  const accessibilityProps: HTMLAttributes<HTMLElement> = labelledBy
    ? { "aria-labelledby": labelledBy }
    : {};

  return (
    <section className={`panel ${className}`.trim()} {...accessibilityProps}>
      {children}
    </section>
  );
}

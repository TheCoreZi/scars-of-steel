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

export function Meter({ label, value }: MeterProps) {
  return (
    <div className="meter">
      <span className="meter__label">{label}</span>
      <div
        aria-label={label}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={value}
        className="meter__track"
        role="progressbar"
      >
        <span className="meter__value" style={{ width: `${value}%` }} />
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

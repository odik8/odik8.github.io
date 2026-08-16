import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "@/lib/classes";
import { Icon, type IconName } from "../Icon/Icon";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "link";
export type ButtonSize = "sm" | "md" | "lg";

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconRight?: IconName;
  full?: boolean;
  children?: ReactNode;
  className?: string;
}

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { as?: "button" };

type AnchorProps = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { as: "a"; href: string };

/** The system's primary action. Four variants, three sizes.
 *
 *  Hover and press are CSS state rather than React state, so this stays a
 *  server component and reacts before hydration. */
export function Button(props: ButtonProps | AnchorProps) {
  const {
    variant = "primary",
    size = "md",
    icon,
    iconRight,
    full = false,
    children,
    className,
    ...rest
  } = props;

  const iconSize = size === "lg" ? 20 : 16;
  const classes = cx(
    styles.button,
    styles[variant],
    styles[size],
    full && styles.full,
    className,
  );

  const inner = (
    <>
      {icon && <Icon name={icon} size={iconSize} />}
      {children}
      {iconRight && <Icon name={iconRight} size={iconSize} className={styles.iconRight} />}
    </>
  );

  if (rest.as === "a") {
    const { as: _as, ...anchorRest } = rest as AnchorProps;
    void _as;
    return (
      <a {...anchorRest} className={classes}>
        {inner}
      </a>
    );
  }

  const { as: _as, ...buttonRest } = rest as ButtonProps;
  void _as;
  return (
    <button {...buttonRest} type={buttonRest.type ?? "button"} className={classes}>
      {inner}
    </button>
  );
}

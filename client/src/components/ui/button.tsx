import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

type ActionIntent = "add" | "save" | "delete" | "upload" | "cancel";

const ACTION_INTENT_KEYWORDS: Record<ActionIntent, string[]> = {
  add: ["add", "create", "new", "plus", "जोडा", "तयार", "नवीन"],
  save: ["save", "submit", "update", "जतन", "सबमिट", "अद्ययावत"],
  delete: ["delete", "remove", "trash", "हटवा", "काढा"],
  upload: ["upload", "अपलोड"],
  cancel: ["cancel", "close", "रद्द", "बंद"],
};

const flattenTextFromChildren = (children: React.ReactNode): string => {
  let text = "";
  React.Children.forEach(children, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      text += child.toString();
      return;
    }
    if (React.isValidElement(child)) {
      if (child.props?.children) {
        text += flattenTextFromChildren(child.props.children);
      }
      const ariaLabel = child.props?.["aria-label"];
      if (typeof ariaLabel === "string") {
        text += ` ${ariaLabel}`;
      }
      const title = child.props?.title;
      if (typeof title === "string") {
        text += ` ${title}`;
      }
      const componentName =
        typeof child.type === "function" || typeof child.type === "object"
          ? // @ts-expect-error - displayName is not guaranteed on type
            child.type?.displayName ?? child.type?.name
          : "";
      if (componentName) {
        text += ` ${componentName}`;
      }
    }
  });
  return text;
};

const inferActionIntent = (
  children: React.ReactNode,
  supplementalText?: string,
): ActionIntent | null => {
  const rawText = [flattenTextFromChildren(children), supplementalText]
    .filter(Boolean)
    .join(" ")
    .trim();
  if (!rawText) {
    return null;
  }

  const normalizedText = rawText.toLowerCase();

  const matchesKeyword = (keyword: string) => {
    const normalizedKeyword = keyword.toLowerCase();
    if (/^[a-z]+$/i.test(normalizedKeyword)) {
      return new RegExp(`\\b${normalizedKeyword}\\b`, "i").test(normalizedText);
    }
    return normalizedText.includes(normalizedKeyword);
  };

  return (Object.keys(ACTION_INTENT_KEYWORDS) as ActionIntent[]).find((intent) =>
    ACTION_INTENT_KEYWORDS[intent].some(matchesKeyword),
  ) ?? null;
};

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500/30 dark:bg-rose-500 dark:hover:bg-rose-400",
        outline:
          "border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        success:
          "bg-emerald-500 text-white hover:bg-emerald-600 focus-visible:ring-emerald-400/40 dark:bg-emerald-600 dark:hover:bg-emerald-500",
        info:
          "bg-sky-500 text-white hover:bg-sky-600 focus-visible:ring-sky-400/40 dark:bg-sky-600 dark:hover:bg-sky-500",
        neutral:
          "bg-slate-200 text-slate-900 hover:bg-slate-300 focus-visible:ring-slate-400/30 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];

const ACTION_INTENT_VARIANT: Record<ActionIntent, ButtonVariant> = {
  add: "success",
  save: "success",
  delete: "destructive",
  upload: "info",
  cancel: "neutral",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { className, variant, size, asChild = false, children, ...rest } = props;
  const {
    ["data-action-intent"]: dataActionIntentProp,
    ...buttonProps
  } = rest as typeof rest & { "data-action-intent"?: ActionIntent };

  const ariaLabel =
    typeof buttonProps["aria-label"] === "string"
      ? (buttonProps["aria-label"] as string)
      : undefined;
  const titleText =
    typeof (buttonProps as { title?: string }).title === "string"
      ? (buttonProps as { title?: string }).title
      : undefined;

  const supplementalIntentText = [ariaLabel, titleText]
    .filter(Boolean)
    .join(" ");

  const inferredIntent =
    dataActionIntentProp ??
    inferActionIntent(children, supplementalIntentText || undefined);
  const resolvedVariant =
    variant ??
    (inferredIntent ? ACTION_INTENT_VARIANT[inferredIntent] : undefined);
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-action-intent={inferredIntent ?? undefined}
      className={cn(buttonVariants({ variant: resolvedVariant, size, className }))}
      ref={ref}
      {...buttonProps}
    >
      {children}
    </Comp>
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };
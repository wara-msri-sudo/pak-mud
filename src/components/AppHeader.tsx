import Link from "next/link";

type HeaderLink = { href: string; label: string };

type AppHeaderProps = {
  /** Page title, shown as the page's h1. Leave out when the page has its own h1. */
  title?: string;
  subtitle?: string;
  /** The band's one filled (tan) action. */
  action?: HeaderLink;
  back?: HeaderLink;
};

const ICON_PROPS = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

function PinIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...ICON_PROPS} className="text-band-cta">
      <path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...ICON_PROPS}>
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" {...ICON_PROPS}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

/** Slate header band shown at the top of every page (decision 0005). */
export function AppHeader({ title, subtitle, action, back }: AppHeaderProps) {
  return (
    <header className="band bg-band text-band-foreground">
      <div className={`mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 pt-3 sm:px-8 ${title ? "pb-6" : "pb-3"}`}>
        <div className="flex min-h-11 items-center justify-between gap-3">
          <div className="flex items-center gap-1">
            {back && (
              <Link
                href={back.href}
                aria-label={back.label}
                className="-ml-3 inline-flex size-11 items-center justify-center rounded-[10px]"
              >
                <BackIcon />
              </Link>
            )}
            <Link href="/" className="inline-flex min-h-11 items-center gap-2 rounded-[10px] text-lg font-semibold">
              <PinIcon />
              Pak Mud
            </Link>
          </div>
          {action && (
            <Link href={action.href} className="button-band">
              <PlusIcon />
              {action.label}
            </Link>
          )}
        </div>
        {title && (
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            {subtitle && <p className="text-band-muted">{subtitle}</p>}
          </div>
        )}
      </div>
    </header>
  );
}

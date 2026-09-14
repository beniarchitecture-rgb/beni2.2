import * as Dialog from "@radix-ui/react-dialog";
import { NavLink } from "react-router-dom";

import { X } from "lucide-react";

function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

export default function MobileMenu({ open, onOpenChange, items, renderLabel }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          data-testid="mobile-menu-overlay"
        />
        <Dialog.Content
          className={classNames(
            "fixed right-0 top-0 z-50 h-full w-[86vw] max-w-sm",
            "border-l border-border bg-background",
            "p-4",
            "data-[state=open]:animate-in data-[state=open]:slide-in-from-right",
            "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right",
          )}
          data-testid="mobile-menu-panel"
        >
          <div className="flex items-center justify-between">
            <div>
              <Dialog.Title className="text-sm font-semibold" data-testid="mobile-menu-title">
                Menu
              </Dialog.Title>
              <Dialog.Description
                className="mt-1 text-xs text-muted-foreground"
                data-testid="mobile-menu-description"
              >
                Navigation
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent"
                data-testid="mobile-menu-close"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="mt-4 grid gap-1" data-testid="mobile-menu-links">
            {items.map((n) => (
              <Dialog.Close key={n.key} asChild>
                <NavLink
                  to={n.path}
                  className={({ isActive }) =>
                    classNames(
                      "rounded-md px-3 py-3 text-sm",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )
                  }
                  data-testid={`mobile-nav-link-${n.key}`}
                >
                  {renderLabel(n.key)}
                </NavLink>
              </Dialog.Close>
            ))}
          </div>

          <div className="mt-6 text-xs text-muted-foreground" data-testid="mobile-menu-footnote">
            {"Tap to navigate. The menu closes automatically."}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

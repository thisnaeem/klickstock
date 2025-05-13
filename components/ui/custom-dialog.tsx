"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"

// Create wrapper with added open and onOpenChange props
interface CustomDialogProps extends DialogPrimitive.DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const CustomDialog = ({
  open,
  onOpenChange,
  ...props
}: CustomDialogProps) => {
  return <DialogPrimitive.Root open={open} onOpenChange={onOpenChange} {...props} />;
};

const CustomDialogTrigger = DialogPrimitive.Trigger

const CustomDialogPortal = ({
  className,
  children,
  ...props
}: DialogPrimitive.DialogPortalProps & { className?: string }) => (
  <DialogPrimitive.Portal {...props}>
    <div className="fixed inset-0 z-50 flex items-start justify-center sm:items-center">
      {children}
    </div>
  </DialogPrimitive.Portal>
)
CustomDialogPortal.displayName = "CustomDialogPortal"

const CustomDialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-all duration-100 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in",
      className
    )}
    {...props}
  />
))
CustomDialogOverlay.displayName = "CustomDialogOverlay"

// Custom dialog content without the close button
const CustomDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <CustomDialogPortal>
    <CustomDialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed z-50 grid w-full gap-4 rounded-b-lg border bg-background p-6 shadow-lg animate-in data-[state=open]:fade-in-90 data-[state=open]:slide-in-from-bottom-10 sm:max-w-lg sm:rounded-lg sm:zoom-in-90 data-[state=open]:sm:slide-in-from-bottom-0",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </CustomDialogPortal>
))
CustomDialogContent.displayName = "CustomDialogContent"

export {
  CustomDialog,
  CustomDialogTrigger,
  CustomDialogContent
} 
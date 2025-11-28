import { toast as sonner, type ExternalToast } from "sonner";

const FIXED_OPTIONS = {
  position: "top-center",
  richColors: true,
  duration: 3000,
} as const;

type titleT = (() => React.ReactNode) | React.ReactNode;
type ToastOptions = Omit<ExternalToast, "position" | "richColors" | "duration">;

const withDefaults = (options?: ToastOptions): ExternalToast => {
  return {
    ...options,
    ...FIXED_OPTIONS,
  };
};

export const toast = Object.assign(
  (message: titleT, options?: ToastOptions) =>
    sonner(message, withDefaults(options)),
  {
    success: (message: titleT, options?: ToastOptions) =>
      sonner.success(message, withDefaults(options)),

    info: (message: titleT, options?: ToastOptions) =>
      sonner.info(message, withDefaults(options)),

    warning: (message: titleT, options?: ToastOptions) =>
      sonner.warning(message, withDefaults(options)),

    error: (message: titleT, options?: ToastOptions) =>
      sonner.error(message, withDefaults(options)),

    loading: (message: titleT, options?: ToastOptions) =>
      sonner.loading(message, withDefaults(options)),

    custom: (
      jsx: (id: number | string) => React.ReactElement,
      options?: ToastOptions,
    ) => sonner.custom(jsx, withDefaults(options)),

    message: (message: titleT, options?: ToastOptions) =>
      sonner.message(message, withDefaults(options)),

    promise: sonner.promise,

    dismiss: sonner.dismiss,

    getHistory: sonner.getHistory,
    getToasts: sonner.getToasts,
  },
);
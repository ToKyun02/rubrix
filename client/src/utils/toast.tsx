import { Toast, type ToastProps } from '@/atom-components/Toast';
import { overlay } from 'overlay-kit';

type ToastOptions = Pick<ToastProps, 'variant' | 'position'>;

export function showToast(
  message: string,
  { variant, position }: ToastOptions = {},
) {
  overlay.open(({ isOpen, close, unmount }) => (
    <Toast
      message={message}
      position={position}
      variant={variant}
      isOpen={isOpen}
      close={close}
      onExit={unmount}
    />
  ));
}

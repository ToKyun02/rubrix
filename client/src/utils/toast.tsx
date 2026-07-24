import { Toast } from '@/atom-components/Toast';
import { overlay } from 'overlay-kit';

export function showToast(
  message: string,
  variant: 'error' | 'success' = 'error',
) {
  overlay.open(({ isOpen, close, unmount }) => (
    <Toast
      message={message}
      variant={variant}
      isOpen={isOpen}
      close={close}
      onExit={unmount}
    />
  ));
}

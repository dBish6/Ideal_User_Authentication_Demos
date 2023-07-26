export type ButtonProps = {
  text?: string;
  icon?: string;
  alt?: string;
  isIconBtn?: boolean;
  style?: object;
  onClick?: (() => void) | ((path?: string) => Window | null);
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  text?: string;
  icon?: string;
  alt?: string;
  isIconBtn?: boolean;
  isLoading?: boolean;
  style?: object;
  onClick?: () => void;
};

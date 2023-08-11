export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  text?: string;
  icon?: string;
  alt?: string;
  isIconBtn?: boolean;
  loading?: {
    email: boolean;
    google: boolean;
    gitHub: boolean;
  };
  style?: object;
  onClick?: () => void;
};

export type FormProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading: {
    register: {
      email: boolean;
      google: boolean;
      gitHub: boolean;
    };
    login: boolean;
  };
  toggleLoading: React.Dispatch<
    React.SetStateAction<{
      register: {
        email: boolean;
        google: boolean;
        gitHub: boolean;
      };
      login: boolean;
    }>
  >;
};

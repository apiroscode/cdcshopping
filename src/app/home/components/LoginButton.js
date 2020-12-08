import { Button } from "@material-ui/core";
import { Google } from "~components/icons";
import { auth, googleAuthProvider } from "~config/firebase";

const LoginButton = ({ className }) => {
  const login = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  };

  return (
    <Button
      className={className}
      variant="outlined"
      color="primary"
      startIcon={<Google />}
      onClick={login}
    >
      Sign in with Google
    </Button>
  );
};

export default LoginButton;

import { Button, makeStyles } from "@material-ui/core";
import { ExitToAppOutlined } from "@material-ui/icons";
import { auth } from "~config/firebase";
import { useOpen } from "~utils/hooks";
import Payment from "./Payment";
import ShoppingList from "./ShoppingList";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    gap: theme.spacing(1) + "px",
    gridAutoFlow: "column",
  },
}));

const Header = () => {
  const classes = useStyles();
  const { isOpen: isOpenShopping, onOpen: onOpenShopping, onClose: onCloseShopping } = useOpen();
  const { isOpen: isOpenPayment, onOpen: onOpenPayment, onClose: onClosePayment } = useOpen();

  const logout = () => {
    auth.signOut();
  };

  const openShopping = () => {
    onClosePayment();
    onOpenShopping();
  };

  const openPayment = () => {
    onCloseShopping();
    onOpenPayment();
  };

  return (
    <div className={classes.root}>
      <Button variant="outlined" onClick={openShopping}>
        Tambah Belanjaan
      </Button>
      <Button variant="outlined" onClick={openPayment}>
        Bayar
      </Button>
      <Button
        startIcon={<ExitToAppOutlined />}
        onClick={logout}
        variant="outlined"
        color="secondary"
      >
        Logout
      </Button>
      <ShoppingList isOpen={isOpenShopping} onClose={onCloseShopping} />
      <Payment isOpen={isOpenPayment} onClose={onClosePayment} />
    </div>
  );
};

export default Header;

import { Container, makeStyles } from "@material-ui/core";
import { LocalAtmOutlined, PaymentOutlined, ShoppingCartOutlined } from "@material-ui/icons";
import { Suspense, useContext } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { Outlet } from "react-router-dom";
import CardPrice from "~components/CardPrice";
import MainSpinner from "~components/spinner/MainSpinner";
import { AuthContext } from "~config/auth";
import { firestore } from "~config/firebase";
import { maybe } from "~utils/index";
import Header from "./components/Header";
import LoginButton from "./components/LoginButton";

const useStyles = makeStyles((theme) => ({
  header: {
    display: "grid",
    gridAutoFlow: "row",
    gridGap: theme.spacing(1.5) + "px",
    marginTop: theme.spacing(1),
    [theme.breakpoints.up("md")]: {
      marginTop: theme.spacing(1.5),
    },
  },
  actionButton: {
    marginLeft: "auto",
  },
  cardWrapper: {
    display: "grid",
    gridAutoFlow: "row",
    gridGap: theme.spacing(0.5) + "px",
    [theme.breakpoints.up("md")]: {
      gridAutoFlow: "column",
      gridGap: theme.spacing(2) + "px",
    },
  },
  main: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
    [theme.breakpoints.up("md")]: { marginTop: theme.spacing(3) },
  },
}));

const Home = () => {
  const { currentUser } = useContext(AuthContext);
  const classes = useStyles();
  const [financeRaw] = useDocumentData(firestore.doc(`/root/finance`));

  const shoppingSum = maybe(() => financeRaw.shoppingSum, 0);
  const paymentSum = maybe(() => financeRaw.paymentSum, 0);
  const total = maybe(() => financeRaw.total, 0);

  return (
    <Container maxWidth="lg">
      <header className={classes.header}>
        <div className={classes.actionButton}>{currentUser ? <Header /> : <LoginButton />}</div>
        <div className={classes.cardWrapper}>
          <CardPrice
            icon={<ShoppingCartOutlined />}
            title="Pembelanjaan"
            number={shoppingSum}
            link={{ to: "/shopping", title: "Lihat Daftar Belanja" }}
            background={"#ffc85c"}
          />
          <CardPrice
            icon={<PaymentOutlined />}
            title="Pembayaran"
            number={paymentSum}
            link={{ to: "/payment", title: "Lihat Bukti Pembayaran" }}
            background={"#5c6e91"}
          />
          <CardPrice
            icon={<LocalAtmOutlined />}
            title="Total Hutang"
            number={total}
            background={total > 0 ? "#ec524b" : "#4e8d7c"}
          />
        </div>
      </header>
      <main className={classes.main}>
        <Suspense fallback={<MainSpinner />}>
          <Outlet />
        </Suspense>
      </main>
    </Container>
  );
};

export default Home;

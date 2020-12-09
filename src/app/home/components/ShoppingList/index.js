import {
  AppBar,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  makeStyles,
  Slide,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";
import { forwardRef, useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { firestore } from "~config/firebase";
import { useNotify } from "~utils/hooks";
import { maybe } from "~utils/index";
import InputItem from "./InputItem";
import List from "./List";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ShoppingList = (props) => {
  const { isOpen, onClose } = props;
  const classes = useStyles();
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      items: [],
    },
  });
  const notify = useNotify();
  const { fields, prepend, remove } = useFieldArray({
    control,
    name: "items",
  });
  const startDate = useMemo(() => new Date(new Date().setHours(0, 0, 0, 0)), []);
  const endDate = useMemo(() => new Date(new Date().setHours(24, 0, 0, 0)), []);

  useEffect(() => {
    const getShoppingDetailsData = async () => {
      const shoppingDetailsRef = await firestore
        .collection("shoppingDetails")
        .where("date", ">=", startDate)
        .where("date", "<", endDate)
        .get();
      const shoppingDetails = shoppingDetailsRef.docs.map((doc) => doc.data());
      reset({
        items: shoppingDetails,
      });
    };
    getShoppingDetailsData();
  }, [endDate, reset, startDate]);

  const onSubmit = async (data) => {
    const items = maybe(() => data.items, []);
    const newTotal = items.map((item) => item.total).reduce((a, b) => a + b, 0);

    //1. get shoppingDateTotal
    const shoppingDateRef = await firestore
      .collection("shopping")
      .where("date", ">=", startDate)
      .where("date", "<", endDate)
      .get();
    const shoppingDate = shoppingDateRef.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))?.[0];
    const shoppingDateTotal = maybe(() => shoppingDate.total, 0);

    //2. get shopping sum
    const financeRef = await firestore.collection("root").doc("finance").get();
    const { paymentSum, shoppingSum } = financeRef.data();

    //3. delete shopping detail
    const shoppingDetailDeleteRef = await firestore
      .collection("shoppingDetails")
      .where("date", ">=", startDate)
      .where("date", "<", endDate)
      .get();
    const shoppingDetailDelete = shoppingDetailDeleteRef.docs.map((doc) => doc.id);

    for (const detailId of shoppingDetailDelete) {
      await firestore.collection("shoppingDetails").doc(detailId).delete();
    }

    // save newShoppingDate
    if (shoppingDate) {
      await firestore.collection("shopping").doc(shoppingDate.id).update({
        total: newTotal,
      });
    } else {
      await firestore.collection("shopping").doc().set({
        date: new Date(),
        total: newTotal,
      });
    }

    //4. save shopping sum
    const newShoppingSum = shoppingSum - shoppingDateTotal + newTotal;
    await firestore
      .collection("root")
      .doc("finance")
      .update({
        paymentSum: paymentSum,
        shoppingSum: newShoppingSum,
        total: newShoppingSum - paymentSum,
      });

    //5. save detail data
    for (const item of items) {
      await firestore
        .collection("shoppingDetails")
        .doc()
        .set({
          date: new Date(),
          ...item,
        });
    }
    notify.success("Belanjaan sudah di save.");
  };

  return (
    <Dialog fullScreen open={isOpen} onClose={onClose} TransitionComponent={Transition}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            disabled={isSubmitting}
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Tambah Belanjaan
          </Typography>
          <Button
            autoFocus
            disabled={isSubmitting}
            color="inherit"
            onClick={handleSubmit(onSubmit)}
          >
            Save
          </Button>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <InputItem prepend={prepend} loading={isSubmitting} />
        <List
          control={control}
          setValue={setValue}
          fields={fields}
          remove={remove}
          loading={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ShoppingList;

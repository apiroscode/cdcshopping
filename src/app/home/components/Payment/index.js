import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  makeStyles,
  TextField,
} from "@material-ui/core";
import { DropzoneArea } from "material-ui-dropzone";
import { useEffect, useState } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { Controller, useForm } from "react-hook-form";
import { firestore, storage } from "~config/firebase";
import { useNotify } from "~utils/hooks";
import { maybe } from "~utils/index";

const useStyles = makeStyles((theme) => ({
  receiptContainer: {
    marginBottom: theme.spacing(2),
  },
}));

const Payment = (props) => {
  const { isOpen, onClose } = props;
  const classes = useStyles();
  const notify = useNotify();
  const [file, setFile] = useState(null);
  const [financeRaw] = useDocumentData(firestore.doc(`/root/finance`));
  const shoppingSum = maybe(() => financeRaw.shoppingSum, 0);
  const paymentSum = maybe(() => financeRaw.paymentSum, 0);
  const totalDebt = maybe(() => financeRaw.total, 0);

  const {
    control,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      totalPay: 0,
    },
  });

  useEffect(() => {
    reset({
      totalPay: totalDebt,
    });
  }, [reset, totalDebt]);

  const onSubmit = async (data) => {
    if (file === null) {
      notify.error("File is required.");
      return;
    }
    const storageRef = storage.ref();
    const uploadTask = await storageRef.child(`receipt/${file.name}`).put(file);
    const downloadUrl = await uploadTask.ref.getDownloadURL();
    await firestore.collection("payment").doc().set({
      date: new Date(),
      receipt: downloadUrl,
      totalPay: data.totalPay,
    });
    await firestore
      .collection("root")
      .doc("finance")
      .update({
        paymentSum: paymentSum + data.totalPay,
        shoppingSum: shoppingSum,
        total: shoppingSum - (paymentSum + data.totalPay),
      });
    notify.success("Payment telah berhasil disimpan.");
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent dividers>
        <div className={classes.receiptContainer}>
          <DropzoneArea
            filesLimit={1}
            acceptedFiles={["image/*"]}
            dropzoneText="Drag and drop an receipt here or click"
            onChange={(files) => {
              if (files.length > 0) {
                setFile(files[0]);
              } else {
                setFile(null);
              }
            }}
          />
        </div>
        <Controller
          control={control}
          name="totalPay"
          render={({ onChange, value }) => (
            <TextField
              label="Total Bayar"
              type="number"
              value={value}
              onChange={(e) => onChange(e.target.valueAsNumber)}
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="secondary" onClick={onClose}>
          Kembali
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          onClick={handleSubmit(onSubmit)}
        >
          Simpan
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Payment;

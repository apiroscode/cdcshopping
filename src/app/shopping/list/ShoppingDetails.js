import {
  Dialog,
  DialogActions,
  DialogContent,
  makeStyles,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { useMemo } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import ResponsiveTable from "~components/table/ResponsiveTable";
import { firestore } from "~config/firebase";
import { dynamicSort, maybe } from "~utils/index";

const useStyles = makeStyles(() => ({ content: { padding: 0 + "!important" } }));

const ShoppingDetails = (props) => {
  const { dateDetail, isOpen, onClose } = props;
  const classes = useStyles();
  const startDate = useMemo(
    () => (dateDetail ? new Date(dateDetail.setHours(0, 0, 0, 0)) : null),
    [dateDetail]
  );
  const endDate = useMemo(() => (dateDetail ? new Date(dateDetail.setHours(24, 0, 0, 0)) : null), [
    dateDetail,
  ]);

  const detailsRawRef = firestore.collection("shoppingDetails");
  const detailsRef =
    startDate || endDate
      ? detailsRawRef.where("date", ">=", startDate).where("date", "<", endDate)
      : detailsRawRef;
  const [detailsRaw] = useCollectionData(detailsRef, {
    idField: "id",
  });
  const details = dateDetail ? maybe(() => detailsRaw, []) : [];

  return (
    <Dialog fullWidth maxWidth="sm" open={isOpen} onClose={onClose}>
      <DialogContent dividers className={classes.content}>
        <TableContainer>
          <ResponsiveTable>
            <TableHead>
              <TableRow>
                <TableCell>Nama Produk</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Jumlah</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {details.sort(dynamicSort("productName")).map((detail) => {
                return (
                  <TableRow key={detail.id}>
                    <TableCell>{detail.productName}</TableCell>
                    <TableCell>Rp. {detail.price.toLocaleString()}</TableCell>
                    <TableCell>{detail.qty.toLocaleString()}</TableCell>
                    <TableCell>Rp. {detail.total.toLocaleString()}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </ResponsiveTable>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="secondary" onClick={onClose}>
          Kembali
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShoppingDetails;

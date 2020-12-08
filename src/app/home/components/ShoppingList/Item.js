import { IconButton, makeStyles, TextField } from "@material-ui/core";
import { DeleteOutlined } from "@material-ui/icons";
import { Controller, useWatch } from "react-hook-form";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1, 0),
    display: "grid",
    gap: theme.spacing(1) + "px",
    [theme.breakpoints.up("md")]: {
      gridAutoFlow: "column",
      gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
    },
  },
}));

const Item = (props) => {
  const { control, idx, item, remove, setValue, loading } = props;
  const classes = useStyles();
  const itemWatch = useWatch({ control, name: `items[${idx}]` });

  return (
    <div className={classes.root}>
      <Controller
        as={TextField}
        control={control}
        name={`items[${idx}].productName`}
        label="Nama Produk"
        type="text"
        variant="outlined"
        defaultValue={item.productName}
        disabled={loading}
      />
      <Controller
        control={control}
        name={`items[${idx}].price`}
        defaultValue={item.price}
        render={({ onChange, value }) => (
          <TextField
            label="Price"
            type="number"
            value={value}
            disabled={loading}
            onChange={(e) => {
              onChange(e.target.valueAsNumber);
              setValue(`items[${idx}].total`, e.target.valueAsNumber * itemWatch.qty);
            }}
          />
        )}
      />
      <Controller
        control={control}
        name={`items[${idx}].qty`}
        defaultValue={item.qty}
        render={({ onChange, value }) => (
          <TextField
            label="Quantity"
            type="number"
            value={value}
            disabled={loading}
            onChange={(e) => {
              onChange(e.target.valueAsNumber);
              setValue(`items[${idx}].total`, itemWatch.price * e.target.valueAsNumber);
            }}
          />
        )}
      />
      <Controller
        as={TextField}
        control={control}
        name={`items[${idx}].total`}
        label="Total"
        type="number"
        variant="outlined"
        disabled
        defaultValue={item.total}
      />

      <IconButton
        variant="contained"
        disabled={loading}
        color="secondary"
        onClick={() => remove(idx)}
      >
        <DeleteOutlined />
      </IconButton>
    </div>
  );
};

export default Item;

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, makeStyles, TextField } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { Controller, useForm } from "react-hook-form";
import * as zod from "zod";

const schema = zod.object({
  productName: zod.string().nonempty(),
  price: zod.number().positive(),
  qty: zod.number().positive(),
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    gap: theme.spacing(1) + "px",
    [theme.breakpoints.up("md")]: {
      gridAutoFlow: "column",
      gridTemplateColumns: "2fr 1fr 1fr .5fr",
    },
  },
}));

const InputItem = ({ prepend, loading }) => {
  const classes = useStyles();

  const { control, errors, handleSubmit, reset } = useForm({
    defaultValues: {
      productName: "",
      price: 0,
      qty: 0,
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    const { price, qty } = data;
    const total = price * qty;
    prepend({
      ...data,
      total,
    });
    reset();
  };

  return (
    <div className={classes.root}>
      <Controller
        as={TextField}
        control={control}
        name="productName"
        label="Name Produk"
        type="text"
        disabled={loading}
        error={!!errors.productName}
        helperText={errors.productName?.message}
      />
      <Controller
        control={control}
        name="price"
        render={({ onChange, value }) => (
          <TextField
            label="Price"
            type="number"
            disabled={loading}
            error={!!errors.price}
            helperText={errors.price?.message}
            value={value}
            onChange={(e) => onChange(e.target.valueAsNumber)}
          />
        )}
      />
      <Controller
        control={control}
        name="qty"
        render={({ onChange, value }) => (
          <TextField
            label="Quantity"
            type="number"
            disabled={loading}
            error={!!errors.qty}
            helperText={errors.qty?.message}
            value={value}
            onChange={(e) => onChange(e.target.valueAsNumber)}
          />
        )}
      />
      <Button
        startIcon={<Add />}
        variant="contained"
        color="primary"
        disabled={loading}
        onClick={handleSubmit(onSubmit)}
      >
        Tambah
      </Button>
    </div>
  );
};

export default InputItem;

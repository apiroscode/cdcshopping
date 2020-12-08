import { makeStyles } from "@material-ui/core";
import Item from "./Item";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
  },
}));

const List = (props) => {
  const { control, setValue, fields, remove, loading } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {fields.map((item, idx) => (
        <Item
          key={item.id}
          control={control}
          item={item}
          idx={idx}
          setValue={setValue}
          remove={remove}
          loading={loading}
        />
      ))}
    </div>
  );
};

export default List;

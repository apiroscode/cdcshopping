import { useCallback, useState } from "react";

const useObjectState = (defaultValues = {}) => {
  const [state, setState] = useState(defaultValues);

  const setObjectState = useCallback((newState) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  }, []);

  return [state, setObjectState];
};

export default useObjectState;

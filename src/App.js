import React, { useEffect, useRef } from "react";
import axios from "axios";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import SearchIcon from "@mui/icons-material/Search";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Table from "./components/Table"; 

const App = () => {
  const [apiData, setApiData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [error, setError] = React.useState("");
  const [empty, setEmpty] = React.useState(true);
  const timeout = useRef();
  const inputRef = useRef();

const columns = [
  { label: "Id", accessor: "id", sortable: false },
  { label: "Name", accessor: "name", sortable: true },
  { label: "Group", accessor: "breed_group", sortable: false },
  { label: "Height", accessor: "height.imperial", sortable: false },
  { label: "Life Span", accessor: "life_span", sortable: true, sortbyOrder: "desc" },
];

const getAPIData = () => {
  setError("");
  setLoading(false);
  //Clear the previous timeout.
  clearTimeout(timeout.current);
  // If there is no search term, do not make API call
  if (!inputRef?.current?.value?.trim()) {
    setApiData([]);
    setLoading(false);
    setError("");
    return;
  }
  timeout.current = setTimeout(async () => {
    setLoading(true);
    setError("");
    setApiData([]);
    try {
      let url = `https://api.thedogapi.com/v1/breeds/search?q=${inputRef.current.value}`;
      let result = await axios.get(url,
        {
          headers: {              
            'x-api-key': 'live_qXYKRdfkEhIXZGhp1bQVuIQVnBG2o4hG1KBIqEVTxr9pSCRdXlkpNVFPQtPQw7mB'
          }
        }
        );
        setApiData(result.data);
        result.data?.length === 0 ? setEmpty(true) : setEmpty(false);
    } catch (error) {
      setError(error.response.statusText);
      setApiData([]);
    } finally {
      setLoading(false);
      
    }
  }, 350);
};

const handleChange = (event) => {
  setPage(1)
  getAPIData();
};

  useEffect(() => {
    getAPIData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);
  
  return (
    <React.Fragment>
      <CssBaseline />
      <h1 align='center'>Dogs Breed</h1>
    <Container>
    <Box>
      <FormControl sx={{ my: 2 }} variant="outlined" fullWidth>
        <InputLabel htmlFor="outlined-adornment-search">Search</InputLabel>
        <OutlinedInput
          id="outlined-adornment-search"
          onChange={handleChange}
          inputRef={inputRef}
          autoComplete="off"
          endAdornment={
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          }
          label="search"
        />
      </FormControl>
      {loading && (
        <Box sx={{ display: "flex", my: 2 }}>
          <CircularProgress />
        </Box>
      )}
      {!loading && !empty && !inputRef?.current?.value && (
        <Box sx={{ display: "flex" }}>
          <Typography gutterBottom variant="h5" component="div">
            Please enter the dog breed name to search for......
          </Typography>
        </Box>
      )}
      {(empty || error) && (
        <Box sx={{ display: "flex" }}>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ color: "#ef5350" }}
          >
            No search result for {inputRef?.current?.value}. Please try a
            different search
          </Typography>
        </Box>
      )}
      {!error && apiData.length !== 0 && !loading && (
         <Table
             caption="Search Result"
             data={apiData}
             columns={columns}
           />
      )}
    </Box>
  </Container>
    </React.Fragment>
  );
};

export default App;

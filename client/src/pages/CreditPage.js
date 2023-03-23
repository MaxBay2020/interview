import {
    CircularProgress,
    Container,
    FormControl,
    Grid,
    InputLabel,
    Pagination,
    Select,
    TextField, Tooltip
} from "@mui/material";
import BasicLayout from "../layout/BasicLayout";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import MenuItem from "@mui/material/MenuItem";
import useDebounce from "../hooks/trainingHooks/useDebounce";
import {pageLimit, sortingSystem, UserRole} from "../utils/consts";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CreditTable from "../components/CreditPage/CreditTable";
import useFetchCredits from "../hooks/creditHooks/useFetchCredits";
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import IconButton from "@mui/material/IconButton";
import useDownloadCreditPDF from "../hooks/creditHooks/useDownloadCreditPDF";
import {blue} from "@mui/material/colors";

const CreditPage = () => {

    // 1 - sort by training created time
    // 2 - sort by training name
    const [sortBy, setSortBy] = useState(sortingSystem.creditPage.defaultSortValue)
    const [searchKeyword, setSearchKeyword] = useState('')
    const debouncedSearchKeyword = useDebounce(searchKeyword, 500)

    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(pageLimit)

    const {
        userName,
        userRole,
    } = useSelector(state => state.user)


    const { data }
        = useFetchCredits(
            ['queryAllCredits', debouncedSearchKeyword, sortBy, page, limit], page, limit, debouncedSearchKeyword, sortBy)

    const { isFetching, data: pdfBlobData, refetch: downloadCreditPDF } = useDownloadCreditPDF(['download-pdf'])

    const searchHandler = e => {
        setSearchKeyword(e.target.value)
    }




    return (
        <BasicLayout>
            <Container>
                <Grid container alignItems='center' justifyContent='space-between'>
                    <Grid item>
                        <Grid container direction='column' alignItems='flex-start' sx={{mb: 5}} spacing={1}>
                            <Grid item><Typography variant='subtitle'>{`User Name:   ${userName}`}</Typography></Grid>
                            <Grid item><Typography variant='subtitle'>{`User Role:   ${userRole}`}</Typography></Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Tooltip title="download">
                            <IconButton
                                disabled={isFetching}
                                onClick={() => downloadCreditPDF()}
                            >
                                <CloudDownloadOutlinedIcon />
                                {
                                    isFetching && (
                                    <CircularProgress
                                        size={40}
                                        sx={{
                                            color: blue[500],
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            zIndex: 1,
                                        }}
                                    />
                                )}
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>


                <Grid container alignItems='center' justifyContent='space-between' sx={{mb: 3}} spacing={1}>
                    <Grid item xs={true} md={true}>
                        <TextField
                            id="outlined-basic"
                            label="Search"
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                            value={searchKeyword}
                            onChange={e => searchHandler(e)}
                        />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="demo-simple-select-label">Sort by</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={sortBy}
                                label="sortBy"
                                onChange={e => setSortBy(e.target.value)}
                            >
                                {
                                    sortingSystem.creditPage.creditPageSortBy.map(sort => <MenuItem key={sort.value} value={sort.value}>{sort.label}</MenuItem>)
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                <Box sx={{minHeight: '390px'}}>
                    {
                        data &&
                        <CreditTable
                            creditsStats={data.creditsStats}
                        />
                    }
                </Box>


                {
                    data
                    &&
                    <Pagination
                        sx={{mt: 2}}
                        count={data.totalPage}
                        page={page}
                        onChange={(_e, v) => setPage(v)}
                    />
                }
            </Container>
        </BasicLayout>

    )
}

export default CreditPage

import { createStyles, makeStyles, styled, Theme } from "@material-ui/core/styles";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { TableRow } from '@mui/material';
export const useStyles = makeStyles((theme: Theme) => createStyles({
    tableSpace: {
        padding: '50px',
    },
    tableSize: {
        minWidth: 650,
    },
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export const OrderTitle = styled('div')({
    textAlign: 'center',
    borderBottom: '1px solid #edece8',
    position: 'sticky',
    backgroundColor: 'white',
    color: 'blue',
    top: 0,
});

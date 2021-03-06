import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { styled } from '@mui/material/styles';
import { IconButton, Button } from '@mui/material';

export const useStyles = makeStyles((theme: Theme) => createStyles({
    appBar: {
        fontFamily: 'Arial',
        height: '80px',
        justifyContent: 'center',
        '& p': {
            fontSize: '25pt',
            fontWeight: '600',
        },
        '& button': {
            margin: '5px',
            borderRadius: '10px',
            fontSize: '1.1rem',
        }
    },
    searchDropdown: {
        width: '450px',
        height: '200px',
        position: 'absolute',
        top: '56px',
        left: '10px',
        backgroundColor: 'white',
        boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
        borderRadius: '3px',
        overflow: 'auto',
        '&::-webkit-scrollbar': {
            display: 'none',
        },
        '& > div': {
            height: '40px',
            width: '100%',
            margin: '0',
        }
    },
    searchItem: {
        cursor: 'pointer',
        '& p': {
            fontSize: '13pt',
            margin: '0 10px',
            padding: '13px 0',
            display: 'inline-block',
        },
        '&:hover': {
            backgroundColor: '#d7eafd',
        },
    },
    stockName: {
        '&:first-letter': {
            textTransform: 'capitalize',
        }
    },
    searchTitle: {
        '& h3': {
            padding: '10px',
            margin: '0',
            fontSize: '16pt',
        }
    }
}));

export const StyledIconBtn = styled(IconButton)({
    color: '#0017ea',
});

export const StyledSearchBar = styled('input')({
    height: '30px',
    width: '450px',
    borderRadius: '5px',
    border: '0',
    backgroundColor: '#f3f6f9',
    padding: '5px 10px',
    fontSize: '16pt',
    '&::-webkit-input-placeholder': {
        fontSize: '16pt',
        padding: '0 5px',
    }
});

export const SearchForm = styled('form')({
    display: "flex",
    alignItems: 'center',
    marginRight: '10px',
    position: 'relative',
});

export const SignupButton = styled(Button)({
    backgroundColor: '#0017ea'
});

export const LoginButton = styled(Button)({
    color: '#0017ea',
    borderColor: '#0017ea'
});
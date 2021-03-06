import React, { useCallback, useEffect } from 'react';
import {
    Box,
    Drawer,
    List,
    Divider,
    Stack,
    Dialog,
    DialogTitle,
    DialogActions,
    Button,
} from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import BarChartIcon from '@mui/icons-material/BarChart';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import CreateIcon from '@mui/icons-material/Create';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state/index';
import { useHistory } from 'react-router-dom';
import { DialogContent, LargeButton, useStyles, StyledAvatar } from '../styles/sideBar.style';
import SidebarBtn from './SidebarBtn';

const url = process.env.REACT_APP_URL || 'http://localhost:5000';

interface Props {
    open: boolean,
    onClose: () => void,
    openWallet?: () => void,
    openTopupModal?: () => void,
    openUpdateModal?: () => void,
    updateLogin?: (val: boolean) => void,
    openPortfolios?: () => void,
    openOrders?: () => void
}
// The sidebar on the right hand side which enables to navigate between different pages/popup window
// The pages and components are: Top up window, Watchlist page, Portfolio page, Wallet page, Orders page, 
//                              Update Profile window,, Logout button, Logout button
const Sidebar: React.FC<Props> = ({
    open,
    onClose,
    openWallet,
    openTopupModal,
    openUpdateModal,
    updateLogin,
    openPortfolios,
    openOrders
}) => {
    const [deleteAcDialog, setDeleteAcDialog] = React.useState(false);
    const history = useHistory();
    const styles = useStyles();
    const dispatch = useDispatch();
    const { setToast } = bindActionCreators(actionCreators, dispatch);
    const [name, setName] = React.useState('');
    const [nameFirstLetter, setNameFirstLetter] = React.useState('');

    const handleLogout = async (): Promise<void> => {
        try {
            const response = await fetch(`${url}/user/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
                },
            });
            const data = await response.json();
            if (response.status === 200 && updateLogin !== undefined) {
                setToast({ type: 'success', message: `${data.response}` });
                sessionStorage.clear();
                updateLogin(false);
                history.push('/');
            } else {
                throw new Error(`${data.error}`);
            }
        } catch (error) {
            setToast({ type: 'error', message: `${error}` });
        }
    };

    const handleDeleteAccount = async (): Promise<void> => {
        try {
            const response = await fetch(`${url}/user/deleteAccount`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
                },
            });
            const data = await response.json();
            if (response.status === 200 && updateLogin !== undefined) {
                setToast({ type: 'success', message: 'Delete Successfully' });
                sessionStorage.clear();
                updateLogin(false);
                history.push('/');
            } else {
                throw new Error(`${data.error}`);
            }
        } catch (error) {
            setToast({ type: 'error', message: `${error}` });
        }
    };
    const handleProfile = useCallback(async (): Promise<void> => {
        try {
            const response = await fetch(`${url}/user/profile`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
                },
            });
            if (response.status === 200) {
                const data = await response.json();
                setName(data.username);
                setNameFirstLetter(data.username[0]);
            } else {

                throw new Error('Failed to fetch user name');

            }
        } catch (e) {
            setToast({ type: 'error', message: `${e}` });
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        handleProfile();
    }, [handleProfile]);

    return (
        <>
            <Drawer anchor={'right'} open={open} onClose={onClose}>
                <Box
                    className={styles.sideBar}
                    role="presentation"
                    onClick={onClose}
                    onKeyDown={onClose}
                >
                    <div className={styles.userInfo}>
                        <StyledAvatar >{nameFirstLetter}</StyledAvatar>
                        <h1 className={styles.username}>
                            {name}
                        </h1>
                    </div>
                    <Stack className={styles.topup} direction="row">
                        <LargeButton
                            variant='contained'
                            type='button'
                            onClick={openTopupModal}
                        >
                            Top-Up
                        </LargeButton>
                    </Stack>
                    <Stack className={styles.menuLabel} direction="row">
                        MENU
                    </Stack>
                    <List>
                        <SidebarBtn
                            text='Watchlist'
                            onClick={(): void => history.push('/dashboard')}
                            childNode={
                                <ShowChartIcon className={styles.btnColor} />
                            }
                        />
                        <SidebarBtn
                            text='Portfolios'
                            onClick={(): void => history.push('/dashboard/portfolios')}
                            childNode={
                                <BarChartIcon className={styles.btnColor} />
                            }
                        />
                        <SidebarBtn
                            text='Wallet'
                            onClick={(): void => history.push('/dashboard/balance')}
                            childNode={
                                <AccountBalanceWalletIcon
                                    className={styles.btnColor}
                                />
                            }
                        />
                        <SidebarBtn
                            text='Orders'
                            onClick={(): void => history.push('/dashboard/orderhistory')}
                            childNode={
                                <ListAltIcon className={styles.btnColor} />
                            }
                        />
                        <SidebarBtn
                            text='Update Profile'
                            onClick={openUpdateModal}
                            childNode={
                                <CreateIcon className={styles.btnColor} />
                            }
                        />
                        <Divider />
                        <SidebarBtn
                            text='Logout'
                            onClick={handleLogout}
                            childNode={
                                <LogoutIcon className={styles.btnColor} />
                            }
                        />
                        <SidebarBtn
                            text='Delete Account'
                            onClick={(): void => setDeleteAcDialog(true)}
                            childNode={
                                <DeleteForeverIcon
                                    className={styles.btnColor}
                                />
                            }
                        />
                    </List>
                </Box>
            </Drawer>
            <Dialog
                open={deleteAcDialog}
                aria-labelledby="delete-account"
            >
                <DialogTitle id="delete-account">
                    <DialogContent>
                        Are you sure to delete your account?
                    </DialogContent>
                </DialogTitle>
                <DialogActions>
                    <Button
                        onClick={(): void => setDeleteAcDialog(false)}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteAccount} autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Sidebar;
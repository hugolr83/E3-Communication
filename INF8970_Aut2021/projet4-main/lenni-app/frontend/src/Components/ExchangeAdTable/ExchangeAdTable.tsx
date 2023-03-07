// eslint-disable-next-line no-use-before-define
import React from 'react'
import clsx from 'clsx'
import { createStyles, lighten, makeStyles, Theme } from '@material-ui/core/styles'
import { Box } from '@material-ui/core'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import SwapHorizIcon from '@material-ui/icons/SwapHoriz'
import { ActionsContainer, TableTopContainer, LabelTypography } from './Styled'
import { IExchangeAd, Severity } from '../../Api/Core/Interfaces'
import { exchangePoints } from '../../Api/Core/clientOperations'
import { convertDate } from '../../Api/utils'
import { useSetRecoilState } from 'recoil'
import { errorState } from '../../Recoil/GlobalState'
import ExchangeConfirmationDialog from '../ExchangeConfirmationDialog/ExchangeConfirmationDialog'

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
  // eslint-disable-next-line no-unused-vars
): (a: { [key in Key]: number | string | Date | Boolean }, b: { [key in Key]: number | string | Date | Boolean }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof IExchangeAd;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  { id: 'supplierFromName', numeric: false, disablePadding: true, label: 'Supplier (from)' },
  { id: 'pointsFrom', numeric: true, disablePadding: true, label: 'Points (from)' },
  { id: 'supplierToName', numeric: false, disablePadding: true, label: 'Supplier (to)' },
  { id: 'pointsTo', numeric: true, disablePadding: true, label: 'Points (to)' },
  { id: 'sellerUsername', numeric: false, disablePadding: true, label: 'Seller' },
  { id: 'timestamp', numeric: true, disablePadding: true, label: 'Creation Date' }
]

interface EnhancedTableProps {
  // eslint-disable-next-line no-use-before-define
  classes: ReturnType<typeof useStyles>;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof IExchangeAd) => void;
  order: Order;
  orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { classes, order, orderBy, onRequestSort } = props
  const createSortHandler = (property: keyof IExchangeAd) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell align="center" colSpan={2}>
          <Box m={2}>
            <Typography variant="h6">
              What I receive
            </Typography>
          </Box>
        </TableCell>
        <TableCell align="center" colSpan={2}>
          <Box m={2}>
            <Typography variant="h6">
              What I give
            </Typography>
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align='center'
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              <Box m={2}>
                <Typography variant="h6">
                  {headCell.label}
                </Typography>
              </Box>
              {orderBy === headCell.id
                ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                )
                : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell align='center' padding="checkbox">
        <Box m={2}>
          <Typography variant="h6">Exchange</Typography>
        </Box>
        </TableCell>
      </TableRow>
    </TableHead>
  )
}

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1)
    },
    highlight:
      theme.palette.type === 'light'
        ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
        : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
    title: {
      flex: '1 1 100%'
    }
  })
)

const EnhancedTableToolbar = () => {
  const classes = useToolbarStyles()

  return (
    <Toolbar
      className={clsx(classes.root)}
    >
      <Typography className={classes.title} variant="h5" id="tableTitle" component="div">
        Ads
      </Typography>
    </Toolbar>
  )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '96%',
      margin: 'auto',
      marginTop: theme.spacing(2)
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2)
    },
    table: {
      minWidth: 750
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1
    }
  })
)

interface ExchangeAdTableProps {
  setCurrentAds: React.Dispatch<React.SetStateAction<IExchangeAd[]>>
  currentAds: IExchangeAd[]
}

export default function ExchangeAdTable({ currentAds, setCurrentAds }: ExchangeAdTableProps) {
  const classes = useStyles()
  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof IExchangeAd>('supplierFromName')
  const [page, setPage] = React.useState(0)
  const [dense, setDense] = React.useState(false)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const setCurrentErrorState = useSetRecoilState(errorState)
  const [open, setOpen] = React.useState(false)
  const [selectedAd, setSelectedAd] = React.useState<IExchangeAd>({
    _id: '',
    sellerID: '',
    sellerUsername: '',
    supplierFromID: '',
    supplierFromName: '',
    supplierToID: '',
    supplierToName: '',
    pointsFrom: 0,
    pointsTo: 0,
    timestamp: new Date()
  })

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof IExchangeAd) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked)
  }

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, currentAds.length - page * rowsPerPage)

  const handleBuyButton = (ad: IExchangeAd) => async (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setSelectedAd(ad)
    setOpen(true)
  }

  const handleClose = (isBuying: boolean) => {
    (async() => {
      setOpen(false)
      if (isBuying) {
        const { errors, hasErrors } = await exchangePoints(selectedAd._id)
        if (!hasErrors) {
          setCurrentAds(currentAds.filter((s) => s._id !== selectedAd._id))
          setCurrentErrorState((prev) => ({
            ...prev,
            open: true,
            message: 'Points exchanged',
            severity: Severity.Success
          }))
        } else if (errors) {
          let isFundsError = false
          for (const err of errors) {
            if (err.param && err.param === 'points') {
              isFundsError = true
              setCurrentErrorState((prev) => ({
                ...prev,
                open: true,
                message: err.msg,
                severity: Severity.Error
              }))
            }
          }
          if (!isFundsError) {
            setCurrentErrorState((prev) => ({
              ...prev,
              open: true,
              message: 'Unable to exchange points',
              severity: Severity.Error
            }))
          }
        } else {
          console.log(errors)
          setCurrentErrorState((prev) => ({
            ...prev,
            open: true,
            message: 'Unable to exchange points',
            severity: Severity.Error
          }))
        }
      }
    })()
  }

  return (
    <div className={classes.root}>
      <TableTopContainer className={classes.paper}>
        <EnhancedTableToolbar />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {stableSort(currentAds, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row._id}
                    >
                      <TableCell align="center" component="th" id={labelId} scope="row" padding="none">
                        <p color="white">{row.supplierFromName}</p>
                      </TableCell>
                      <TableCell align="center">{row.pointsFrom}</TableCell>
                      <TableCell align="center">{row.supplierToName}</TableCell>
                      <TableCell align="center">{row.pointsTo}</TableCell>
                      <TableCell align="center">{row.sellerUsername}</TableCell>
                      <TableCell align="center">{convertDate(row.timestamp)}</TableCell>
                      <TableCell align="center">
                        <ActionsContainer>
                          <IconButton aria-label="buy" onClick={handleBuyButton(row)} color="secondary">
                            <SwapHorizIcon fontSize="large" />
                          </IconButton>
                        </ActionsContainer>
                      </TableCell>
                    </TableRow>
                  )
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={currentAds.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableTopContainer>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label={<LabelTypography>Dense padding</LabelTypography>}
      />

      <ExchangeConfirmationDialog
        ad={selectedAd}
        open={open}
        onClose={handleClose}
        isBuyAd={true}
      />
    </div>
  )
}

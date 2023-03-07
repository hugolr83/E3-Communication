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
import DoneIcon from '@material-ui/icons/Done'
import ClearIcon from '@material-ui/icons/Clear'
import { IExchangeAd, IPendingExchangeAd, Severity } from '../../Api/Core/Interfaces'
import { ActionsContainer, TableTopContainer, LabelTypography } from './Styled'
import { validateExchangeAd, deleteExchangeAd } from '../../Api/Core/clientExchangeAds'
import { convertDate } from '../../Api/utils'
import { useSetRecoilState } from 'recoil'
import { errorState } from '../../Recoil/GlobalState'
import ActionDialog from '../ActionDialog/ActionDialog'

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
  id: keyof IPendingExchangeAd;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  { id: 'sellerLastname', numeric: false, disablePadding: true, label: 'Last Name' },
  { id: 'sellerFirstname', numeric: false, disablePadding: true, label: 'First Name' },
  { id: 'supplierFromName', numeric: false, disablePadding: true, label: 'Supplier (from)' },
  { id: 'supplierToName', numeric: false, disablePadding: true, label: 'Supplier (to)' },
  { id: 'timestamp', numeric: true, disablePadding: true, label: 'Creation Date' }
]

interface EnhancedTableProps {
  // eslint-disable-next-line no-use-before-define
  classes: ReturnType<typeof useStyles>;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof IPendingExchangeAd) => void;
  order: Order;
  orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { classes, order, orderBy, onRequestSort } = props
  const createSortHandler = (property: keyof IPendingExchangeAd) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
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
          <Typography variant="h6">Validate/Reject</Typography>
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
        Pending Ads
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
  setCurrentAds: React.Dispatch<React.SetStateAction<IPendingExchangeAd[]>>
  currentAds: IPendingExchangeAd[]
}

export default function PendingAdTable({ currentAds, setCurrentAds }: ExchangeAdTableProps) {
  const classes = useStyles()
  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof IPendingExchangeAd>('sellerLastname')
  const [page, setPage] = React.useState(0)
  const [dense, setDense] = React.useState(false)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const setCurrentErrorState = useSetRecoilState(errorState)
  const [validate, setValidate] = React.useState(false)
  const [reject, setReject] = React.useState(false)
  const [selectedAd, setSelectedAd] = React.useState<IPendingExchangeAd>({
    _id: '',
    sellerID: '',
    sellerUsername: '',
    sellerFirstname: '',
    sellerLastname: '',
    supplierFromID: '',
    supplierFromName: '',
    supplierToID: '',
    supplierToName: '',
    pointsFrom: 0,
    pointsTo: 0,
    timestamp: new Date()
  })

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof IPendingExchangeAd) => {
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

  const handleAcceptButton = (ad: IPendingExchangeAd) => async (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setSelectedAd(ad)
    setValidate(true)
  }

  const handleRejectButton = (ad: IPendingExchangeAd) => async (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setSelectedAd(ad)
    setReject(true)
  }

  const handleAccept = (isAccepting: boolean) => {
    (async() => {
      setValidate(false)
      if (isAccepting) {
        const iExchangeAd :IExchangeAd = ({
          _id: selectedAd._id,
          sellerID: selectedAd.sellerID,
          sellerUsername: selectedAd.sellerUsername,
          supplierFromID: selectedAd.supplierFromID,
          supplierFromName: selectedAd.supplierFromName,
          supplierToID: selectedAd.supplierToID,
          supplierToName: selectedAd.supplierToName,
          pointsFrom: selectedAd.pointsFrom,
          pointsTo: selectedAd.pointsTo,
          timestamp: selectedAd.timestamp
        })
        const { errors, hasErrors } = await validateExchangeAd(iExchangeAd)
        if (!hasErrors) {
          setCurrentAds(currentAds.filter((s) => s._id !== selectedAd._id))
          setCurrentErrorState((prev) => ({
            ...prev,
            open: true,
            message: 'Exchange validated',
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
              message: 'Unable to validate exchange',
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

  const handleReject = (isRejecting: boolean) => {
    (async() => {
      setReject(false)
      if (isRejecting) {
        const iExchangeAd :IExchangeAd = ({
          _id: selectedAd._id,
          sellerID: selectedAd.sellerID,
          sellerUsername: selectedAd.sellerUsername,
          supplierFromID: selectedAd.supplierFromID,
          supplierFromName: selectedAd.supplierFromName,
          supplierToID: selectedAd.supplierToID,
          supplierToName: selectedAd.supplierToName,
          pointsFrom: selectedAd.pointsFrom,
          pointsTo: selectedAd.pointsTo,
          timestamp: selectedAd.timestamp
        })
        const { errors, hasErrors } = await deleteExchangeAd(iExchangeAd)
        if (!hasErrors) {
          setCurrentAds(currentAds.filter((s) => s._id !== selectedAd._id))
          setCurrentErrorState((prev) => ({
            ...prev,
            open: true,
            message: 'Exchange deleted',
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
              message: 'Unable to delete exchange',
              severity: Severity.Error
            }))
          }
        } else {
          console.log(errors)
          setCurrentErrorState((prev) => ({
            ...prev,
            open: true,
            message: 'Unable to delete exchange',
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
                        <p color="white">{row.sellerLastname}</p>
                      </TableCell>
                      <TableCell align="center">{row.sellerFirstname}</TableCell>
                      <TableCell align="center">{row.supplierToName}</TableCell>
                      <TableCell align="center">{row.supplierFromName}</TableCell>
                      <TableCell align="center">{convertDate(row.timestamp)}</TableCell>
                      <TableCell align="center">
                        <ActionsContainer>
                          <IconButton aria-label="accept" onClick={handleAcceptButton(row)} color="secondary">
                            <DoneIcon fontSize="large" />
                          </IconButton>
                          <IconButton aria-label="delete" onClick={handleRejectButton(row)} color="secondary">
                            <ClearIcon fontSize="large" />
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

      <ActionDialog
        ad={selectedAd}
        open={validate}
        onAction={handleAccept}
        isActionAd={true}
        titleDialog={'Confirm transaction'}
      />
      <ActionDialog
        ad={selectedAd}
        open={reject}
        onAction={handleReject}
        isActionAd={true}
        titleDialog={'Delete transaction'}
      />
    </div>
  )
}

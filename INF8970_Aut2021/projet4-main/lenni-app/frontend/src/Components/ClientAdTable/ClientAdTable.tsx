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
import DeleteIcon from '@material-ui/icons/Delete'
import EditSharpIcon from '@material-ui/icons/EditSharp'
import { ActionsContainer, TableTopContainer, LabelTypography } from './Styled'
import { IAd, Severity } from '../../Api/Core/Interfaces'
import { deleteAd, updateAd } from '../../Api/Core/clientAds'
import { convertDate } from '../../Api/utils'
import { useSetRecoilState } from 'recoil'
import { errorState } from '../../Recoil/GlobalState'
import ConfirmationDialog from '../ConfirmationDialog/ConfirmationDialog'
import EditAdDialog from '../EditAdDialog/EditAdDialog'

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
  id: keyof IAd;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  { id: 'supplierName', numeric: false, disablePadding: true, label: 'Supplier' },
  { id: 'points', numeric: true, disablePadding: true, label: 'Points' },
  { id: 'price', numeric: true, disablePadding: true, label: 'Price' },
  { id: 'timestamp', numeric: true, disablePadding: true, label: 'Creation Date' }
]

interface EnhancedTableProps {
  // eslint-disable-next-line no-use-before-define
  classes: ReturnType<typeof useStyles>;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof IAd) => void;
  order: Order;
  orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { classes, order, orderBy, onRequestSort } = props
  const createSortHandler = (property: keyof IAd) => (event: React.MouseEvent<unknown>) => {
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
          <Typography variant="h6">Actions</Typography>
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
        My Ads
      </Typography>
    </Toolbar>
  )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
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

interface ClientAdTableProps {
  setCurrentClientAds: React.Dispatch<React.SetStateAction<IAd[]>>
  currentClientAds: IAd[]
}

export default function ClientAdTable({ currentClientAds, setCurrentClientAds }: ClientAdTableProps) {
  const classes = useStyles()
  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof IAd>('supplierName')
  const [page, setPage] = React.useState(0)
  const [dense, setDense] = React.useState(false)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const setCurrentErrorState = useSetRecoilState(errorState)
  const [open, setOpen] = React.useState(false)
  const [openEdit, setOpenEdit] = React.useState(false)
  const [selectedAd, setSelectedAd] = React.useState<IAd>({
    _id: '',
    clientID: '',
    clientUsername: '',
    supplierID: '',
    supplierName: '',
    points: 0,
    price: 0,
    timestamp: new Date()
  })

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof IAd) => {
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

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, currentClientAds.length - page * rowsPerPage)

  const handleDeleteButton = (ad: IAd) => async (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setSelectedAd(ad)
    setOpen(true)
  }

  const handleClose = (isDeleting: boolean) => {
    (async() => {
      setOpen(false)
      if (isDeleting) {
        const { errors, hasErrors } = await deleteAd(selectedAd)
        if (!hasErrors) {
          setCurrentClientAds(currentClientAds.filter((s) => s._id !== selectedAd._id))
          setCurrentErrorState((prev) => ({
            ...prev,
            open: true,
            message: 'Ad deleted',
            severity: Severity.Success
          }))
        } else {
          console.log(errors)
          setCurrentErrorState((prev) => ({
            ...prev,
            open: true,
            message: 'Unable to delete ad',
            severity: Severity.Error
          }))
        }
      }
    })()
  }

  const handleEditButton = (ad: IAd) => async (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setSelectedAd(ad)
    setOpenEdit(true)
  }

  const handleCloseEdit = (isEditing: boolean, points: number, price: number) => {
    (async() => {
      setOpenEdit(false)
      if (isEditing) {
        const updateData = {
          points: points,
          price: price
      }
        const { errors, hasErrors } = await updateAd(selectedAd._id, updateData)
        if (!hasErrors) {
          // update ad in currentClientAds
          const updatedAdList = currentClientAds.map(ad => {
              if (ad._id === selectedAd._id) {
                return { ...ad, points: points, price: price }
              }
              return ad
            })

          setCurrentClientAds(updatedAdList)

          setCurrentErrorState((prev) => ({
            ...prev,
            open: true,
            message: 'Ad updated',
            severity: Severity.Success
          }))
        } else if (errors) {
          let isAlreadyBoughtError = false
          for (const err of errors) {
            if (err.param && err.param === 'alreadyBought') {
              setCurrentClientAds(currentClientAds.filter((s) => s._id !== selectedAd._id))
              isAlreadyBoughtError = true
              setCurrentErrorState((prev) => ({
                ...prev,
                open: true,
                message: err.msg,
                severity: Severity.Error
              }))
            }
          }
          if (!isAlreadyBoughtError) {
            setCurrentErrorState((prev) => ({
              ...prev,
              open: true,
              message: 'Unable to update ad',
              severity: Severity.Error
            }))
          }
        } else {
          console.log(errors)
          setCurrentErrorState((prev) => ({
            ...prev,
            open: true,
            message: 'Unable to update ad',
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
              {stableSort(currentClientAds, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.supplierName}
                    >
                      <TableCell align="center" component="th" id={labelId} scope="row" padding="none">
                        <p color="white">{row.supplierName}</p>
                      </TableCell>
                      <TableCell align="center">{row.points}</TableCell>
                      <TableCell align="center">{row.price}</TableCell>
                      <TableCell align="center">{convertDate(row.timestamp)}</TableCell>
                      <TableCell align="center">
                        <ActionsContainer>
                          <IconButton aria-label="edit" onClick={handleEditButton(row)} color="secondary">
                            <EditSharpIcon />
                          </IconButton>
                          <IconButton aria-label="delete" onClick={handleDeleteButton(row)} color="secondary">
                            <DeleteIcon />
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
          count={currentClientAds.length}
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

      <ConfirmationDialog
        ad={selectedAd}
        open={open}
        onClose={handleClose}
        isBuyAd={false}
      />

      <EditAdDialog
        ad={selectedAd}
        open={openEdit}
        onClose={handleCloseEdit}
      />
    </div>
  )
}

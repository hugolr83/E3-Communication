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
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import { TableTopContainer, LabelTypography } from './Styled'
import { IPromotionData } from '../../Api/Core/Interfaces'
import { convertDate } from '../../Api/utils'
// import { convertDate } from '../../Api/utils'

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
  id: keyof IPromotionData;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  { id: 'oldPointsToLennis', numeric: false, disablePadding: true, label: 'Old Points to Lennis Promo' },
  { id: 'oldDollarsToPoints', numeric: true, disablePadding: true, label: 'Old Dollars to Points Promo' },
  { id: 'oldPointsToDollars', numeric: false, disablePadding: true, label: 'Old Points to Dollars Promo' },
  { id: 'newPointsToLennis', numeric: true, disablePadding: true, label: 'New Points to Lennis Promo' },
  { id: 'newDollarsToPoints', numeric: false, disablePadding: true, label: 'New Dollars to Points Promo' },
  { id: 'newPointsToDollars', numeric: true, disablePadding: true, label: 'New Points to Dollars Promo' },
  { id: 'currentDate', numeric: true, disablePadding: true, label: 'Creation Date' },
  { id: 'expirationDate', numeric: true, disablePadding: true, label: 'Expiration Date' }
]

interface EnhancedTableProps {
  // eslint-disable-next-line no-use-before-define
  classes: ReturnType<typeof useStyles>;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof IPromotionData) => void;
  order: Order;
  orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { classes, order, orderBy, onRequestSort } = props
  const createSortHandler = (property: keyof IPromotionData) => (event: React.MouseEvent<unknown>) => {
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
        History
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

interface SupplierHistoryPromotionsTableProps {
  setCurrentSupplierPromotions: React.Dispatch<React.SetStateAction<IPromotionData[]>>
  currentSupplierPromotions: IPromotionData[]
}

export default function SupplierHistoryPromotionsTable({ currentSupplierPromotions, setCurrentSupplierPromotions }: SupplierHistoryPromotionsTableProps) {
  const classes = useStyles()
  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof IPromotionData>('oldPointsToLennis')
  const [page, setPage] = React.useState(0)
  const [dense, setDense] = React.useState(false)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof IPromotionData) => {
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

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, currentSupplierPromotions.length - page * rowsPerPage)

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
              {stableSort(currentSupplierPromotions, getComparator(order, orderBy))
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
                        <p color="white">{row.oldPointsToLennis}</p>
                      </TableCell>
                      <TableCell align="center">{row.oldDollarsToPoints}</TableCell>
                      <TableCell align="center">{row.oldPointsToDollars}</TableCell>
                      <TableCell align="center">{row.newPointsToLennis}</TableCell>
                      <TableCell align="center">{row.newDollarsToPoints}</TableCell>
                      <TableCell align="center">{row.newPointsToDollars}</TableCell>
                      <TableCell align="center">{convertDate(row.currentDate)}</TableCell>
                      <TableCell align="center">{convertDate(row.expirationDate)}</TableCell>
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
          count={currentSupplierPromotions.length}
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
    </div>
  )
}

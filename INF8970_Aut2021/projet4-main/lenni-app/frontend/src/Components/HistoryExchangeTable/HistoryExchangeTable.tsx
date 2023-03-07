// eslint-disable-next-line no-use-before-define
import React from 'react'
import clsx from 'clsx'
import { createStyles, lighten, makeStyles, Theme } from '@material-ui/core/styles'
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
import { TableTopContainer } from './Styled'
import { IAddress, IExchangeData, IUserInfo } from '../../Api/Core/Interfaces'
import { convertDate } from './../../Api/utils'

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
): (a: { [key in Key]: number | string | Date | Boolean | IAddress | IUserInfo }, b: { [key in Key]: number | string | Date | Boolean | IAddress | IUserInfo }) => number {
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
  id: keyof IExchangeData;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  { id: '_id', numeric: false, disablePadding: true, label: 'Exchange ID' },
  { id: 'sellerUsername', numeric: false, disablePadding: true, label: 'Exchanger 1 Username' },
  { id: 'supplierFromName', numeric: false, disablePadding: true, label: 'Exchanger 1 Supplier Name' },
  { id: 'pointsFrom', numeric: true, disablePadding: true, label: ' Number of Points from Exchanger 1' },
  { id: 'pointsTo', numeric: true, disablePadding: true, label: ' Number of Points from Exchanger 2' },
  { id: 'supplierToName', numeric: false, disablePadding: true, label: 'Exchanger 2 Supplier Name' },
  { id: 'buyerUsername', numeric: false, disablePadding: true, label: 'Exchanger 2 Username' },
  { id: 'exchangeAdID', numeric: false, disablePadding: true, label: 'Exchange Ad ID' },
  { id: 'exchangeAdCreationDate', numeric: false, disablePadding: true, label: ' Exchange Ad Date' },
  { id: 'exchangeDate', numeric: false, disablePadding: true, label: 'Exchange Date' }
]

interface EnhancedTableProps {
  // eslint-disable-next-line no-use-before-define
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof IExchangeData) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { classes, order, orderBy, onRequestSort } = props
  const createSortHandler = (property: keyof IExchangeData) => (event: React.MouseEvent<unknown>) => {
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
              <Typography variant="h6">

                {headCell.label}
              </Typography>
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

interface EnhancedTableToolbarProps {
  numSelected: number;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles()
  const { numSelected } = props

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      {numSelected > 0
        ? (
          <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
            {numSelected} selected
          </Typography>
        )
        : (
          <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
            Exchanges History
          </Typography>
        )}
    </Toolbar>
  )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%'
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

interface HistoryExchangeTableProps {
  setCurrentExchanges: React.Dispatch<React.SetStateAction<IExchangeData[]>>
  currentExchanges: IExchangeData[]
}

export default function UserTable({ currentExchanges, setCurrentExchanges }: HistoryExchangeTableProps) {
  const classes = useStyles()
  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof IExchangeData>('_id')
  const [selected, setSelected] = React.useState<string[]>([])
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof IExchangeData) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = currentExchanges.map((n) => n._id)
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }

  const handleClick = (event: React.MouseEvent<unknown>, _id: string) => {
    const selectedIndex = selected.indexOf(_id)
    let newSelected: string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, _id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }

    setSelected(newSelected)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const isSelected = (_id: string) => selected.indexOf(_id) !== -1

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, currentExchanges.length - page * rowsPerPage)

  return (
    <div className={classes.root}>
      <TableTopContainer className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size='medium'
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={currentExchanges.length}
            />
            <TableBody>
              {stableSort(currentExchanges, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row._id as string)
                  const labelId = `enhanced-table-checkbox-${index}`
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row._id as string)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row._id}
                      selected={isItemSelected}
                    >
                      <TableCell align="center" component="th" id={labelId} scope="row" padding="none">
                        <p color="white">{row._id}</p>
                      </TableCell>
                      <TableCell align="center">{row.sellerUsername}</TableCell>
                      <TableCell align="center">{row.supplierFromName}</TableCell>
                      <TableCell align="center">{row.pointsFrom}</TableCell>
                      <TableCell align="center">{row.pointsTo}</TableCell>
                      <TableCell align="center">{row.supplierToName}</TableCell>
                      <TableCell align="center">{row.buyerUsername}</TableCell>
                      <TableCell align="center">{row.exchangeAdID}</TableCell>
                      <TableCell align="center">{convertDate(row.exchangeAdCreationDate)}</TableCell>
                      <TableCell align="center">{convertDate(row.exchangeDate)}</TableCell>
                    </TableRow>
                  )
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={currentExchanges.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableTopContainer>
    </div>
  )
}

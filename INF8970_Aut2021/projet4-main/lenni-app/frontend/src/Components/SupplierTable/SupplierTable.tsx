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
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import VisibilityIcon from '@material-ui/icons/Visibility'
import DeleteIcon from '@material-ui/icons/Delete'
import FilterListIcon from '@material-ui/icons/FilterList'
import { ActionsContainer, TableTopContainer } from './Styled'
// import EditSharpIcon from '@material-ui/icons/EditSharp'
import { IAddress, ISuppliers, IUserInfo } from '../../Api/Core/Interfaces'
import { deleteSupplier } from '../../Api/Core/suppliers'
import { convertDate } from './../../Api/utils'
import { useHistory } from 'react-router-dom'

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
): (a: { [key in Key]: string | number | Date | Boolean| IAddress | IUserInfo }, b: { [key in Key]: string | number | Date | Boolean | IAddress | IUserInfo }) => number {
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
  id: keyof ISuppliers;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  { id: 'businessName', numeric: false, disablePadding: true, label: 'Business Name' },
  { id: 'businessNumber', numeric: false, disablePadding: true, label: 'Business Number' },
  { id: 'pointsToLennis', numeric: true, disablePadding: true, label: 'Points To Lennis' },
  { id: 'dollarToPoints', numeric: true, disablePadding: true, label: 'Dollar To Points' },
  { id: 'pointsToDollars', numeric: true, disablePadding: true, label: 'Points To Dollars' },
  { id: 'userInfo', numeric: false, disablePadding: true, label: 'Last Connection' }
]

interface EnhancedTableProps {
  // eslint-disable-next-line no-use-before-define
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof ISuppliers) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props
  const createSortHandler = (property: keyof ISuppliers) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all suppliers' }}
          />
        </TableCell>
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
        <TableCell align='center' padding="checkbox">
          <p>Actions</p>
        </TableCell>
      </TableRow>
    </TableHead>
  )
}

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
      fontSize: theme.typography.pxToRem(20)
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
          // backgroundColor: '#1f1122'
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
          <Typography className={classes.title} variant="h5" id="tableTitle" component="div">
            Suppliers
          </Typography>
        )}
      {numSelected > 0
        ? (
          <Tooltip title="Delete">
            <IconButton aria-label="delete">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )
        : (
          <Tooltip title="Filter list">
            <IconButton aria-label="filter list">
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
    </Toolbar>
  )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      fontSize: theme.typography.pxToRem(30)
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

interface SupplierTableProps {
  setCurrentSuppliers: React.Dispatch<React.SetStateAction<ISuppliers[]>>
  currentSuppliers: ISuppliers[]
}

export default function SupplierTable({ currentSuppliers, setCurrentSuppliers }: SupplierTableProps) {
  const classes = useStyles()
  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof ISuppliers>('businessName')
  const [selected, setSelected] = React.useState<string[]>([])
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const history = useHistory()

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof ISuppliers) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = currentSuppliers.map((n) => n.businessName)
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }

  const handleClick = (event: React.MouseEvent<unknown>, businessName: string) => {
    const selectedIndex = selected.indexOf(businessName)
    let newSelected: string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, businessName)
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

  const isSelected = (businessName: string) => selected.indexOf(businessName) !== -1

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, currentSuppliers.length - page * rowsPerPage)

  const handleDeleteButton = (supplier: ISuppliers) => async (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setCurrentSuppliers(currentSuppliers.filter((s) => s.businessName !== supplier.businessName))
    const { errors, hasErrors } = await deleteSupplier(supplier)
    if (hasErrors) {
      console.log(errors)
    }
  }

  const goToSupplierInformations = (supplier: ISuppliers) => async (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    history.push({
      pathname: '/admin/supplierInformations',
      state: supplier
     })
  }

  return (
    <div className={classes.root}>
      <TableTopContainer className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size= 'medium'
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={currentSuppliers.length}
            />
            <TableBody>
              {stableSort(currentSuppliers, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.businessName as string)
                  const labelId = `enhanced-table-checkbox-${index}`

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.businessName as string)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.businessName}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell align="center" component="th" id={labelId} scope="row" padding="none">
                        <p color="white">{row.businessName}</p>
                      </TableCell>
                      <TableCell align="center">{row.businessNumber}</TableCell>
                      <TableCell align="center">{row.pointsToLennis}</TableCell>
                      <TableCell align="center">{row.dollarToPoints}</TableCell>
                      <TableCell align="center">{row.pointsToDollars}</TableCell>
                      <TableCell align="center">{convertDate(row.userInfo.lastConnection)}</TableCell>
                      <TableCell align="center">
                        <ActionsContainer>
                        <IconButton onClick={goToSupplierInformations(row)} color="secondary">
                            <VisibilityIcon />
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
          count={currentSuppliers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableTopContainer>

    </div>
  )
}

// eslint-disable-next-line no-use-before-define
import React from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import AdminHistoryTransfer from './../../Pages/Admin/AdminHistoryTransfer/AdminHistoryTransfer'
import AdminHistoryTransaction from './../../Pages/Admin/AdminHistoryTransaction/AdminHistoryTransaction'
import AdminHistoryExchange from './../../Pages/Admin/AdminHistoryExchange/AdminHistoryExchange'
import AdminHistoryAd from './../../Pages/Admin/AdminHistoryAd/AdminHistoryAd'
import AdminHistoryPromotion from './../../Pages/Admin/AdminHistoryPromotion/AdminHistoryPromotion'
import AdminHistoryFunding from './../../Pages/Admin/AdminHistoryFunding/AdminHistoryFunding'
import AdminHistoryAdExchange from './../../Pages/Admin/AdminHistoryAdExchange/AdminHistoryAdExchange'

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={6}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  tab: {
    '& .Mui-selected': {
      color: 'white',
      fontSize: '80px'
    }
  }
}))

export default function HistoryTabs() {
  const classes = useStyles()
  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue)
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Transfers" {...a11yProps(0)} />
          <Tab label="Exchanges Announcements" {...a11yProps(1)} />
          <Tab label="Exchanges" {...a11yProps(2)} />
          <Tab label="Transactions Announcements" {...a11yProps(3)} />
          <Tab label="Transactions" {...a11yProps(4)} />
          <Tab label="Promotions" {...a11yProps(5)} />
          <Tab label="Fundings" {...a11yProps(6)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <AdminHistoryTransfer />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <AdminHistoryAdExchange />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <AdminHistoryExchange />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <AdminHistoryAd />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <AdminHistoryTransaction />
      </TabPanel>
      <TabPanel value={value} index={5}>
        <AdminHistoryPromotion />
      </TabPanel>
      <TabPanel value={value} index={6}>
        <AdminHistoryFunding />
      </TabPanel>
    </div>
  )
}

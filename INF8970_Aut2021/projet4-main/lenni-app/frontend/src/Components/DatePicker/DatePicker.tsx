// eslint-disable-next-line no-use-before-define
import React from 'react'
import 'date-fns'

import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { DateContainer } from './Styled'

interface DatePickerProps {
  name: string;
  defaultValue: MaterialUiPickersDate;
  changeDate: (newDate: MaterialUiPickersDate) => void;
}

const DatePicker = ({ name, defaultValue, changeDate }: DatePickerProps) => {
  // The first commit of Material-UI
  const [selectedDate, setSelectedDate] = React.useState<MaterialUiPickersDate>(defaultValue)

  const handleDateChange = (date: MaterialUiPickersDate) => {
    changeDate(date)
    setSelectedDate(date)
  }

  return (
    <div>
      <DateContainer
        autoOk
        ampm={false}
        disableFuture
        color="secondary"
        variant="inline"
        format="yyyy/MM/dd hh:mm a"
        margin="normal"
        id="date-picker-inline"
        label={name}
        value={selectedDate}
        onChange={handleDateChange}
      />
    </div>
  )
}

export default DatePicker

// eslint-disable-next-line no-use-before-define
import React from 'react'
import SearchSharpIcon from '@material-ui/icons/SearchSharp'
import { Search, Container } from './Styled'

interface SearchInputProps {
  changeCurrentData: (newValue: string) => void
}

const SearchInput = ({ changeCurrentData }: SearchInputProps) => {
  return (
    <Container>
      <SearchSharpIcon color="secondary" />
      <Search onChange={e => changeCurrentData(e.target.value)} type="text" id="search" name="search" placeholder="search..." />
    </Container>
  )
}

export default SearchInput

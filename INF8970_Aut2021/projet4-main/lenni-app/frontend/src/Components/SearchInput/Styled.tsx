import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  width: 200px;
  background: #bcf3ef;
  padding: .4em;
  transition: background .5s;
  align-items: center;
  overflow: hidden;
  
  &:hover{
    background: #ddf3f2;
  }

  &:hover input{
    background: #ddf3f2;
  }

  svg{
    margin-left: .5em;
  }
  
  `

export const Search = styled.input`
  background: inherit;
  border: none;
  padding: .3em;
  transition: background .5s;
  &:focus{
    outline: none;
    border: none;
  }
`

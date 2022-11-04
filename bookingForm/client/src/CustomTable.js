import * as React from 'react';
import { Table, Header, HeaderRow, HeaderCell, Body, Row, Cell } from '@table-library/react-table-library/table';
import { useTree, CellTree, TreeExpandClickTypes } from '@table-library/react-table-library/tree';
import { useTheme } from '@table-library/react-table-library/theme';
import { activitiesList } from './BookingForm';

const THEME = {
  
  Table:
  /*
    `grid-template-columns: 3fr 1fr 1fr 2fr 5fr;
    `*/
    `grid-template-columns: 3fr 1fr 5fr;
    `
  ,
  HeaderRow: `
    font-size: 10px;
    color:white;
    padding: 15px;
    border-width: thin;
    border-style: none;
    background-color: #333;
  `,
  Row: `
    font-size: 8px;
    border-width: thin;
    border-style: none;
    padding: 15px;
    background-color: #333;
  `,
};

const CustomTable = () => {
  const data = { nodes: activitiesList };
  data.nodes.forEach(element => {
    let days = '';
    if(element.days.includes('L')){
      days += 'Lunedì ';
    }
    if(element.days.includes('Ma')){
      days += 'Martedì ';
    }
    if(element.days.includes('Me')){
      days += 'Mercoledì ';
    }
    if(element.days.includes('G')){
      days += 'Giovedì ';
    }
    if(element.days.includes('V')){
      days += 'Venerdì ';
    }
    if(element.days.includes('S')){
      days += 'Sabato ';
    }
    if(element.days.includes('D')){
      days += 'Domenica ';
    }
    days = days.replaceAll(' ', ', ');
    days = days.slice(0, -2);
    element.days = days;
  });
  const theme = useTheme(THEME);

  const tree = useTree(data, 
  {
    onChange: onTreeChange,
  },
  {
    clickType: TreeExpandClickTypes.ButtonClick,
  }
);

  function onTreeChange(action, state) {
    
  }
/*
  return <Table data={data} tree={tree} theme={theme} layout={{ horizontalScroll: true }}>
    {(tableList) => (
      <>
        <Header>
          <HeaderRow>
            <HeaderCell>Attività</HeaderCell>
            <HeaderCell>Inizio</HeaderCell>
            <HeaderCell>Fine</HeaderCell>
            <HeaderCell>Coperti</HeaderCell>
            <HeaderCell>Giorni</HeaderCell>
          </HeaderRow>
        </Header>
        <Body>
          {tableList.map((item) => (
            <Row key={item.name} item={item}>
            <CellTree item={item} pinLeft>
              {item.name}
            </CellTree>
            <Cell>{item.start}</Cell>
            <Cell>{item.end}</Cell>
            <Cell>{item.spots}</Cell>
            <Cell>{item.days}</Cell>
          </Row>
        ))}
        </Body>
      </>
      )}</Table>;*/
      return <Table data={data} tree={tree} theme={theme} layout={{ horizontalScroll: true }}>
    {(tableList) => (
      <>
        <Header>
          <HeaderRow>
            <HeaderCell>Attività</HeaderCell>
            <HeaderCell>Fascia Oraria</HeaderCell>
            <HeaderCell>Giorni</HeaderCell>
          </HeaderRow>
        </Header>
        <Body>
          {tableList.map((item) => (
            <Row key={item.name} item={item}>
            <CellTree item={item} pinLeft>
              {item.name}
            </CellTree>
            <Cell>{item.start} / {item.end}</Cell>
            <Cell>{item.days}</Cell>
          </Row>
        ))}
        </Body>
      </>
      )}</Table>;
};

export default CustomTable;
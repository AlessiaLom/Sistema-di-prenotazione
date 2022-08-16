import * as React from 'react';
import { Table, Header, HeaderRow, HeaderCell, Body, Row, Cell } from '@table-library/react-table-library/table';
import { useTree, CellTree, TreeExpandClickTypes } from '@table-library/react-table-library/tree';
import { useTheme } from '@table-library/react-table-library/theme';

const list = [
  {
    id: "1",
    name: "Lunedì",
    startTime: "17:30",
    endTime: "22:00",
    isClosed: false,
    nodes: [
      {
        id: "1.1",
        name: "Aperitivo",
        startTime: "17:30",
        endTime: "19:00",
        isClosed: false,
      },
      {
        id: "1.2",
        name: "Cena",
        startTime: "19:00",
        endTime: "22:00",
        isClosed: false,
      },
    ],
  },
  {
    id: "2",
    name: "Martedì",
    startTime: "",
    endTime: "",
    isClosed: true,
  },
  {
    id: "3",
    name: "Mercoledì",
    startTime: "9:00",
    endTime: "22:30",
    isClosed: false,
    nodes: [
      {
        id: "3.1",
        name: "Colazione",
        startTime: "9:00",
        endTime: "11:00",
        isClosed: false,
      },
      {
        id: "3.2",
        name: "Pranzo",
        startTime: "12:00",
        endTime: "15:00",
        isClosed: false,
      },
      {
        id: "3.3",
        name: "Aperitivo",
        startTime: "17.30",
        endTime: "19:00",
        isClosed: false,
      },
      {
        id: "3.4",
        name: "Cena",
        startTime: "19.00",
        endTime: "22:30",
        isClosed: false,
      },
    ],
  },
  {
    id: "4",
    name: "Giovedì",
    startTime: "12:00",
    endTime: "22:30",
    isClosed: false,
    nodes: [
      {
        id: "4.1",
        name: "Pranzo",
        startTime: "12:00",
        endTime: "15:00",
        isClosed: false,
      },
      {
        id: "4.2",
        name: "Aperitivo",
        startTime: "17:30",
        endTime: "19:00",
        isClosed: false,
      },
      {
        id: "4.3",
        name: "Cena",
        startTime: "19.00",
        endTime: "22:30",
        isClosed: false,
      },
    ],
  },
  {
    id: "5",
    name: "Venerdì",
    startTime: "8:00",
    endTime: "1:00",
    isClosed: false,
    nodes: [
      {
        id: "5.1",
        name: "Colazione",
        startTime: "8:00",
        endTime: "12:00",
        isClosed: false,
      },
      {
        id: "5.2",
        name: "Pranzo",
        startTime: "12:00",
        endTime: "15:00",
        isClosed: false,
      },
      {
        id: "5.3",
        name: "Aperitivo",
        startTime: "17.00",
        endTime: "19:00",
        isClosed: false,
      },
      {
        id: "5.4",
        name: "Cena",
        startTime: "19.00",
        endTime: "22:30",
        isClosed: false,
      },
      {
        id: "5.5",
        name: "Drink",
        startTime: "22.30",
        endTime: "1:00",
        isClosed: false,
      },
    ],
  },
  {
    id: "6",
    name: "Sabato",
    startTime: "8:00",
    endTime: "1:30",
    isClosed: false,
    nodes: [
      {
        id: "6.1",
        name: "Colazione",
        startTime: "8:00",
        endTime: "12:00",
        isClosed: false,
      },
      {
        id: "6.2",
        name: "Pranzo",
        startTime: "12:00",
        endTime: "15:00",
        isClosed: false,
      },
      {
        id: "6.3",
        name: "Aperitivo",
        startTime: "17.00",
        endTime: "19:00",
        isClosed: false,
      },
      {
        id: "6.4",
        name: "Cena",
        startTime: "19.00",
        endTime: "23:00",
        isClosed: false,
      },
      {
        id: "6.5",
        name: "Drink",
        startTime: "23.00",
        endTime: "1:30",
        isClosed: false,
      },
    ],
  },
  {
    id: "7",
    name: "Domenica",
    startTime: "8:00",
    endTime: "0:00",
    isClosed: false,
    nodes: [
      {
        id: "7.1",
        name: "Colazione",
        startTime: "8:00",
        endTime: "12:00",
        isClosed: false,
      },
      {
        id: "7.2",
        name: "Pranzo",
        startTime: "12:00",
        endTime: "15:00",
        isClosed: false,
      },
      {
        id: "7.3",
        name: "Aperitivo",
        startTime: "17.00",
        endTime: "19:00",
        isClosed: false,
      },
      {
        id: "7.4",
        name: "Cena",
        startTime: "19.00",
        endTime: "22:00",
        isClosed: false,
      },
      {
        id: "7.5",
        name: "Drink",
        startTime: "22.00",
        endTime: "0:00",
        isClosed: false,
      },
    ],
  }
];

const THEME = {
  
  Table:
    `grid-template-columns: 32% repeat(2, 22%) 24%;
    `
  ,
  HeaderRow: `
    font-size: 14px;

    background-color: #bf1650;
  `,
  Row: `
    font-size: 14px;

    &:nth-of-type(odd) {
      background-color: #d2e9fb;
    }

    &:nth-of-type(even) {
      background-color: #ec5990;
    }
  `,
};

const CustomTable = () => {
  const data = { nodes: list };

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
    // console.log(action, state);
  }


  return <Table data={data} tree={tree} theme={theme} layout={{ horizontalScroll: true }}>
    {(tableList) => (
      <>
        <Header>
          <HeaderRow>
            <HeaderCell>Giorni</HeaderCell>
            <HeaderCell>Inizio</HeaderCell>
            <HeaderCell>Fine</HeaderCell>
            <HeaderCell>Chiuso</HeaderCell>
          </HeaderRow>
        </Header>
        <Body>
          {tableList.map((item) => (
            <Row key={item.id} item={item}>
            <CellTree item={item} pinLeft>
              {item.name}
            </CellTree>
            <Cell>{item.startTime}</Cell>
            <Cell>{item.endTime}</Cell>
            <Cell className={item.isClosed.toString()}>{item.isClosed.toString() === "true" ? "Sì" : ""}</Cell>
          </Row>
        ))}
        </Body>
      </>
      )}</Table>;
};

export default CustomTable;
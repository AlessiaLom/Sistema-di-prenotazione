import * as React from 'react';

import { CompactTable } from '@table-library/react-table-library/compact';
import { useTheme } from '@table-library/react-table-library/theme';

import nodes from './Data';

const CustomTable = () => {
  const data = { nodes };

  const theme = useTheme({

    HeaderRow: `
      background-color: #777;
    `,
    Row: `
      &:nth-of-type(odd) {
        background-color: #bf1650;
      }

      &:nth-of-type(even) {
        background-color: #white;
      }
    `,
    Table: `
        --data-table-library_grid-template-columns: 20% 20% 20% 40%;
      `,
  });

  const COLUMNS = [
    { label: 'Attività', renderCell: (item) => item.name },
    { label: 'Inizio', renderCell: (item) => item.startTime },
    { label: 'Fine', renderCell: (item) => item.endTime },
    { label: 'Giorni', renderCell: (item) => item.days },
  ];

  return <CompactTable columns={COLUMNS} data={data} theme={theme} layout={{ custom: true, horizontalScroll: true }} />;
};

export default CustomTable;
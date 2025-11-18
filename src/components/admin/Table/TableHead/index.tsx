import React from 'react';
import {
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
} from '@material-ui/core';

import styles from './styles.module.scss';

type TableHeadProps = {
  order: any;
  orderBy: any;
  onRequestSort: (event: any, value: any) => void;
  headColumns: { id: string; label: string }[];
};

export function TableHeadContainer({
  onRequestSort,
  order,
  orderBy,
  headColumns,
}: TableHeadProps) {
  const createSortHandler = (property: string) => (event: any) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead className={styles.tableHead} >
      
      <TableRow >
        {headColumns.map((headCell) => (
          <TableCell
          
            key={headCell?.id}
            align="left"
            width={277}
            height={100}
            sortDirection={orderBy === headCell?.id ? order : false}
          >
            <TableSortLabel
            
              active={orderBy === headCell?.id}
              direction={orderBy === headCell?.id ? order : 'asc'}
              onClick={createSortHandler(headCell?.id)}
              
            >
              {headCell?.label}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell key="acoes" align="left" width={150} >
          Ações
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

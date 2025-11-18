import {
  ChangeEvent,
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';

type PaginationContextType = {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  rowsPerPage: number;
  setRowsPerPage: Dispatch<SetStateAction<number>>;
  order: string;
  setOrder: Dispatch<SetStateAction<string>>;
  orderBy: string;
  setOrderBy: Dispatch<SetStateAction<string>>;
  handleChangePage: (event: any, newPage: number) => void;
  handleChangeRowsPerPage: (event: ChangeEvent<HTMLInputElement>) => void;
  handleRequestSort: (event: any, property: string) => void;
};

type PaginationProviderProps = {
  children: ReactNode;
};

const PaginationContext = createContext({} as PaginationContextType);

export function PaginationProvider({ children }: PaginationProviderProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('published');

  const handleChangePage = (event: any, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (event: any, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <PaginationContext.Provider
      value={{
        page,
        setPage,
        order,
        orderBy,
        rowsPerPage,
        setOrder,
        setOrderBy,
        setRowsPerPage,
        handleChangePage,
        handleChangeRowsPerPage,
        handleRequestSort,
      }}
    >
      {children}
    </PaginationContext.Provider>
  );
}

export function usePagination() {
  const ctx = useContext(PaginationContext);

  return ctx;
}

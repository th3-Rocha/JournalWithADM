import { Typography } from '@material-ui/core';
import { Toolbar } from '@material-ui/core';

import { Button } from '../../Button';

import styles from './styles.module.scss';

type TableToolbarProps = {
  openAddComponent: () => void;
  label: string;
  count: number;
  buttonName: string;
  TwoButton?: Boolean;
  buttonTwoName?: string | 'none';
  openAddComponentTwo?: () => void; 
};

export function TableToolbar({
  label,
  openAddComponent,
  count,
  buttonName,
  TwoButton,
  buttonTwoName = 'none',
  openAddComponentTwo,
}: TableToolbarProps) {
  return (
    <Toolbar className={styles.toolbar}>
      <Typography variant="h6" component="div">
        {label} ({count})
      </Typography>
      <Button label={buttonName} handleClick={openAddComponent} />
      {TwoButton && openAddComponentTwo && <Button label={buttonTwoName} handleClick={openAddComponentTwo} />}
    </Toolbar>
  );
}

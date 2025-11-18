import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';

interface Grupo {
  name: string;
  groupId: string;
}

interface Props {
  firstSelectedId: any;
  grupos: Grupo[];
  onSelectChange: (value: string) => void; // Explicitly define the type
}

export function Dropdown({ grupos, onSelectChange, firstSelectedId }: Props) {
  
  let selectedGrupo: Grupo | undefined;
  selectedGrupo = {
    name: "unde",
    groupId: "unde"
  };
  let once = true;

  const [selected, setSelected] = useState(selectedGrupo?.name);

  useEffect(() => {
    if(once){
      let foundGrupo = grupos.find((grupo) => grupo.groupId === firstSelectedId);
  
      if (foundGrupo) {
        selectedGrupo = foundGrupo;
      } else {
        selectedGrupo = grupos[0];
      }
      if(selectedGrupo){

        onSelectChange(selectedGrupo!.groupId); 
        setSelected(selectedGrupo!.name);

      }
      else{

      }
      once = false;
    }
  }, []);
  

  



  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    selectedGrupo = grupos.find((grupo) => grupo.name === e.target.value);
    setSelected(selectedGrupo!.name);
    onSelectChange(selectedGrupo!.groupId); 
  };

  return (
    <div className={styles.dropdown}>
      <span>Escolha o Grupo do Post</span>
      <select value={selected} onChange={handleChange}>
        {grupos.map((grupo) => (
          <option key={grupo.groupId} value={grupo.name}>
            {grupo.name}
          </option>
        ))}
      </select>
    </div>
  );
}

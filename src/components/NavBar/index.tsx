import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import React, {useEffect } from 'react';

import { IconClose, IconMenuHamburguer } from '../Icons';
import { NavLink } from './NavLink';
import { replaceSpaceWithUnderscore } from '../../utils/replaceSpaceWithUnderscore';

import styles from './styles.module.scss';

let menuItems = [
  { name: 'Notícias', path: 'noticias' },
  { name: 'Sobre', path: 'sobre' },
];
 
export const NavBar = () => {
  const [menu, setMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menuItemsState, setMenuItemsState] = useState(menuItems);

  const fetchData = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_URL_API_BACKEND + '/postgroups/paginated-list');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      menuItems = [
        { name: 'Notícias', path: 'noticias' },
        { name: 'Sobre', path: 'sobre' },
      ];
      for(let i = 0; i < data.response.length; i++){
        if(data.response[i].showNavbar == true){
          let newItem = {name:String(data.response[i].title), path: 'grupos/' +  data.response[i]._id +  `?slug=${replaceSpaceWithUnderscore(data.response[i].title)}` }
          menuItems.push(newItem);
          setMenuItemsState(menuItems);
        }
      }


      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
    
  }, []);



  const handleSetMenu = () => {
    setMenu(!menu);
  };

  

  return (
    <aside className={styles.container}>
  {(
    <nav className={styles.nav}>
      <Link href="/">
        <a className={styles.logo}>
          <Image
            src="/amarelo_branco_comnome.svg"
            alt="Laperme Logo"
            objectFit="cover"
            layout="responsive"
            height={88}
            width={150}
          />
        </a>
      </Link>
      <ul className={menu ? styles.navLinksMobile : styles.navLinks}>
        {menuItemsState.map((item) => (
          <li key={item.path}>
            <NavLink menuItem={item.name} path={item.path} />
          </li>
        ))}       
      </ul>
      <button onClick={handleSetMenu} className={styles.mobileMenuIcon}>
        {menu ? <IconClose /> : <IconMenuHamburguer />}
      </button>
    </nav>
  )}
</aside>
  );
};

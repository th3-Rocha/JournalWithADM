import Image from 'next/image';
import { useState } from 'react';
import React, {useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { ReactNotificationModal } from '../../../components/admin/Modal/ResponseModal';
import {
  HomeOutlined,
  LibraryBooksOutlined,
  CollectionsBookmarkOutlined,
  ExpandMoreOutlined,
  ExpandLessOutlined,
  EditOutlined,
  Kitchen,
  Remove,
  Add,
  DashboardOutlined,
  InfoOutlined,
  LogoutOutlined
} from '@mui/icons-material';

import { useAuthenticated } from '../../../contexts/AuthContext';
import { MenuItem } from './MenuItem';

import styles from './styles.module.scss';

let menuItens = [
  { name: '', path: '' },
];


const itemsSideBar = [
  {
    name: 'Dashboard',
    route: '/admin/home',
    icon: <DashboardOutlined />,
  },
  {
    name: 'Sobre',
    route: '/admin/sobre',
    icon: <InfoOutlined />,
  },
];

export function SideBar() {
  const { signOut } = useAuthenticated();
  const [openGeneral, setOpenGeneral] = useState(false);
  const [openHome, setOpenHome] = useState(false);
  const [openPosts, setOpenPosts] = useState(false);
  const router = useRouter();

  const [openGroups, setOpenGroups] = useState(false);
  

  const handleOpenGeneralSubmenu = () => setOpenGeneral(!openGeneral);
  const handleOpenHomeSubmenu = () => setOpenHome(!openHome);
  const handleOpenGroupsSubmenu = () => setOpenGroups(!openGroups);
  const [modalError, setModalError] = useState(false);
  const handleOpenPostsSubmenu = () => setOpenPosts(!openPosts);

  const [loading, setLoading] = useState(true);



  //validate token

  async function routerLogin(){
    await router.push('/admin/login');
  }



  const validateToken = async () => {
    const bearerToken = Cookies.get('nextauth.token');
    try {
      const responseToken = await fetch(process.env.NEXT_PUBLIC_URL_API_BACKEND + '/auth/token/' + bearerToken);

      if(responseToken.status == 400){
        
        setModalError(true);      
      }
      else{
           
      }

      
    }
    catch (error) {
      console.error('Error no get' + process.env.NEXT_PUBLIC_URL_API_BACKEND + '/auth/token/' + bearerToken);
    }
  }


  

  const fetchGroups = async () => {
    
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_URL_API_BACKEND + '/postgroups/list');
      if (!response.ok) {
        throw new Error('Não foi possivel listar Grupos: SideBar');
      }
      const data = await response.json();
      menuItens = [
      ];
      for(let i = 0; i < data.length; i++){
        let newItem = {name:data[i].title, path: '/admin/groups/edit/' +  data[i]._id + '/postView'}
        menuItens.push(newItem);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };


  useEffect(() => {
  
    fetchGroups();
    const routerGroup = router.asPath.toLowerCase().includes("group") || router.asPath.toLowerCase().includes("posts")
    if(routerGroup) {
      setOpenGroups(true);
    }
    validateToken(); //Valida se o token expirou ou não
  }, [])

  

  return (
    <aside className={styles.container}>
       {modalError && (
        <ReactNotificationModal
          isOpen={modalError}
          title="Erro"
          body={"Token Expirado, Clique em Ok para fazer Login"}
          onClick={routerLogin}
          handleSetModal={routerLogin}
        />
      )}
      <Image src="/azul_laranja_comnome.svg" width={250} height={150} alt="Logo" />
      <span />
      <ul className={styles.list}>

      {itemsSideBar.map((item) => (
          <li key={item.route}>
            <MenuItem route={item.route}>
              {item.icon}
              {item.name}
            </MenuItem>
          </li>
        ))}

      <li onClick={handleOpenGroupsSubmenu}>
          <MenuItem route="#">
            <CollectionsBookmarkOutlined />
            Grupos
          </MenuItem>
          {openGroups ? <ExpandLessOutlined /> : <ExpandMoreOutlined />}
        </li>
        {openGroups && (
          <ul className={styles.submenu}>
            <li>
              <LibraryBooksOutlined />
              <MenuItem route="/admin/posts">Todos os Posts</MenuItem>
            </li>
            {menuItens.map((item) => (
              <li key={item.path}>
                <EditOutlined/>
                <MenuItem route={item.path}> {item.name}</MenuItem>
              </li>
            ))}
            <li>
              <Add/>
              <MenuItem route="/admin/groups/register"> Adicionar Grupo</MenuItem>
            </li>
            
          </ul>
        )}

        <li>
          <MenuItem route="/admin/noticias">
            <LibraryBooksOutlined />
            Notícias
          </MenuItem>
        </li>
      

        <li onClick={handleOpenHomeSubmenu}>
          <MenuItem route="#">
            <HomeOutlined />
            Home
          </MenuItem>
          {openHome ? <ExpandLessOutlined /> : <ExpandMoreOutlined />}
        </li>
        {openHome && (
          <ul className={styles.submenu}>
            <li>
              <MenuItem route="/admin/banner">Banner</MenuItem>
            </li>
            <li>
              <MenuItem route="/admin/cta">CTAs</MenuItem>
            </li>
          </ul>
        )}

        <li onClick={handleOpenGeneralSubmenu}>
          <MenuItem route="#">
            <Kitchen />
            Geral
          </MenuItem>
          {openGeneral ? <ExpandLessOutlined /> : <ExpandMoreOutlined />}
        </li>
        {openGeneral && (
          <ul className={styles.submenu}>
            <li>
              <MenuItem route="/admin/footer">Footer</MenuItem>
            </li>
          </ul>
        )}

        <li onClick={signOut}>
          <MenuItem route="/admin/login">
            <LogoutOutlined />
            Sair
          </MenuItem>
        </li>
      </ul>
    </aside>
  );
}

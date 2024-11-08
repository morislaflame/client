import React from 'react';
import { Drawer } from 'antd';
import styles from './Menu.module.css';
import { USER_ACCOUNT_ROUTE, SELLER_ACCOUNT_ROUTE } from '../../utils/consts';
import { NavLink } from 'react-router-dom';
import { FaUserAlt } from 'react-icons/fa';
import { AiFillDollarCircle } from "react-icons/ai";

const Menu = ({ open, onClose }) => {
    return (
        <Drawer title="Menu" onClose={onClose} open={open} width="auto">
            <h3>Navigation</h3>
            <div className={styles.links_container}>
                <NavLink
                    to={USER_ACCOUNT_ROUTE}
                    onClick={onClose}
                    className={styles.menuLink}
                >
                   <FaUserAlt /> My Account
                </NavLink>
                <NavLink
                    to={SELLER_ACCOUNT_ROUTE}
                    onClick={onClose}
                    className={styles.menuLink}
                >
                    <AiFillDollarCircle /> Seller Account
                </NavLink>
            </div>
            {/* Добавьте другие пункты меню по необходимости */}
        </Drawer>
    );
};

export default Menu;

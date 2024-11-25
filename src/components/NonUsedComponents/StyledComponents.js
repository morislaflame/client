import styled from "styled-components";
import { Offcanvas } from 'react-bootstrap';

export const CustomOffcanvasHeader = styled(Offcanvas.Header)`
        background: linear-gradient(to bottom, #f55d04, #c20606);
        color: white;
        border-top-right-radius: 20px;
        border-top-left-radius: 20px;
    `;

export const CustomOffcanvas = styled(Offcanvas)`
    --bs-offcanvas-zindex: 1045;
    --bs-offcanvas-height: auto;
    background: #c20606;
    border-top-right-radius: 20px;
    border-top-left-radius: 20px;
    `;

export const CustomOffcanvasBody = styled(Offcanvas.Body)`
        background: linear-gradient(to bottom, #c20606, #030107);
        color: white;
        display: flex;
        flex-direction: column;
        gap: 15px;
        padding: calc(var(--index)* 0.7) calc(var(--index)* 1) calc(var(--index)* 2);
    `;


    
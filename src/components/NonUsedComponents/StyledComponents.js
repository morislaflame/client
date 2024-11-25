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


    export const ExchangeOffcanvasHeader = styled(Offcanvas.Header)`
        background: linear-gradient(to bottom, #6c04f5, #0672c2);
        color: white;
        border-top-right-radius: 20px;
        border-top-left-radius: 20px;
    `;

export const ExchangeOffcanvas = styled(Offcanvas)`
        height: auto !important;
        background: #0672c2;
        border-top-right-radius: 20px;
        border-top-left-radius: 20px;
    `;

export const ExchangeOffcanvasBody = styled(Offcanvas.Body)`
        background: linear-gradient(to bottom, #0672c2, #030107);
        color: white;
        display: flex;
        flex-direction: column;
        gap: calc(var(--index)* 0.7);
        padding: calc(var(--index)* 0.7) calc(var(--index)* 1) calc(var(--index)* 2);
    `;
// React hooks
import { useEffect, useState, useCallback, useMemo, useRef,React } from 'react';
import { useNavigate, Link, useParams, useLocation,useSearchParams } from 'react-router-dom';
import { Container, Button, Form as BootstrapForm, ButtonGroup, Card, Modal, Row, Col, Spinner, Tabs, Tab, Alert, ToggleButton, Badge,DropdownButton,Dropdown } from 'react-bootstrap';
import { Formik, Field, Form, FieldArray, ErrorMessage  } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPencilAlt, FaPlus, FaTrash, FaArrowLeft,FaEye } from 'react-icons/fa'; //Font Awesome
import { PiFileArrowUp } from 'react-icons/pi'; //Phosphor Icons

import DataTable from 'react-data-table-component';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { BarLoader } from "react-spinners";

window.useEffect = useEffect;
window.useState = useState;
window.useCallback = useCallback;
window.useMemo = useMemo;
window.useRef = useRef;
Window.React = React;

// React Router

window.useNavigate = useNavigate;
window.Link = Link;
window.useParams = useParams;
window.useLocation = useLocation;
window.useSearchParams = useSearchParams;

// React Bootstrap

window.Container = Container;
window.Button = Button;
window.ButtonGroup = ButtonGroup;
window.BootstrapForm = BootstrapForm;
window.Card = Card;
window.Modal = Modal;
window.Row = Row;
window.Col = Col;
window.Spinner = Spinner;
window.Tabs = Tabs;
window.Tab = Tab;
window.Alert = Alert;
window.ToggleButton = ToggleButton;
window.Badge = Badge;
window.DropdownButton = DropdownButton;
window.Dropdown = Dropdown;

// Formik

window.Formik = Formik;
window.Field = Field;
window.Form = Form;
Window.ErrorMessage = ErrorMessage;
window.FieldArray = FieldArray;

// Yup validation

window.Yup = Yup;

// React toastify

window.toast = toast;
const toastOptions = {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
};
window.toastOptions = toastOptions;
window.ToastContainer = ToastContainer;

// Icons Font Awesome

window.FaPencilAlt = FaPencilAlt;
window.FaPlus = FaPlus;
window.FaTrash = FaTrash;
window.FaArrowLeft = FaArrowLeft;
window.FaEye = FaEye;

// Icons Phosphor Icons

window.PiFileArrowUp = PiFileArrowUp;

// toast 

window.ToastContainer = ToastContainer;
window.toast = toast;
window.toastOptions = toastOptions;

// 

// Other required components 



window.DataTable = DataTable;
window.BarLoader = BarLoader

// Skeleton loading 

window.Skeleton = Skeleton;


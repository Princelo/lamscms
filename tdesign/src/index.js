import React from "react";
import { render } from "react-dom";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import './index.css';
import 'tdesign-react/es/style/index.css'; // 少量公共样式

render(
    <Router>
        <App />
    </Router>,
    document.getElementById("root")
);
